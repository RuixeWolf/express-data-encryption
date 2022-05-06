/**
 * App views
 */

import { GetPubKeyResV1 } from './interfaces'

// Exprot map of status codes
export const getPubKeyStatusCodeMap = {
  SUCCESS: 1,
  CANNOT_READ_PUBKEY_FILE: 2
}

/**
 * Get RSA public key response data
 * @version v1
 * @param {string} rsaPubKey - RSA public key
 * @returns {GetKeyRes} RSA public key response data
 */
export function getRsaPubKeyResV1 (
  statusCode: number = 0,
  rsaPubKey?: string
): GetPubKeyResV1 {
  // Init default response data
  const getPubKeyRes: GetPubKeyResV1 = {
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

  // Can not get pubkey file
  if (statusCode === 2) getPubKeyRes.message = 'Cannot Get RSA Public Key'

  return getPubKeyRes
}
