import { isNonNullable, isNumber } from '.'
import string from './string'

export function checkFullName(fullName: unknown) {
  if (!isNonNullable(fullName) || !string.isString(fullName)) return true
  if (string.isEmpty(fullName)) return true

  let message = 'Full name must be longer than 3 characters!'

  const trimmed = fullName.trim()
  if (trimmed.length <= 3) return message

  message = 'Full name must contain at least 2 words!'

  return /^[^\d\s]+(\s[^\d\s])/.test(trimmed) || message
}

export function checkEmail(email: unknown) {
  let message = 'Email is required!'

  if (!isNonNullable(email) || !string.isString(email)) return message
  if (string.isEmpty(email)) return message

  message = 'Email is invalid!'

  return (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email.toLowerCase(),
    ) || message
  )
}

export function checkEmptiness(value: unknown) {
  return (
    isNonNullable(value) && ((string.isString(value) && !string.isEmpty(value)) || isNumber(value))
  )
}
