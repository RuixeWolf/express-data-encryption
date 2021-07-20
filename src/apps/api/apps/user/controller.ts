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
  EditUserInfoRes,
  ModifyUserPaswdReq,
  ModifyUserPaswdRes,
  AccountCancellationReq,
  AccountCancellationRes
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
export function register (): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Receive request data
    const reqData: UserRegisterReq = req.body

    /** 解密数据 */

    // 解密密码
    reqData.password = rsaDecrypt(reqData.password)
    if (!reqData.password) {
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
      if (await UserInfoModel.findOne({ userName: reqData.userName })) {
        const resData: UserRegisterRes = view.getUserRegResData(3)
        res.json(resData)
        return
      }
    } catch (error) {
      next(error)
      return
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
      const resData: UserRegisterRes = view.getUserRegResData(1, newUserInfoDoc)
      res.json(resData)
      return
    }

    // Default case
    const defaultResData: UserRegisterRes = view.getUserRegResData()
    res.json(defaultResData)
  }
}

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
      const resData: UserLoginRes = view.getUserLoginResData(2)
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
      const resData: UserLoginRes = view.getUserLoginResData(2)
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
      const resData: UserLoginRes = view.getUserLoginResData(2)
      res.json(resData)
      return
    }

    // 验证用户密码
    const encryptedUserPassword: string = MD5(reqData.password).toString()
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
      const resData: UserLoginRes = view.getUserLoginResData(1, { authToken })
      res.json(resData)
      return
    }

    const defaultResData: UserLoginRes = view.getUserLoginResData()
    res.json(defaultResData)
  }
}

/**
 * User logout API controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function logout (): SessionRequestHandler {
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
      return
    }

    // 生成退出登录响应数据
    const currentTime: Date = new Date()
    const logoutTime: string = currentTime.toISOString()
    const logoutData = {
      logoutTime
    }

    // 退出登录成功
    if (sessionDelRes.ok) {
      const resData: UserLogoutRes = view.getUserLogoutResData(1, logoutData)
      res.json(resData)
      return
    }

    const defaultResData: UserLogoutRes = view.getUserLogoutResData()
    res.json(defaultResData)
  }
}

/**
 * Get user information API controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function getInfo (): SessionRequestHandler {
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
    let userInfoDoc: (UserInfoDoc & Document<UserInfoDoc>) | null
    try {
      userInfoDoc = await UserInfoModel.findOne({ userId }, { _id: false })
    } catch (error) {
      next(error)
      return
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

    const defaultResData: GetUserInfoRes = view.getUserInfoResData()
    res.json(defaultResData)
  }
}

/**
 * Edit user info API controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function editInfo (): SessionRequestHandler {
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
      modifiedTime
    }

    // 添加需要修改的字段
    if (reqData.nickName !== undefined) {
      userInfoUpdateData.nickName = reqData.nickName || null
    }
    if (reqData.avatar !== undefined) {
      userInfoUpdateData.avatar = reqData.avatar || null
    }
    if (reqData.email !== undefined) {
      userInfoUpdateData.email = reqData.email || null
    }
    if (reqData.phone !== undefined) {
      userInfoUpdateData.phone = reqData.phone || null
    }

    // 更新用户信息
    let userInfoUpdateRes: (UserInfoDoc & Document<UserInfoDoc>) | null
    try {
      userInfoUpdateRes = await UserInfoModel.findOneAndUpdate(
        { userId },
        userInfoUpdateData,
        { new: true, useFindAndModify: false }
      )
    } catch (error) {
      next(error)
      return
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

    const defaultResData: EditUserInfoRes = view.getEditUserInfoResData()
    res.json(defaultResData)
  }
}

/**
 * Modify user password API controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function modifyPassword (): SessionRequestHandler {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    // 从会话信息获取用户 ID 与会话 ID
    const userId: string = req.session.userId
    const sessionId: string = req.session.sessionId
    if (!userId || !sessionId) {
      const resData: ModifyUserPaswdRes = view.getModifyUserPaswdResData(2)
      res.json(resData)
      return
    }

    // 获取请求数据
    const reqData: ModifyUserPaswdReq = req.body

    // 解密密码
    reqData.oldPassword = rsaDecrypt(reqData.oldPassword)
    reqData.newPassword = rsaDecrypt(reqData.newPassword)

    // 验证旧密码解密结果
    if (!reqData.oldPassword) {
      const resData: ModifyUserPaswdRes = view.getModifyUserPaswdResData(3)
      res.json(resData)
      return
    }

    // 验证新密码解密结果
    if (!reqData.newPassword) {
      const resData: ModifyUserPaswdRes = view.getModifyUserPaswdResData(4)
      res.json(resData)
      return
    }

    // 查询旧密码
    let userPasswordDoc: (UserPasswordDoc & Document<UserPasswordDoc>) | null
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
      const resData: ModifyUserPaswdRes = view.getModifyUserPaswdResData(2)
      res.json(resData)
      return
    }

    // 验证用户旧密码
    const encryptedUserOldPassword: string = MD5(reqData.oldPassword).toString()
    if (!userPasswordDoc.password || encryptedUserOldPassword !== userPasswordDoc.password) {
      const resData: ModifyUserPaswdRes = view.getModifyUserPaswdResData(3)
      res.json(resData)
      return
    }

    // 验证新密码有效性
    if (!reqData.newPassword || reqData.newPassword.length < 6) {
      const resData: ModifyUserPaswdRes = view.getModifyUserPaswdResData(4)
      res.json(resData)
      return
    }

    /** 处理修改密码事件 */

    // MD5 单向加密新密码
    const encryptedUserNewPassword: string = MD5(reqData.newPassword).toString()

    // 更新用户密码
    let userPasswordUpdateRes: (UserPasswordDoc & Document<UserPasswordDoc>) | null
    try {
      userPasswordUpdateRes = await UserPasswordModel.findOneAndUpdate(
        { userId },
        { password: encryptedUserNewPassword },
        { new: true, useFindAndModify: false }
      )
    } catch (error) {
      next(error)
      return
    }

    // 删除当前会话信息
    try {
      await SessionInfoModel.deleteOne({ sessionId })
    } catch (error) {
      next(error)
      return
    }

    // 密码修改成功
    if (userPasswordUpdateRes && userPasswordUpdateRes.password === encryptedUserNewPassword) {
      const resData: ModifyUserPaswdRes = view.getModifyUserPaswdResData(1)
      res.json(resData)
      return
    }

    const defaultResData: ModifyUserPaswdRes = view.getModifyUserPaswdResData()
    res.json(defaultResData)
  }
}

