import { GetUserInfoResData, GetUserInfoRes } from '../interfaces'

// Exprot status codes
export const getInfoStatusCodes: Record<string, number> = {
  GET_INFO_SUCCESS: 1,
  USER_NOT_EXIST: 2
}

/**
 * Get user information response data
 * @param {number} [statusCode = 0] - Get user information status code
 * + 1: 获取用户信息成功
 * + 2: 用户不存在
 * @param {UserInfoResData | unknown} [data = {}] - User information data
 * @returns {UserInfoRes} User information response data
 */
export function getInfo (
  statusCode: number = 0,
  data: GetUserInfoResData | unknown = {}
): GetUserInfoRes {
  const resData: GetUserInfoRes = {
    message: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 获取用户信息成功
      resData.message = 'success'
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
