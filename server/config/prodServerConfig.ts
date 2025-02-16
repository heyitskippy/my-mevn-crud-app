import type { Application } from 'express'

import express from 'express'
import path from 'path'

export const startProdServer = (app: Application) => {
  app.use('/', express.static(path.join(path.resolve(__dirname), '../')))

  const BASE = import.meta.env.VITE_BASE
  const PORT = import.meta.env.VITE_SERVER_PORT

  app.listen(PORT)

  console.log(`   %c➜%c  Listening on ${BASE}:${PORT}/`, 'color:green;')
}
