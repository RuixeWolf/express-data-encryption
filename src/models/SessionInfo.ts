/**
 * SessionInfo model
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

const SessionInfoSchema = new Schema({
  sessionId: {
    type: String,
    required: true
  },
  authToken: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdTime: {
    type: Date,
    required: true
  },
  expTime: {
    type: Date,
    required: true
  }
})

const SessionInfoModel: Model<any, any, any> = mongoose.model('SessionInfo', SessionInfoSchema)
export default SessionInfoModel
