/**
 * App routers
 */

import { Router } from 'express'

// Import app's router
import userAppRouter from './apps/user/routers'
import rsaKeyAppRouter from './apps/key/routers'

const router: Router = Router()

// Route request to app's router
router.use('/user', userAppRouter)
router.use('/key', rsaKeyAppRouter)

export default router
