import { SessionRequestHandler, SessionRequest } from '@/interfaces/session'
import SessionInfoModel from '@/models/SessionInfo'
import { Response, NextFunction } from 'express'
import { UserLogoutRes } from '../interfaces'
import { logout as logoutView, logoutStatusCodes } from '../views'

// Import status codes
const {
  LOGOUT_SUCCESS,
  USER_NOT_EXIST
} = logoutStatusCodes

/**
 * User logout API handler version 1
 * @version v1
 * @param req - Express session request
 * @param res - Express response
 * @param next - Express next function
 */
async function logoutV1 (req: SessionRequest, res: Response, next: NextFunction) {
  // 从会话信息获取用户 ID 与会话 ID
  const userId: string = req.session.userId
  const sessionId: string = req.session.sessionId
  if (!userId || !sessionId) {
    const resData: UserLogoutRes = logoutView(USER_NOT_EXIST)
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
    const resData: UserLogoutRes = logoutView(LOGOUT_SUCCESS, logoutData)
    res.json(resData)
    return
  }

  const defaultResData: UserLogoutRes = logoutView()
  res.json(defaultResData)
}

/**
 * User logout API main controller
 * @returns {SessionRequestHandler} Session request handler of Express app
 */
export function logout (): SessionRequestHandler {
  return (req: SessionRequest, res: Response, next: NextFunction) => {
    // API version controller
    switch (req.params.apiVersion) {
      // API version 1
      case 'v1': {
        logoutV1(req, res, next)
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
