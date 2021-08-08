/**
 * App routers
 */

import { Router, RequestHandler } from 'express'
import * as controllers from './controllers'
import { verifySession } from '@/privateMiddlewares/verifySession'

const router: Router = Router()

/**
 * $route POST /api/user/register
 * @access public
 */
router.post('/register', controllers.register())

/**
 * $route POST /api/user/login
 * @access public
 */
router.post('/login', controllers.login())

/**
 * $route GET /api/user/logout
 * @access private
 */
router.get(
  '/logout',
  // 先调用验证会话信息中间件
  verifySession() as RequestHandler,
  controllers.logout() as RequestHandler
)

/**
 * $route GET /api/user/info
 * @access private
 */
router.get(
  '/info',
  verifySession() as RequestHandler,
  controllers.getInfo() as RequestHandler
)

/**
 * $route POST /api/user/info
 * @access private
 */
router.post(
  '/info',
  verifySession() as RequestHandler,
  controllers.editInfo() as RequestHandler
)

/**
 * $route POST /api/user/modifypassword
 * @access private
 */
router.post(
  '/modifypassword',
  verifySession() as RequestHandler,
  controllers.modifyPassword() as RequestHandler
)

/**
 * $route POST /api/user/cancellation
 * @description User account cancellation
 * @access private
 */
router.post(
  '/cancellation',
  verifySession() as RequestHandler,
  controllers.accountCancellation() as RequestHandler
)

export default router
