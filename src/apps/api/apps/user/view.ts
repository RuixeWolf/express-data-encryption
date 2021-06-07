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
  ModifyUserPaswdRes,
  AccountCancellationRes
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
 * @param {UserInfoDoc | unknown} [data = {}] - Registration data
 * @returns {UserRegisterRes} User register response data
 */
export function getUserRegResData (statusCode?: number, data?: UserInfoDoc | unknown): UserRegisterRes {
  // Set status code
  statusCode = statusCode || 0
  // Set data
  data = data || {}

  // Init res data
  let userRegResData: UserRegisterRes = {
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
      
    default:
      userRegResData.message = '注册失败'
      userRegResData.statusCode = 0
      return userRegResData
  }
}

/**
 * Get user login response data
 * @param {number} [statusCode = 0] - User login status code
 * + 1: 登录成功
 * + 2: 用户不存在或密码无效
 * @param {unknown} [data = {}] - Login data
 * @returns User login response data
 */
export function getUserLoginResData (statusCode?: number, data?: unknown): UserLoginRes {
  statusCode = statusCode || 0
  data = data || {}

  let userLoginResData: UserLoginRes = {
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

/**
 * Get user information response data
 * @param {number} [statusCode = 0] - Get user information status code
 * + 1: 获取用户信息成功
 * + 2: 用户不存在
 * @param {UserInfoResData | unknown} data - User information data
 * @returns {UserInfoRes} User information response data
 */
export function getUserInfoResData (statusCode?: number, data?: GetUserInfoResData | unknown): GetUserInfoRes {
  statusCode = statusCode || 0
  data = data || {}

  let resData: GetUserInfoRes = {
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

/**
 * Get user logout response data
 * @param {number} [statusCode = 0] - User logout status code
 * + 1: 退出登录成功
 * + 2: 用户不存在
 * @param {unknown} data - User logout data
 * @returns {UserLogoutRes} User logout response data
 */
export function getUserLogoutResData (statusCode?: number, data?: unknown): UserLogoutRes {
  statusCode = statusCode || 0
  data = data || {}

  let resData: UserLogoutRes = {
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

/**
 * Get edit user information response data
 * @param {number} [statusCode = 0] - Edit user information status code
 * + 1: 修改用户信息成功
 * + 2: 用户不存在
 * + 3: 邮箱无效
 * + 4: 手机号无效
 * @param {EditUserInfoResData | unknown} data - User information data
 * @returns {EditUserInfoRes} Edit user information response data
 */
export function getEditUserInfoResData (statusCode?: number, data?: EditUserInfoResData | unknown): EditUserInfoRes {
  statusCode = statusCode || 0
  data = data || {}

  let resData: EditUserInfoRes = {
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

/**
 * Get modify user password response data
 * @param {number} [statusCode = 0] - Modify user password status code
 * + 1: 密码修改成功
 * + 2: 用户不存在
 * + 3: 旧密码无效
 * + 4: 新密码无效
 * @returns {ModifyUserPaswdRes} Modify user password response data
 */
export function getModifyUserPaswdResData (statusCode?: number): ModifyUserPaswdRes {
  statusCode = statusCode || 0

  let resData: ModifyUserPaswdRes = {
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

    default:
      resData.message = 'fail'
      resData.statusCode = 0
      return resData
  }
}

/**
 * Get user account cancellation response
 * @param {number} statusCode - Account cancellation satus code
 * + 1: 账号注销成功
 * + 2: 用户不存在
 * + 3: 密码无效
 * @param {unknown} data - Account cancellation data
 * @returns {AccountCancellationRes} User account cancellation response
 */
export function getAccountCancellationRes (statusCode?: number, data?: unknown): AccountCancellationRes {
  statusCode = statusCode || 0
  data = data || {}

  let resData: AccountCancellationRes = {
    message: '',
    success: false,
    statusCode,
    data
  }

  switch(statusCode) {
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
