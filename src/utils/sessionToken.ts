/**
 * Generate and parse session token
 */

import AES from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'

// Set secret key
const secretKey: string = 'jhvi@u3*7s%ia93gtyhbs^as@17'

/**
 * Generate token from session ID
 * @param {string} sessionId - Client session ID
 * @returns {string} Client authorization token
 */
export function generateToken (sessionId: string): string {
  try {
    const token: string = AES.encrypt(sessionId, secretKey).toString()
    return token
  } catch (error) {
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
    const sessionId: string = AES.decrypt(token, secretKey).toString(encUtf8)
    return sessionId
  } catch (error) {
    return ''
  }
}