/**
 * User account cancellation API controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function accountCancellation (): SessionRequestHandler {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    // 从会话信息获取用户 ID 与会话 ID
    const userId: string = req.session.userId
    const sessionId: string = req.session.sessionId
    if (!userId || !sessionId) {
      const resData: AccountCancellationRes = view.getAccountCancellationRes(2)
      res.json(resData)
      return
    }

    // 获取请求数据
    const reqData: AccountCancellationReq = req.body

    // 解密密码
    reqData.password = rsaDecrypt(reqData.password)

    // 验证旧密码解密结果
    if (!reqData.password) {
      const resData: AccountCancellationRes = view.getAccountCancellationRes(3)
      res.json(resData)
      return
    }

    // 查询密码
    let userPasswordDoc: (UserPasswordDoc & Document<UserPasswordDoc>) | null
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
      const resData: AccountCancellationRes = view.getAccountCancellationRes(2)
      res.json(resData)
      return
    }

    // 验证密码
    const encryptedUserPassword: string = MD5(reqData.password).toString()
    if (!userPasswordDoc.password || encryptedUserPassword !== userPasswordDoc.password) {
      const resData: AccountCancellationRes = view.getAccountCancellationRes(3)
      res.json(resData)
      return
    }

    /** 处理用户账号注销事件 */

    // 删除用户信息
    let userInfoDelRes
    try {
      userInfoDelRes = await UserInfoModel.deleteOne(
        { userId }
      )
    } catch (error) {
      next(error)
      return
    }

    // 删除密码信息
    let passwordDelRes
    try {
      passwordDelRes = await UserPasswordModel.deleteOne(
        { userId }
      )
    } catch (error) {
      next(error)
      return
    }

    // 删除该用户所有会话信息
    let sessionDelRes
    try {
      sessionDelRes = await SessionInfoModel.deleteMany(
        { userId }
      )
    } catch (error) {
      next(error)
      return
    }

    // 生成账号注销响应数据
    const currentTime: Date = new Date()
    const cancellationTime: string = currentTime.toISOString()
    const cancellationData = {
      cancellationTime
    }

    // 账号注销成功
    if (userInfoDelRes.ok && passwordDelRes.ok && sessionDelRes.ok) {
      const resData: AccountCancellationRes = view.getAccountCancellationRes(1, cancellationData)
      res.json(resData)
      return
    }

    const defaultResData: AccountCancellationRes = view.getAccountCancellationRes()
    res.json(defaultResData)
  }
}
