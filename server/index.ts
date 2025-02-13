import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'

const env = import.meta.env.DEV ? 'development' : 'production'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const BASE = import.meta.env.VITE_BASE
const PORT = import.meta.env.VITE_SERVER_PORT
const API = import.meta.env.VITE_API

app.get(`${API}*`, (req, res) => {
  res.send("It's API!")
})

app.get(`${API}/ip`, async (req, res) => {
  const resp = await fetch('https://api.ipify.org?format=json')
  const json = await resp.json()
  res.json(json)
})

if (env === 'production') {
  app.use('/', express.static('../'))
  app.listen(PORT)
  console.log(`listening on ${BASE}:${PORT}/`)
}

export const server = app
