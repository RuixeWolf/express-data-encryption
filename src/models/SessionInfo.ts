/**
 * SessionInfo model
 */

import mongoose, { Schema, Model, Document } from 'mongoose'
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

// Create session information schema
const SessionInfoSchema: Schema = new Schema({
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
  clientAesKey: {
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

const SessionInfoModel: Model<Document<SessionInfoDoc>> = mongoose.model(
  'SessionInfo',
  SessionInfoSchema,
  'session_info'
)
export default SessionInfoModel
