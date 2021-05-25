/**
 * App router
 */

import { Router } from 'express'
import * as controller from './controller'

const router: Router = Router()

/**
* $route GET /api/key/pubkey
* @description Get RSA public key
* @access public
*/
router.get('/pubkey', controller.getPubKey())

export default router
