/**
 * RSA key configs
 */

import path from 'path'

/**
 * Public key path
 */
export const pubKeyPath: string = path.join(__dirname, '../../keys/rsa_1024_pub.pem')

/**
 * Private key path
 */
export const privKeyPath: string = path.join(__dirname, '../../keys/rsa_1024_priv.pem')
