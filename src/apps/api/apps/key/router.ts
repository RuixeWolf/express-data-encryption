/**
 * App router
 */

import { Router } from 'express'
import * as controller from './controller'

const router: Router = Router()

/**
* $route GET /api/key/getkey
* @description Get RSA public key
* @access public
*/
router.get('/getkey', controller.getKey())

export default router
