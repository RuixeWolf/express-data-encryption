/**
 * SessionInfo model
 */

import mongoose, { Schema, Model } from 'mongoose'
import mongodbUrl from '@configs/mongodb'
import { printLog } from '@utils/printLog'
import { SessionInfoDoc } from '@interfaces/session'

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

const SessionInfoModel: Model<SessionInfoDoc, unknown, unknown> = mongoose.model('SessionInfo', SessionInfoSchema)
export default SessionInfoModel
