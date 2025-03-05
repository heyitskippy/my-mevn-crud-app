import type { NullableUserEntity } from '_/types/users'

import Model from './Model'

export default class User extends Model<NullableUserEntity> implements NullableUserEntity {
  constructor(entity: Partial<NullableUserEntity>) {
    super(entity)

    this.snapshot = this.prepare(entity)

    const snapshot = this.getSnapshot()

    this.fullName = snapshot.fullName
    this.email = snapshot.email
    this.role = snapshot.role

    this.createdAt = snapshot.createdAt
    this.updatedAt = snapshot.updatedAt
  }

  fullName: NullableUserEntity['fullName']
  email: NullableUserEntity['email']
  role: NullableUserEntity['role']

  createdAt: NullableUserEntity['createdAt']
  updatedAt: NullableUserEntity['updatedAt']

  protected model = {
    id: null,

    fullName: null,
    email: null,
    role: null,

    createdAt: null,
    updatedAt: null,
  }
  protected snapshot = this.getModel()

  update(value: Partial<NullableUserEntity>, force?: boolean) {
    const entity = super.update(value, force)

    this.fullName = entity.fullName
    this.email = entity.email
    this.role = entity.role

    this.createdAt = entity.createdAt
    this.updatedAt = entity.updatedAt

    return entity
  }
}
