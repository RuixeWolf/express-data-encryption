/**
 * App interface
 */

import { ResBody } from '../../../../interfaces/resBody'

/**
 * User information MongoDB document
 */
 export interface UserInfoDoc {
  userId: string
  userAccount: string
  userName: string
  nickName: string
  avatar: string
  email: string
  phone: string
  modifyTime: string
  registerTime?: string
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
  data: UserInfoDoc
}
