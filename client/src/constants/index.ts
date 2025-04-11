import type { InputTypeHTMLAttribute } from 'vue'

import type { FormNames, TableHeader } from '_/types/ui'
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
    readonly: { edit: true },
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
}
