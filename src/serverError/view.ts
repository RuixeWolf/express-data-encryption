/**
 * Server error middleware view
 */

import { ResBody } from '../interfaces/resBody'

/**
 * Get default internal server error response data
 * @param {string} [language='en'] - User language preference
 * @returns {ResBody} Internal server error response data
 */
export function getErrRes(language?: string): ResBody {
  // Set language
  language = language || 'en'

  // Init res data
  let errRes: ResBody = {
    msg: 'Internal server error',
    success: false,
    statusCode: 500
  }

  /** Handle internationalization */

  // en
  if (/^en/.test(language)) {
    errRes.msg = 'Internal server error'
    return errRes
  }

  // zh
  if (/^zh/.test(language)) {
    errRes.msg = '服务器内部错误'
    return errRes
  }

  return errRes
}
