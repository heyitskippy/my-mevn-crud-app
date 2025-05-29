import type { IUser } from '_/types/users'
import { describe, expect, it } from 'vitest'

const API = import.meta.env.VITE_API
const route = '/auth'

describe(`${API}${route}`, () => {
  let testUser: IUser
  let refreshToken: string | undefined

  it('POST /register should create a new user and return tokens', async (ctx) => {
    testUser = ctx.fixtures.generateUser()
    const response = await ctx.request?.post(`${API}${route}/register`).send(testUser)

    expect(response?.statusCode).toBe(200)
    expect(response?.body.user).toBeDefined()
    expect(response?.body.accessToken).toBeDefined()
    expect(response?.headers['set-cookie']).toBeDefined()

    const setCookie = Array.isArray(response?.headers['set-cookie'])
      ? response?.headers['set-cookie']
      : [response?.headers['set-cookie']]

    const cookie = setCookie.find((c: string) => c.startsWith('refreshToken='))

    refreshToken = cookie?.split(';')[0]?.split('=')[1]
    expect(refreshToken).toBeDefined()
  })

  it('POST /login should authenticate and return tokens', async (ctx) => {
    const response = await ctx.request
      ?.post(`${API}${route}/login`)
      .send({ email: testUser.email, password: testUser.password })

    expect(response?.statusCode).toBe(200)
    expect(response?.body.user).toBeDefined()
    expect(response?.body.accessToken).toBeDefined()
    expect(response?.headers['set-cookie']).toBeDefined()

    const setCookie = Array.isArray(response?.headers['set-cookie'])
      ? response?.headers['set-cookie']
      : [response?.headers['set-cookie']]

    const cookie = setCookie.find((c: string) => c.startsWith('refreshToken='))

    refreshToken = cookie?.split(';')[0]?.split('=')[1]
    expect(refreshToken).toBeDefined()
  })

  it('GET /refresh should return a new access token', async (ctx) => {
    const response = await ctx.request
      ?.get(`${API}${route}/refresh`)
      .set('Cookie', [`refreshToken=${refreshToken}`])

    expect(response?.statusCode).toBe(200)
    expect(response?.body.user).toBeDefined()
    expect(response?.body.accessToken).toBeDefined()
  })

  it('POST /login with wrong password should fail', async (ctx) => {
    const response = await ctx.request
      ?.post(`${API}${route}/login`)
      .send({ email: testUser.email, password: 'wrongpassword' })

    expect(response?.statusCode).toBeGreaterThanOrEqual(400)
    expect(response?.body.accessToken).toBeUndefined()
  })

  it('GET /refresh with invalid token should fail', async (ctx) => {
    const response = await ctx.request
      ?.get(`${API}${route}/refresh`)
      .set('Cookie', [`refreshToken=invalidtoken`])

    expect(response?.statusCode).toBeGreaterThanOrEqual(400)
    expect(response?.body.accessToken).toBeUndefined()
  })
})
