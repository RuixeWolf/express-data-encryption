/**
 * App controllers
 */

import { RequestHandler, Request, Response, NextFunction } from 'express'
import * as view from './views'
import { GetPubKeyResV1 } from './interfaces'
import { getPublicKey } from '@/utils/rsa'
import { getPubKeyStatusCodeMap } from './views'

/**
 * Get RSA public key API handler version 1
 * @version v1
 * @returns {GetPubKeyResV1} Get RSA public key response version 1
 */
function getPublicKeyV1 (req: Request, res: Response, next: NextFunction) {
  const rsaPubKey: string = getPublicKey()

  // Return response data
  if (rsaPubKey) {
    const resData: GetPubKeyResV1 = view.getRsaPubKeyResV1(
      getPubKeyStatusCodeMap.SUCCESS,
      rsaPubKey
    )
    res.json(resData)
    return
  }

  // Cannot get RSA public key
  const defaultResData: GetPubKeyResV1 = view.getRsaPubKeyResV1(
    getPubKeyStatusCodeMap.CANNOT_READ_PUBKEY_FILE
  )
  res.json(defaultResData)
}

/**
 * Get RSA public key API main controller
 * @returns {RequestHandler} Express request handler
 */
export function getPubKey (): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    // API version controller
    switch (req.params.apiVersion) {
      // API version 1
      case 'v1': {
        getPublicKeyV1(req, res, next)
        break
      }

      // API version not found
      default: {
        res.redirect('/404')
        break
      }
    }
  }
}
