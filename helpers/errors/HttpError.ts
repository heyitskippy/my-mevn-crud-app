import AppError from './AppError'

export default class HttpError extends AppError {
  constructor(message = 'Something went wrong', statusCode = 500) {
    super(message, statusCode)
  }
}
