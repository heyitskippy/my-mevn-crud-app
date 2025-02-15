import express from 'express'
import path from 'path'

import cors from 'cors'
import bodyParser from 'body-parser'

const env = import.meta.env.DEV ? 'development' : 'production'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get(`/api*`, (req, res) => {
  res.send("It's API!")
})

app.get(`/api/ip`, async (req, res) => {
  const resp = await fetch('https://api.ipify.org?format=json')
  const json = await resp.json()
  res.json(json)
})

if (env === 'production') {
  serveStatic()

  const BASE = import.meta.env.VITE_BASE
  const PORT = import.meta.env.VITE_SERVER_PORT
  app.listen(PORT)

  console.log(`listening on ${BASE}:${PORT}/`)
}

function serveStatic() {
  app.use('/', express.static(path.join(path.resolve(__dirname), '../')))
}

export const server = app
