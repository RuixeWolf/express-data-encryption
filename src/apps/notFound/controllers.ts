/**
 * App controllers
 */

import { RequestHandler, Request, Response } from 'express'
import { printLog } from '@utils/printLog'

// Do not handle the list of paths to the log
const LOG_BLOCK_LIST = [
  '/404',
  '/notFound',
  '/not_found',
  '/not-found'
]

/**
 * Not found controller
 * @description Handle HTTP 404
 * @returns {RequestHandler} Express request handler
 */
export function notFound (): RequestHandler {
  return (req: Request, res: Response) => {
    // Print HTTP 404 log
    const method: string = req.method
    const originalUrl: string = req.originalUrl
    if (!LOG_BLOCK_LIST.includes(originalUrl)) {
      printLog(`[${req.ip}]`, `Cannot ${method} ${originalUrl}`, 2)
    }

    // Response HTTP 404
    res.status(404)
    res.send('404 Not Found')
  }
}
