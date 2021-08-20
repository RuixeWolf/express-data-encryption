import { UserLogoutRes } from '../interfaces'

// Exprot status codes
export const logoutStatusCodes: Record<string, number> = {
  LOGOUT_SUCCESS: 1,
  USER_NOT_EXIST: 2
}

/**
 * Get user logout response data
 * @param {number} [statusCode = 0] - User logout status code
 * + 1: 退出登录成功
 * + 2: 用户不存在
 * @param {unknown} [data = {}] - User logout data
 * @returns {UserLogoutRes} User logout response data
 */
export function logout (
  statusCode: number = 0,
  data: unknown = {}
): UserLogoutRes {
  const resData: UserLogoutRes = {
    message: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 退出登录成功
      resData.message = '已退出登录'
      resData.success = true
      return resData

    case 2:
      // 用户不存在
      resData.message = '用户不存在'
      return resData

    default:
      resData.message = 'fail'
      resData.statusCode = 0
      return resData
  }
}
