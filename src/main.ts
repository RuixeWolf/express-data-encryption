/**
 * Main app entrance
 */

import express from 'express'

// Http server port
const serverPort: number = 8000

// Create Express app
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!<br>From Express with Typescript.')
})

// Start http server
app.listen(serverPort, () => {
  console.clear()
  console.log(`Server is running at http://localhost:${serverPort}\n`)
})
