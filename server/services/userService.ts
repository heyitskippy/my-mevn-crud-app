import type { ID } from '~/types'
import type { IUser } from '~/types/users'

import User from '~/models/User'

const fetchUsers = async () => {
  const users = await User.find()
  const mapped = users?.map((user) => user.toJSON())

  return mapped
}

const addUser = async (user: IUser) => {
  const newUser = new User(user)
  const saved = await newUser.save()

  return saved?.toJSON()
}

const fetchUserById = async (id: ID) => {
  const user = await User.findById(id)

  return user?.toJSON()
}

const updateUser = async (id: ID, user: Partial<IUser>) => {
  const updated = await User.findByIdAndUpdate(id, user, { returnDocument: 'after' })

  return updated?.toJSON()
}

const deleteUser = async (id: ID) => {
  const deleted = await User.findByIdAndDelete(id)

  return deleted?.toJSON()
}

const deleteAllUsers = async () => {
  return await User.deleteMany()
}

export default { fetchUsers, addUser, fetchUserById, updateUser, deleteUser, deleteAllUsers }
