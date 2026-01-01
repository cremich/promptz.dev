import {
  getContentTypeBadgeVariant,
  getLibraryBadgeVariant,
  getBadgeArrangement,
  getStandardBadgeClasses,
  getBadgeContainerClasses,
  normalizeBadgeText,
  getBadgePriority
} from '@/lib/utils/badge-utils'

describe('Badge Utils', () => {
  describe('getContentTypeBadgeVariant', () => {
    it('should return secondary variant for prompt type', () => {
      const result = getContentTypeBadgeVariant('prompt')
      expect(result.variant).toBe('secondary')
    })

    it('should return default variant for agent type', () => {
      const result = getContentTypeBadgeVariant('agent')
      expect(result.variant).toBe('default')
    })

    it('should return default variant for power type', () => {
      const result = getContentTypeBadgeVariant('power')
      expect(result.variant).toBe('default')
    })

    it('should return outline variant for hook type', () => {
      const result = getContentTypeBadgeVariant('hook')
      expect(result.variant).toBe('outline')
    })

    it('should return outline variant for steering type', () => {
      const result = getContentTypeBadgeVariant('steering')
      expect(result.variant).toBe('outline')
    })

    it('should return secondary variant for unknown type', () => {
      const result = getContentTypeBadgeVariant('unknown')
      expect(result.variant).toBe('secondary')
    })

    it('should handle case insensitive input', () => {
      const result = getContentTypeBadgeVariant('PROMPT')
      expect(result.variant).toBe('secondary')
    })
  })

  describe('getLibraryBadgeVariant', () => {
    it('should return blue styling for promptz library', () => {
      const result = getLibraryBadgeVariant('promptz')
      expect(result.variant).toBe('outline')
      expect(result.className).toContain('border-blue-200')
      expect(result.className).toContain('text-blue-700')
    })

    it('should return purple styling for kiro-powers library', () => {
      const result = getLibraryBadgeVariant('kiro-powers')
      expect(result.variant).toBe('outline')
      expect(result.className).toContain('border-purple-200')
      expect(result.className).toContain('text-purple-700')
    })

    it('should return default outline variant for unknown library', () => {
      const result = getLibraryBadgeVariant('unknown')
      expect(result.variant).toBe('outline')
      expect(result.className).toBeUndefined()
    })

    it('should handle case insensitive input', () => {
      const result = getLibraryBadgeVariant('PROMPTZ')
      expect(result.variant).toBe('outline')
      expect(result.className).toContain('border-blue-200')
    })
  })

  describe('getBadgeArrangement', () => {
    it('should return card-header arrangement with proper classes', () => {
      const result = getBadgeArrangement('card-header')
      expect(result.containerClasses).toBe('flex flex-wrap gap-1 shrink-0')
      expect(result.badgeClasses).toBe('text-xs font-medium')
      expect(result.maxBadges).toBe(3)
    })

    it('should return card-footer arrangement with proper classes', () => {
      const result = getBadgeArrangement('card-footer')
      expect(result.containerClasses).toBe('flex gap-1')
      expect(result.badgeClasses).toBe('text-xs font-medium')
      expect(result.maxBadges).toBe(2)
    })

    it('should return list-item arrangement with proper classes', () => {
      const result = getBadgeArrangement('list-item')
      expect(result.containerClasses).toBe('flex gap-1')
      expect(result.badgeClasses).toBe('text-xs font-medium')
      expect(result.maxBadges).toBe(4)
    })
  })

  describe('getStandardBadgeClasses', () => {
    it('should return consistent badge classes', () => {
      const result = getStandardBadgeClasses()
      expect(result).toBe('text-xs font-medium')
    })
  })

  describe('getBadgeContainerClasses', () => {
    it('should return consistent container classes', () => {
      const result = getBadgeContainerClasses()
      expect(result).toBe('flex flex-wrap gap-1 shrink-0')
    })
  })

  describe('normalizeBadgeText', () => {
    it('should normalize text to lowercase and replace special characters', () => {
      const result = normalizeBadgeText('Test Badge!')
      expect(result).toBe('test-badge-')
    })

    it('should trim whitespace', () => {
      const result = normalizeBadgeText('  test  ')
      expect(result).toBe('test')
    })

    it('should handle multiple special characters', () => {
      const result = normalizeBadgeText('Test@Badge#123!')
      expect(result).toBe('test-badge-123-')
    })

    it('should preserve hyphens and alphanumeric characters', () => {
      const result = normalizeBadgeText('test-badge-123')
      expect(result).toBe('test-badge-123')
    })
  })

  describe('getBadgePriority', () => {
    it('should return highest priority for content-type badges', () => {
      const result = getBadgePriority('content-type')
      expect(result).toBe(3)
    })

    it('should return second priority for library badges', () => {
      const result = getBadgePriority('library')
      expect(result).toBe(2)
    })

    it('should return third priority for category badges', () => {
      const result = getBadgePriority('category')
      expect(result).toBe(1)
    })

    it('should return lowest priority for status badges', () => {
      const result = getBadgePriority('status')
      expect(result).toBe(0)
    })

    it('should return default priority for unknown badge types', () => {
      const result = getBadgePriority('unknown' as 'content-type' | 'library' | 'category' | 'status')
      expect(result).toBe(0)
    })
  })
})