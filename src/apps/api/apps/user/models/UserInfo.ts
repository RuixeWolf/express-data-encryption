/**
 * UserInfo model
 */

import mongoose, { Schema, Model } from 'mongoose'
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
const UserInfoModel: Model<UserInfoDoc, unknown, unknown> = mongoose.model(
  'UserInfo',
  UserInfoSchema,
  'user_info'
)

export default UserInfoModel
