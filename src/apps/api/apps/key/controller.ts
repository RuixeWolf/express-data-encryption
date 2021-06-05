/**
 * App controller
 */

import { RequestHandler, Request, Response } from 'express'
import * as view from './view'
import { GetPubKeyRes } from './interface'
import { getPublicKey } from '@utils/rsaEncrypt'

/**
 * Get RSA public key API controller
 * @returns {RequestHandler} Express request handler
 */
export function getPubKey (): RequestHandler {
  return (req: Request, res: Response) => {
    // Get RSA public key
    const rsaPubKey: string = getPublicKey()
    // Get response data
    const resData: GetPubKeyRes = view.getRsaPubKeyRes(rsaPubKey)
    res.json(resData)
  }
}
