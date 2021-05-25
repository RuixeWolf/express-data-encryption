/**
 * SessionInfo model
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

const SessionInfoModel: Model<any, any, any> = model('SessionInfo', SessionInfoSchema)
export default SessionInfoModel
