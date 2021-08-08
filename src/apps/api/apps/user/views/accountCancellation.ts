import { AccountCancellationRes } from '../interfaces'

/**
 * Get user account cancellation response
 * @param {number} [statusCode = 0] - Account cancellation satus code
 * + 1: 账号注销成功
 * + 2: 用户不存在
 * + 3: 密码无效
 * @param {unknown} [data = {}] - Account cancellation data
 * @returns {AccountCancellationRes} User account cancellation response
 */
export function accountCancellation (
  statusCode: number = 0,
  data: unknown = {}
): AccountCancellationRes {
  const resData: AccountCancellationRes = {
    message: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 账号注销成功
      resData.message = '账号已注销'
      resData.success = true
      return resData

    case 2:
      // 用户不存在
      resData.message = '用户不存在'
      return resData

    case 3:
      // 密码无效
      resData.message = '密码有误'
      return resData

    default:
      resData.message = 'fail'
      resData.statusCode = 0
      return resData
  }
}
