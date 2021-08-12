import { SessionInfoDoc } from '@/interfaces/session'
import SessionInfoModel from '@/models/SessionInfo'
import { generateId } from '@/utils/idGenerator'
import { rsaDecrypt } from '@/utils/rsaEncrypt'
import { generateToken } from '@/utils/sessionToken'
import { MD5 } from 'crypto-js'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { Document } from 'mongoose'
import { UserLoginReq, UserLoginRes, UserInfoDoc, UserPasswordDoc } from '../interfaces'
import UserInfoModel from '../models/UserInfo'
import UserPasswordModel from '../models/UserPassword'
import { login as loginView } from '../views'
import { secretKey } from '@configs/secretKey'

/**
 * User login API controller
 * @returns {RequestHandler} Express request handler
 */
export function login (): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Receive request data
    const reqData: UserLoginReq = req.body

    /** 解密数据 */

    // 解密密码
    reqData.password = rsaDecrypt(reqData.password)
    if (!reqData.password) {
      const resData: UserLoginRes = loginView(2)
      res.json(resData)
      return
    }

    /** 查询数据 */

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
        const user: (UserInfoDoc & Document<UserInfoDoc, unknown>) | null = await UserInfoModel.findOne(
          { [queryField]: reqData.user },
          { userId: true, _id: false }
        )
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
      const resData: UserLoginRes = loginView(2)
      res.json(resData)
      return
    }

    // 查询密码
    let userPasswordDoc: (UserPasswordDoc & Document<UserPasswordDoc, unknown>) | null
    try {
      userPasswordDoc = await UserPasswordModel.findOne(
        { userId }
      )
    } catch (error) {
      next(error)
      return
    }

    // 用户不存在
    if (!userPasswordDoc) {
      const resData: UserLoginRes = loginView(2)
      res.json(resData)
      return
    }

    // 验证用户密码（secretKey + 用户密码）
    const encryptedUserPassword: string = MD5(secretKey + reqData.password).toString()
    if (!userPasswordDoc.password || encryptedUserPassword !== userPasswordDoc.password) {
      const resData: UserLoginRes = loginView(2)
      res.json(resData)
      return
    }

    /** 处理登录事件 */

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
      const resData: UserLoginRes = loginView(1, { authToken })
      res.json(resData)
      return
    }

    const defaultResData: UserLoginRes = loginView()
    res.json(defaultResData)
  }
}
