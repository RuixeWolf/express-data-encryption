/**
 * App controller
 */

import { RequestHandler, Request, Response, NextFunction } from 'express'
import * as view from './view'
import { GetPubKeyRes } from './interface'
import { getPublicKey } from '@utils/rsaEncrypt'

/**
 * Get RSA public key API controller
 * @returns {RequestHandler} Express request handler
 */
export function getPubKey (): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get RSA public key
    const rsaPubKey: string = getPublicKey()
    if (!rsaPubKey) {
      next(new Error('Cannot Get RSA Public Key'))
      return
    }

    // Get response data
    const resData: GetPubKeyRes = view.getRsaPubKeyRes(rsaPubKey)
    res.json(resData)
  }
}
