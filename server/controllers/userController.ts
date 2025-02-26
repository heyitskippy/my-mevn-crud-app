/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'
import type { ID } from '@/../../types'
import type { IUser } from '@/../../types/users'

import userService from '~/services/userService'

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.fetchUsers()

    res.status(200).json({ users })

    next()
  } catch (e: any) {
    console.error('[getAllUsers]', e.message)

    res.sendStatus(500)

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

    res.sendStatus(500)

    next(e)
  }
}

const getUserById = async (req: Request<{ id: ID }>, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const user = await userService.fetchUserById(id)
    if (!user) throw new Error(`Can't find user with id=${id}`)

    res.status(200).json({ user })
    next()
  } catch (e: any) {
    console.error('[getUserById]', e.message)

    res.sendStatus(404)

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
    if (!updatedUser) throw new Error(`Something went wrong while updating user  with id=${id}`)

    res.status(200).json({ user: updatedUser })
    next()
  } catch (e: any) {
    console.error('[updateUser]', e.message)

    res.sendStatus(500)

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

    res.sendStatus(500)

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

    res.sendStatus(500)

    next(e)
  }
}

export default {
  getAll: getAllUsers,
  create: createUser,
  getById: getUserById,
  update: updateUser,
  delete: deleteUser,
  deleteAll: deleteAllUsers,
}
