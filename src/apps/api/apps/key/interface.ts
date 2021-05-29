/**
 * App interface
 */

import { JsonRes } from '@interfaces/resBody'

/**
 * Get key response
 */
export interface GetPubKeyRes extends JsonRes {
  data: {
    pubKey: string
  }
}
