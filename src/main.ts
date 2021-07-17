/**
 * Main service app entrance
 */

// Register module alias
import 'module-alias/register'

import express, { Express } from 'express'
import * as serviceConfig from './configs/service'
import middlewares from './publicMiddlewares'
import staticFiles from './static'
import router from './router'
import { serverErrorHandler } from './serverError'
import { printLog } from '@utils/printLog'

// Create Express app
const app: Express = express()

// Register public middlewares
app.use(middlewares)

// Register static files
app.use(staticFiles)

// Register main router
app.use(router)

// Register internal server error
app.use(serverErrorHandler())

// Start HTTP service
app.listen(serviceConfig.port, () => {
  console.clear()
  printLog('Service is running at', `http://localhost:${serviceConfig.port}/`, 0)
})
