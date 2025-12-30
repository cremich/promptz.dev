import { getAllSteering, getLatestSteering } from '@/lib/steering'
import { readPromptzLibrary, readKiroLibrary } from '@/lib/content-service'
import type { SteeringDocument, Library } from '@/lib/types/content'

// Mock the content service functions
jest.mock('@/lib/content-service', () => ({
  readPromptzLibrary: jest.fn(),
  readKiroLibrary: jest.fn()
}))

const mockReadPromptzLibrary = readPromptzLibrary as jest.MockedFunction<typeof readPromptzLibrary>
const mockReadKiroLibrary = readKiroLibrary as jest.MockedFunction<typeof readKiroLibrary>

describe('Steering utilities', () => {
  const mockSteeringA: SteeringDocument = {
    id: 'steering-a',
    title: 'Steering A',
    author: 'Author A',
    date: '2024-01-15',
    path: 'libraries/promptz/steering/a.md',
    type: 'steering',
    content: 'Steering content A',
    git: {
      author: 'Git Author A',
      authorEmail: 'a@example.com',
      createdDate: '2024-01-15T10:00:00Z',
      lastModifiedDate: '2024-01-15T10:00:00Z',
      commitHash: 'abc123',
      commitMessage: 'Add steering A'
    }
  }

  const mockSteeringB: SteeringDocument = {
    id: 'steering-b',
    title: 'Steering B',
    author: 'Author B',
    date: '2024-01-16',
    path: 'libraries/kiro-powers/steering/b.md',
    type: 'steering',
    content: 'Steering content B',
    git: {
      author: 'Git Author B',
      authorEmail: 'b@example.com',
      createdDate: '2024-01-16T10:00:00Z',
      lastModifiedDate: '2024-01-16T10:00:00Z',
      commitHash: 'def456',
      commitMessage: 'Add steering B'
    }
  }

  const mockSteeringC: SteeringDocument = {
    id: 'steering-c',
    title: 'Steering C',
    author: 'Author C',
    date: '2024-01-14',
    path: 'libraries/promptz/steering/c.md',
    type: 'steering',
    content: 'Steering content C'
    // No git info - should use frontmatter date
  }

  const mockPromptzLibrary: Library = {
    name: 'promptz',
    path: 'libraries/promptz',
    prompts: [],
    agents: [],
    powers: [],
    steering: [mockSteeringA, mockSteeringC],
    hooks: []
  }

  const mockKiroLibrary: Library = {
    name: 'kiro-powers',
    path: 'libraries/kiro-powers',
    prompts: [],
    agents: [],
    powers: [],
    steering: [mockSteeringB],
    hooks: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllSteering', () => {
    it('should fetch steering documents from both libraries and sort by date', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockResolvedValue(mockKiroLibrary)

      const result = await getAllSteering()

      expect(result).toHaveLength(3)
      // Should be sorted by date (newest first): B (2024-01-16), A (2024-01-15), C (2024-01-14)
      expect(result[0].id).toBe('steering-b')
      expect(result[1].id).toBe('steering-a')
      expect(result[2].id).toBe('steering-c')
    })

    it('should combine steering documents from all libraries', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockResolvedValue(mockKiroLibrary)

      const result = await getAllSteering()

      // Should include documents from both libraries
      const promptzDocs = result.filter(doc => doc.path.includes('promptz'))
      const kiroDocs = result.filter(doc => doc.path.includes('kiro-powers'))
      
      expect(promptzDocs).toHaveLength(2)
      expect(kiroDocs).toHaveLength(1)
    })

    it('should use git creation date for sorting when available', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockResolvedValue(mockKiroLibrary)

      const result = await getAllSteering()

      // Verify git dates are used for sorting
      expect(result[0].git?.createdDate).toBe('2024-01-16T10:00:00Z')
      expect(result[1].git?.createdDate).toBe('2024-01-15T10:00:00Z')
    })

    it('should fall back to frontmatter date when git info is not available', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockResolvedValue(mockKiroLibrary)

      const result = await getAllSteering()

      // Document C has no git info, should use frontmatter date
      const docC = result.find(doc => doc.id === 'steering-c')
      expect(docC?.git).toBeUndefined()
      expect(docC?.date).toBe('2024-01-14')
    })

    it('should return empty array when both libraries fail', async () => {
      mockReadPromptzLibrary.mockRejectedValue(new Error('Promptz library error'))
      mockReadKiroLibrary.mockRejectedValue(new Error('Kiro library error'))

      const result = await getAllSteering()

      expect(result).toHaveLength(0)
    })

    it('should handle partial library failures gracefully', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockRejectedValue(new Error('Kiro library error'))

      const result = await getAllSteering()

      // Should still return promptz documents
      expect(result).toHaveLength(2)
      expect(result.every(doc => doc.path.includes('promptz'))).toBe(true)
    })

    it('should handle empty libraries', async () => {
      const emptyPromptzLibrary: Library = {
        ...mockPromptzLibrary,
        steering: []
      }
      const emptyKiroLibrary: Library = {
        ...mockKiroLibrary,
        steering: []
      }

      mockReadPromptzLibrary.mockResolvedValue(emptyPromptzLibrary)
      mockReadKiroLibrary.mockResolvedValue(emptyKiroLibrary)

      const result = await getAllSteering()

      expect(result).toHaveLength(0)
    })
  })

  describe('getLatestSteering', () => {
    beforeEach(() => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
      mockReadKiroLibrary.mockResolvedValue(mockKiroLibrary)
    })

    it('should return all steering documents when no limit is specified', async () => {
      const result = await getLatestSteering()

      expect(result).toHaveLength(3)
    })

    it('should limit results when limit is specified', async () => {
      const result = await getLatestSteering(2)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('steering-b')
      expect(result[1].id).toBe('steering-a')
    })

    it('should return all steering documents when limit is larger than available', async () => {
      const result = await getLatestSteering(10)

      expect(result).toHaveLength(3)
    })

    it('should handle zero or negative limits gracefully', async () => {
      const resultZero = await getLatestSteering(0)
      const resultNegative = await getLatestSteering(-1)

      expect(resultZero).toHaveLength(3) // Should return all when limit is 0
      expect(resultNegative).toHaveLength(3) // Should return all when limit is negative
    })

    it('should maintain sorting order when limiting results', async () => {
      const result = await getLatestSteering(1)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('steering-b') // Should be the newest
    })

    it('should handle errors gracefully', async () => {
      mockReadPromptzLibrary.mockRejectedValue(new Error('Error'))
      mockReadKiroLibrary.mockRejectedValue(new Error('Error'))

      const result = await getLatestSteering(5)

      expect(result).toHaveLength(0)
    })
  })
})