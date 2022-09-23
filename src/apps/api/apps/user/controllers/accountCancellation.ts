import { SessionRequestHandler, SessionRequest } from '@/interfaces/session'
import SessionInfoModel from '@/models/SessionInfo'
import { verifyAesSignature, aesDecryptWithTimestamp } from '@/utils/aes'
import { HmacMD5 } from 'crypto-js'
import { Response, NextFunction } from 'express'
import { AccountCancellationRes, AccountCancellationReq, UserPasswordDoc } from '../interfaces'
import UserInfoModel from '../models/UserInfo'
import UserPasswordModel from '../models/UserPassword'
import {
  accountCancellation as accountCancellationView,
  accountCancellationStatusCodes
} from '../views'
import { secretKey } from '@configs/secretKey'

// Import status codes
const {
  ACCOUNT_CANCELLATION_SUCCESS,
  USER_NOT_EXIST,
  INVALID_PASSWORD,
  DATA_SIGNATURE_VERIFICATION_FAILED
} = accountCancellationStatusCodes

/**
 * User account cancellation API handler version 1
 * @version v1
 * @param req - Express session request
 * @param res - Express response
 * @param next - Express next function
 */
async function accountCancellationV1 (req: SessionRequest, res: Response, next: NextFunction) {
  // 从会话信息获取用户 ID 与会话 ID
  const userId: string = req.session.userId
  const sessionId: string = req.session.sessionId
  if (!userId || !sessionId) {
    const resData: AccountCancellationRes = accountCancellationView(USER_NOT_EXIST)
    res.json(resData)
    return
  }

  // 获取请求数据
  const reqData: AccountCancellationReq = req.body

  /* 验证数字签名 */

  // 从请求头 Signature 字段获取数据签名
  const dataSignature = req.header('Signature')
  if (!dataSignature) {
    const resData: AccountCancellationRes = accountCancellationView(DATA_SIGNATURE_VERIFICATION_FAILED)
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
    const resData: AccountCancellationRes = accountCancellationView(DATA_SIGNATURE_VERIFICATION_FAILED)
    res.json(resData)
    return
  }

  // 解密密码
  const userPassword = aesDecryptWithTimestamp(
    reqData.password,
    req.session.clientAesKey
  )

  // 验证旧密码解密结果
  if (!userPassword) {
    const resData: AccountCancellationRes = accountCancellationView(INVALID_PASSWORD)
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
    const resData: AccountCancellationRes = accountCancellationView(USER_NOT_EXIST)
    res.json(resData)
    return
  }

  // 验证密码
  const encryptedUserPassword: string = HmacMD5(userPassword, secretKey).toString()
  if (!userPasswordDoc.password || encryptedUserPassword !== userPasswordDoc.password) {
    const resData: AccountCancellationRes = accountCancellationView(INVALID_PASSWORD)
    res.json(resData)
    return
  }

  /* 处理用户账号注销事件 */

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
    const resData: AccountCancellationRes = accountCancellationView(ACCOUNT_CANCELLATION_SUCCESS, cancellationData)
    res.json(resData)
    return
  }

  const defaultResData: AccountCancellationRes = accountCancellationView()
  res.json(defaultResData)
}

/**
 * User account cancellation API main controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function accountCancellation (): SessionRequestHandler {
  return (req: SessionRequest, res: Response, next: NextFunction) => {
    // API version controller
    switch (req.params.apiVersion) {
      // API version 1
      case 'v1': {
        accountCancellationV1(req, res, next)
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
