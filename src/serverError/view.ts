/**
 * Server error middleware view
 */

/**
 * Get default internal server error response message
 * @param {string} [language = 'en'] - User language preference
 * @returns {string} Internal server error response message
 */
export function getErrMsg (language?: string): string {
  // Set language
  language = language || 'en'

  // Init res data
  let errMsg: string = '500 Internal Server Error'

  /** Handle internationalization */

  // en
  if (/^en/.test(language)) {
    errMsg = '500 Internal Server Error'
    return errMsg
  }

  // zh
  if (/^zh/.test(language)) {
    errMsg = '500 服务器内部错误'
    return errMsg
  }

  return errMsg
}
