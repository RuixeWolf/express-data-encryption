import { networkInterfaces } from 'os'

/**
 * Get local IP address
 * @param {'IPv4' | 'IPv6'} [family = 'IPv4'] - IP family
 * @returns {string | null} Local IP address
 */
export function getLocalIP (family?: 'IPv4' | 'IPv6'): string | null {
  family = family || 'IPv4'
  const interfaces = networkInterfaces()
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName]
    if (!interfaceInfo) return null
    for (const infoItem of interfaceInfo) {
      if (infoItem.family === family && !infoItem.internal) {
        return infoItem.address
      }
    }
  }
  return null
}
