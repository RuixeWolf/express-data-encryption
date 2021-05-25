/**
 * App controller
 */

import { RequestHandler, Request, Response, NextFunction } from 'express'
import { Document } from 'mongoose'
import MD5 from 'crypto-js/md5'

// Import interfaces
import {
  UserRegisterReq,
  UserRegisterRes,
  UserInfoDoc,
  UserPasswordDoc,
  UserLoginReq,
  UserLoginRes,
  GetUserInfoResData,
  GetUserInfoRes,
  UserLogoutRes,
  EditUserInfoReq,
  EditUserInfoFields,
  EditUserInfoResData,
  EditUserInfoRes
} from './interface'
import {
  SessionInfoDoc,
  SessionRequestHandler,
  SessionRequest
} from '@interfaces/session'

// Import models
import UserInfoModel from './models/UserInfo'
import UserPasswordModel from './models/UserPassword'
import SessionInfoModel from '@models/SessionInfo'

// Import views
import * as view from './view'

// Import utils
import { rsaDecrypt } from '@utils/rsaEncrypt'
import { generateId, generateAccount } from '@utils/idGenerator'
import { generateToken } from '@utils/sessionToken'

/**
 * User register API controller
 * @returns {RequestHandler} Express request handler
 */
export function register(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Receive request data
    const reqData: UserRegisterReq = req.body

    /** 解密数据 */

    // 解密密码
    try {
      reqData.password = rsaDecrypt(reqData.password)
    } catch (error) {
      const resData: UserRegisterRes = view.getUserRegResData(4)
      res.json(resData)
      return
    }

    /** 验证数据有效性 */

    // 验证用户名（必填）
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
      next(error)
      throw error
    }

    // 验证密码（必填）
    if (!reqData.password || reqData.password.length < 6) {
      const resData: UserRegisterRes = view.getUserRegResData(4)
      res.json(resData)
      return
    }

    // 验证邮箱（非必填）
    const emailReg: RegExp = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
    if (reqData.email && !emailReg.test(reqData.email)) {
      const resData: UserRegisterRes = view.getUserRegResData(5)
      res.json(resData)
      return
    }

    // 验证手机号（非必填）
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
      next(error)
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
      next(error)
      throw error
    }

    // MD5 单向加密密码
    const password: string = MD5(reqData.password).toString()

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
    let userInfoSaveRes: Document | undefined
    let userPasswordSaveRes: Document | undefined
    try {
      userInfoSaveRes = await newUserInfoModel.save()
      userPasswordSaveRes = await newUserPasswordModel.save()
    } catch (error) {
      next(error)
      throw error
    }

    // 注册成功
    if (userInfoSaveRes && userPasswordSaveRes) {
      const resData: UserRegisterRes = view.getUserRegResData(1, newUserInfoDoc)
      res.json(resData)
      return
    }

    // Default case
    const defaultResData: UserRegisterRes = view.getUserRegResData()
    res.json(defaultResData)
    return
  }
}

/**
 * User login API controller
 * @returns {RequestHandler} Express request handler
 */
