import { generateId, generateAccount } from '@/utils/idGenerator'
import { rsaDecrypt } from '@/utils/rsaEncrypt'
import { HmacMD5 } from 'crypto-js'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { Document } from 'mongoose'
import { UserRegisterReq, UserRegisterRes, UserInfoDoc, UserPasswordDoc } from '../interfaces'
import UserInfoModel from '../models/UserInfo'
import UserPasswordModel from '../models/UserPassword'
import { secretKey } from '@configs/secretKey'
import { register as registerView, registerStatusCodes } from '../views'

// Import status codes
const {
  REGISTER_SUCCESS,
  INVALID_USER_NAME,
  USER_NAME_EXIST,
  INVALID_PASSWORD,
  INVALID_EMAIL,
  INVALID_PHONE
} = registerStatusCodes

/**
 * User register API handler version 1
 * @version v1
 * @param req - Express session request
 * @param res - Express response
 * @param next - Express next function
 */
async function registerV1 (req: Request, res: Response, next: NextFunction) {
  // Receive request data
  const reqData: UserRegisterReq = req.body

  /* 解密数据 */

  // 解密密码
  reqData.password = rsaDecrypt(reqData.password)
  if (!reqData.password) {
    const resData: UserRegisterRes = registerView(INVALID_PASSWORD)
    res.json(resData)
    return
  }

  /* 验证数据有效性 */

  // 验证用户名（必填）
  const userNameReg: RegExp = /^[a-zA-Z0-9_-]*$/
  if (!reqData.userName || !userNameReg.test(reqData.userName)) {
    const resData: UserRegisterRes = registerView(INVALID_USER_NAME)
    res.json(resData)
    return
  }

  // 用户名查重
  try {
    if (await UserInfoModel.findOne({ userName: reqData.userName })) {
      const resData: UserRegisterRes = registerView(USER_NAME_EXIST)
      res.json(resData)
      return
    }
  } catch (error) {
    next(error)
    return
  }

  // 验证密码（必填）
  if (!reqData.password || reqData.password.length < 6) {
    const resData: UserRegisterRes = registerView(INVALID_PASSWORD)
    res.json(resData)
    return
  }

  // 验证邮箱（非必填）
  const emailReg: RegExp = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
  if (reqData.email && !emailReg.test(reqData.email)) {
    const resData: UserRegisterRes = registerView(INVALID_EMAIL)
    res.json(resData)
    return
  }

  // 验证手机号（非必填）
  const phoneNumReg: RegExp = /^1[3456789]\d{9}$/
  if (reqData.phone && !phoneNumReg.test(reqData.phone)) {
    const resData: UserRegisterRes = registerView(INVALID_PHONE)
    res.json(resData)
    return
  }

  /* 处理注册事件 */

  // 生成用户 ID 并查重
  let userId: string = generateId()
  try {
    while (true) {
      if (await UserInfoModel.findOne({ userId })) {
        userId = generateId()
      } else {
        break
      }
    }
  } catch (error) {
    next(error)
    return
  }

  // 生成账号并查重
  let userAccount: string = generateAccount(10)
  try {
    while (true) {
      if (await UserInfoModel.findOne({ userAccount })) {
        userAccount = generateAccount(10)
      } else {
        break
      }
    }
  } catch (error) {
    next(error)
    return
  }

  // MD5 单向加密密码（secretKey + 用户密码）
  const password: string = HmacMD5(reqData.password, secretKey).toString()

  // 生成用户信息文档
  const currentTime: Date = new Date()
  const modifiedTime: string = currentTime.toISOString()
  const registerTime: string = currentTime.toISOString()
  const newUserInfoDoc: UserInfoDoc = {
    userId,
    userAccount,
    userName: reqData.userName,
    nickName: reqData.nickName || null,
    avatar: reqData.avatar || null,
    email: reqData.email || null,
    phone: reqData.phone || null,
    modifiedTime,
    registerTime
  }
  // 生成用户信息 model
  const newUserInfoModel: Document = new UserInfoModel(newUserInfoDoc)

  // 生成用户密码文档
  const newUserPasswordDoc: UserPasswordDoc = {
    userId,
    password
  }
  // 生成用户密码 model
  const newUserPasswordModel: Document = new UserPasswordModel(newUserPasswordDoc)

  // 将用户信息与密码保存至 MongoDB
  let userInfoSaveRes: Document<UserInfoDoc> | undefined
  let userPasswordSaveRes: Document<UserPasswordDoc> | undefined
  try {
    userInfoSaveRes = await newUserInfoModel.save()
    userPasswordSaveRes = await newUserPasswordModel.save()
  } catch (error) {
    next(error)
    return
  }

  // 注册成功
  if (userInfoSaveRes && userPasswordSaveRes) {
    const resData: UserRegisterRes = registerView(REGISTER_SUCCESS, newUserInfoDoc)
    res.json(resData)
    return
  }

  // Default case
  const defaultResData: UserRegisterRes = registerView()
  res.json(defaultResData)
}

/**
 * User register API main controller
 * @returns {RequestHandler} Express request handler
 */
export function register (): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    // API version controller
    switch (req.params.apiVersion) {
      // API version 1
      case 'v1': {
        registerV1(req, res, next)
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
