import { Role } from '_/types/users'

import { connectDB, disconnectDB } from '~/config/databaseConfig'
import userService from '~/services/userService'

import User from '~/models/User'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

export async function seedAdmin() {
  try {
    await connectDB()

    console.log('🔄 Seeding admin...')

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL })

    if (existingAdmin) {
      console.log('ℹ️  Admin already exists')
    } else {
      userService.addUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: Role.Admin,
      })

      console.log('✅ Admin created successfully!')
    }
  } catch (e) {
    console.error('❌ Failed to seed admin:', e)
  } finally {
    await disconnectDB()
  }
}
