import type { MongoUser } from '../types/users'
import { Role } from '../types/users'

import { Schema, model } from 'mongoose'

const userSchema = new Schema<MongoUser>(
  {
    id: Schema.ObjectId,
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Role,
      required: true,
      default: Role.User,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id

        return ret
      },
    },
  },
)

export default model<MongoUser>('user', userSchema)
