/**
 * Session interface
 */

import { Request, Response, NextFunction } from 'express'

/**
 * Session request content
 */
export interface SessionRequest extends Request {
  session: {
    sessionId: string
    userId: string
  }
}

/**
 * Session request handler
 */
export interface SessionRequestHandler {
  (
    req: SessionRequest,
    res: Response,
    next: NextFunction
  ): void
}

/**
 * Session information MongoDB document
 */
export interface SessionInfoDoc {
  sessionId: string
  authToken: string
  userId: string
  createdTime: string
  expTime: string
}
