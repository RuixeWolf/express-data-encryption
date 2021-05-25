/**
 * Main server app entrance
 */

// Register module alias
require('module-alias/register')

import express, { Express } from 'express'
import * as serverConfig from './configs/server'
import middlewares from './publicMiddlewares'
import staticFiles from './static'
import router from './router'
import { serverErrorHandler } from './serverError'

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

// Start http server
app.listen(serverConfig.port, () => {
  console.clear()
  console.log(`\nServer is running at http://localhost:${serverConfig.port}\n`)
})
