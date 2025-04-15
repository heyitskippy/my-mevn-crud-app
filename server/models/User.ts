import type { IUser, UserEntity } from '_/types/users'
import { Role } from '_/types/users'

import { Model, Schema, model } from 'mongoose'

import { isNonNullable } from '_/helpers'
import string from '_/helpers/string'

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      immutable: true,
      required: [true, 'Email is required!'],
      unique: true,
      validate: {
        validator: function (email: string) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email.toLowerCase(),
          )
        },
        message: 'Email is invalid!',
      },
    },
    fullName: {
      type: String,
      minlength: [3, 'Full name must be longer than 3 characters!'],
      validate: {
        validator: function (fullName: unknown) {
          if (!isNonNullable(fullName) || !string.isString(fullName)) return true
          if (string.isEmpty(fullName)) return true

          return /^[^\d\s]+(\s[^\d\s])/.test(fullName)
        },
        message: 'Full name must contain at least 2 words!',
      },
    },
    role: {
      type: String,
      enum: Role,
      default: Role.User,
      required: [true, 'The role is required!'],
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
