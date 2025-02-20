import { describe, expect, it } from 'vitest'

const API = import.meta.env.VITE_API

describe(API, () => {
  it(`GET should return text "It's API!"`, async (ctx) => {
    const response = await ctx.request.get(API)

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe("It's API!")
  })
})
