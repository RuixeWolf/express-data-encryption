/**
 * App interface
 */

import { ResBody } from '@interfaces/resBody'

/**
 * Get key response
 */
export interface GetPubKeyRes extends ResBody {
  data: {
    pubKey: string
  }
}
