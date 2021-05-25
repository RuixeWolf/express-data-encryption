/**
 * UserPassword model
 */

import { connect, Schema, Model, model } from 'mongoose'
import mongodbUrl from '@configs/mongodb'

// Connect to MongoDB
connect(
  mongodbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).catch(err => {
  throw err
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
const UserPasswordModel: Model<any, any, any> = model('UserPassword', UserPasswordSchema)

export default UserPasswordModel
