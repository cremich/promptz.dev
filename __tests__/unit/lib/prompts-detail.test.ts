import { getPromptById } from '@/lib/prompts'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/prompts.json', () => jest.requireActual('../../../__mocks__/data/prompts.json'))

describe('getPromptById', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return the correct prompt when found', async () => {
    const result = await getPromptById('prompt-a')

    expect(result).toEqual({
      type: 'prompt',
      id: 'prompt-a',
      title: 'Prompt A',
      author: 'Author A',
      date: '2024-01-15',
      path: 'libraries/promptz/prompts/a.md',
      content: 'Content A',
      git: {
        author: 'Git Author A',
        authorEmail: 'a@example.com',
        createdDate: '2024-01-15T10:00:00Z',
        lastModifiedDate: '2024-01-15T10:00:00Z',
        commitHash: 'abc123',
        commitMessage: 'Add prompt A'
      }
    })
  })

  test('should return null when prompt is not found', async () => {
    const result = await getPromptById('nonexistent-prompt')

    expect(result).toBeNull()
  })

  test('should return null when service throws an error', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the JSON data to be invalid
    jest.doMock('@/data/prompts.json', () => null)
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getPromptById: getPromptByIdWithError } = await import('@/lib/prompts')

    const result = await getPromptByIdWithError('prompt-a')

    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching prompts:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  test('should handle empty prompts array', async () => {
    // Mock empty array
    jest.doMock('@/data/prompts.json', () => [])
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getPromptById: getPromptByIdEmpty } = await import('@/lib/prompts')

    const result = await getPromptByIdEmpty('prompt-a')

    expect(result).toBeNull()
  })
})