import { SessionRequestHandler, SessionRequest } from '@/interfaces/session'
import SessionInfoModel from '@/models/SessionInfo'
import { verifyAesSignature, aesDecryptWithTimestamp } from '@/utils/aes'
import { rsaDecrypt } from '@/utils/rsa'
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
  INVALID_NEW_PASSWORD,
  DATA_SIGNATURE_VERIFICATION_FAILED
} = modifyPasswordStatusCodes

/**
 * Modify user password API handler version 1
 * @version v1
 * @param req - Express session request
 * @param res - Express response
 * @param next - Express next function
 */
async function modifyPasswordV1 (req: SessionRequest, res: Response, next: NextFunction) {
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

  /* 验证数字签名 */

  // 从请求头 Signature 字段获取数据签名
  const dataSignature = req.header('Signature')
  if (!dataSignature) {
    const resData: ModifyUserPaswdRes = modifyPasswordView(DATA_SIGNATURE_VERIFICATION_FAILED)
    res.json(resData)
    return
  }

  // 验证数字签名，判断数据是否被篡改
  const verifySignatureResult = verifyAesSignature({
    data: reqData as unknown as Record<string, unknown>,
    signature: dataSignature,
    aesSecretKey: req.session.clientAesKey
  })
  if (!verifySignatureResult) {
    const resData: ModifyUserPaswdRes = modifyPasswordView(DATA_SIGNATURE_VERIFICATION_FAILED)
    res.json(resData)
    return
  }

  // 解密密码
  const oldPassword = aesDecryptWithTimestamp(
    reqData.oldPassword,
    req.session.clientAesKey
  )
  const newPassword = aesDecryptWithTimestamp(
    reqData.newPassword,
    req.session.clientAesKey
  )

  // 验证旧密码解密结果
  if (!oldPassword) {
    const resData: ModifyUserPaswdRes = modifyPasswordView(INVALID_OLD_PASSWORD)
    res.json(resData)
    return
  }

  // 验证新密码解密结果
  if (!newPassword) {
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
  const encryptedUserOldPassword: string = HmacMD5(oldPassword, secretKey).toString()
  if (!userPasswordDoc.password || encryptedUserOldPassword !== userPasswordDoc.password) {
    const resData: ModifyUserPaswdRes = modifyPasswordView(INVALID_OLD_PASSWORD)
    res.json(resData)
    return
  }

  // 验证新密码有效性
  if (!newPassword || newPassword.length < 6) {
    const resData: ModifyUserPaswdRes = modifyPasswordView(INVALID_NEW_PASSWORD)
    res.json(resData)
    return
  }

  /* 处理修改密码事件 */

  // MD5 单向加密新密码
  const encryptedUserNewPassword: string = HmacMD5(newPassword, secretKey).toString()

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

/**
 * Modify user password API main controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function modifyPassword (): SessionRequestHandler {
  return (req: SessionRequest, res: Response, next: NextFunction) => {
    // API version controller
    switch (req.params.apiVersion) {
      // API version 1
      case 'v1': {
        modifyPasswordV1(req, res, next)
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
