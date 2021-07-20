/**
 * App router
 */

import { Router } from 'express'
import * as controller from './controller'

const router: Router = Router()

/**
* $route ALL *
* @access public
*/
router.all('*', controller.notFound())

export default router
