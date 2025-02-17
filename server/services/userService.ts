import type { UserEntity } from '../types/users'

import User from '../models/User'

const addUser = async (user: UserEntity) => {
  const newUser = new User(user)

  return await newUser.save()
}

const fetchUsers = async () => {
  return await User.find()
}

export default { addUser, fetchUsers }