export function login(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Receive request data
    const reqData: UserLoginReq = req.body

    /** 解密数据 */

    // 解密密码
    let reqUserPassword: string = ''
    try {
      reqUserPassword = rsaDecrypt(reqData.password)
    } catch (error) {
      const resData: UserLoginRes = view.getUserLoginResData(2)
      res.json(resData)
      return
    }

    /** 查询数据 */
    
    // 初始化用户 ID
    let userId: string = ''

    // 需要查询的字段（依据命中概率排序）
    const queryFields: string[] = [
      'userAccount',
      'userName',
      'phone',
      'email'
    ]

    // 查询用户 ID
    try {
      for (const queryField of queryFields) {
        const user = await UserInfoModel.findOne(
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
      throw error
    }

    // 验证用户 ID
    if (!userId) {
      const resData: UserLoginRes = view.getUserLoginResData(2)
      res.json(resData)
      return
    }

    // 查询密码
    let userPasswordDoc
    try {
      userPasswordDoc = await UserPasswordModel.findOne(
        { userId },
        { password: true, _id: false }
      )
    } catch (error) {
      next(error)
      throw error
    }

    // 验证用户密码
    const encryptedUserPassword: string = MD5(reqUserPassword).toString()
    if (!userPasswordDoc.password || encryptedUserPassword !== userPasswordDoc.password) {
      const resData: UserLoginRes = view.getUserLoginResData(2)
      res.json(resData)
      return
    }

    /** 处理登录事件 */

    // 删除已存在的会话信息
    try {
      await SessionInfoModel.deleteMany({ userId })
    } catch (error) {
      next(error)
      throw error
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
      throw error
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
      throw error
    }

    // 登录成功
    if (sessionInfoSaveRes) {
      const resData: UserLoginRes = view.getUserLoginResData(1, { authToken })
      res.json(resData)
      return
    }

    const defaultResData = view.getUserLoginResData()
    res.json(defaultResData)
  }
}

/**
 * User logout API controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function logout(): SessionRequestHandler {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    // 从会话信息获取用户 ID 与会话 ID
    const userId: string = req.session.userId
    const sessionId: string = req.session.sessionId
    if (!userId || !sessionId) {
      const resData: UserLogoutRes = view.getUserLogoutResData(2)
      res.json(resData)
      return
    }

    // 删除本条会话信息
    let sessionDelRes
    try {
      sessionDelRes = await SessionInfoModel.deleteOne({ sessionId })
    } catch (error) {
      next(error)
      throw error
    }

    // 生成退出登录响应数据
    const currentTime: Date = new Date()
    const logoutTime: string = currentTime.toISOString()
    const logoutData = {
      logoutTime
    }

    // 退出登录成功
    if (sessionDelRes && sessionDelRes.ok) {
      const resData: UserLogoutRes = view.getUserLogoutResData(1, logoutData)
      res.json(resData)
      return
    }

    const defaultResData = view.getUserLogoutResData()
    res.json(defaultResData)
  }
}

/**
 * Get user information API controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function getInfo(): SessionRequestHandler {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    // 从会话信息获取用户 ID
    const userId: string = req.session.userId
    // 用户 ID 缺失
    if (!userId) {
      const resData: GetUserInfoRes = view.getUserInfoResData(2)
      res.json(resData)
      return
    }

    // 查询用户信息
    let userInfoDoc: UserInfoDoc
    try {
      userInfoDoc = await UserInfoModel.findOne({ userId }, { _id: false })
    } catch (error) {
      next(error)
      throw error
    }

    // 用户不存在
    if (!userInfoDoc) {
      const resData: GetUserInfoRes = view.getUserInfoResData(2)
      res.json(resData)
      return
    }

    // 生成用户信息响应数据
    const userInfoResData: GetUserInfoResData = {
      userId: userInfoDoc.userId,
      userAccount: userInfoDoc.userAccount,
      userName: userInfoDoc.userName,
      nickName: userInfoDoc.nickName,
      avatar: userInfoDoc.avatar,
      email: userInfoDoc.email,
      phone: userInfoDoc.phone,
      modifiedTime: userInfoDoc.modifiedTime,
      registerTime: userInfoDoc.registerTime
    }

    // 获取用户信息成功
    if (userInfoDoc && userInfoResData.userId === userId) {
      const resData: GetUserInfoRes = view.getUserInfoResData(1, userInfoResData)
      res.json(resData)
      return
    }

    const defaultResData = view.getUserInfoResData()
    res.json(defaultResData)
  }
}

/**
 * Edit user info API controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function editInfo(): SessionRequestHandler {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    // 从会话信息获取用户 ID
    const userId: string = req.session.userId
    // 用户 ID 缺失
    if (!userId) {
      const resData: EditUserInfoRes = view.getEditUserInfoResData(2)
      res.json(resData)
      return
    }

    // 获取需要需修改的用户信息
    const reqData: EditUserInfoReq = req.body

    /** 验证数据 */

    // 验证邮箱（非必填）
    const emailReg: RegExp = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
    if (reqData.email && !emailReg.test(reqData.email)) {
      const resData: EditUserInfoRes = view.getEditUserInfoResData(3)
      res.json(resData)
      return
    }

    // 验证手机号（非必填）
    const phoneNumReg: RegExp = /^1[3456789]\d{9}$/
    if (reqData.phone && !phoneNumReg.test(reqData.phone)) {
      const resData: EditUserInfoRes = view.getEditUserInfoResData(4)
      res.json(resData)
      return
    }

    /** 处理修改用户信息事件 */

    // 生成需要更新的数据
    const currentTime: Date = new Date()
    const modifiedTime: string = currentTime.toISOString()
    const userInfoUpdateData: EditUserInfoFields = {
      nickName: reqData.nickName || null,
      avatar: reqData.avatar || null,
      email: reqData.email || null,
      phone: reqData.phone || null,
      modifiedTime
    }

    // 更新用户信息
    let userInfoUpdateRes: UserInfoDoc
    try {
      userInfoUpdateRes = await UserInfoModel.findOneAndUpdate(
        { userId },
        userInfoUpdateData,
        { new: true, useFindAndModify: false }
      )
    } catch (error) {
      next(error)
      throw error
    }
    
    // 用户不存在
    if (!userInfoUpdateRes) {
      const resData: EditUserInfoRes = view.getEditUserInfoResData(2)
      res.json(resData)
      return
    }

    // 生成修改后的用户信息响应数据
    const editUserInfoResData: EditUserInfoResData = {
      userId: userInfoUpdateRes.userId,
      userAccount: userInfoUpdateRes.userAccount,
      userName: userInfoUpdateRes.userName,
      nickName: userInfoUpdateRes.nickName,
      avatar: userInfoUpdateRes.avatar,
      email: userInfoUpdateRes.email,
      phone: userInfoUpdateRes.phone,
      modifiedTime: userInfoUpdateRes.modifiedTime,
      registerTime: userInfoUpdateRes.registerTime
    }

    // 修改用户信息成功
    if (userInfoUpdateRes && editUserInfoResData.userId === userId) {
      const resData: EditUserInfoRes = view.getEditUserInfoResData(1, editUserInfoResData)
      res.json(resData)
      return
    }

    const defaultResData = view.getEditUserInfoResData()
    res.json(defaultResData)
  }
}
