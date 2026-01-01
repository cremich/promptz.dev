import { getAllPowers, getLatestPowers } from '@/lib/powers'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/powers.json', () => jest.requireActual('../../../__mocks__/data/powers.json'))

describe('Powers Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPowers', () => {
    test('should fetch powers from JSON data and sort by date', async () => {
      const result = await getAllPowers()

      expect(result).toHaveLength(2)
      // Should be sorted by git creation date (newest first): kiro-power (2024-01-20), promptz-power (2024-01-15)
      expect(result[0].id).toBe('kiro-power')
      expect(result[1].id).toBe('promptz-power')
    })

    test('should sort powers by creation date (newest first)', async () => {
      const result = await getAllPowers()

      expect(result).toHaveLength(2)
      // Verify git dates are used for sorting
      expect(result[0].git?.createdDate).toBe('2024-01-20T10:00:00Z')
      expect(result[1].git?.createdDate).toBe('2024-01-15T10:00:00Z')
    })

    test('should return empty array when JSON processing fails', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/powers.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getAllPowers: getAllPowersWithError } = await import('@/lib/powers')
      
      const result = await getAllPowersWithError()

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching powers:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('getLatestPowers', () => {
    test('should return all powers when no limit is specified', async () => {
      const result = await getLatestPowers()

      expect(result).toHaveLength(2)
    })

    test('should return all powers when limit is undefined', async () => {
      const result = await getLatestPowers(undefined)

      expect(result).toHaveLength(2)
    })

    test('should limit results when limit is specified', async () => {
      const result = await getLatestPowers(1)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('kiro-power') // Should be the newest
    })

    test('should handle limit larger than available powers', async () => {
      const result = await getLatestPowers(10)

      expect(result).toHaveLength(2)
    })

    test('should handle limit of 0', async () => {
      const result = await getLatestPowers(0)

      expect(result).toHaveLength(2) // Returns all when limit is 0
    })

    test('should handle negative limit', async () => {
      const result = await getLatestPowers(-1)

      expect(result).toHaveLength(2) // Returns all when limit is negative
    })

    test('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/powers.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getLatestPowers: getLatestPowersWithError } = await import('@/lib/powers')

      const result = await getLatestPowersWithError(5)

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching powers:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})