/**
 * App controller
 */

import { RequestHandler, Request, Response } from 'express'

/**
 * Not found controller
 * @description Handle HTTP 404
 * @returns {RequestHandler} Express request handler
 */
export function notFound(): RequestHandler {
  return (req: Request, res: Response) => {
    res.status(404)
    res.send('404 Not Found')
  }
}
