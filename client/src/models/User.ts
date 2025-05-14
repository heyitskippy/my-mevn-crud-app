import type { NullableUserEntity, UserForm } from '_/types/users'
import type { TMap } from '_/types/utilities'

import {
  assertAllRequired,
  cloneDeep,
  deleteByModelKeys,
  isEmpty,
  prepareCollection,
} from '_/helpers'
import { checkEmail, checkFullName, checkEmptiness, checkPassword } from '_/helpers/validation'

import Model from './Model'

export default class User
  extends Model<NullableUserEntity, UserForm>
  implements Omit<NullableUserEntity, 'password'>
{
  constructor(entity: Partial<NullableUserEntity> = {}) {
    super(entity)

    const snap = this.prepare(entity)
    assertAllRequired(snap)
    this.snapshot = snap

    this.formSnapshot = User.prepareForm(entity, undefined, true)

    const snapshot = this.getSnapshot()

    this.fullName = snapshot.fullName
    this.email = snapshot.email
    this.role = snapshot.role

    this.password = snapshot.password

    this.createdAt = snapshot.createdAt
    this.updatedAt = snapshot.updatedAt
  }

  fullName: NullableUserEntity['fullName']
  email: NullableUserEntity['email']
  role: NullableUserEntity['role']

  protected password: NullableUserEntity['password']

  createdAt: NullableUserEntity['createdAt']
  updatedAt: NullableUserEntity['updatedAt']

  protected model: NullableUserEntity = {
    id: null,

    fullName: null,
    email: null,
    role: null,

    password: null,

    createdAt: null,
    updatedAt: null,
  }
  protected snapshot: NullableUserEntity
  protected formSnapshot

  validate(form: Partial<UserForm> = this.toJSON()): Record<keyof UserForm, true | string> {
    const isNew = this.isNew()
    const valid = {
      fullName: checkFullName(form.fullName),
      email: checkEmail(form.email),
      role: checkEmptiness(form.role) || 'The role is required!',
      password: isNew || (!isNew && form.password !== null) ? checkPassword(form.password) : true,
    }
    const errors = this.validationErrors ?? {}

    Object.entries(valid).forEach(([key, value]) => {
      const k = key as keyof UserForm

      if (value === true) valid[k] = errors[k] ? `Server: ${errors[k]}` : true
    })

    return valid
  }

  update(value: Partial<NullableUserEntity>, force?: boolean) {
    const entity = super.update(value, force)

    if (force) {
      this.formSnapshot = User.prepareForm(entity, undefined, true)
    }

    this.fullName = entity.fullName
    this.email = entity.email
    this.role = entity.role

    this.password = entity.password

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
      password: null,
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
