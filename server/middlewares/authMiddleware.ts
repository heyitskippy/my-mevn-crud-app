/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'

import AuthError from '_/helpers/errors/AuthError'

import authService from '~/services/authService'

const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AuthError('Please log in first'))
  }

  const token = authHeader.split(' ')[1]

  try {
    req.user = authService.verifyAccessToken(token)

    next()
  } catch (e: any) {
    next(new AuthError(e.message ?? 'Authorization failed', 403))
  }
}

export default authenticate
