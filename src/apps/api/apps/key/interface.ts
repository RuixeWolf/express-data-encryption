/**
 * App interface
 */

import { ResBody } from '@interfaces/resBody'

/**
 * Get key response
 */
export interface GetKeyRes extends ResBody {
  data: {
    key: string
  }
}
