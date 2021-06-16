/**
 * Body parser middleware
 */

import express, { Express } from 'express'
import { urlencoded, json } from 'body-parser'

const app: Express = express()

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }))

// Parse application/json
app.use(json())

export default app
