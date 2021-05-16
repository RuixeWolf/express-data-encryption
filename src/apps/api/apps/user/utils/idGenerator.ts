/**
 * Account Generator
 */

/**
 * Generate ID
 * @param {string} [prefix=''] - ID prefix
 * @returns {string} Prefix with 20-bit hex string
 */
export function generateId(prefix?: string): string {
  let id: string = ''
  prefix = prefix || ''
  // Generate 11-bit hex timestamp string
  const currentTime: number = Date.now()
  const currentTimeStr: string = currentTime.toString(16)
  // Generate 9-bit random hex string
  const randomStr: string = Math.random().toString(16).substr(2, 9)
  id = id.concat(prefix, currentTimeStr, randomStr)
  return id
}

/**
 * Generate account number string
 * @param {number} [length=10] - Account number length
 * @returns {string} Account number string
 */
export function generateAccount(length?: number): string {
  let userAccount: string = ''
  length = length || 10
  userAccount = Math.random().toString().substr(2, length)
  return userAccount
}
