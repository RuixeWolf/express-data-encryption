/**
 * UserInfo model
 */

import mongoose, { Schema, Model, Document } from 'mongoose'
import mongodbUrl from '@configs/mongodb'
import { printLog } from '@utils/printLog'
import { UserInfoDoc } from '../interfaces'

// Connect to MongoDB
mongoose.connect(
  mongodbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).catch(err => {
  printLog(err.name, err.message, 3)
})

// User roles
export const userRoleMap = {
  /**
   * Super administrator
   * + Has all permissions
   */
  ADMIN: 'admin',
  /**
   * User administrator
   * + Read all user information
   * + Edit all user information
   */
  USER_ADMIN: 'userAdmin',
  /**
   * General user (Can not set this role)
   * + Read self information
   * + Edit self information
   */
  GENERAL_USER: 'generalUser'
}

// Create user information schema
const UserInfoSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  userAccount: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  // TODO: 添加用户角色
  // roles: {
  //   type: [String],
  //   required: true,
  //   default: [userRoleMap.GENERAL_USER]
  // },
  nickName: {
    type: String
  },
  avatar: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  registerTime: {
    type: Date
  },
  modifiedTime: {
    type: Date,
    default: Date.now
  }
})

// Create user info model
const UserInfoModel: Model<Document<UserInfoDoc>> = mongoose.model(
  'UserInfo',
  UserInfoSchema,
  'user_info'
)

export default UserInfoModel
