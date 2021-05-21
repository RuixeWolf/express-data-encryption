/**
 * App controller
 */

import { RequestHandler, Request, Response } from 'express'
import * as view from './view'
import { GetKeyRes } from './interface'

/**
 * Get RSA public key API controller
 * @returns {RequestHandler} Express request handler
 */
export function getKey(): RequestHandler {
  return (req: Request, res: Response) => {
    const resData: GetKeyRes = view.getRsaPubKey()
    res.json(resData)
  }
}
