import { titleCase } from '../case'

describe('titleCase', () => {
  it('should handle hyphen-separated words', () => {
    expect(titleCase('a-simple-test-1')).toBe('A Simple Test 1')
  })

  it('should handle underscore-separated words', () => {
    expect(titleCase('a_simple_test_2')).toBe('A Simple Test 2')
  })

  it('should handle mixed separators', () => {
    expect(titleCase('a simple-test_3')).toBe('A Simple Test 3')
  })

  it('should handle space-separated words', () => {
    expect(titleCase('a simple test 4')).toBe('A Simple Test 4')
  })

  it('should handle empty string', () => {
    expect(titleCase('')).toBe('')
  })

  it('should handle single word', () => {
    expect(titleCase('hello')).toBe('Hello')
  })
})
