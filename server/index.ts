import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'

import commonRouter from './routes/common'
import usersRouter from './routes/users'

import { connectDB } from './config/databaseConfig'
import { startProdServer } from './config/prodServerConfig'
import { loggerMiddleware } from './middlewares/loggerMiddleware'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

connectDB()

app.use(commonRouter)
app.use('/api/users', usersRouter)

if (!import.meta.env.DEV) {
  startProdServer(app)
} else {
  app.use(loggerMiddleware)
}

export const server = app
