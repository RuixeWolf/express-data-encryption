/**
 * App view
 */

// Import interfaces
import {
  UserRegisterRes,
  UserInfoDoc,
  UserLoginRes,
  GetUserInfoRes,
  GetUserInfoResData,
  UserLogoutRes,
  EditUserInfoResData,
  EditUserInfoRes,
  ModifyUserPaswdRes
} from './interface'

/**
 * Get user register response data
 * @param {number} [statusCode = 0] - Registration status code
 * + 1: 注册成功
 * + 2: 用户名无效
 * + 3: 用户名已被占用
 * + 4: 密码无效
 * + 5: 邮箱无效
 * + 6: 手机号无效
 * @param {(UserInfoDoc|any)} [data = {}] - Registration data
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
      userRegResData.statusCode = 0
      return userRegResData
  }
}

/**
 * Get user login response data
 * @param {number} [statusCode = 0] - User login status code
 * + 1: 登录成功
 * + 2: 用户不存在或密码无效
 * @param {any} [data = {}] - Login data
 * @returns User login response data
 */
export function getUserLoginResData(statusCode?: number, data?: any): UserLoginRes {
  statusCode = statusCode || 0
  data = data || {}

  let userLoginResData: UserLoginRes = {
    msg: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 登陆成功
      userLoginResData.msg = '登陆成功'
      userLoginResData.success = true
      return userLoginResData

    case 2:
      // 用户不存在或密码无效
      userLoginResData.msg = '用户不存在或密码不正确'
      return userLoginResData

    default:
      userLoginResData.msg = '登录失败'
      userLoginResData.statusCode = 0
      return userLoginResData
  }
}

/**
 * Get user information response data
 * @param {number} [statusCode = 0] - Get user information status code
 * + 1: 获取用户信息成功
 * + 2: 用户不存在
 * @param {(UserInfoResData | any)} data - User information data
 * @returns {UserInfoRes} User information response data
 */
export function getUserInfoResData(statusCode?: number, data?: GetUserInfoResData | any): GetUserInfoRes {
  statusCode = statusCode || 0
  data = data || {}

  let resData: GetUserInfoRes = {
    msg: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 获取用户信息成功
      resData.msg = 'success'
      resData.success = true
      return resData

    case 2:
      // 用户不存在
      resData.msg = '用户不存在'
      return resData

    default:
      resData.msg = 'fail'
      resData.statusCode = 0
      return resData
  }
}

/**
 * Get user logout response data
 * @param {number} [statusCode = 0] - User logout status code
 * + 1: 退出登录成功
 * + 2: 用户不存在
 * @param {any} data - User logout data
 * @returns {UserLogoutRes} User logout response data
 */
export function getUserLogoutResData(statusCode?: number, data?: any): UserLogoutRes {
  statusCode = statusCode || 0
  data = data || {}

  let resData: UserLogoutRes = {
    msg: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 退出登录成功
      resData.msg = '已退出登录'
      resData.success = true
      return resData

    case 2:
      // 用户不存在
      resData.msg = '用户不存在'
      return resData

    default:
      resData.msg = 'fail'
      resData.statusCode = 0
      return resData
  }
}

/**
 * Get edit user information response data
 * @param {number} [statusCode = 0] - Edit user information status code
 * + 1: 修改用户信息成功
 * + 2: 用户不存在
 * + 3: 邮箱无效
 * + 4: 手机号无效
 * @param {(EditUserInfoResData | any)} data - User information data
 * @returns {EditUserInfoRes} Edit user information response data
 */
export function getEditUserInfoResData(statusCode?: number, data?: EditUserInfoResData | any): EditUserInfoRes {
  statusCode = statusCode || 0
  data = data || {}

  let resData: EditUserInfoRes = {
    msg: '',
    success: false,
    statusCode,
    data
  }

  switch (statusCode) {
    case 1:
      // 修改用户信息成功
      resData.msg = '用户信息已更改'
      resData.success = true
      return resData

    case 2:
      // 用户不存在
      resData.msg = '用户不存在'
      return resData

    case 3:
      // 邮箱无效
      resData.msg = '邮箱格式有误'
      return resData

    case 4:
      // 手机号无效
      resData.msg = '手机号格式有误'
      return resData

    default:
      resData.msg = 'fail'
      resData.statusCode = 0
      return resData
  }
}

/**
 * Get modify user password response data
 * @param {number} [statusCode = 0] - Modify user password status code
 * + 1: 密码修改成功
 * + 2: 用户不存在或旧密码无效
 * + 3: 新密码无效
 * @returns {ModifyUserPaswdRes} Modify user password response data
 */
export function getModifyUserPaswdResData(statusCode?: number): ModifyUserPaswdRes {
  statusCode = statusCode || 0

  let resData: ModifyUserPaswdRes = {
    msg: '',
    success: false,
    statusCode
  }

  switch (statusCode) {
    case 1:
      // 密码修改成功
      resData.msg = '密码已更改'
      resData.success = true
      return resData
    
    case 2:
      // 用户不存在
      resData.msg = '用户不存在或旧密码不正确'
      return resData
    
    case 3:
      // 新密码无效
      resData.msg = '新密码无效'
      return resData

    default:
      resData.msg = 'fail'
      resData.statusCode = 0
      return resData
  }
}
