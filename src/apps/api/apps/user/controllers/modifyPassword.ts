import { SessionRequestHandler, SessionRequest } from '@/interfaces/session'
import SessionInfoModel from '@/models/SessionInfo'
import { rsaDecrypt } from '@/utils/rsaEncrypt'
import { HmacMD5 } from 'crypto-js'
import { Response, NextFunction } from 'express'
import { ModifyUserPaswdRes, ModifyUserPaswdReq, UserPasswordDoc } from '../interfaces'
import UserPasswordModel from '../models/UserPassword'
import { modifyPassword as modifyPasswordView, modifyPasswordStatusCodes } from '../views'
import { secretKey } from '@configs/secretKey'

// Import status codes
const {
  PASSWORD_MODIFIED_SUCCESS,
  USER_NOT_EXIST,
  INVALID_OLD_PASSWORD,
  INVALID_NEW_PASSWORD
} = modifyPasswordStatusCodes

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
      const resData: ModifyUserPaswdRes = modifyPasswordView(USER_NOT_EXIST)
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
      const resData: ModifyUserPaswdRes = modifyPasswordView(INVALID_OLD_PASSWORD)
      res.json(resData)
      return
    }

    // 验证新密码解密结果
    if (!reqData.newPassword) {
      const resData: ModifyUserPaswdRes = modifyPasswordView(INVALID_NEW_PASSWORD)
      res.json(resData)
      return
    }

    // 查询旧密码
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
      const resData: ModifyUserPaswdRes = modifyPasswordView(USER_NOT_EXIST)
      res.json(resData)
      return
    }

    // 验证用户旧密码
    const encryptedUserOldPassword: string = HmacMD5(reqData.oldPassword, secretKey).toString()
    if (!userPasswordDoc.password || encryptedUserOldPassword !== userPasswordDoc.password) {
      const resData: ModifyUserPaswdRes = modifyPasswordView(INVALID_OLD_PASSWORD)
      res.json(resData)
      return
    }

    // 验证新密码有效性
    if (!reqData.newPassword || reqData.newPassword.length < 6) {
      const resData: ModifyUserPaswdRes = modifyPasswordView(INVALID_NEW_PASSWORD)
      res.json(resData)
      return
    }

    /** 处理修改密码事件 */

    // MD5 单向加密新密码
    const encryptedUserNewPassword: string = HmacMD5(reqData.newPassword, secretKey).toString()

    // 更新用户密码
    let userPasswordUpdateRes: UserPasswordDoc | null
    try {
      userPasswordUpdateRes = await UserPasswordModel.findOneAndUpdate(
        { userId },
        { password: encryptedUserNewPassword },
        { new: true, useFindAndModify: false }
      ) as UserPasswordDoc | null
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
      const resData: ModifyUserPaswdRes = modifyPasswordView(PASSWORD_MODIFIED_SUCCESS)
      res.json(resData)
      return
    }

    const defaultResData: ModifyUserPaswdRes = modifyPasswordView()
    res.json(defaultResData)
  }
}
