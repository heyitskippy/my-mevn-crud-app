import type { ID, Maybe } from '_/types'
import type { UserEntity } from '_/types/users'

import jwt from 'jsonwebtoken'

import AuthError from '_/helpers/errors/AuthError'

import userService from '~/services/userService'

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET
const REFRESH_SECRET = import.meta.env.VITE_REFRESH_SECRET

const ACCESS_TOKEN_EXPIRE = '15m'
const REFRESH_TOKEN_EXPIRE = '30d'

const loginUser = async (
  maybeUser: UserEntity | { email: string; password: string },
  isRegister: boolean,
): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> => {
  const message = 'Invalid credentials!'
  let user: Maybe<UserEntity> = null

  if (!isRegister) {
    const { email, password } = maybeUser as { email: string; password: string }

    if (!password) throw new AuthError(message)

    const userDocument = await userService.fetchUserByFields({ email })

    if (!userDocument || !(await userDocument.comparePassword(password))) {
      throw new AuthError(message)
    }

    user = userDocument?.toJSON()
  } else {
    user = maybeUser as UserEntity
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return { user, accessToken, refreshToken }
}

const generateAccessToken = (user: UserEntity) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRE },
  )

const generateRefreshToken = (user: UserEntity) =>
  jwt.sign(
    {
      id: user.id,
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRE },
  )

const verifyAccessToken = (token: string) =>
  jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { id: ID; email: string }

const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload & { id: ID }

export default {
  loginUser,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
