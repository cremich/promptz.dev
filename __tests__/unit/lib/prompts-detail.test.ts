import { getPromptById } from '@/lib/prompts'
import { readPromptzLibrary } from '@/lib/content-service'
import type { Prompt } from '@/lib/types/content'

// Mock the content service
jest.mock('@/lib/content-service')

const mockReadPromptzLibrary = readPromptzLibrary as jest.MockedFunction<typeof readPromptzLibrary>

describe('getPromptById', () => {
  const mockPrompts: Prompt[] = [
    {
      id: 'promptz/prompts/test-prompt',
      type: 'prompt',
      title: 'Test Prompt',
      author: 'Test Author',
      date: '2024-01-15',
      path: '/libraries/promptz/prompts/test-prompt.md',
      content: 'This is a test prompt content',
      category: 'testing'
    },
    {
      id: 'promptz/prompts/another-prompt',
      type: 'prompt',
      title: 'Another Prompt',
      author: 'Another Author',
      date: '2024-01-10',
      path: '/libraries/promptz/prompts/another-prompt.md',
      content: 'This is another test prompt content'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the correct prompt when found', async () => {
    mockReadPromptzLibrary.mockResolvedValue({
      name: 'promptz',
      path: '/libraries/promptz',
      prompts: mockPrompts,
      agents: [],
      powers: [],
      steering: [],
      hooks: []
    })

    const result = await getPromptById('promptz/prompts/test-prompt')

    expect(result).toEqual(mockPrompts[0])
  })

  it('should return null when prompt is not found', async () => {
    mockReadPromptzLibrary.mockResolvedValue({
      name: 'promptz',
      path: '/libraries/promptz',
      prompts: mockPrompts,
      agents: [],
      powers: [],
      steering: [],
      hooks: []
    })

    const result = await getPromptById('promptz/prompts/nonexistent-prompt')

    expect(result).toBeNull()
  })

  it('should return null when service throws an error', async () => {
    mockReadPromptzLibrary.mockRejectedValue(new Error('Service error'))

    const result = await getPromptById('promptz/prompts/test-prompt')

    expect(result).toBeNull()
  })

  it('should handle empty prompts array', async () => {
    mockReadPromptzLibrary.mockResolvedValue({
      name: 'promptz',
      path: '/libraries/promptz',
      prompts: [],
      agents: [],
      powers: [],
      steering: [],
      hooks: []
    })

    const result = await getPromptById('promptz/prompts/test-prompt')

    expect(result).toBeNull()
  })
})