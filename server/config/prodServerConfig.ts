import type { Application, RequestHandler } from 'express'

import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const { VITE_BASE: BASE, VITE_SERVER_PORT: PORT, VITE_ROUTES_API: API } = import.meta.env

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DIST = path.join(path.resolve(__dirname), '../../dist')
const INDEX = path.join(DIST, 'index.html')

const serveStaticFiles: RequestHandler = (req, res, next) => {
  if (req.path.startsWith(API)) return next()

  express.static(DIST)(req, res, next)
}

const serveSpaFallback: RequestHandler = (_, res) => {
  res.sendFile(INDEX)
}

export const startProdServer = (app: Application) => {
  app.use(serveStaticFiles)

  app.get('*', (req, res, next) =>
    req.path.startsWith(API) ? next() : serveSpaFallback(req, res, next),
  )

  return app.listen(PORT, () => {
    console.log(`   ➜  Server running at ${BASE}:${PORT}`)

    app.emit('started')
  })
}
