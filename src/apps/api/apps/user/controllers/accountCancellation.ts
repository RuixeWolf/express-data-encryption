import { SessionRequestHandler, SessionRequest } from '@/interfaces/session'
import SessionInfoModel from '@/models/SessionInfo'
import { rsaDecrypt } from '@/utils/rsaEncrypt'
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
  INVALID_PASSWORD
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

  // 解密密码
  reqData.password = rsaDecrypt(reqData.password)

  // 验证旧密码解密结果
  if (!reqData.password) {
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
  const encryptedUserPassword: string = HmacMD5(reqData.password, secretKey).toString()
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
