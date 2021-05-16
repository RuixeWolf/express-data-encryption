/**
 * Main router list
 */

import { Router } from 'express'

// Import app's router
import apiAppRouter from './apps/api/router'

const router: Router = Router()

// Route request to app's router
router.use('/api', apiAppRouter)

export default router
