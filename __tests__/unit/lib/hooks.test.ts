import { getAllHooks, getLatestHooks } from '@/lib/hooks'
import { readPromptzLibrary } from '@/lib/content-service'
import type { Hook, Library } from '@/lib/types/content'

// Mock the content service
jest.mock('@/lib/content-service')
const mockReadPromptzLibrary = readPromptzLibrary as jest.MockedFunction<typeof readPromptzLibrary>

// Mock the date formatter
jest.mock('@/lib/utils/date-formatter', () => ({
  compareDatesNewestFirst: jest.fn((a: string, b: string) => {
    // Simple date comparison for testing
    return new Date(b).getTime() - new Date(a).getTime()
  })
}))

const mockHooks: Hook[] = [
  {
    type: 'hook',
    id: 'promptz/hooks/hook-1',
    title: 'Test Hook 1',
    author: 'Author 1',
    date: '2024-01-15',
    path: '/libraries/promptz/hooks/hook-1.kiro.hook',
    description: 'Test hook 1 description',
    content: 'Hook 1 content',
    trigger: 'userTriggered',
    git: {
      author: 'Git Author 1',
      authorEmail: 'git1@example.com',
      createdDate: '2024-01-15T10:00:00Z',
      lastModifiedDate: '2024-01-16T10:00:00Z',
      commitHash: 'abc123',
      commitMessage: 'Add hook 1'
    }
  },
  {
    type: 'hook',
    id: 'promptz/hooks/hook-2',
    title: 'Test Hook 2',
    author: 'Author 2',
    date: '2024-01-14',
    path: '/libraries/promptz/hooks/hook-2.kiro.hook',
    description: 'Test hook 2 description',
    content: 'Hook 2 content',
    trigger: 'onFileSave'
  },
  {
    type: 'hook',
    id: 'promptz/hooks/hook-3',
    title: 'Test Hook 3',
    author: 'Author 3',
    date: '2024-01-13',
    path: '/libraries/promptz/hooks/hook-3.kiro.hook',
    description: 'Test hook 3 description',
    content: 'Hook 3 content'
  }
]

const mockLibrary: Library = {
  name: 'promptz',
  path: '/libraries/promptz',
  prompts: [],
  agents: [],
  powers: [],
  steering: [],
  hooks: mockHooks
}

describe('getAllHooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return all hooks from promptz library', async () => {
    mockReadPromptzLibrary.mockResolvedValue(mockLibrary)

    const result = await getAllHooks()

    expect(result).toEqual(mockHooks)
    expect(mockReadPromptzLibrary).toHaveBeenCalledTimes(1)
  })

  it('should return hooks sorted by creation date (newest first)', async () => {
    const unsortedHooks = [...mockHooks].reverse() // Reverse to test sorting
    const libraryWithUnsortedHooks = {
      ...mockLibrary,
      hooks: unsortedHooks
    }
    
    mockReadPromptzLibrary.mockResolvedValue(libraryWithUnsortedHooks)

    const result = await getAllHooks()

    // Should be sorted by date (newest first)
    expect(result[0].date).toBe('2024-01-15')
    expect(result[1].date).toBe('2024-01-14')
    expect(result[2].date).toBe('2024-01-13')
  })

  it('should return empty array when library has no hooks', async () => {
    const emptyLibrary = {
      ...mockLibrary,
      hooks: []
    }
    mockReadPromptzLibrary.mockResolvedValue(emptyLibrary)

    const result = await getAllHooks()

    expect(result).toEqual([])
  })

  it('should handle errors gracefully and return empty array', async () => {
    mockReadPromptzLibrary.mockRejectedValue(new Error('Library error'))

    const result = await getAllHooks()

    expect(result).toEqual([])
    expect(console.error).toHaveBeenCalledWith('Error fetching hooks:', expect.any(Error))
  })

  it('should use git creation date for sorting when available', async () => {
    const hooksWithGitDates = [
      {
        ...mockHooks[0],
        git: {
          ...mockHooks[0].git!,
          createdDate: '2024-01-20T10:00:00Z'
        }
      },
      mockHooks[1], // No git info, uses frontmatter date
      mockHooks[2]
    ]
    
    const libraryWithGitDates = {
      ...mockLibrary,
      hooks: hooksWithGitDates
    }
    
    mockReadPromptzLibrary.mockResolvedValue(libraryWithGitDates)

    const result = await getAllHooks()

    // Hook with git date (2024-01-20) should be first
    expect(result[0].id).toBe('promptz/hooks/hook-1')
  })
})

describe('getLatestHooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return all hooks when no limit specified', async () => {
    mockReadPromptzLibrary.mockResolvedValue(mockLibrary)

    const result = await getLatestHooks()

    expect(result).toEqual(mockHooks)
    expect(result).toHaveLength(3)
  })

  it('should return limited number of hooks when limit specified', async () => {
    mockReadPromptzLibrary.mockResolvedValue(mockLibrary)

    const result = await getLatestHooks(2)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(mockHooks[0])
    expect(result[1]).toEqual(mockHooks[1])
  })

  it('should return all hooks when limit is larger than available hooks', async () => {
    mockReadPromptzLibrary.mockResolvedValue(mockLibrary)

    const result = await getLatestHooks(10)

    expect(result).toEqual(mockHooks)
    expect(result).toHaveLength(3)
  })

  it('should return empty array when limit is 0', async () => {
    mockReadPromptzLibrary.mockResolvedValue(mockLibrary)

    const result = await getLatestHooks(0)

    expect(result).toEqual([])
  })

  it('should return empty array when limit is negative', async () => {
    mockReadPromptzLibrary.mockResolvedValue(mockLibrary)

    const result = await getLatestHooks(-1)

    expect(result).toEqual([])
  })

  it('should handle errors gracefully and return empty array', async () => {
    mockReadPromptzLibrary.mockRejectedValue(new Error('Error'))

    const result = await getLatestHooks(5)

    expect(result).toEqual([])
    expect(console.error).toHaveBeenCalledWith('Error fetching hooks:', expect.any(Error))
  })

  it('should return empty array when no hooks available', async () => {
    const emptyLibrary = {
      ...mockLibrary,
      hooks: []
    }
    mockReadPromptzLibrary.mockResolvedValue(emptyLibrary)

    const result = await getLatestHooks(5)

    expect(result).toEqual([])
  })
})