import type { ID, Maybe } from '_/types/index'
import type { IUser, UserEntity } from '_/types/users'

import bcrypt from 'bcrypt'

import User from '~/models/User'

const fetchUsers = async (): Promise<UserEntity[]> => {
  const users = await User.find().sort({ updatedAt: 'desc' }).exec()
  const mapped = users?.map((user) => user.toJSON())

  return mapped
}

const addUser = async (user: Partial<IUser>): Promise<UserEntity> => {
  const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : ''

  const newUser = new User({ ...user, password: hashedPassword })
  const saved = await newUser.save()

  return saved?.toJSON()
}

const addUserList = async (users: IUser[]): Promise<UserEntity[]> => {
  const hashed = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10)

      return { ...user, password: hashedPassword }
    }),
  )

  const saved = await User.insertMany(hashed)
  const mapped = saved?.map((user) => user.toJSON())

  return mapped
}

const fetchUserById = async (id: ID): Promise<Maybe<UserEntity> | undefined> => {
  const user = await User.findById(id).exec()

  return user?.toJSON()
}

const updateUser = async (id: ID, user: Partial<IUser>): Promise<Maybe<UserEntity> | undefined> => {
  const updated = await User.findByIdAndUpdate(id, user, {
    returnDocument: 'after',
    runValidators: true,
  }).exec()

  return updated?.toJSON()
}

const deleteUser = async (id: ID): Promise<Maybe<UserEntity> | undefined> => {
  const deleted = await User.findByIdAndDelete(id).exec()

  return deleted?.toJSON()
}

const deleteAllUsers = async () => {
  return await User.deleteMany().exec()
}

const fetchUserByFields = async (user: Partial<UserEntity>) => {
  return await User.findOne(user).exec()
}

export default {
  fetchUsers,
  addUser,
  addUserList,
  fetchUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,

  fetchUserByFields,
}
