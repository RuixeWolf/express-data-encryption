/**
 * RSA key configs
 */

import path from 'path'

/**
 * Public key path
 */
export const pubKeyPath: string = process.env.NODE_ENV === 'production'
  // 生产环境的路径（生产环境只有一个 bundle 文件：dist/src/main.js）
  ? path.join(__dirname, '../keys/rsa_2048_pub.pem')
  // 开发环境的路径
  : path.join(__dirname, '../../keys/rsa_2048_pub.pem')

/**
 * Private key path
 */
export const privKeyPath: string = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../keys/rsa_2048_priv.pem')
  : path.join(__dirname, '../../keys/rsa_2048_priv.pem')
