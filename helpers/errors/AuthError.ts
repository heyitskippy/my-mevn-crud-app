import AppError from './AppError'

export default class AuthError extends AppError {
  constructor(message = 'Authentication failed', statusCode = 401) {
    super(message, statusCode)
  }
}
