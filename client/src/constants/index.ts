import type { FormFields, LoginForm, TableHeader, ToastState } from '_/types/ui'
import type { NullableUserEntity, UserForm } from '_/types/users'

export const TABLE_POSITIONS: Record<NonNullable<TableHeader['position']>, string> = {
  start: 'text-left',
  center: 'text-center',
  end: 'text-right',
}

export const USER_HEADERS: TableHeader<Partial<Omit<NullableUserEntity, 'password'>>>[] = [
  {
    headerName: 'Email',
    field: 'email',
    type: 'text',
  },
  {
    headerName: 'Full name',
    field: 'fullName',
    type: 'text',
  },
  {
    headerName: 'Role',
    field: 'role',
    type: 'select',
    options: 'role',
  },
  {
    headerName: 'Created',
    field: 'createdAt',
    type: 'datetime-local',
  },
  {
    headerName: 'Updated',
    field: 'updatedAt',
    type: 'datetime-local',
  },
]

export const USER_FIELDS: FormFields<UserForm> = {
  email: {
    label: 'Email',
    type: 'email',
    readonly: { edit: true },
    required: true,
    autocomplete: 'off',
  },
  fullName: {
    label: 'Full Name',
    type: 'text',
  },
  role: {
    label: 'Role',
    type: 'select',
    options: 'role',
    required: true,
  },
  password: {
    label: 'Password',
    type: 'password',
    required: true,
    autocomplete: 'new-password',
  },
}

export const LOGIN_FIELDS: FormFields<LoginForm> = {
  email: {
    label: 'Email',
    type: 'email',
    autocomplete: 'email',
    defaultValue: '',
  },
  password: {
    label: 'Password',
    type: 'password',
    autocomplete: 'current-password',
    defaultValue: '',
  },
}

export const DEFAULT_TOASTER_STATE: Omit<ToastState, 'key'> = {
  visibility: false,
  text: null,
  type: 'error',
  timeout: 3000,
}

export const TOAST_SIMULTANEOUS = 3

export const STORE_KEY = import.meta.env.VITE_STORE_KEY
