import type { Application } from 'express'

import express from 'express'
import path from 'path'

export const startProdServer = (app: Application) => {
  app.use('/', express.static(path.join(path.resolve(__dirname), '../')))

  const BASE = import.meta.env.VITE_BASE
  const PORT = import.meta.env.VITE_SERVER_PORT

  const server = app.listen(PORT)

  app.emit('started')

  console.log(`  ➜  Listening: ${BASE}:${PORT}/`)

  return server
}
