import type { ID, Maybe } from '_/types/index'
import type { IUser, UserEntity } from '_/types/users'

import User from '~/models/User'

const fetchUsers = async (): Promise<UserEntity[]> => {
  const users = await User.find().sort({ updatedAt: 'desc' }).exec()
  const mapped = users?.map((user) => user.toJSON())

  return mapped
}

const addUser = async (user: IUser): Promise<UserEntity> => {
  const newUser = new User(user)
  const saved = await newUser.save()

  return saved?.toJSON()
}

const addUserList = async (users: IUser[]): Promise<UserEntity[]> => {
  const saved = await User.insertMany(users)
  const mapped = saved?.map((user) => user.toJSON())

  return mapped
}

const fetchUserById = async (id: ID): Promise<Maybe<UserEntity> | undefined> => {
  const user = await User.findById(id).exec()

  return user?.toJSON()
}

const updateUser = async (id: ID, user: Partial<IUser>): Promise<Maybe<UserEntity> | undefined> => {
  const updated = await User.findByIdAndUpdate(id, user, { returnDocument: 'after' }).exec()

  return updated?.toJSON()
}

const deleteUser = async (id: ID): Promise<Maybe<UserEntity> | undefined> => {
  const deleted = await User.findByIdAndDelete(id).exec()

  return deleted?.toJSON()
}

const deleteAllUsers = async () => {
  return await User.deleteMany().exec()
}

export default {
  fetchUsers,
  addUser,
  addUserList,
  fetchUserById,
  updateUser,
  deleteUser,
  deleteAllUsers,
}
