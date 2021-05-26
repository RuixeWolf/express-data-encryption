/**
 * UserInfo model
 */

import mongoose, { Schema, Model } from 'mongoose'
import mongodbUrl from '@configs/mongodb'

// Connect to MongoDB
mongoose.connect(
  mongodbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).catch(err => {
  throw err
})

// Create user info schema
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
const UserInfoModel: Model<any, any, any> = mongoose.model('UserInfo', UserInfoSchema)

export default UserInfoModel
