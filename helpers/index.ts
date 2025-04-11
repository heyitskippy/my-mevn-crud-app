import type { MaybeRefOrGetter, Reactive, ShallowReactive } from 'vue'

import type { ID, IModel, Maybe, NullableEntity } from '_/types'
import type { InputValue, TableType } from '_/types/ui'
import type { Constructor, TMap } from '_/types/utilities'

import { isReactive, toRaw, toValue } from 'vue'

import Model from '@/models/Model'

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

export function cloneDeep<T = unknown>(
  value: MaybeRefOrGetter<T> | Reactive<T> | ShallowReactive<T> | T,
): T {
  value = toOriginal(value)

  if (!isObject(value)) return value

  if (!structuredClone) {
    return JSON.parse(JSON.stringify(value))
  }

  return structuredClone(value)
}

export function getTableItem<T extends TableType>(item: T | [Maybe<ID>, T], key: keyof T | string) {
  if (!Array.isArray(item) && key in item) return item

  if (Array.isArray(item) && key in item[1]) return item[1]

  return undefined
}

export function prepareCollection<T extends NullableEntity, M extends IModel>(
  collection: Partial<T>[],
  targetMap: TMap<M>,
  Class: Constructor<M, [Partial<T>]>,
) {
  const isOnlyOne = targetMap.size === 1
  let isEmpty = targetMap.size === 0

  collection.forEach((entity) => {
    let model = new Class(entity)
    /**
     * To keep the edited entity, but change its position according to sorting
     */
    if (!isEmpty) {
      const oldModel = targetMap.get(model.id)

      if (oldModel?.isDirty() || oldModel?.isDeleted) {
        model = oldModel
        targetMap.delete(model.id)

        if (isOnlyOne) isEmpty = true
      }
    }

    targetMap.set(model.id, model)
  })

  return targetMap
}

export function prepareDateTime(
  date?: unknown,
  dateStyle: 'short' | 'full' | 'long' | 'medium' = 'short',
  timeStyle: 'short' | 'full' | 'long' | 'medium' = 'short',
  options?: Intl.DateTimeFormatOptions,
): Date | string {
  if (!isMaybeDate(date)) return ''

  const opts = options ?? {
    dateStyle,
    timeStyle,
  }

  return new Date(date).toLocaleString('ru', opts)
}

export function fixTimezoneOffset(date: InputValue, backwards = false): Date {
  if (!isNonNullable(date)) return new Date()

  const offset = new Date().getTimezoneOffset() * 60 * 1000
  const timestamp = new Date(date).getTime()

  return new Date(timestamp + (backwards ? 1 : -1) * offset)
}

export function isMaybeDate(value: unknown) {
  return value instanceof Date || typeof value === 'string' || typeof value === 'number'
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

export function isModelLike(value: unknown) {
  return value instanceof Model
}

export function toOriginal<T = unknown>(
  value: MaybeRefOrGetter<T> | Reactive<T> | ShallowReactive<T> | T,
) {
  value = toValue(value)

  if (isReactive(value)) return toOriginal(toRaw(value))

  return value as T
}

export function prettifyErrors(errors: object) {
  return JSON.stringify(errors)
    .replaceAll(',', '\n ')
    .replaceAll('{', ' ')
    .replaceAll('}', '')
    .replaceAll(':"', ': ')
    .replaceAll('"', '')
}
