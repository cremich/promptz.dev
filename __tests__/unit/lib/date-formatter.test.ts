import {
  formatDate,
  formatGitDate,
  formatFrontmatterDate,
  getFormattedDisplayDate,
  getDateTimestamp,
  compareDatesNewestFirst,
  isValidDate
} from '@/lib/utils/date-formatter'

describe('date-formatter', () => {
  describe('formatDate', () => {
    it('should format valid ISO date strings', () => {
      const result = formatDate('2024-01-15T10:00:00Z')
      expect(result).toBe('Jan 15, 2024')
    })

    it('should format valid date strings in different formats', () => {
      const result = formatDate('2024-01-15')
      expect(result).toBe('Jan 15, 2024')
    })

    it('should handle null and undefined gracefully', () => {
      expect(formatDate(null)).toBe('Unknown Date')
      expect(formatDate(undefined)).toBe('Unknown Date')
      expect(formatDate('')).toBe('Unknown Date')
    })

    it('should return original string for invalid dates', () => {
      const invalidDate = 'not-a-date'
      const result = formatDate(invalidDate)
      expect(result).toBe(invalidDate)
    })

    it('should handle custom format options', () => {
      const result = formatDate('2024-01-15', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      expect(result).toBe('January 15, 2024')
    })
  })

  describe('formatGitDate', () => {
    it('should format git date strings', () => {
      const result = formatGitDate('2024-01-15T10:00:00Z')
      expect(result).toBe('Jan 15, 2024')
    })

    it('should handle null git dates', () => {
      const result = formatGitDate(null)
      expect(result).toBe('Unknown Date')
    })
  })

  describe('formatFrontmatterDate', () => {
    it('should format frontmatter date strings', () => {
      const result = formatFrontmatterDate('2024-01-15')
      expect(result).toBe('Jan 15, 2024')
    })

    it('should handle null frontmatter dates', () => {
      const result = formatFrontmatterDate(null)
      expect(result).toBe('Unknown Date')
    })
  })

  describe('getFormattedDisplayDate', () => {
    it('should prefer git creation date over frontmatter date', () => {
      const result = getFormattedDisplayDate('2024-01-15T10:00:00Z', '2024-01-10')
      expect(result).toBe('Jan 15, 2024')
    })

    it('should fall back to frontmatter date when git date is not available', () => {
      const result = getFormattedDisplayDate(null, '2024-01-10')
      expect(result).toBe('Jan 10, 2024')
    })

    it('should return Unknown Date when both dates are unavailable', () => {
      const result = getFormattedDisplayDate(null, null)
      expect(result).toBe('Unknown Date')
    })
  })

  describe('getDateTimestamp', () => {
    it('should return timestamp for valid dates', () => {
      const result = getDateTimestamp('2024-01-15T10:00:00Z')
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should return 0 for invalid dates', () => {
      expect(getDateTimestamp(null)).toBe(0)
      expect(getDateTimestamp('invalid-date')).toBe(0)
      expect(getDateTimestamp('')).toBe(0)
    })
  })

  describe('compareDatesNewestFirst', () => {
    it('should sort dates newest first', () => {
      const newer = '2024-01-15T10:00:00Z'
      const older = '2024-01-10T10:00:00Z'
      
      const result = compareDatesNewestFirst(newer, older)
      expect(result).toBeLessThan(0) // newer should come first (negative result)
    })

    it('should handle equal dates', () => {
      const date = '2024-01-15T10:00:00Z'
      const result = compareDatesNewestFirst(date, date)
      expect(result).toBe(0)
    })

    it('should handle null dates', () => {
      const validDate = '2024-01-15T10:00:00Z'
      
      // Valid date should come before null
      expect(compareDatesNewestFirst(validDate, null)).toBeLessThan(0)
      expect(compareDatesNewestFirst(null, validDate)).toBeGreaterThan(0)
      expect(compareDatesNewestFirst(null, null)).toBe(0)
    })
  })

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate('2024-01-15T10:00:00Z')).toBe(true)
      expect(isValidDate('2024-01-15')).toBe(true)
    })

    it('should return false for invalid dates', () => {
      expect(isValidDate(null)).toBe(false)
      expect(isValidDate(undefined)).toBe(false)
      expect(isValidDate('')).toBe(false)
      expect(isValidDate('invalid-date')).toBe(false)
    })
  })
})