/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'

import mongoose from 'mongoose'

const handleError = (e: any, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next()

  const errors: Record<string, string> = {}
  const exists = /duplicate key/.test(e.message)
  let status = e.statusCode ?? 500

  if (e instanceof mongoose.Error.ValidationError || exists) {
    status = 422

    if (exists) {
      const result = e.message.match(/\w+: "/g)
      const keys = result?.map((v: string) => v.replace(': "', '') ?? [])

      e.errors ??= {}

      for (const index in keys) {
        errors[keys[index]] = `This ${keys[index]} already exists!`
      }

      errors['server'] = e.message
    }
  }

  if (e.errors) {
    for (const key in e.errors) {
      errors[key] = e.errors[key].message
    }
  } else {
    errors['server'] = e.message
  }

  res.status(status).json({ errors })

  next(e)
}

export default handleError
