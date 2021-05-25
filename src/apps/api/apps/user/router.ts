/**
 * App router
 */

import { Router, RequestHandler } from 'express'
import * as controller from './controller'
import { verifySession } from '@/privateMiddlewares/verifySession'

const router: Router = Router()

/**
 * $route POST /api/user/register
 * @access public
 */
router.post('/register', controller.register())

/**
 * $route POST /api/user/login
 * @access public
 */
router.post('/login', controller.login())

/**
 * $route GET /api/user/logout
 * @access private
 */
 router.get(
  '/logout',
  // 先调用验证会话信息中间件
  verifySession() as RequestHandler,
  controller.logout() as RequestHandler
)

/**
 * $route GET /api/user/info
 * @access private
 */
router.get(
  '/info',
  verifySession() as RequestHandler,
  controller.getInfo() as RequestHandler
)

/**
 * $route POST /api/user/info
 * @access private
 */
 router.post(
  '/info',
  verifySession() as RequestHandler,
  controller.editInfo() as RequestHandler
)

export default router
