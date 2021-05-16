/**
 * App view
 */

// Import interfaces
import { UserRegisterRes, UserInfoDoc } from './interface'

/**
 * Get user register response data
 * @param {number} [statusCode=0] - Register status code
 * + 1: 注册成功
 * + 2: 用户名无效
 * + 3: 密码无效
 * + 4: 用户名已被占用
 * + 5: 邮箱无效
 * + 6: 手机号无效
 * @param {(UserInfoDoc|any)} [data={}] - User info
 * @returns {UserRegisterRes} User register response data
 */
export function getUserRegResData(statusCode?: number, data?: UserInfoDoc | any): UserRegisterRes {
  // Set status code
  statusCode = statusCode || 0
  // Set data
  data = data || {}

  // Init res data
  let userRegResData: UserRegisterRes = {
    msg: '',
    success: false,
    statusCode,
    data
  }

  // Handle register status
  switch (statusCode) {
    case 1:
      // 注册成功
      userRegResData.msg = '注册成功'
      userRegResData.success = true
      return userRegResData

    case 2:
      // 用户名无效
      userRegResData.msg = '用户名无效'
      return userRegResData

    case 3:
      // 用户名已存在
      userRegResData.msg = '用户名已被占用'
      return userRegResData

    case 4:
      // 密码无效
      userRegResData.msg = '密码无效'
      return userRegResData
    
    case 5:
      // 邮箱无效
      userRegResData.msg = '邮箱格式有误'
      return userRegResData

    case 6:
      // 手机号无效
      userRegResData.msg = '手机号格式有误'
      return userRegResData
      
    default:
      userRegResData.msg = '注册失败'
      return userRegResData
  }
}
