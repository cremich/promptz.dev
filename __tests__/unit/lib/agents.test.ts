import { getAllAgents, getLatestAgents } from '@/lib/agents'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/agents.json', () => jest.requireActual('../../../__mocks__/data/agents.json'))

describe('agents service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllAgents', () => {
    test('should return all agents sorted by creation date (newest first)', async () => {
      const result = await getAllAgents()

      expect(result).toHaveLength(2)
      // Should be sorted by git creation date (newest first): agent-2 (2024-01-16), agent-1 (2024-01-15)
      expect(result[0].id).toBe('agent-2')
      expect(result[1].id).toBe('agent-1')
    })

    test('should return empty array when JSON processing fails', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/agents.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getAllAgents: getAllAgentsWithError } = await import('@/lib/agents')
      
      const result = await getAllAgentsWithError()

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching agents:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    test('should sort agents using git creation date when available', async () => {
      const result = await getAllAgents()

      expect(result).toHaveLength(2)
      // Verify git dates are used for sorting
      expect(result[0].git?.createdDate).toBe('2024-01-16T10:00:00Z')
      expect(result[1].git?.createdDate).toBe('2024-01-15T10:00:00Z')
    })
  })

  describe('getLatestAgents', () => {
    test('should return all agents when no limit specified', async () => {
      const result = await getLatestAgents()

      expect(result).toHaveLength(2)
    })

    test('should return limited number of agents when limit specified', async () => {
      const result = await getLatestAgents(1)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('agent-2') // Should be the newest
    })

    test('should return all agents when limit is larger than available agents', async () => {
      const result = await getLatestAgents(10)

      expect(result).toHaveLength(2)
    })

    test('should return empty array when limit is 0', async () => {
      const result = await getLatestAgents(0)

      expect(result).toEqual([])
    })

    test('should return empty array when limit is negative', async () => {
      const result = await getLatestAgents(-1)

      expect(result).toEqual([])
    })

    test('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the JSON data to be invalid
      jest.doMock('@/data/agents.json', () => null)
      
      // Re-import the module to get the new mock
      jest.resetModules()
      const { getLatestAgents: getLatestAgentsWithError } = await import('@/lib/agents')

      const result = await getLatestAgentsWithError(5)

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching agents:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})