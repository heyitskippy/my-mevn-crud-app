import type { IModel, NullableEntity } from '_/types'
import type { Constructor, TMap } from '_/types/utilities'

export function mergeDeep<T = unknown>(target: T, ...sources: unknown[]): T {
  if (!sources.length) return target

  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      const k = key as keyof typeof source
      const value = source[k]

      if (!isObject(value)) Object.assign(target, { [k]: value })
      else {
        if (!target[k]) Object.assign(target, { [k]: Array.isArray(value) ? [] : {} })

        mergeDeep(target[k], value)
      }
    }
  }

  return mergeDeep(target, ...sources)
}
/**
 * @param target - where to delete props
 * @param model - the object whose keys should remain in the target
 * @param deep - enables recursive deletion (only nested objects, not arrays)
 */
export function deleteByModelKeys(target: object, model: object, deep?: boolean) {
  if (Array.isArray(target)) return

  for (const key in target) {
    const k = key as keyof typeof target

    if (!Object.hasOwn(model, k)) {
      delete target[k]
    } else if (deep && isObject(target[k])) {
      if (!isObject(model[k])) {
        target[k] = (Array.isArray(target[k]) ? [] : {}) as never
      } else if (!Array.isArray(target[k])) {
        deleteByModelKeys(target[k], model[k], deep)
      }
    }
  }
}

export function cloneDeep<T = unknown>(value: T): T {
  if (!isObject(value)) return value

  if (!structuredClone) {
    return JSON.parse(JSON.stringify(value))
  }

  return structuredClone(value)
}

export function prepareCollection<T extends NullableEntity, M extends IModel>(
  collection: Partial<T>[],
  targetMap: TMap<M>,
  Class: Constructor<M, [Partial<T>]>,
) {
  collection.forEach((entity) => {
    const model = new Class(entity)

    targetMap.set(model.id, model)
  })

  return targetMap
}

export function isEmpty(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0
}

export function isObject(value: unknown) {
  return value !== null && typeof value === 'object'
}

export function isNonNullable<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined
}
