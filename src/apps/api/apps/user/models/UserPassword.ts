/**
 * UserPassword model
 */

import mongoose, { Schema, Model } from 'mongoose'
import mongodbUrl from '@configs/mongodb'
import { printLog } from '@utils/printLog'
import { UserPasswordDoc } from '../interface'

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

// Create user password schema
const UserPasswordSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// Create user password model
const UserPasswordModel: Model<UserPasswordDoc, unknown, unknown> = mongoose.model('UserPassword', UserPasswordSchema)

export default UserPasswordModel
