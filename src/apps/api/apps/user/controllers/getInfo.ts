import { SessionRequestHandler, SessionRequest } from '@/interfaces/session'
import { Response, NextFunction } from 'express'
import { Document } from 'mongoose'
import { GetUserInfoRes, UserInfoDoc, GetUserInfoResData } from '../interfaces'
import UserInfoModel from '../models/UserInfo'
import { getInfo as getInfoView } from '../views'

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
      const resData: GetUserInfoRes = getInfoView(2)
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
      const resData: GetUserInfoRes = getInfoView(2)
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
      const resData: GetUserInfoRes = getInfoView(1, userInfoResData)
      res.json(resData)
      return
    }

    const defaultResData: GetUserInfoRes = getInfoView()
    res.json(defaultResData)
  }
}
