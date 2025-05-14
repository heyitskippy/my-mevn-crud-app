import type { MaybeRefOrGetter, Reactive, ShallowReactive } from 'vue'

import type { ID, IModel, Maybe, NullableEntity } from '_/types'
import type { InputValue, TableType } from '_/types/ui'
import type { AssertAllRequired, Constructor, TMap } from '_/types/utilities'

import { isReactive, toRaw, toValue } from 'vue'

import Model from '@/models/Model'

export function mergeDeep<T = unknown>(target: T, ...sources: unknown[]): T {
  if (!sources.length || !isObject(target)) return target

  const source = sources.shift()

  if (
    isObject(source) &&
    (Array.isArray(target) ? Array.isArray(source) : !Array.isArray(source))
  ) {
    for (const key in source) {
      const k = key as keyof typeof source
      const value = source[k] as unknown

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
    const id = entity.id
    const hasId = id && targetMap.has(id)

    const model = (!isEmpty && hasId && targetMap.get(id)) || new Class(entity)

    if (!isEmpty && hasId) {
      targetMap.delete(id)

      if (isOnlyOne) isEmpty = true
    }

    targetMap.set(model.id, model)
  })

  return targetMap
}

export function prepareDateTime(
  date?: unknown,
  options: Intl.DateTimeFormatOptions = {},
  locale: Intl.LocalesArgument = 'ru',
): Date | string {
  if (!date || !isMaybeDate(date)) return ''

  const opts: Intl.DateTimeFormatOptions = {
    dateStyle: 'short',
    timeStyle: 'short',
    ...options,
  }

  const prepared = new Date(date).toLocaleString(locale, opts)

  return prepared === 'Invalid Date' ? '' : prepared
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

export function isNumber(value: unknown): value is number {
  return Number.isFinite(value)
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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms))
}

export function assertAllRequired<T>(obj: Partial<T>): asserts obj is AssertAllRequired<T> {
  for (const key in obj) {
    if (obj[key as keyof T] === undefined) {
      throw new Error(`Missing required property: "${key}"`)
    }
  }
}
