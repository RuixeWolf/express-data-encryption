/**
 * Generate and parse session token
 */

import AES from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'
import { printLog } from '@utils/printLog'
import { aesSecretKey } from '@configs/secretKey'

/**
 * Generate token from session ID
 * @param {string} sessionId - Client session ID
 * @returns {string} Client authorization token
 */
export function generateToken (sessionId: string): string {
  try {
    const token: string = AES.encrypt(sessionId, aesSecretKey).toString()
    return token
  } catch (error) {
    const err: Error = error as Error
    printLog(`${err.name}:` || 'Error:', err.message, 3)
    return ''
  }
}

/**
 * Parse token to session ID
 * @param {string} token - Client authorization token
 * @returns {string} - Client session ID
 */
export function parseToken (token: string): string {
  try {
    const sessionId: string = AES.decrypt(token, aesSecretKey).toString(encUtf8)
    return sessionId
  } catch (error) {
    const err: Error = error as Error
    printLog(`${err.name}:` || 'Error:', err.message, 3)
    return ''
  }
}
