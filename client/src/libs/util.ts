/**
 * @param name
 * @returns
 */
export function snakeToCamel(name: string) {
  return name
    .replace(/_+/g, '_')
    .replace(/_(\w)/g, (a, letter) => letter.toUpperCase())
}
/**
 * @param name
 * @param sep default "_"
 * @returns
 */
export function camelToSnake(name: string, sep: string = '_') {
  return name.replace(/([A-Z])/g, (match, offset) =>
    offset === 0 ? match.toLowerCase() : `${sep}${match.toLowerCase()}`
  )
}

/**
 * 生成uuid
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
