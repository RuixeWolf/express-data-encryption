/**
 * App view
 */

import { GetPubKeyRes } from './interface'

/**
 * Get RSA public key response data
 * @param {string} rsaPubKey - RSA public key
 * @returns {GetKeyRes} RSA public key response data
 */
export function getRsaPubKeyRes (rsaPubKey: string): GetPubKeyRes {
  // Init default response data
  let getPubKeyRes: GetPubKeyRes = {
    message: 'fail',
    success: false,
    statusCode: 0,
    data: {
      pubKey: ''
    }
  }

  if (rsaPubKey) {
    getPubKeyRes.message = 'success'
    getPubKeyRes.success = true
    getPubKeyRes.statusCode = 1
    getPubKeyRes.data.pubKey = rsaPubKey
    return getPubKeyRes
  }
  
  return getPubKeyRes
}
