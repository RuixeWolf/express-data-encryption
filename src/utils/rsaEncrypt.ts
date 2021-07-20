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
