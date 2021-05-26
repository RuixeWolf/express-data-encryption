/**
 * RSA encrypt util
 */

import path from 'path'
import fs from 'fs'
import NodeRSA from 'node-rsa'

// Set RSA key paths
const publicKeyPath: string = path.join(__dirname, './keys/rsa_1024_pub.pem')
const privateKeyPath: string = path.join(__dirname, './keys/rsa_1024_priv.pem')

/**
 * RSA encrypt
 * @param {string} content - String to be encrypted
 * @returns {string} Encrypt result
 */
export function rsaEncrypt(content: string): string {
  try {
    const publicKeyContent: string = fs.readFileSync(publicKeyPath).toString('utf8')
    const nodeRsa = new NodeRSA(publicKeyContent)
    nodeRsa.setOptions({ encryptionScheme: 'pkcs1'})
    const encryptRes: string = nodeRsa.encrypt(content, 'base64')
    return encryptRes
  } catch (error) {
    return ''
  }
}

/**
 * RSA decrypt
 * @param {string} content - String to be decrypted
 * @returns {string} Decrypt result
 */
export function rsaDecrypt(content: string): string {
  try {
    const privateKeyContent: string = fs.readFileSync(privateKeyPath).toString('utf8')
    const nodeRsa = new NodeRSA(privateKeyContent)
    nodeRsa.setOptions({ encryptionScheme: 'pkcs1'})
    const decryptRes: string = nodeRsa.decrypt(content, 'utf8')
    return decryptRes
  } catch (error) {
    return ''
  }
}

/**
 * Get public key
 * @returns {string} Public key content
 */
export function getPublicKey(): string {
  try {
    const publicKeyContent: string = fs.readFileSync(publicKeyPath).toString('utf8')
    return publicKeyContent
  } catch (error) {
    return ''
  }
}

/**
 * Get private key
 * @returns {string} Private key content
 */
export function getPrivateKey(): string {
  try {
    const privateKeyContent: string = fs.readFileSync(privateKeyPath).toString('utf8')
    return privateKeyContent
  } catch (error) {
    return ''
  }
}
