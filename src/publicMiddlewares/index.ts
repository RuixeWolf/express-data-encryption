/**
 * Main middleware config
 */

import epxress, { Express } from 'express'

// Import middlewares
import bodyParser from './bodyParser'
import { printReqInfo } from './printInfo'

const app: Express = epxress()

// Register public middlewares
app.use(bodyParser)
app.use(printReqInfo())

export default app
