import { UserInfoDoc, UserRegisterRes } from '../interfaces'

// Exprot status codes
export const registerStatusCodes: Record<string, number> = {
  REGISTER_SUCCESS: 1,
  INVALID_USER_NAME: 2,
  USER_NAME_EXIST: 3,
  INVALID_PASSWORD: 4,
  INVALID_EMAIL: 5,
  INVALID_PHONE: 6,
  DATA_SIGNATURE_VERIFICATION_FAILED: 7
}

/**
 * Get user register response data
 * @param {number} [statusCode = 0] - Registration status code
 * + 1: 注册成功
 * + 2: 用户名无效
 * + 3: 用户名已被占用
 * + 4: 密码无效
 * + 5: 邮箱无效
 * + 6: 手机号无效
 * @param {UserInfoDoc | unknown} [data = {}] - Registration data
 * @returns {UserRegisterRes} User register response data
 */
export function register (
  statusCode: number = 0,
  data: UserInfoDoc | unknown = {}
): UserRegisterRes {
  // Init res data
  const userRegResData: UserRegisterRes = {
    message: '',
    success: false,
    statusCode,
    data
  }

  // Handle register status
  switch (statusCode) {
    case 1:
      // 注册成功
      userRegResData.message = '注册成功'
      userRegResData.success = true
      return userRegResData

    case 2:
      // 用户名无效
      userRegResData.message = '用户名无效'
      return userRegResData

    case 3:
      // 用户名已存在
      userRegResData.message = '用户名已被占用'
      return userRegResData

    case 4:
      // 密码无效
      userRegResData.message = '密码无效'
      return userRegResData

    case 5:
      // 邮箱无效
      userRegResData.message = '邮箱格式有误'
      return userRegResData

    case 6:
      // 手机号无效
      userRegResData.message = '手机号格式有误'
      return userRegResData

    case 7:
      // 数据签名验证失败
      userRegResData.message = '数据签名验证失败'
      return userRegResData

    default:
      userRegResData.message = '注册失败'
      userRegResData.statusCode = 0
      return userRegResData
  }
}
