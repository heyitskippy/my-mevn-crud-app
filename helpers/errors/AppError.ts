export default class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }
}
