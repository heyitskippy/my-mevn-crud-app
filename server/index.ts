import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'

import commonRouter from './routes/common'
import usersRouter from './routes/users'

import loggerMiddleware from './middlewares/loggerMiddleware'

import { connectDB } from './config/databaseConfig'
import { startProdServer } from './config/prodServerConfig'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const API = import.meta.env.VITE_API

app.use(`${API}/users`, usersRouter)

connectDB()

if (!import.meta.env.DEV) {
  app.use(commonRouter)
  startProdServer(app)
} else {
  app.use(loggerMiddleware)
  app.use(commonRouter)
}

export const server = app
