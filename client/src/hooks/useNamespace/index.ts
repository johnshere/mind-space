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

  const e = (element: string) => `${b}${elementSeparator}${element}`

  const m = (modifier: string) => `${b}${modifierSeparator}${modifier}`

  const em = (element: string, modifier: string) =>
    `${b}${elementSeparator}${element}${modifierSeparator}${modifier}`

  return {
    b,
    e,
    m,
    em
  }
}
