import { getAllPowers, getLatestPowers } from '@/lib/powers'
import type { Power, Library } from '@/lib/types/content'

// Mock the content service
jest.mock('@/lib/content-service', () => ({
  readPromptzLibrary: jest.fn(),
  readKiroLibrary: jest.fn()
}))

// Mock the date formatter
jest.mock('@/lib/utils/date-formatter', () => ({
  compareDatesNewestFirst: jest.fn((a: string, b: string) => {
    // Simple date comparison for testing
    return new Date(b).getTime() - new Date(a).getTime()
  })
}))

import { readPromptzLibrary, readKiroLibrary } from '@/lib/content-service'

const mockReadPromptzLibrary = readPromptzLibrary as jest.MockedFunction<typeof readPromptzLibrary>
const mockReadKiroLibrary = readKiroLibrary as jest.MockedFunction<typeof readKiroLibrary>

describe('Powers Service', () => {
  const mockPromptzPower: Power = {
    id: 'promptz-power',
    title: 'Promptz Power',
    displayName: 'Promptz Test Power',
    author: 'Promptz Author',
    date: '2024-01-15',
    path: 'libraries/promptz/powers/test/POWER.md',
    type: 'power',
    description: 'A power from promptz library',
    keywords: ['promptz', 'test'],
    content: 'Promptz power content',
    git: {
      author: 'Git Author',
      authorEmail: 'git@example.com',
      createdDate: '2024-01-15T10:00:00Z',
      lastModifiedDate: '2024-01-16T10:00:00Z',
      commitHash: 'abc123',
      commitMessage: 'Add promptz power'
    }
  }

  const mockKiroPower: Power = {
    id: 'kiro-power',
    title: 'Kiro Power',
    displayName: 'Kiro Test Power',
    author: 'Kiro Author',
    date: '2024-01-16',
    path: 'libraries/kiro-powers/stripe/POWER.md',
    type: 'power',
    description: 'A power from kiro-powers library',
    keywords: ['kiro', 'stripe'],
    content: 'Kiro power content',
    git: {
      author: 'Git Author 2',
      authorEmail: 'git2@example.com',
      createdDate: '2024-01-16T10:00:00Z',
      lastModifiedDate: '2024-01-17T10:00:00Z',
      commitHash: 'def456',
      commitMessage: 'Add kiro power'
    }
  }

  const mockPromptzLibrary: Library = {
    name: 'promptz',
    path: 'libraries/promptz',
    prompts: [],
    agents: [],
    powers: [mockPromptzPower],
    steering: [],
    hooks: []
  }

  const mockKiroLibrary: Library = {
    name: 'kiro-powers',
    path: 'libraries/kiro-powers',
    prompts: [],
    agents: [],
    powers: [mockKiroPower],
    steering: [],
    hooks: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPowers', () => {
    it('should fetch and combine powers from both libraries', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockResolvedValue(mockKiroLibrary)

      const result = await getAllPowers()

      expect(mockReadPromptzLibrary).toHaveBeenCalledTimes(1)
      expect(mockReadKiroLibrary).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(2)
      expect(result).toContain(mockPromptzPower)
      expect(result).toContain(mockKiroPower)
    })

    it('should sort powers by creation date (newest first)', async () => {
      const olderPower: Power = {
        ...mockPromptzPower,
        git: {
          ...mockPromptzPower.git!,
          createdDate: '2024-01-10T10:00:00Z'
        }
      }

      const newerPower: Power = {
        ...mockKiroPower,
        git: {
          ...mockKiroPower.git!,
          createdDate: '2024-01-20T10:00:00Z'
        }
      }

      mockReadPromptzLibrary.mockResolvedValue({
        ...mockPromptzLibrary,
        powers: [olderPower]
      })
      mockReadKiroLibrary.mockResolvedValue({
        ...mockKiroLibrary,
        powers: [newerPower]
      })

      const result = await getAllPowers()

      expect(result[0]).toBe(newerPower)
      expect(result[1]).toBe(olderPower)
    })

    it('should use frontmatter date when git date is not available', async () => {
      const powerWithoutGit: Power = {
        ...mockPromptzPower,
        date: '2024-01-20',
        git: undefined
      }

      mockReadPromptzLibrary.mockResolvedValue({
        ...mockPromptzLibrary,
        powers: [powerWithoutGit]
      })
      mockReadKiroLibrary.mockResolvedValue({
        ...mockKiroLibrary,
        powers: [mockKiroPower]
      })

      const result = await getAllPowers()

      expect(result).toHaveLength(2)
      expect(result).toContain(powerWithoutGit)
      expect(result).toContain(mockKiroPower)
    })

    it('should handle empty libraries gracefully', async () => {
      mockReadPromptzLibrary.mockResolvedValue({
        ...mockPromptzLibrary,
        powers: []
      })
      mockReadKiroLibrary.mockResolvedValue({
        ...mockKiroLibrary,
        powers: []
      })

      const result = await getAllPowers()

      expect(result).toHaveLength(0)
    })

    it('should return empty array when libraries fail to load', async () => {
      mockReadPromptzLibrary.mockRejectedValue(new Error('Failed to read promptz'))
      mockReadKiroLibrary.mockRejectedValue(new Error('Failed to read kiro'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = await getAllPowers()

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching powers:', expect.any(Error))

      consoleSpy.mockRestore()
    })

    it('should handle partial library failures', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockRejectedValue(new Error('Failed to read kiro'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = await getAllPowers()

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching powers:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('getLatestPowers', () => {
    beforeEach(() => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockResolvedValue(mockKiroLibrary)
    })

    it('should return all powers when no limit is specified', async () => {
      const result = await getLatestPowers()

      expect(result).toHaveLength(2)
      expect(result).toContain(mockPromptzPower)
      expect(result).toContain(mockKiroPower)
    })

    it('should return all powers when limit is undefined', async () => {
      const result = await getLatestPowers(undefined)

      expect(result).toHaveLength(2)
    })

    it('should limit results when limit is specified', async () => {
      const result = await getLatestPowers(1)

      expect(result).toHaveLength(1)
    })

    it('should handle limit larger than available powers', async () => {
      const result = await getLatestPowers(10)

      expect(result).toHaveLength(2)
    })

    it('should handle limit of 0', async () => {
      const result = await getLatestPowers(0)

      expect(result).toHaveLength(2) // Returns all when limit is 0
    })

    it('should handle negative limit', async () => {
      const result = await getLatestPowers(-1)

      expect(result).toHaveLength(2) // Returns all when limit is negative
    })

    it('should return empty array when getAllPowers fails', async () => {
      mockReadPromptzLibrary.mockRejectedValue(new Error('Failed to read'))
      mockReadKiroLibrary.mockRejectedValue(new Error('Failed to read'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = await getLatestPowers(5)

      expect(result).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching powers:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})