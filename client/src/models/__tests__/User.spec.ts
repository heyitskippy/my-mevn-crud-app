import type { Entity } from '_/types'
import type { MakeMaybe } from '_/types/utilities'
import type { IUser, NullableUserEntity } from '_/types/users'
import { Role } from '_/types/users'

import { describe, expect, it } from 'vitest'

import User from '../User'

type NullableMockUser = MakeMaybe<IUser & Entity>

describe('User class', () => {
  const model = {
    id: null,

    fullName: null,
    email: null,
    role: null,

    createdAt: null,
    updatedAt: null,
  } satisfies NullableUserEntity

  const darkElf = {
    ...model,

    id: '🌚',

    fullName: "Drizzt Do'Urden",
    email: 'forgotten-realms@email.su',
    role: Role.Admin,
  } satisfies NullableUserEntity

  it('user.isNew() of a new instance should return true and false otherwise', (ctx) => {
    const user = new User(ctx.fixtures.generateUser())
    expect(user).toBeInstanceOf(User)

    expect(user.isNew()).toBe(true)

    user.id = darkElf.id
    expect(user.isNew()).toBe(false)
  })

  it('user.isDirty() of a new instance should return false and true otherwise', (ctx) => {
    const user = new User(ctx.fixtures.generateUser())

    expect(user.isDirty()).toBe(false)

    user.email = darkElf.email
    expect(user.isDirty()).toBe(true)
  })

  it('user.getModel() should return an object with the same fields as in the NullableUserEntity type, with null values', (ctx) => {
    const user = new User(ctx.fixtures.generateUser())

    expect(user.getModel()).toEqual(model)
  })

  it('user.getSnapshot() should return a snapshot containing the same fields as in the param', (ctx) => {
    const mockUser = ctx.fixtures.generateUser()
    const user = new User(mockUser)

    expect(user.getSnapshot()).toMatchObject(mockUser)
  })

  it('user.toJSON() should return an object with all current values of the User fields (the same fields as in the NullableUserEntity type)', (ctx) => {
    const user = new User(ctx.fixtures.generateUser<NullableMockUser>({ id: '🌚' }))

    user.fullName = darkElf.fullName
    user.email = darkElf.email
    user.role = darkElf.role

    expect(user.isDirty()).toBe(true)
    expect(user.toJSON()).toEqual(darkElf)
  })

  it('user.prepare(mockUser) should return a new object with mockUser & NullableUserEntity fields', (ctx) => {
    const user = new User({})
    const mockUser = ctx.fixtures.generateUser()

    expect(user.prepare(mockUser)).toEqual({
      ...model,
      ...mockUser,
    })
  })

  it('user.update() should update User fields (NullableUserEntity), and snapshot with id if force: true', (ctx) => {
    const user = new User(ctx.fixtures.generateUser<NullableMockUser>({ id: '🌚' }))

    const updated = user.update(darkElf)
    expect(updated).toEqual(darkElf)

    expect(user.isDirty()).toBe(true)
    expect(user.toJSON()).toEqual(darkElf)

    user.update({ ...darkElf, id: '🗿' }, true)
    expect(user.isDirty()).toBe(false)
    expect(user.id).toBe('🗿')
  })

  it('user.reset() should reset all current User field values to the snapshot values', (ctx) => {
    const mockUser = ctx.fixtures.generateUser<NullableMockUser>({ id: '🌚' })
    const user = new User(mockUser)

    user.update(darkElf)
    user.isDeleted = true

    expect(user.toJSON()).toEqual(darkElf)

    user.reset()

    expect(user.isDirty()).toBe(false)
    expect(user.isDeleted).toBe(false)
    expect(user.toJSON()).toMatchObject(mockUser)
  })

  it('user.checkIfDirty() should return false if the param is deeply equal to the snapshot, and true otherwise', (ctx) => {
    const mockUser = ctx.fixtures.generateUser(model)
    const user = new User(mockUser)

    expect(user.checkIfDirty(mockUser)).toBe(false)

    const editedMockUser1 = { ...mockUser, email: darkElf.email }
    expect(user.checkIfDirty(editedMockUser1)).toBe(true)

    const editedMockUser2 = { ...mockUser, someField: 1 }
    expect(user.checkIfDirty(editedMockUser2)).toBe(true)
  })

  it('User.prepareCollection should return a collection (Map) of Users with the same fields in the snapshots as in the params', (ctx) => {
    const users = Array.from({ length: 3 }).map((_, index) =>
      ctx.fixtures.generateUser({ id: String(index) }),
    )
    const map = User.prepareCollection<NullableMockUser, User>(users, (entity) => new User(entity))

    expect(map.get(users[0].id)).toBeInstanceOf(User)

    const values = Array.from(map.values())

    expect(values.map((user) => user.getSnapshot())).toEqual(
      users.map((user) => expect.objectContaining(user)),
    )
  })
})
