import type { ID, Maybe } from '~/../types'
import type { IUser } from '~/../types/users'

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

  it(`GET should return a list of users`, async (ctx) => {
    const response = await ctx.request.get(`${API}${route}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toBeDefined()
  })

  it('POST should return a new user', async (ctx) => {
    Object.assign(newUser, ctx.fixtures.generateUser())

    const response = await ctx.request.post(`${API}${route}`).send(newUser)

    expect(response.statusCode).toBe(201)
    expect(response.body.user).toBeDefined()

    expect(response.body.user.fullName).toBe(newUser.fullName)
    expect(response.body.user.email).toBe(newUser.email)
    expect(response.body.user.role).toBe(newUser.role)

    id = response.body.user.id
  })

  it(`GET /:id should return user by id`, async (ctx) => {
    const response = await ctx.request.get(`${API}${route}/${id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.user).toBeDefined()

    expect(response.body.user.fullName).toBe(newUser.fullName)
    expect(response.body.user.email).toBe(newUser.email)
    expect(response.body.user.role).toBe(newUser.role)
  })

  it('PUT /:id should return updated user', async (ctx) => {
    const user: Partial<IUser> = { fullName: ctx.fixtures.generateUser().fullName }

    const response = await ctx.request.put(`${API}${route}/${id}`).send(user)

    expect(response.statusCode).toBe(200)
    expect(response.body.user).toBeDefined()

    expect(response.body.user.fullName).toBe(user.fullName)
  })

  it(`DELETE /:id should delete user`, async (ctx) => {
    const res = await ctx.request.delete(`${API}${route}/${id}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.user.id).toBe(id)
  })

  it.skip('DELETE should return deletedCount which is equal to users.length', async (ctx) => {
    let response = await ctx.request.post(`${API}${route}`).send(newUser)
    expect(response.body.user).toBeDefined()

    response = await ctx.request.get(`${API}${route}`)
    expect(response.body.users).toBeDefined()

    const length = response.body.users.length

    response = await ctx.request.delete(`${API}${route}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.deletedCount).toBe(length)
  })
})
