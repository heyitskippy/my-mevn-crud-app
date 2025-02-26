import type { IUser, UserEntity } from '_/types/users'
import { Role } from '_/types/users'

import { Model, Schema, model } from 'mongoose'

const userSchema = new Schema<IUser>(
  {
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
    id: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id

        return { id: ret.id, ...ret }
      },
    },
  },
)

export default model<IUser, Model<UserEntity>>('User', userSchema)
