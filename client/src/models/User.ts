import type { NullableUserEntity, UserForm } from '_/types/users'
import type { TMap } from '_/types/utilities'

import { cloneDeep, deleteByModelKeys, isEmpty, prepareCollection } from '_/helpers'
import { checkEmail, checkFullName, checkEmptiness } from '_/helpers/validation'

import Model from './Model'

export default class User
  extends Model<NullableUserEntity, UserForm>
  implements NullableUserEntity
{
  constructor(entity: Partial<NullableUserEntity> = {}) {
    super(entity)

    this.snapshot = this.prepare(entity)
    this.formSnapshot = User.prepareForm(entity, undefined, true)

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

  protected model: NullableUserEntity = {
    id: null,

    fullName: null,
    email: null,
    role: null,

    createdAt: null,
    updatedAt: null,
  }
  protected snapshot
  protected formSnapshot

  validate(form: Partial<UserForm> = this.toJSON()): Record<keyof UserForm, true | string> {
    return {
      fullName: checkFullName(form.fullName),
      email: checkEmail(form.email),
      role: checkEmptiness(form.role) || 'The role cannot be empty!',
    }
  }

  update(value: Partial<NullableUserEntity>, force?: boolean) {
    const entity = super.update(value, force)

    this.fullName = entity.fullName
    this.email = entity.email
    this.role = entity.role

    this.createdAt = entity.createdAt
    this.updatedAt = entity.updatedAt

    return entity
  }

  static prepareForm(
    value: Partial<NullableUserEntity> = {},
    form: UserForm = cloneDeep({
      fullName: null,
      email: null,
      role: null,
    }),
    clone: boolean = false,
  ) {
    const cloned = clone ? cloneDeep<Partial<NullableUserEntity>>(value) : value

    if (!isEmpty(cloned)) {
      deleteByModelKeys(cloned, form, true)
      Object.assign(form, cloned)
    }

    return form
  }

  static prepareCollection(
    collection: Partial<NullableUserEntity>[],
    targetMap: TMap<User> = new Map(),
  ) {
    return prepareCollection<NullableUserEntity, User>(collection, targetMap, User)
  }
}
