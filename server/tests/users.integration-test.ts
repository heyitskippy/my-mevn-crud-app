import type { ID, Maybe } from '_/types'
import type { IUser } from '_/types/users'

import { describe, expect, it } from 'vitest'

const API = import.meta.env.VITE_API
const route = '/users'

describe(`${API}${route}`, () => {
  const newUser = {
    fullName: null,
    email: null,
    role: null,
  }
  let id: Maybe<ID> = null

  it(`GET / should return a list of users`, async (ctx) => {
    const response = await ctx.request
      ?.get(`${API}${route}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])

    expect(response?.statusCode).toBe(200)
    expect(response?.body.users).toBeDefined()
  })

  it('POST / with an object should return a new user', async (ctx) => {
    Object.assign(newUser, ctx.fixtures.generateUser())

    const response = await ctx.request
      ?.post(`${API}${route}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])
      .send(newUser)

    expect(response?.statusCode).toBe(201)
    expect(response?.body.user).toBeDefined()

    expect(response?.body.user.fullName).toBe(newUser.fullName)
    expect(response?.body.user.email).toBe(newUser.email)
    expect(response?.body.user.role).toBe(newUser.role)

    id = response?.body.user.id
  })

  it(`GET /:id should return user by id`, async (ctx) => {
    const response = await ctx.request
      ?.get(`${API}${route}/${id}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])

    expect(response?.statusCode).toBe(200)
    expect(response?.body.user).toBeDefined()

    expect(response?.body.user.fullName).toBe(newUser.fullName)
    expect(response?.body.user.email).toBe(newUser.email)
    expect(response?.body.user.role).toBe(newUser.role)
  })

  it('PUT /:id should return updated user', async (ctx) => {
    const user: Partial<IUser> = { fullName: ctx.fixtures.generateUser().fullName }

    const response = await ctx.request
      ?.put(`${API}${route}/${id}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])
      .send(user)

    expect(response?.statusCode).toBe(200)
    expect(response?.body.user).toBeDefined()

    expect(response?.body.user.fullName).toBe(user.fullName)
  })

  it(`DELETE /:id should delete user`, async (ctx) => {
    const response = await ctx.request
      ?.delete(`${API}${route}/${id}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])

    expect(response?.statusCode).toBe(200)
    expect(response?.body.user.id).toBe(id)
  })

  it.skip('POST / with an array should return a list of new users', async (ctx) => {
    const users = Array.from({ length: 20 }).map(() => ctx.fixtures.generateUser())
    const response = await ctx.request
      ?.post(`${API}${route}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])
      .send(users)

    expect(response?.statusCode).toBe(201)
    expect(response?.body.users).toBeDefined()

    expect(response?.body.users).toEqual(users.map((user) => expect.objectContaining(user)))
  })

  it.skip('DELETE / should return deletedCount which is equal to users.length', async (ctx) => {
    let response = await ctx.request
      ?.post(`${API}${route}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])
      .send(newUser)

    expect(response?.body.user).toBeDefined()

    response = await ctx.request
      ?.get(`${API}${route}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])

    expect(response?.body.users).toBeDefined()

    const length = response?.body.users.length

    response = await ctx.request
      ?.delete(`${API}${route}`)
      .set('Authorization', `Bearer ${ctx.accessToken}`)
      .set('Cookie', [`refreshToken=${ctx.refreshToken}`])

    expect(response?.statusCode).toBe(200)
    expect(response?.body.deletedCount).toBe(length)
  })
})
