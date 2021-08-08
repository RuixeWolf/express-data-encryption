/**
 * Main router list
 */

import { Router } from 'express'

// Import app's router
import apiAppRouter from '@/apps/api/routers'
import notFoundAppRouter from '@/apps/notFound/routers'

const router: Router = Router()

// Route request to app's router
router.use('/api', apiAppRouter)

// Register 404 not found
router.use('*', notFoundAppRouter)

export default router
