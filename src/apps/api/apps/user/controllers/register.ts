import { generateId, generateAccount } from '@/utils/idGenerator'
import { rsaDecrypt } from '@/utils/rsaEncrypt'
import { MD5 } from 'crypto-js'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { Document } from 'mongoose'
import { UserRegisterReq, UserRegisterRes, UserInfoDoc, UserPasswordDoc } from '../interfaces'
import UserInfoModel from '../models/UserInfo'
import UserPasswordModel from '../models/UserPassword'
import { register as registerView } from '../views'
import { secretKey } from '@configs/secretKey'

/**
 * User register API controller
 * @returns {RequestHandler} Express request handler
 */
export function register (): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Receive request data
    const reqData: UserRegisterReq = req.body

    /** 解密数据 */

    // 解密密码
    reqData.password = rsaDecrypt(reqData.password)
    if (!reqData.password) {
      const resData: UserRegisterRes = registerView(4)
      res.json(resData)
      return
    }

    /** 验证数据有效性 */

    // 验证用户名（必填）
    const userNameReg: RegExp = /^[a-zA-Z0-9_-]*$/
    if (!reqData.userName || !userNameReg.test(reqData.userName)) {
      const resData: UserRegisterRes = registerView(2)
      res.json(resData)
      return
    }

    // 用户名查重
    try {
      if (await UserInfoModel.findOne({ userName: reqData.userName })) {
        const resData: UserRegisterRes = registerView(3)
        res.json(resData)
        return
      }
    } catch (error) {
      next(error)
      return
    }

    // 验证密码（必填）
    if (!reqData.password || reqData.password.length < 6) {
      const resData: UserRegisterRes = registerView(4)
      res.json(resData)
      return
    }

    // 验证邮箱（非必填）
    const emailReg: RegExp = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
    if (reqData.email && !emailReg.test(reqData.email)) {
      const resData: UserRegisterRes = registerView(5)
      res.json(resData)
      return
    }

    // 验证手机号（非必填）
    const phoneNumReg: RegExp = /^1[3456789]\d{9}$/
    if (reqData.phone && !phoneNumReg.test(reqData.phone)) {
      const resData: UserRegisterRes = registerView(6)
      res.json(resData)
      return
    }

    /** 处理注册事件 */

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
    const password: string = MD5(secretKey + reqData.password).toString()

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
      const resData: UserRegisterRes = registerView(1, newUserInfoDoc)
      res.json(resData)
      return
    }

    // Default case
    const defaultResData: UserRegisterRes = registerView()
    res.json(defaultResData)
  }
}
