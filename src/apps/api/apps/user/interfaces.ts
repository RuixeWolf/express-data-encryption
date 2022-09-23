/**
 * App interfaces
 */

import { JsonRes } from '@interfaces/resBody'

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
  clientAesKey: string
  nickName?: string
  avatar?: string
  email?: string
  phone?: string
}

/**
 * User register response
 */
export interface UserRegisterRes extends JsonRes {
  data: UserInfoDoc | unknown
}

/**
 * User login request data
 */
export interface UserLoginReq {
  user: string
  password: string
  clientAesKey: string
}

/**
 * User login response
 */
export interface UserLoginRes extends JsonRes {
  data: unknown
}

/**
 * Get user info response data
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
 * User information response
 */
export interface GetUserInfoRes extends JsonRes {
  data: GetUserInfoResData | unknown
}

/**
 * User logout response
 */
export interface UserLogoutRes extends JsonRes {
  data: unknown
}

/**
 * Edit user information request data
 */
export interface EditUserInfoReq {
  nickName?: string | null
  avatar?: string | null
  email?: string | null
  phone?: string | null
}

/**
 * User information fields that can be edited
 */
export interface EditUserInfoFields {
  nickName?: string | null
  avatar?: string | null
  email?: string | null
  phone?: string | null,
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
extends JsonRes {}

/**
 * User account cancellation request
 */
export interface AccountCancellationReq {
  password: string
}

/**
 * User account cancellation response
 */
export interface AccountCancellationRes
extends JsonRes {
  data: unknown
}
