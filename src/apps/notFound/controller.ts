/**
 * App controller
 */

import { RequestHandler, Request, Response } from 'express'
import { printLog } from '@utils/printLog'

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
    printLog(`[${req.ip}]`, `Cannot ${method} ${originalUrl}`, 2)

    // Response HTTP 404
    res.status(404)
    res.send('404 Not Found')
  }
}
