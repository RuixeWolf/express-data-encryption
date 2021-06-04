import { RequestHandler, Request, Response, NextFunction } from 'express'
import { printLog } from '@utils/printLog'

/**
 * Print request information
 * @returns {RequestHandler} Express request handler
 */
export function printReqInfo (): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const method: string = req.method
    const originalUrl: string = req.originalUrl
    printLog(method, originalUrl, 0)
    next()
  }
}
