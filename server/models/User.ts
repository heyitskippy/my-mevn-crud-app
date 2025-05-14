import type { Model } from 'mongoose'
import type { IUser, IUserMethods, UserDocument } from '_/types/users'
import { Role } from '_/types/users'

import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { isNonNullable } from '_/helpers'
import string from '_/helpers/string'

type UserModelType = Model<UserDocument, object, IUserMethods>

const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
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
      minlength: [3, 'Full name must be longer than 2 characters!'],
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
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      minlength: [8, 'Password must be longer than 7 characters!'],
      validate: {
        validator: function (password: unknown) {
          if (!isNonNullable(password) || !string.isString(password)) return false

          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(password)
        },
        message: 'Password is invalid!',
      },
    },
  },
  {
    timestamps: true,
    id: true,
    methods: {
      comparePassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.password)
      },
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id
        delete ret.password

        return { id: ret.id, ...ret }
      },
    },
  },
)

export default model<IUser, UserModelType>('User', userSchema)
