/* eslint-disable  @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'

const DB_USER = import.meta.env.VITE_MONGO_USERNAME
const DB_PASSWORD = import.meta.env.VITE_MONGO_PASSWORD
const DB_HOST = import.meta.env.VITE_MONGO_HOST
const DB_PORT = import.meta.env.VITE_MONGO_PORT
const DB_NAME = import.meta.env.VITE_MONGO_DB_NAME

const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`

export const connectDB = async () => {
  let db = null

  try {
    db = await mongoose.connect(url)

    console.log('\nMongoDB: connected!')
  } catch (e: any) {
    console.error('\nMongoDB: connection failed!', e.message)
    process.exit(1)
  }

  return db
}

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()

    console.log('\nMongoDB: disconnected!')
  } catch (e: any) {
    console.error('\nMongoDB:', e.message)
  }
}
