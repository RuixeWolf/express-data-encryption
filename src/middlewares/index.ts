/**
 * Main middleware config
 */

import epxress, { Express } from 'express'

// Import middlewares
import bodyParser from './bodyParser'

const app: Express = epxress()

// Register middlewares
app.use(bodyParser)

export default app
