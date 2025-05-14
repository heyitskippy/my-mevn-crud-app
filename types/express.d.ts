import 'express'

declare module 'express' {
  export interface Request {
    user?: {
      id: ID
      email?: string
    }
  }
}

export {}
