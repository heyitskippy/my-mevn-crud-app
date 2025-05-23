import type { IUser } from '_/types/users'

import { describe, it, expect, vi } from 'vitest'

import bcrypt from 'bcrypt'

import User from '~/models/User'

import userService from '../userService'

describe('userService', () => {
  it('fetchUsers returns mapped users', async (ctx) => {
    const userDoc = new User(ctx.fixtures.generateUser())

    vi.spyOn(User, 'find').mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([userDoc]),
    } as unknown as ReturnType<typeof User.find>)

    const users = await userService.fetchUsers()
    expect(users).toEqual([userDoc.toJSON()])
  })

  it('addUser hashes password and saves user', async (ctx) => {
    const plain = ctx.fixtures.generateUser()

    vi.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed')

    const save = vi.spyOn(User.prototype, 'save').mockResolvedValue(new User(plain))
    const result = await userService.addUser(plain)

    expect(bcrypt.hash).toHaveBeenCalledWith(plain.password, 10)
    expect(save).toHaveBeenCalled()
    expect(result).toHaveProperty('email', plain.email)
  })

  it('addUser handles missing password', async (ctx) => {
    const plain = ctx.fixtures.generateUser()

    const save = vi.spyOn(User.prototype, 'save').mockResolvedValue(new User(plain))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...noPass } = plain

    const result = await userService.addUser(noPass)

    expect(result).toHaveProperty('email', plain.email)
    expect(save).toHaveBeenCalled()
  })

  it('addUserList hashes all passwords and inserts users', async (ctx) => {
    const users: IUser[] = [
      ctx.fixtures.generateUser(),
      ctx.fixtures.generateUser<IUser>({ email: 'b@test.com' }),
    ]

    vi.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed')
    vi.spyOn(User, 'insertMany').mockResolvedValue(users.map((u) => new User(u)))

    const result = await userService.addUserList(users)

    expect(bcrypt.hash).toHaveBeenCalledTimes(2)
    expect(result[0]).toHaveProperty('email', users[0].email)
    expect(result[1]).toHaveProperty('email', users[1].email)
  })

  it('fetchUserById returns user if found', async (ctx) => {
    const userDoc = new User(ctx.fixtures.generateUser())

    vi.spyOn(User, 'findById').mockReturnValue({
      exec: vi.fn().mockResolvedValue(userDoc),
    } as unknown as ReturnType<typeof User.findById>)

    const result = await userService.fetchUserById('1')
    expect(result).toEqual(userDoc.toJSON())
  })

  it('fetchUserById returns undefined if not found', async () => {
    vi.spyOn(User, 'findById').mockReturnValue({
      exec: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof User.findById>)

    const result = await userService.fetchUserById('1')

    expect(result).toBeUndefined()
  })

  it('updateUser returns updated user', async (ctx) => {
    const userDoc = new User(ctx.fixtures.generateUser())

    vi.spyOn(User, 'findByIdAndUpdate').mockReturnValue({
      exec: vi.fn().mockResolvedValue(userDoc),
    } as unknown as ReturnType<typeof User.findByIdAndUpdate>)

    const result = await userService.updateUser('1', { email: 'new@test.com' })

    expect(result).toEqual(userDoc.toJSON())
  })

  it('updateUser returns undefined if not found', async () => {
    vi.spyOn(User, 'findByIdAndUpdate').mockReturnValue({
      exec: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof User.findByIdAndUpdate>)

    const result = await userService.updateUser('1', { email: 'new@test.com' })

    expect(result).toBeUndefined()
  })

  it('deleteUser returns deleted user', async (ctx) => {
    const userDoc = new User(ctx.fixtures.generateUser())

    vi.spyOn(User, 'findByIdAndDelete').mockReturnValue({
      exec: vi.fn().mockResolvedValue(userDoc),
    } as unknown as ReturnType<typeof User.findByIdAndDelete>)

    const result = await userService.deleteUser('1')

    expect(result).toEqual(userDoc.toJSON())
  })

  it('deleteUser returns undefined if not found', async () => {
    vi.spyOn(User, 'findByIdAndDelete').mockReturnValue({
      exec: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof User.findByIdAndDelete>)

    const result = await userService.deleteUser('1')

    expect(result).toBeUndefined()
  })

  it('deleteAllUsers calls deleteMany', async () => {
    const exec = vi.fn().mockResolvedValue({ deletedCount: 2 })

    vi.spyOn(User, 'deleteMany').mockReturnValue({ exec } as unknown as ReturnType<
      typeof User.deleteMany
    >)

    const result = await userService.deleteAllUsers()

    expect(exec).toHaveBeenCalled()
    expect(result).toEqual({ deletedCount: 2 })
  })

  it('fetchUserByFields returns user if found', async (ctx) => {
    const userDoc = new User(ctx.fixtures.generateUser())

    vi.spyOn(User, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue(userDoc),
    } as unknown as ReturnType<typeof User.findOne>)

    const result = await userService.fetchUserByFields({ email: userDoc.email })

    expect(result).toEqual(userDoc)
  })

  it('fetchUserByFields returns undefined if not found', async () => {
    vi.spyOn(User, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof User.findOne>)

    const result = await userService.fetchUserByFields({ email: 'nope@test.com' })

    expect(result).toBeUndefined()
  })
})
