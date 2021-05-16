/**
 * UserPassword model
 */

import { Schema, model, Model } from 'mongoose'

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
