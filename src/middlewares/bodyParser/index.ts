/**
 * Body parser middleware
 */

import express, { Express } from 'express'
import bodyParser from 'body-parser'

const app: Express = express()

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json
app.use(bodyParser.json())

export default app
