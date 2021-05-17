/**
 * App controller
 */

import { RequestHandler, Request, Response } from 'express'
import { connect, Document } from 'mongoose'

// Import configs
import mongodbUrl from './configs/mongodb'

// Import interfaces
import { UserRegisterReq, UserRegisterRes, UserInfoDoc, UserPasswordDoc } from './interface'

// Import models
import UserInfoModel from './models/UserInfo'
import UserPasswordModel from './models/UserPassword'

// Import views
import * as view from './view'

// Import utils
import { generateId, generateAccount } from './utils/idGenerator'

// Connect MongoDB
connect(
  mongodbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).catch(err => {
  throw err
})

/**
 * Register API controller
 * @returns {RequestHandler} Express request handler
 */
export function register(): RequestHandler {
  return async (req: Request, res: Response) => {
    // Receive request data
    const reqData: UserRegisterReq = req.body

    /** 验证数据有效性 */

    // 验证用户名
    const userNameReg: RegExp = /^[a-zA-Z0-9_-]*$/
    if (!reqData.userName || !userNameReg.test(reqData.userName)) {
      const resData: UserRegisterRes = view.getUserRegResData(2)
      res.json(resData)
      return
    }

    // 用户名查重
    try {
      if (await UserInfoModel.findOne({userName: reqData.userName})) {
        const resData: UserRegisterRes = view.getUserRegResData(3)
        res.json(resData)
        return
      }
    } catch (error) {
      throw error
    }

    // 验证密码
    if (!reqData.password || reqData.password.length < 6) {
      const resData: UserRegisterRes = view.getUserRegResData(4)
      res.json(resData)
      return
    }

    // 验证邮箱
    const emailReg: RegExp = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
    if (reqData.email && !emailReg.test(reqData.email)) {
      const resData: UserRegisterRes = view.getUserRegResData(5)
      res.json(resData)
      return
    }

    // 验证手机号
    const phoneNumReg: RegExp = /^1[3456789]\d{9}$/
    if (reqData.phone && !phoneNumReg.test(reqData.phone)) {
      const resData: UserRegisterRes = view.getUserRegResData(6)
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
      throw error
    }
    
    // 生成账号并查重
    let userAccount: string = generateAccount(8)
    try {
      while (true) {
        if (await UserInfoModel.findOne({ userAccount })) {
          userAccount = generateAccount(8)
        } else {
          break
        }
      }
    } catch (error) {
      throw error
    }

    // TODO: 单向加密密码
    const password: string = reqData.password

    // 生成用户信息文档
    const currentTime = new Date()
    const modifyTime: string = currentTime.toISOString()
    const registerTime: string = currentTime.toISOString()
    const userInfoDoc: UserInfoDoc = {
      userId,
      userAccount,
      userName: reqData.userName || '',
      nickName: reqData.nickName || '',
      avatar: reqData.avatar || '',
      email: reqData.email || '',
      phone: reqData.phone || '',
      modifyTime,
      registerTime
    }
    // 生成用户信息 model
    const userInfoModel: Document = new UserInfoModel(userInfoDoc)

    // 生成用户密码文档
    const userPasswordDoc: UserPasswordDoc = {
      userId,
      password
    }
    // 生成用户密码 model
    const userPasswordModel: Document = new UserPasswordModel(userPasswordDoc)

    // 将用户信息与密码保存至 MongoDB
    let userInfoInsertRes: Document | undefined
    let userPasswordInsertRes: Document | undefined
    try {
      userInfoInsertRes = await userInfoModel.save()
      userPasswordInsertRes = await userPasswordModel.save()
    } catch (error) {
      throw error
    }

    // 注册成功
    if (userInfoInsertRes && userPasswordInsertRes) {
      const resData: UserRegisterRes = view.getUserRegResData(1, userInfoDoc)
      res.json(resData)
      return
    }

    // Default case
    const defaultResData: UserRegisterRes = view.getUserRegResData()
    res.json(defaultResData)
    return
  }
}
