/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'
import type { ID } from '_/types'
import type { IUser } from '_/types/users'

import mongoose from 'mongoose'

import HttpError from '_/helpers/errors/HttpError'

import userService from '~/services/userService'

const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.fetchUsers()

    res.status(200).json({ users })

    next()
  } catch (e: any) {
    console.error('[getAllUsers]', e.message)

    next(e)
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const user: Partial<IUser> = req.body

  try {
    const newUser = await userService.addUser(user)

    if (req.path === '/register') {
      req.body = newUser

      return next()
    }

    res.status(201).json({ user: newUser })

    next()
  } catch (e: any) {
    console.error('[createUser]', e.message)

    next(e)
  }
}

const getUserById = async (req: Request<{ id?: ID }>, res: Response, next: NextFunction) => {
  const id: ID | undefined = req.path === '/me' ? req.user?.id : req.params.id

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError(`The id is not valid (${id})`, 404)
    }

    const user = await userService.fetchUserById(id)
    if (!user) throw new HttpError(`Can't find user with id=${id}`, 404)

    res.status(200).json({ user })

    next()
  } catch (e: any) {
    console.error('[getUserById]', e.message)

    if (!(e instanceof HttpError)) {
      e = new HttpError(e.message, 404)
    }

    next(e)
  }
}

const updateUser = async (
  req: Request<{ id: ID }, any, IUser>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params
  const user = req.body

  try {
    const updatedUser = await userService.updateUser(id, user)
    if (!updatedUser) throw new HttpError(`Something went wrong while updating user with id=${id}`)

    res.status(200).json({ user: updatedUser })

    next()
  } catch (e: any) {
    console.error('[updateUser]', e.message)

    next(e)
  }
}

const deleteUser = async (req: Request<{ id: ID }>, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const user = await userService.deleteUser(id)
    if (!user) throw new HttpError(`Can't find or delete user with id=${id}`)

    res.status(200).json({ user })

    next()
  } catch (e: any) {
    console.error('[deleteUser]', e.message)

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

    next(e)
  }
}

const deleteAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const deleteResult = await userService.deleteAllUsers()

    if (!deleteResult?.acknowledged) {
      throw new HttpError('Something went wrong while deleting users')
    }

    res.status(200).json(deleteResult)

    next()
  } catch (e: any) {
    console.error('[deleteAllUsers]', e.message)

    next(e)
  }
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
