/**
 * Middleware view
 */

import { JsonRes } from '@interfaces/resBody'

/**
 * Get verify session response data
 * @param {number} [statusCode = 10000] - Verify session status code
 * + 10001: 请求头没有 Authorization
 * + 10002: Token 无效
 * + 10003: Token 过期
 * @returns {JsonRes} Verify session response data
 */
export function verifySessionRes (statusCode: number = 10000): JsonRes {
  const resData: JsonRes = {
    message: '',
    success: false,
    statusCode
  }

  switch (statusCode) {
    case 10001:
      // 请求头没有 Authorization
      resData.message = 'Request header without Authorization'
      return resData

    case 10002:
      // Token 无效
      resData.message = 'Token is invalid'
      return resData

    case 10003:
      // Token 过期
      resData.message = 'Token is expired'
      return resData

    default:
      resData.message = 'Access denied'
      resData.statusCode = 10000
      return resData
  }
}
