import type { NullableEntity, ID, Maybe, EntityForm } from '_/types'

import { cloneDeep, deleteByModelKeys } from '_/helpers'
import { isEqual } from 'lodash-es'

export default abstract class Model<T extends NullableEntity, F extends EntityForm> {
  constructor(entity: Partial<T>) {
    this.id = entity.id ?? null
  }

  readonly key = Symbol()

  protected abstract model: T
  protected abstract snapshot: T
  protected abstract formSnapshot: F

  id: Maybe<ID>
  isDeleted: boolean = false

  isNew() {
    return this.id === null
  }

  isDirty() {
    return !isEqual(this.snapshot, this.toJSON())
  }

  getModel() {
    return cloneDeep(this.model)
  }

  getSnapshot() {
    return cloneDeep(this.snapshot)
  }

  protected getOnlyModelProps() {
    const props: Partial<typeof this> = {}

    for (const key in this.model) {
      props[key as keyof this] = this[key as keyof this]
    }

    return props
  }

  toJSON(): T {
    return {
      ...this.getSnapshot(),
      ...this.getOnlyModelProps(),
    }
  }

  prepare(value: Partial<T>, model = this.getModel()) {
    const cloned = cloneDeep<Partial<T>>(value)

    deleteByModelKeys(cloned, model, true)
    Object.assign(model, cloned)

    return model
  }
  /**
   * @param value - any part of entity
   * @param force - pass true to update the class after saving to the database
   * @returns full entity
   */
  update(value: Partial<T>, force?: boolean) {
    const entity = this.prepare(value, this.toJSON())

    if (force) {
      this.id = entity.id ?? null
      this.snapshot = entity
    }

    return entity
  }

  reset() {
    this.isDeleted = false

    this.update(this.snapshot)
  }

  checkIfDirty(form: F) {
    return !isEqual(this.formSnapshot, form)
  }
}
