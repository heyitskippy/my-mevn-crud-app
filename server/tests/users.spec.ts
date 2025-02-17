import type { UserEntity } from '../types/users'
import { Role } from '../types/users'

import supertest from 'supertest'
import { describe, expect, it } from 'vitest'

import { server as app } from '../'

const request = supertest(app)

describe('GET /api/users', () => {
  it('should return a list of users', async () => {
    const res = await request.get('/api/users')

    expect(res.statusCode).toEqual(200)
    expect(res.body.users).toBeDefined()
  })
})

describe('POST /api/users', () => {
  it('should return a new user', async () => {
    const fullName = 'Nick O'
    const email = 'test@example.com'

    const res = await request.post('/api/users').send({
      fullName,
      email,
      role: Role.User,
    } satisfies UserEntity)

    expect(res.statusCode).toEqual(201)
    expect(res.body.user).toBeDefined()

    expect(res.body.user.fullName).toBe(fullName)
    expect(res.body.user.email).toBe(email)
    expect(res.body.user.role).toBe(Role.User)
  })
})
