import { camelToSnake, snakeToCamel, uuid } from '../util'

describe('String Case Conversion Utilities', () => {
  describe('camelToSnake', () => {
    it('should convert camelCase to snake_case by default', () => {
      expect(camelToSnake('userName')).toBe('user_name')
      expect(camelToSnake('getUserInfo')).toBe('get_user_info')
    })

    it('should support custom separator', () => {
      expect(camelToSnake('userName', '-')).toBe('user-name')
      expect(camelToSnake('getUserInfo', '.')).toBe('get.user.info')
    })

    it('should handle empty string', () => {
      expect(camelToSnake('')).toBe('')
    })

    it('should handle single word', () => {
      expect(camelToSnake('user')).toBe('user')
    })
  })

  describe('snakeToCamel', () => {
    it('should convert snake_case to camelCase', () => {
      expect(snakeToCamel('user_name')).toBe('userName')
      expect(snakeToCamel('get_user_info')).toBe('getUserInfo')
    })

    it('should handle empty string', () => {
      expect(snakeToCamel('')).toBe('')
    })

    it('should handle single word', () => {
      expect(snakeToCamel('user')).toBe('user')
    })

    it('should handle multiple underscores', () => {
      expect(snakeToCamel('user__name')).toBe('userName')
    })
  })
})

describe('UUID Generation', () => {
  it('should generate valid UUID format', () => {
    const id = uuid()
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    )
  })

  it('should generate unique values', () => {
    const id1 = uuid()
    const id2 = uuid()
    expect(id1).not.toBe(id2)
  })

  it('should have correct version bits (4)', () => {
    const id = uuid()
    expect(id.charAt(14)).toBe('4')
    expect(['8', '9', 'a', 'b']).toContain(id.charAt(19))
  })
})
