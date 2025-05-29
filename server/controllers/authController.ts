/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'
import type { UserEntity } from '_/types/users'

import AuthError from '_/helpers/errors/AuthError'

import authService from '~/services/authService'
import userService from '~/services/userService'

const DEV = import.meta.env.DEV
const isCypressTest = !!import.meta.env.CYPRESS || !!process.env.CYPRESS

const login = async (req: Request, res: Response, next: NextFunction) => {
  const maybeUser: UserEntity | { email: string; password: string } = req.body

  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(
      maybeUser,
      req.path === '/register',
    )

    res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: !DEV && !isCypressTest,
        sameSite: DEV || isCypressTest ? 'lax' : 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user, accessToken })

    next()
  } catch (e: any) {
    console.error('[login]', e.message)

    next(e)
  }
}

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.refreshToken

  try {
    if (!token) throw new AuthError('There is no token!')

    const payload = authService.verifyRefreshToken(token)

    const user = await userService.fetchUserById(payload.id)
    if (!user) throw new AuthError('Access denied: token does not match any user', 403)

    const accessToken = authService.generateAccessToken(user)

    res.status(200).json({ user, accessToken })

    next()
  } catch (e: any) {
    console.error('[refresh]', e.message)

    next(e)
  }
}

export default {
  login,
  refresh,
}
