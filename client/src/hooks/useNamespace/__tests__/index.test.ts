import { useNamespace } from '../'

// 在文件顶部添加模拟
jest.mock('@/assets/style/variables.module.scss', () => ({
  namespace: 'ms',
  blockSeparator: '-',
  elementSeparator: '__',
  modifierSeparator: '--'
}))

describe('useNamespace', () => {
  test('should generate correct block class', () => {
    const ns = useNamespace('block')
    expect(ns.b).toBe('ms-block')
  })

  test('should generate correct element class', () => {
    const ns = useNamespace('block')
    expect(ns.e('element')).toBe('ms-block__element')
  })

  test('should generate correct modifier class', () => {
    const ns = useNamespace('block')
    expect(ns.m('modifier')).toBe('ms-block--modifier')
  })

  test('should generate correct element+modifier class', () => {
    const ns = useNamespace('block')
    expect(ns.em('element', 'modifier')).toBe('ms-block__element--modifier')
  })
})
