/**
 * Main server app entrance
 */

import express, { Express } from 'express'
import * as serverConfig from './configs/server'
import middlewares from './middlewares'
import router from './router'
import { serverErrorHandler } from './serverError'

// Create Express app
const app: Express = express()

// Register middlewares
app.use(middlewares)

// Register main router
app.use(router)

app.get('/', (req, res) => {
  res.send('Hello World!<br>From Express with Typescript.')
})

// Register internal server error
app.use(serverErrorHandler())

// Start http server
app.listen(serverConfig.port, () => {
  console.clear()
  console.log(`\nServer is running at http://localhost:${serverConfig.port}\n`)
})
