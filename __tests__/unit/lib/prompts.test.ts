import { getAllPrompts, getLatestPrompts } from '@/lib/prompts'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/prompts.json', () => jest.requireActual('../../../__mocks__/data/prompts.json'))

describe('Prompt utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPrompts', () => {
    it('should fetch prompts from JSON data and sort by date', async () => {
      const result = await getAllPrompts()

      expect(result).toHaveLength(3)
      // Should be sorted by date (newest first): B (2024-01-16), A (2024-01-15), C (2024-01-14)
      expect(result[0].id).toBe('prompt-b')
      expect(result[1].id).toBe('prompt-a')
      expect(result[2].id).toBe('prompt-c')
    })

    it('should return empty array when JSON processing fails', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/prompts.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getAllPrompts: getAllPromptsWithError } = await import('@/lib/prompts')
      
      const result = await getAllPromptsWithError()

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching prompts:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('getLatestPrompts', () => {
    it('should return all prompts when no limit is specified', async () => {
      const result = await getLatestPrompts()

      expect(result).toHaveLength(3)
    })

    it('should limit results when limit is specified', async () => {
      const result = await getLatestPrompts(2)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('prompt-b')
      expect(result[1].id).toBe('prompt-a')
    })

    it('should return all prompts when limit is larger than available prompts', async () => {
      const result = await getLatestPrompts(10)

      expect(result).toHaveLength(3)
    })

    it('should handle zero or negative limits gracefully', async () => {
      const resultZero = await getLatestPrompts(0)
      const resultNegative = await getLatestPrompts(-1)

      expect(resultZero).toHaveLength(3) // Should return all when limit is 0
      expect(resultNegative).toHaveLength(3) // Should return all when limit is negative
    })

    it('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/prompts.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getLatestPrompts: getLatestPromptsWithError } = await import('@/lib/prompts')

      const result = await getLatestPromptsWithError(5)

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching prompts:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})