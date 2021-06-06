/**
 * Main service app entrance
 */

// Register module alias
import 'module-alias/register'

import express, { Express } from 'express'
import * as serverConfig from './configs/server'
import middlewares from './publicMiddlewares'
import staticFiles from './static'
import router from './router'
import { serverErrorHandler } from './serverError'
import { printLog } from '@utils/printLog'
import { getLocalIP } from '@utils/getIP'

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
app.listen(serverConfig.port, () => {
  const host: string = getLocalIP() || 'localhost'
  console.clear()
  printLog('Service is running at', `http://${host}:${serverConfig.port}/`, 0)
})
