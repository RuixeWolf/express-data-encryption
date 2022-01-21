/**
 * Frontend app history router fallback middleware
 */

import express, { Express } from 'express'
import history from 'connect-history-api-fallback'

const app: Express = express()

// Register history router fallback
app.use(history({
  index: '/index.html',
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
}))

export default app
