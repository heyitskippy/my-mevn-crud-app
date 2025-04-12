function isEmpty(st: unknown) {
  if (!isString(st)) {
    throw TypeError('Not a string!')
  }

  return !st
}

function isString(st: unknown) {
  return typeof st === 'string'
}

export default { isString, isEmpty }
