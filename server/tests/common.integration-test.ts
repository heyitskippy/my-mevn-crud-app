import { describe, expect, it } from 'vitest'

const API = import.meta.env.VITE_API

describe('404', () => {
  it(`GET ${API} should return 404"`, async (ctx) => {
    const response = await ctx.request
      ?.get(API)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])

    expect(response?.statusCode).toBe(404)
  })

  it(`GET /abs should return 404"`, async (ctx) => {
    const response = await ctx.request
      ?.get(API)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])

    expect(response?.statusCode).toBe(404)
  })

  it(`GET /users/ss/ss should return 404"`, async (ctx) => {
    const response = await ctx.request
      ?.get(API)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])

    expect(response?.statusCode).toBe(404)
  })
})
