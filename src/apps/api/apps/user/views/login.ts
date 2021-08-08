import { UserLoginRes } from '../interfaces'

/**
 * Get user login response data
 * @param {number} [statusCode = 0] - User login status code
 * + 1: 登录成功
 * + 2: 用户不存在或密码无效
 * @param {unknown} [data = {}] - Login data
 * @returns User login response data
 */
export function login (
  statusCode: number = 0,
  data: unknown = {}
): UserLoginRes {
  const userLoginResData: UserLoginRes = {
    message: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 登陆成功
      userLoginResData.message = '登陆成功'
      userLoginResData.success = true
      return userLoginResData

    case 2:
      // 用户不存在或密码无效
      userLoginResData.message = '用户不存在或密码不正确'
      return userLoginResData

    default:
      userLoginResData.message = '登录失败'
      userLoginResData.statusCode = 0
      return userLoginResData
  }
}
