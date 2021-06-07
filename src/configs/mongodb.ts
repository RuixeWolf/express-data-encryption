/**
 * MongoDB config
 */

const host: string = 'localhost'
const port: number = 27017
const user: string = 'expressApp'
const pwd: string = '123456'
const dbName: string = 'express-data-encryption'
const authSource: string = 'express-data-encryption'

// Generate and export MongoDB connection string
export const mongodbUrl: string = `mongodb://${user}:${pwd}@${host}:${port}/${dbName}?authSource=${authSource}`
export default mongodbUrl
