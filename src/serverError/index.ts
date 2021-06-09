/**
 * Handle internal server error
 */

import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import * as view from './view'
import { printLog } from '@utils/printLog'

/**
 * Default internal server error handler
 * @returns {ErrorRequestHandler}
 */
export function serverErrorHandler (): ErrorRequestHandler {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      // Print error log
      printLog(`${err.name}:` || 'Error:', err.message, 3)

      // Response HTTP 500
      const userLanguages: string[] = req.acceptsLanguages()
      const errMsg: string = view.getErrMsg(userLanguages[0])
      res.status(500)
      res.send(errMsg)
    }
    next(err)
  }
}
