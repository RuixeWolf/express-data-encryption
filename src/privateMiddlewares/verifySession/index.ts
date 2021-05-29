/**
 * Verify authorization middleware
 */

import { Response, NextFunction } from 'express'
import { SessionRequestHandler, SessionRequest, SessionInfoDoc } from '@interfaces/session'
import { parseToken } from '@utils/sessionToken'
import SessionInfoModel from '@models/SessionInfo'
import * as view from './view'
import { JsonRes } from '@interfaces/resBody'

/**
 * Verify session information
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function verifySession(): SessionRequestHandler {
  return async (req: SessionRequest, res: Response, next: NextFunction) => {
    /** 验证会话有效性 */

    // 从请求头获取 authorization token
    const authToken: string | undefined = req.header('Authorization')
    // 验证请求头是否包含 Authorization
    if (!authToken) {
      res.status(403)
      const resData: JsonRes = view.verifySessionRes(10001)
      res.json(resData)
      return
    }

    // 解密 token 获取 session ID
    const sessionId: string = parseToken(authToken)
    // 验证解密结果
    if (!sessionId) {
      res.status(403)
      const resData: JsonRes = view.verifySessionRes(10002)
      res.json(resData)
      return
    }

    // 查询会话信息
    let sessionInfo: SessionInfoDoc
    try {
      sessionInfo = await SessionInfoModel.findOne(
        { sessionId },
        { _id: false }
      )
    } catch (error) {
      next(error)
      throw error
    }
    // 验证查询结果
    if (!sessionInfo || authToken !== sessionInfo.authToken) {
      res.status(403)
      const resData: JsonRes = view.verifySessionRes(10002)
      res.json(resData)
      return
    }

    // 验证会话是否过期
    const sessionExpTime: Date = new Date(sessionInfo.expTime)
    const sessionExpTimestamp: number = sessionExpTime.getTime()
    const currentTimestamp: number = Date.now()
    if (sessionExpTimestamp < currentTimestamp) {
      // 删除本条已过期的会话信息
      try {
        await SessionInfoModel.deleteOne({ sessionId: sessionInfo.sessionId })
      } catch (error) {
        next(error)
        throw error
      }
      res.status(403)
      const resData: JsonRes = view.verifySessionRes(10003)
      res.json(resData)
      return
    }

    /** 会话验证通过 */

    // 续期会话信息
    const date: Date = new Date()
    date.setDate(date.getDate() + 7)
    const afterOneWeek: string = date.toISOString()
    try {
      await SessionInfoModel.updateOne(
        { sessionId: sessionInfo.sessionId },
        { expTime: afterOneWeek }
      )
    } catch (error) {
      next(error)
      throw error
    }

    // 将 sessionInfo 添加至 req.session
    req.session = {
      sessionId: sessionInfo.sessionId,
      userId: sessionInfo.userId
    }
    // 转发请求至下一个处理器
    next()
  }
}
