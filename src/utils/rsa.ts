/**
 * RSA encrypt util
 */

import fs from 'fs'
import NodeRSA from 'node-rsa'
import { pubKeyPath, privKeyPath } from '@configs/rsaKeys'
import { printLog } from '@utils/printLog'

// Set RSA key paths
const publicKeyPath: string = pubKeyPath
const privateKeyPath: string = privKeyPath

/** RSA Timeout allowed for encryption and decryption, in milliseconds */
// Timeout allowed within 1 minute
const RSA_TIMEOUT = 60 * 1000

/**
 * RSA encrypt
 * @param {string} content - String to be encrypted
 * @returns {string} Encrypt result
 */
export function rsaEncrypt (content: string): string {
  try {
    const publicKeyContent: string = fs.readFileSync(publicKeyPath).toString('utf8')
    const nodeRsa = new NodeRSA(publicKeyContent)
    nodeRsa.setOptions({ encryptionScheme: 'pkcs1' })
    const encryptRes: string = nodeRsa.encrypt(content, 'base64')
    return encryptRes
  } catch (error) {
    const err: Error = error as Error
    printLog(`${err.name}:` || 'Error:', err.message, 3)
    return ''
  }
}

/**
 * 包含时间戳的 RSA 加密方法
 * @description 将数据与时间戳一起加密，防止中间人攻击时保存密文伪造请求。
 * 默认的加密原文格式：[数据]@#@#@[时间戳]
 * @param {string} originalData - 要加密的数据
 * @param {string} [delimiter = '@#@#@'] - 数据与时间戳的分隔符
 * @returns {string} 加密结果
 */
export function rsaEncryptWithTimestamp (
  originalData: string,
  delimiter: string = '@#@#@'
): string {
  const timestamp = Date.now().toString()
  return rsaEncrypt(originalData + delimiter + timestamp)
}

/**
 * RSA decrypt
 * @param {string} content - String to be decrypted
 * @returns {string} Decrypt result
 */
export function rsaDecrypt (content: string): string {
  try {
    const privateKeyContent: string = fs.readFileSync(privateKeyPath).toString('utf8')
    const nodeRsa = new NodeRSA(privateKeyContent)
    nodeRsa.setOptions({ encryptionScheme: 'pkcs1' })
    const decryptRes: string = nodeRsa.decrypt(content, 'utf8')
    return decryptRes
  } catch (error) {
    const err: Error = error as Error
    printLog(`${err.name}:` || 'Error:', err.message, 3)
    return ''
  }
}

/**
 * RSA 解密与验证
 * @description 验证原文中的时间戳，防止中间人攻击时保存密文伪造请求。
 * 默认的加密原文格式：[数据]@#@#@[时间戳]
 * @param {string} cipherText - 包含时间戳信息的密文
 * @param {string} [delimiter = '@#@#@'] - 数据与时间戳的分隔符
 * @returns {string | false} 解密结果
 */
export function rsaDecryptWithTimestamp (
  cipherText: string,
  delimiter: string = '@#@#@'
): string | false {
  // RSA 解密
  let decryptedText: string
  try {
    decryptedText = rsaDecrypt(cipherText)
  } catch (error) {
    if (error instanceof Error) {
      printLog(`${error.name}:` || 'Error:', error.message, 3)
    }
    return false
  }

  // 解析原数据与时间戳
  const [originalData, timestampStr] = decryptedText.split(delimiter)
  const timestamp = Number.parseInt(timestampStr)

  // 验证时间戳
  if (!timestamp || Date.now() - timestamp > RSA_TIMEOUT) return false

  // 验证通过
  return originalData
}

/**
 * Get public key
 * @returns {string} Public key content
 */
export function getPublicKey (): string {
  try {
    const publicKeyContent: string = fs.readFileSync(publicKeyPath).toString('utf8')
    return publicKeyContent
  } catch (error) {
    const err: Error = error as Error
    printLog(`${err.name}:` || 'Error:', err.message, 3)
    return ''
  }
}

/**
 * Get private key
 * @returns {string} Private key content
 */
export function getPrivateKey (): string {
  try {
    const privateKeyContent: string = fs.readFileSync(privateKeyPath).toString('utf8')
    return privateKeyContent
  } catch (error) {
    const err: Error = error as Error
    printLog(`${err.name}:` || 'Error:', err.message, 3)
    return ''
  }
}
