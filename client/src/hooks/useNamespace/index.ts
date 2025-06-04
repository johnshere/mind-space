import * as vars from '@/assets/style/variables.module.scss'

export const config = {
  namespace: vars.namespace.replace(/['"]/g, ''),
  blockSeparator: vars.blockSeparator.replace(/['"]/g, ''),
  elementSeparator: vars.elementSeparator.replace(/['"]/g, ''),
  modifierSeparator: vars.modifierSeparator.replace(/['"]/g, '')
}

export const useNamespace = (block: string) => {
  const { namespace, blockSeparator, elementSeparator, modifierSeparator } =
    config
  const b = `${namespace}${blockSeparator}${block}`

  let _e: string
  const e = (ele: string) => `${b}${elementSeparator}${(_e = ele)}`

  const m = (mod: string) =>
    `${b}${elementSeparator}${_e}${modifierSeparator}${mod}`

  const em = (ele: string, mod: string) =>
    `${b}${elementSeparator}${ele}${modifierSeparator}${mod}`

  return {
    b,
    e,
    m,
    em
  }
}
