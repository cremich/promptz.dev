import { getAllPrompts, getLatestPrompts } from '@/lib/prompts'
import { readPromptzLibrary } from '@/lib/content-service'
import type { Prompt, Library } from '@/lib/types/content'

// Mock the content service functions
jest.mock('@/lib/content-service', () => ({
  readPromptzLibrary: jest.fn()
}))

const mockReadPromptzLibrary = readPromptzLibrary as jest.MockedFunction<typeof readPromptzLibrary>

describe('Prompt utilities', () => {
  const mockPromptA: Prompt = {
    id: 'prompt-a',
    title: 'Prompt A',
    author: 'Author A',
    date: '2024-01-15',
    path: 'libraries/promptz/prompts/a.md',
    type: 'prompt',
    content: 'Content A',
    git: {
      author: 'Git Author A',
      authorEmail: 'a@example.com',
      createdDate: '2024-01-15T10:00:00Z',
      lastModifiedDate: '2024-01-15T10:00:00Z',
      commitHash: 'abc123',
      commitMessage: 'Add prompt A'
    }
  }

  const mockPromptB: Prompt = {
    id: 'prompt-b',
    title: 'Prompt B',
    author: 'Author B',
    date: '2024-01-16',
    path: 'libraries/promptz/prompts/b.md',
    type: 'prompt',
    content: 'Content B',
    git: {
      author: 'Git Author B',
      authorEmail: 'b@example.com',
      createdDate: '2024-01-16T10:00:00Z',
      lastModifiedDate: '2024-01-16T10:00:00Z',
      commitHash: 'def456',
      commitMessage: 'Add prompt B'
    }
  }

  const mockPromptC: Prompt = {
    id: 'prompt-c',
    title: 'Prompt C',
    author: 'Author C',
    date: '2024-01-14',
    path: 'libraries/promptz/prompts/c.md',
    type: 'prompt',
    content: 'Content C'
    // No git info - should use frontmatter date
  }

  const mockPromptzLibrary: Library = {
    name: 'promptz',
    path: 'libraries/promptz',
    prompts: [mockPromptA, mockPromptB, mockPromptC],
    agents: [],
    powers: [],
    steering: [],
    hooks: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllPrompts', () => {
    it('should fetch prompts from promptz library and sort by date', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)

      const result = await getAllPrompts()

      expect(result).toHaveLength(3)
      // Should be sorted by date (newest first): B (2024-01-16), A (2024-01-15), C (2024-01-14)
      expect(result[0].id).toBe('prompt-b')
      expect(result[1].id).toBe('prompt-a')
      expect(result[2].id).toBe('prompt-c')
    })

    it('should return empty array when promptz library fails', async () => {
      mockReadPromptzLibrary.mockRejectedValue(new Error('Promptz library error'))

      const result = await getAllPrompts()

      expect(result).toHaveLength(0)
    })
  })

  describe('getLatestPrompts', () => {
    beforeEach(() => {
      mockReadPromptzLibrary.mockResolvedValue(mockPromptzLibrary)
    })

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
      mockReadPromptzLibrary.mockRejectedValue(new Error('Error'))

      const result = await getLatestPrompts(5)

      expect(result).toHaveLength(0)
    })
  })
})