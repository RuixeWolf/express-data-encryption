/**
 * MongoDB config
 */

// Environment variable name of the MongoDB URL
const envName: string = 'EXPRESS_MONGODB_URL'

// Get MongoDB connection string
// MongoDB URL format: mongodb://[user]:[password]@[host]:[port]/[dbName]?authSource=[dbName]
export const mongodbUrl: string = process.env[envName] as string
export default mongodbUrl
