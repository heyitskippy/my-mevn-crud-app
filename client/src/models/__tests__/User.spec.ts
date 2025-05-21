import type { Entity } from '_/types'
import type { MakeMaybe } from '_/types/utilities'
import type { IUser, NullableUserEntity, UserForm } from '_/types/users'
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

    password: null,

    createdAt: null,
    updatedAt: null,
  } satisfies NullableUserEntity

  const darkElf = {
    ...model,

    id: '🌚',

    fullName: "Drizzt Do'Urden",
    email: 'forgotten-realms@email.su',
    role: Role.Admin,
    password: 'Tlaz22QC',
  } satisfies NullableUserEntity

  const error = "I don't like this name!"

  it('user.validate() should return true if the field is valid and a string with an error otherwise', (ctx) => {
    const user = new User(ctx.fixtures.generateUser())

    let validation = user.validate()

    expect(Object.keys(validation).every((valid) => valid)).toBe(true)

    user.update({ fullName: '1a a' })

    validation = user.validate()

    expect(typeof validation.fullName === 'string').toBeTruthy()
    expect(validation.email).toBe(true)
    expect(validation.role).toBe(true)
  })

  it('user.validate(form) should true if the field is valid and a string with an error otherwise', (ctx) => {
    const mockUser = ctx.fixtures.generateUser<NullableMockUser>(darkElf)
    const user = new User(mockUser)

    let validation = user.validate()

    expect(Object.keys(validation).every((valid) => valid)).toBe(true)

    const form: UserForm = {
      ...user.toJSON(),
      fullName: '1a a',
      role: Role.User,
      password: '12345678',
    }
    user.update(form)

    validation = user.validate()

    expect(typeof validation.fullName === 'string').toBeTruthy()
    expect(typeof validation.password === 'string').toBeTruthy()
    expect(validation.email).toBe(true)
    expect(validation.role).toBe(true)
  })

  it('user.validate() should return an error prefixed with "Server" if it contains errors from user.validationErrors', (ctx) => {
    const user = new User(ctx.fixtures.generateUser())

    let validation = user.validate()
    expect(validation.fullName).toBe(true)

    user.updateValidationErrors({ fullName: error })

    validation = user.validate()
    expect(validation.fullName).toBe(`Server: ${error}`)
  })

  it('user.updateValidationErrors(undefined / {...}) should update user.validationErrors', (ctx) => {
    const user = new User(ctx.fixtures.generateUser())

    expect(user.validationErrors).toBe(null)

    user.updateValidationErrors({ fullName: error })
    expect(user.validationErrors?.fullName).toBe(error)

    user.updateValidationErrors()
    expect(user.validationErrors).toBe(null)
  })

  it('user.isValid() should return true if all fields are valid and false otherwise', (ctx) => {
    const u = ctx.fixtures.generateUser()
    const user = new User(u)

    expect(user.isValid()).toBe(true)

    user.update({ fullName: '1a a' })
    expect(user.isValid()).toBe(false)

    user.update({ fullName: '1111' })
    expect(user.isValid()).toBe(false)

    user.update({ fullName: 'Mr. Freeman' })
    expect(user.isValid()).toBe(true)

    user.updateValidationErrors({ fullName: error })
    expect(user.isValid()).toBe(false)

    user.updateValidationErrors()
    expect(user.isValid()).toBe(true)
  })

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

    user.update({
      fullName: darkElf.fullName,
      email: darkElf.email,
      role: darkElf.role,
      password: darkElf.password,
    })

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

    const key = user.key.value

    user.updateValidationErrors({ fullName: error })
    expect(user.validationErrors).not.toBe(null)

    const updated = user.update(darkElf)
    expect(updated).toEqual(darkElf)

    expect(user.isDirty()).toBe(true)
    expect(user.toJSON()).toEqual(darkElf)

    expect(user.key.value !== key).toBeTruthy()
    expect(user.validationErrors).toBe(null)

    user.update({ ...darkElf, id: '🗿' }, true)
    expect(user.isDirty()).toBe(false)
    expect(user.id).toBe('🗿')
  })

  it('user.reset() should reset all current User field values to the snapshot values', (ctx) => {
    const mockUser = ctx.fixtures.generateUser<NullableMockUser>({ id: '🌚' })
    const user = new User(mockUser)

    user.update(darkElf)

    expect(user.toJSON()).toEqual(darkElf)

    user.reset()

    expect(user.isDirty()).toBe(false)
    expect(user.toJSON()).toMatchObject(mockUser)
  })

  it('user.delete() should set user.isDelete as false', (ctx) => {
    const user = new User(ctx.fixtures.generateUser())

    user.delete()
    expect(user.isDeleted).toBe(true)

    user.reset()
    expect(user.isDeleted).toBe(false)
  })

  it('user.checkIfDirty() should return false if the param is deeply equal to the snapshot, and true otherwise', (ctx) => {
    const mockUser = ctx.fixtures.generateUser<typeof model>(model)
    const user = new User(mockUser)

    const form = User.prepareForm(mockUser)

    expect(user.checkIfDirty(form)).toBe(false)

    const editedMockUser1 = { ...mockUser, email: darkElf.email }
    expect(user.checkIfDirty(editedMockUser1)).toBe(true)

    const editedMockUser2 = { ...mockUser, someField: 1 }
    expect(user.checkIfDirty(editedMockUser2)).toBe(true)
  })

  it('user.prepareForm() should return only UserForm fields', (ctx) => {
    const mockUser = ctx.fixtures.generateUser(model)
    const user = new User(mockUser)

    const fields = user.toJSON()

    const form: UserForm = {
      fullName: fields.fullName,
      email: fields.email,
      role: fields.role,
      password: null,
    }

    expect(User.prepareForm(fields)).toEqual(form)
  })

  it('User.prepareCollection should return a collection (Map) of Users with the same fields in the snapshots as in the params', (ctx) => {
    const users = Array.from({ length: 3 }).map((_, index) =>
      ctx.fixtures.generateUser({ id: String(index) }),
    )
    const map = User.prepareCollection(users)

    expect(map.get(users[0].id)).toBeInstanceOf(User)

    const values = Array.from(map.values())

    expect(values.map((user) => user.getSnapshot())).toEqual(
      users.map((user) => expect.objectContaining(user)),
    )
  })
})
