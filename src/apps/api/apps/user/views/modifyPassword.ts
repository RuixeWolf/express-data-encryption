import { ModifyUserPaswdRes } from '../interfaces'

// Exprot status codes
export const modifyPasswordStatusCodes: Record<string, number> = {
  PASSWORD_MODIFIED_SUCCESS: 1,
  USER_NOT_EXIST: 2,
  INVALID_OLD_PASSWORD: 3,
  INVALID_NEW_PASSWORD: 4,
  DATA_SIGNATURE_VERIFICATION_FAILED: 5
}

/**
 * Get modify user password response data
 * @param {number} [statusCode = 0] - Modify user password status code
 * + 1: 密码修改成功
 * + 2: 用户不存在
 * + 3: 旧密码无效
 * + 4: 新密码无效
 * @returns {ModifyUserPaswdRes} Modify user password response data
 */
export function modifyPassword (
  statusCode: number = 0
): ModifyUserPaswdRes {
  const resData: ModifyUserPaswdRes = {
    message: '',
    success: false,
    statusCode
  }

  switch (statusCode) {
    case 1:
      // 密码修改成功
      resData.message = '密码已更改'
      resData.success = true
      return resData

    case 2:
      // 用户不存在
      resData.message = '用户不存在'
      return resData

    case 3:
      // 旧密码无效
      resData.message = '旧密码有误'
      return resData

    case 4:
      // 新密码无效
      resData.message = '新密码无效'
      return resData

    case 5:
      // 数据签名验证失败
      resData.message = '数据签名验证失败'
      return resData

    default:
      resData.message = 'fail'
      resData.statusCode = 0
      return resData
  }
}
