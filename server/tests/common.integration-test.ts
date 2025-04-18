import { describe, expect, it } from 'vitest'

const API = import.meta.env.VITE_API

describe(`${API} 404`, () => {
  it(`GET should return 404"`, async (ctx) => {
    const response = await ctx.request.get(API)

    expect(response.statusCode).toBe(404)
  })
})
