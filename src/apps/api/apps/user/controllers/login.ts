import { SessionInfoDoc } from '@/interfaces/session'
import SessionInfoModel from '@/models/SessionInfo'
import { generateId } from '@/utils/idGenerator'
import { rsaDecrypt } from '@/utils/rsaEncrypt'
import { generateToken } from '@/utils/sessionToken'
import { HmacMD5 } from 'crypto-js'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { Document } from 'mongoose'
import { UserLoginReq, UserLoginRes, UserInfoDoc, UserPasswordDoc } from '../interfaces'
import UserInfoModel from '../models/UserInfo'
import UserPasswordModel from '../models/UserPassword'
import { secretKey } from '@configs/secretKey'
import { login as loginView, loginStatusCodes } from '../views'

// Import status codes
const {
  LOGIN_SUCCESS,
  USER_NOT_EXIST_OR_INVALID_PASSWORD
} = loginStatusCodes

/**
 * User login API handler version 1
 * @version v1
 * @param req - Express session request
 * @param res - Express response
 * @param next - Express next function
 */
async function loginV1 (req: Request, res: Response, next: NextFunction) {
  // Receive request data
  const reqData: UserLoginReq = req.body

  /* 解密数据 */

  // 解密密码
  reqData.password = rsaDecrypt(reqData.password)
  if (!reqData.password) {
    const resData: UserLoginRes = loginView(USER_NOT_EXIST_OR_INVALID_PASSWORD)
    res.json(resData)
    return
  }

  /* 查询数据 */

  // 初始化用户 ID
  let userId: string = ''

  // 需要查询的字段（依据命中概率排序）
  const queryFields: string[] = [
    'userName',
    'userAccount'
  ]

  // 查询用户 ID
  try {
    for (const queryField of queryFields) {
      const user: UserInfoDoc | null = await UserInfoModel.findOne(
        { [queryField]: reqData.user },
        { userId: true, _id: false }
      ) as UserInfoDoc | null
      if (user) {
        userId = user.userId
        break
      }
    }
  } catch (error) {
    next(error)
    return
  }

  // 验证用户 ID
  if (!userId) {
    const resData: UserLoginRes = loginView(USER_NOT_EXIST_OR_INVALID_PASSWORD)
    res.json(resData)
    return
  }

  // 查询密码
  let userPasswordDoc: UserPasswordDoc | null
  try {
    userPasswordDoc = await UserPasswordModel.findOne(
      { userId }
    ) as UserPasswordDoc | null
  } catch (error) {
    next(error)
    return
  }

  // 用户不存在
  if (!userPasswordDoc) {
    const resData: UserLoginRes = loginView(USER_NOT_EXIST_OR_INVALID_PASSWORD)
    res.json(resData)
    return
  }

  // 验证用户密码（secretKey + 用户密码）
  const encryptedUserPassword: string = HmacMD5(reqData.password, secretKey).toString()
  if (!userPasswordDoc.password || encryptedUserPassword !== userPasswordDoc.password) {
    const resData: UserLoginRes = loginView(USER_NOT_EXIST_OR_INVALID_PASSWORD)
    res.json(resData)
    return
  }

  /* 处理登录事件 */

  // 删除已存在的会话信息
  try {
    await SessionInfoModel.deleteMany({ userId })
  } catch (error) {
    next(error)
    return
  }

  // 生成会话 ID 并查重
  let sessionId: string = generateId()
  try {
    while (true) {
      if (await SessionInfoModel.findOne({ sessionId })) {
        sessionId = generateId()
      } else {
        break
      }
    }
  } catch (error) {
    next(error)
    return
  }

  // 生成 token
  const authToken = generateToken(sessionId)

  // 生成会话信息文档
  const date: Date = new Date()
  const createdTime: string = date.toISOString()
  date.setDate(date.getDate() + 7)
  const afterOneWeek: string = date.toISOString()
  const sessionInfoDoc: SessionInfoDoc = {
    sessionId,
    authToken,
    userId,
    createdTime,
    expTime: afterOneWeek
  }
  // 生成会话信息 model
  const newSessionInfoModel: Document = new SessionInfoModel(sessionInfoDoc)

  // 将会话信息保存至 MongoDB
  let sessionInfoSaveRes: Document | undefined
  try {
    sessionInfoSaveRes = await newSessionInfoModel.save()
  } catch (error) {
    next(error)
    return
  }

  // 登录成功
  if (sessionInfoSaveRes) {
    const resData: UserLoginRes = loginView(LOGIN_SUCCESS, { authToken })
    res.json(resData)
    return
  }

  const defaultResData: UserLoginRes = loginView()
  res.json(defaultResData)
}

/**
 * User login API main controller
 * @returns {RequestHandler} Express request handler
 */
export function login (): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    // API version controller
    switch (req.params.apiVersion) {
      // API version 1
      case 'v1': {
        loginV1(req, res, next)
        break
      }

      // API version not found
      default: {
        res.redirect('/404')
        break
      }
    }
  }
}
