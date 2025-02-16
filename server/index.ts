import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'

import commonRouter from './routes/common'

import { connectDB } from './config/databaseConfig'
import { startProdServer } from './config/prodServerConfig'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

await connectDB()

app.use(commonRouter)

if (!import.meta.env.DEV) startProdServer(app)

export const server = app
