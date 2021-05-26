/**
 * UserPassword model
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
const UserPasswordModel: Model<any, any, any> = mongoose.model('UserPassword', UserPasswordSchema)

export default UserPasswordModel
