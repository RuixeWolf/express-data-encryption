/**
 * App interface
 */

import { ResBody } from '@interfaces/resBody'

/**
 * User information MongoDB document
 */
 export interface UserInfoDoc {
  userId: string
  userAccount: string
  userName: string
  nickName: string | null
  avatar: string | null
  email: string | null
  phone: string | null
  modifiedTime: string
  registerTime: string
}

/**
 * User password MongoDB document
 */
export interface UserPasswordDoc {
  userId: string
  password: string
}

/**
 * User register request data
 */
export interface UserRegisterReq {
  userName: string
  password: string
  nickName?: string
  avatar?: string
  email?: string
  phone?: string
}

/**
 * User register response data
 */
export interface UserRegisterRes extends ResBody {
  data: UserInfoDoc | any
}

/**
 * User login request data
 */
export interface UserLoginReq {
  user: string
  password: string
}

/**
 * User login response data
 */
export interface UserLoginRes extends ResBody {
  data: any
}

/**
 * Get user info response date
 */
export interface GetUserInfoResData {
  userId: string
  userAccount: string
  userName: string
  nickName: string | null
  avatar: string | null
  email: string | null
  phone: string | null
  modifiedTime: string
  registerTime: string
}

/**
 * User information response data
 */
export interface GetUserInfoRes extends ResBody {
  data: GetUserInfoResData | any
}

/**
 * User logout response data
 */
export interface UserLogoutRes extends ResBody {
  data: any
}

/**
 * Edit user information request data
 */
export interface EditUserInfoReq {
  nickName: string | null
  avatar: string | null
  email: string | null
  phone: string | null
}

/**
 * User information fields that can be edited
 */
export interface EditUserInfoFields {
  nickName: string | null
  avatar: string | null
  email: string | null
  phone: string | null,
  modifiedTime: string
}

/**
 * Edit user information response data
 */
export interface EditUserInfoResData
  extends GetUserInfoResData {}

/**
 * Edit user information response
 */
export interface EditUserInfoRes
  extends GetUserInfoRes {}

/**
 * Modify user password request
 */
export interface ModifyUserPaswdReq {
  oldPassword: string
  newPassword: string
}

/**
 * Modify user password response
 */
export interface ModifyUserPaswdRes
  extends ResBody {}
