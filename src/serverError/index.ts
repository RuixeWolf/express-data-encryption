/**
 * Handle internal server error
 */

import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import * as view from './view'
import { ResBody } from '@interfaces/resBody'

/**
 * Default internal server error handler
 * @returns {ErrorRequestHandler}
 */
export function serverErrorHandler(): ErrorRequestHandler {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      const userLanguage = req.headers['accept-language']
      const errRes: ResBody = view.getErrRes(userLanguage)
      res.status(500)
      res.json(errRes)
    } else {
      next(err)
    }
  }
}
