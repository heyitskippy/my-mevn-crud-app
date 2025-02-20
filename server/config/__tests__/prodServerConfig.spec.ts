import express from 'express'

import { describe, expect, it } from 'vitest'

import { startProdServer } from '../prodServerConfig'

describe('prodServerConfig', () => {
  it('should emit started', async () => {
    const app = express()
    const started = new Promise((resolve) => app.on('started', () => resolve(true)))
    const server = startProdServer(app)

    expect(await started).toBe(true)

    server.close()
  }, 100)
})
