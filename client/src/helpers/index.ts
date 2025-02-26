import { isObject } from '_/types/utilities'

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

export function deleteDeep(target: object, modelOrKeys: object, deep?: boolean) {
  const model = Array.isArray(modelOrKeys)
    ? modelOrKeys.reduce((model, key) => {
        model[key] = null

        return model
      }, {})
    : modelOrKeys

  for (const key in target) {
    const k = key as keyof typeof target

    if (!Object.hasOwn(model, k)) {
      delete target[k]
    } else if (deep && isObject(model[k])) {
      deleteDeep(target[k], model[k])
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
