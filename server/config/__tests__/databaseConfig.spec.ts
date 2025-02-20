import mongoose from 'mongoose'
import { describe, expect, it, vi } from 'vitest'

import { connectDB, disconnectDB } from '../databaseConfig'

describe('databaseConfig', () => {
  it('should connect and disconnect successfully or throw an error', async () => {
    const db = await connectDB()
    expect(db.connection.readyState).toBe(1)

    await disconnectDB()
    expect(db.connection.readyState).toBe(0)

    vi.spyOn(mongoose, 'connect').mockImplementation(() => {
      throw Error('DB error!')
    })

    await expect(async () => {
      await connectDB()
    }).rejects.toThrowError('1')
  }, 100)
})
