import { EditUserInfoResData, EditUserInfoRes } from '../interfaces'

/**
 * Get edit user information response data
 * @param {number} [statusCode = 0] - Edit user information status code
 * + 1: 修改用户信息成功
 * + 2: 用户不存在
 * + 3: 邮箱无效
 * + 4: 手机号无效
 * @param {EditUserInfoResData | unknown} [data = {}] - User information data
 * @returns {EditUserInfoRes} Edit user information response data
 */
export function editInfo (
  statusCode: number = 0,
  data: EditUserInfoResData | unknown = {}
): EditUserInfoRes {
  const resData: EditUserInfoRes = {
    message: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 修改用户信息成功
      resData.message = '用户信息已更改'
      resData.success = true
      return resData

    case 2:
      // 用户不存在
      resData.message = '用户不存在'
      return resData

    case 3:
      // 邮箱无效
      resData.message = '邮箱格式有误'
      return resData

    case 4:
      // 手机号无效
      resData.message = '手机号格式有误'
      return resData

    default:
      resData.message = 'fail'
      resData.statusCode = 0
      return resData
  }
}
