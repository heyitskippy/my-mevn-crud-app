import type { InputTypeHTMLAttribute } from 'vue'

import type { FormNames, TableHeader, ToastState } from '_/types/ui'
import type { NullableUserEntity, UserForm } from '_/types/users'

export const TABLE_POSITIONS: Record<NonNullable<TableHeader['position']>, string> = {
  start: 'text-left',
  center: 'text-center',
  end: 'text-right',
}

export const USER_HEADERS: TableHeader<Partial<NullableUserEntity>>[] = [
  {
    headerName: 'Email',
    field: 'email',
    type: 'email',
    readonly: { edit: true },
    required: true,
  },
  {
    headerName: 'Full name',
    field: 'fullName',
  },
  {
    headerName: 'Role',
    field: 'role',
    type: 'select',
    options: 'role',
    required: true,
  },
  {
    headerName: 'Created',
    field: 'createdAt',
    type: 'datetime',
  },
  {
    headerName: 'Updated',
    field: 'updatedAt',
    type: 'datetime',
  },
]

export const USER_FORM_LABELS: FormNames<UserForm> = {
  email: 'Email',
  fullName: 'Full Name',
  role: 'Role',
}

export const FIELD_TYPES: Record<NonNullable<TableHeader['type']>, InputTypeHTMLAttribute> = {
  datetime: 'datetime-local',
  text: 'text',
  select: 'select',
  email: 'email',
}

export const DEFAULT_TOASTER_STATE: Omit<ToastState, 'key'> = {
  visibility: false,
  text: null,
  type: 'error',
  timeout: 3000,
}

export const TOAST_SIMULTANEOUS = 3
