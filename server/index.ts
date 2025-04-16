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
app.use(commonRouter)

connectDB()

if (!import.meta.env.DEV) {
  startProdServer(app)
} else {
  app.use(loggerMiddleware)
}

export const server = app
