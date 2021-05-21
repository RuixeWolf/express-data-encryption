/**
 * App router
 */

import { Router } from 'express'

// Import app's router
import userAppRouter from './apps/user/router'
import rsaKeyAppRouter from './apps/key/router'

const router: Router = Router()

// Route request to app's router
router.use('/user', userAppRouter)
router.use('/key', rsaKeyAppRouter)

export default router
