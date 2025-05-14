import express from 'express'

import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import authRouter from './routes/auth'
import commonRouter from './routes/common'
import usersRouter from './routes/users'

import authMiddleware from './middlewares/authMiddleware'
import errorMiddleware from './middlewares/errorMiddleware'
import loggerMiddleware from './middlewares/loggerMiddleware'

import { connectDB } from './config/databaseConfig'
import { startProdServer } from './config/prodServerConfig'

const DEV = import.meta.env.DEV

const BASE = import.meta.env.VITE_BASE
const PORT = import.meta.env.VITE_CLIENT_PORT

const API = import.meta.env.VITE_API

const app = express()

app.use(cors({ origin: `${BASE}:${PORT}`, credentials: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (DEV) app.use(loggerMiddleware)

app.use(`${API}/auth`, authRouter)

app.use(authMiddleware)
app.use(`${API}/users`, usersRouter)

app.use(errorMiddleware)

connectDB()

if (!DEV) {
  app.use(commonRouter)
  startProdServer(app)
} else {
  app.use(commonRouter)
}

export const server = app
