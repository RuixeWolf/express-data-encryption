/**
 * App interfaces
 */

import { JsonRes } from '@interfaces/resBody'

/**
 * Get key response
 */
export interface GetPubKeyResV1 extends JsonRes {
  data: {
    pubKey: string
  }
}
