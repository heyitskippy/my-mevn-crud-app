/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'
import type { UserEntity } from '../types/users'

import userService from '../services/userService'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const user: UserEntity = req.body

  try {
    const newUser = await userService.addUser(user)
    if (!newUser) throw new Error('Something went wrong while creating the user')

    res.status(201).json({ user: newUser })
    next()
  } catch (e: any) {
    console.error('[createUser]', e.message)

    res.sendStatus(500)

    next(e)
  }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.fetchUsers()
    if (!users) throw new Error('No users found')

    res.status(200).json({ users })
    next()
  } catch (e: any) {
    console.error('[getAllUsers]', e.message)

    res.sendStatus(500)

    next(e)
  }
}

export default { create: createUser, getAll: getAllUsers }
