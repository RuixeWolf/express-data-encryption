/**
 * UserPassword model
 */

import mongoose, { Schema, Model, Document } from 'mongoose'
import mongodbUrl from '@configs/mongodb'
import { printLog } from '@utils/printLog'
import { UserPasswordDoc } from '../interfaces'

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
const UserPasswordModel: Model<Document<UserPasswordDoc>> = mongoose.model(
  'UserPassword',
  UserPasswordSchema,
  'user_password'
)

export default UserPasswordModel
