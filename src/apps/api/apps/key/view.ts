/**
 * App view
 */

import { getPublicKey } from '@utils/rsaEncrypt'
import { GetKeyRes } from './interface'

/**
 * Get RSA public key
 * @returns {GetKeyRes} RSA public key
 */
export function getRsaPubKey(): GetKeyRes {
  // Init default response data
  let getKeyRes: GetKeyRes = {
    msg: 'fail',
    success: false,
    statusCode: 0,
    data: {
      key: ''
    }
  }

  // Get RSA public key
  const rsaPubKey: string = getPublicKey()

  if (rsaPubKey) {
    getKeyRes.msg = 'success'
    getKeyRes.success = true
    getKeyRes.statusCode = 1
    getKeyRes.data.key = rsaPubKey
    return getKeyRes
  }
  
  return getKeyRes
}
