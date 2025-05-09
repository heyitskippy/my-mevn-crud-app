/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'
import type { ID } from '_/types'
import type { IUser } from '_/types/users'

import mongoose from 'mongoose'

import userService from '~/services/userService'

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.fetchUsers()

    res.status(200).json({ users })

    next()
  } catch (e: any) {
    console.error('[getAllUsers]', e.message)

    handleError(e, res)

    next(e)
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = req.body

  try {
    const newUser = await userService.addUser(user)

    res.status(201).json({ user: newUser })

    next()
  } catch (e: any) {
    console.error('[createUser]', e.message)

    handleError(e, res)

    next(e)
  }
}

const getUserById = async (req: Request<{ id: ID }>, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`The id is not valid (${id})`)
    }

    const user = await userService.fetchUserById(id)
    if (!user) throw new Error(`Can't find user with id=${id}`)

    res.status(200).json({ user })
    next()
  } catch (e: any) {
    console.error('[getUserById]', e.message)

    handleError(e, res, 404)

    next(e)
  }
}

const updateUser = async (
  req: Request<{ id: ID; user: IUser }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params
  const user = req.body

  try {
    const updatedUser = await userService.updateUser(id, user)
    if (!updatedUser) throw new Error(`Something went wrong while updating user with id=${id}`)

    res.status(200).json({ user: updatedUser })
    next()
  } catch (e: any) {
    console.error('[updateUser]', e.message)

    handleError(e, res)

    next(e)
  }
}

const deleteUser = async (req: Request<{ id: ID }>, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const user = await userService.deleteUser(id)
    if (!user) throw new Error(`Can't find or delete user with id=${id}`)

    res.status(200).json({ user })
    next()
  } catch (e: any) {
    console.error('[deleteUser]', e.message)

    handleError(e, res)

    next(e)
  }
}

const createUserList = async (req: Request, res: Response, next: NextFunction) => {
  const list: IUser[] = req.body

  try {
    const users = await userService.addUserList(list)

    res.status(201).json({ users })

    next()
  } catch (e: any) {
    console.error('[createUserList]', e.message)

    handleError(e, res)

    next(e)
  }
}

const deleteAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleteResult = await userService.deleteAllUsers()

    if (!deleteResult?.acknowledged) {
      throw new Error('Something went wrong while deleting users')
    }

    res.status(200).json(deleteResult)

    next()
  } catch (e: any) {
    console.error('[deleteAllUsers]', e.message)

    handleError(e, res)

    next(e)
  }
}

export const handleError = (e: any, res: Response, status = 500) => {
  const errors: Record<string, string> = {}

  if (e instanceof mongoose.Error.ValidationError || /duplicate key/.test(e.message)) {
    status = 422

    if (/duplicate key/.test(e.message)) {
      const result = e.message.match(/\w+: "/g)
      const keys = result?.map((v: string) => v.replace(': "', '') ?? [])

      e.errors ??= {}

      for (const index in keys) {
        errors[keys[index]] = `This ${keys[index]} already exists!`
      }

      errors['server'] = e.message
    }
  }

  if (e.errors) {
    for (const key in e.errors) {
      errors[key] = e.errors[key].message
    }
  } else {
    errors['server'] = e.message
  }

  res.status(status).json({ errors })
}

export default {
  getAll: getAllUsers,
  create: createUser,
  getById: getUserById,
  update: updateUser,
  delete: deleteUser,
  createMany: createUserList,
  deleteAll: deleteAllUsers,
}
