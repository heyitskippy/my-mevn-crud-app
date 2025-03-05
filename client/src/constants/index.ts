import type { TableHeader } from '_/types/ui'
import type { NullableUserEntity } from '_/types/users'

export const USER_HEADERS: TableHeader<Partial<NullableUserEntity>>[] = [
  {
    headerName: 'Email',
    field: 'email',
  },
  {
    headerName: 'Full name',
    field: 'fullName',
  },
  {
    headerName: 'Role',
    field: 'role',
  },
]
