/**
 * Main middleware config
 */

import epxress, { Express } from 'express'

// Import middlewares
import bodyParser from './bodyParser'
import { printReqInfo } from './printInfo'
import historyFallback from './historyFallback'

const app: Express = epxress()

// Register public middlewares
app.use(bodyParser)
app.use(printReqInfo())
app.use(historyFallback)

export default app
