/**
 * App router
 */

import { Router } from 'express'
import * as controller from './controller'

const router: Router = Router()

/**
 * $route POST /api/user/register
 * @access public
 */
router.post('/register', controller.register())

export default router
