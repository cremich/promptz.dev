import { getAllAgents, getLatestAgents } from '@/lib/agents'
import { readPromptzLibrary } from '@/lib/content-service'
import type { Agent, Library } from '@/lib/types/content'

// Mock the content service
jest.mock('@/lib/content-service')
const mockReadPromptzLibrary = readPromptzLibrary as jest.MockedFunction<typeof readPromptzLibrary>

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('agents service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  const mockAgent1: Agent = {
    type: 'agent',
    id: 'promptz/agents/test-agent-1',
    title: 'Test Agent 1',
    author: 'Test Author',
    date: '2024-01-01',
    path: '/libraries/promptz/agents/test-agent-1.md',
    description: 'A test agent',
    config: {},
    content: 'Test agent content',
    git: {
      author: 'Git Author',
      authorEmail: 'git@example.com',
      createdDate: '2024-01-02T10:00:00Z',
      lastModifiedDate: '2024-01-02T10:00:00Z',
      commitHash: 'abc123',
      commitMessage: 'Add test agent'
    }
  }

  const mockAgent2: Agent = {
    type: 'agent',
    id: 'promptz/agents/test-agent-2',
    title: 'Test Agent 2',
    author: 'Test Author 2',
    date: '2024-01-03',
    path: '/libraries/promptz/agents/test-agent-2.md',
    description: 'Another test agent',
    config: {},
    content: 'Another test agent content'
  }

  const mockLibrary: Library = {
    name: 'promptz',
    path: '/libraries/promptz',
    prompts: [],
    agents: [mockAgent1, mockAgent2],
    powers: [],
    steering: [],
    hooks: []
  }

  describe('getAllAgents', () => {
    it('should return all agents sorted by creation date (newest first)', async () => {
      mockReadPromptzLibrary.mockResolvedValue(mockLibrary)

      const result = await getAllAgents()

      expect(result).toHaveLength(2)
      expect(result[0]).toBe(mockAgent2) // No git date, uses frontmatter date (2024-01-03)
      expect(result[1]).toBe(mockAgent1) // Has git date (2024-01-02)
    })

    it('should return empty array when library has no agents', async () => {
      const emptyLibrary: Library = {
        ...mockLibrary,
        agents: []
      }
      mockReadPromptzLibrary.mockResolvedValue(emptyLibrary)

      const result = await getAllAgents()

      expect(result).toEqual([])
    })

    it('should return empty array and log error when content service fails', async () => {
      const error = new Error('Content service failed')
      mockReadPromptzLibrary.mockRejectedValue(error)

      const result = await getAllAgents()

      expect(result).toEqual([])
      expect(mockConsoleError).toHaveBeenCalledWith('Error fetching agents:', error)
    })

    it('should sort agents using git creation date when available', async () => {
      const agentWithOlderGitDate: Agent = {
        ...mockAgent2,
        git: {
          author: 'Git Author',
          authorEmail: 'git@example.com',
          createdDate: '2024-01-01T10:00:00Z',
          lastModifiedDate: '2024-01-01T10:00:00Z',
          commitHash: 'def456',
          commitMessage: 'Add another test agent'
        }
      }

      const libraryWithGitDates: Library = {
        ...mockLibrary,
        agents: [mockAgent1, agentWithOlderGitDate]
      }
      mockReadPromptzLibrary.mockResolvedValue(libraryWithGitDates)

      const result = await getAllAgents()

      expect(result).toHaveLength(2)
      expect(result[0]).toBe(mockAgent1) // 2024-01-02 (newer)
      expect(result[1]).toBe(agentWithOlderGitDate) // 2024-01-01 (older)
    })
  })

  describe('getLatestAgents', () => {
    beforeEach(() => {
      mockReadPromptzLibrary.mockResolvedValue(mockLibrary)
    })

    it('should return all agents when no limit specified', async () => {
      const result = await getLatestAgents()

      expect(result).toHaveLength(2)
      expect(result[0]).toBe(mockAgent2)
      expect(result[1]).toBe(mockAgent1)
    })

    it('should return limited number of agents when limit specified', async () => {
      const result = await getLatestAgents(1)

      expect(result).toHaveLength(1)
      expect(result[0]).toBe(mockAgent2)
    })

    it('should return all agents when limit is larger than available agents', async () => {
      const result = await getLatestAgents(10)

      expect(result).toHaveLength(2)
      expect(result[0]).toBe(mockAgent2)
      expect(result[1]).toBe(mockAgent1)
    })

    it('should return empty array when limit is 0', async () => {
      const result = await getLatestAgents(0)

      expect(result).toEqual([])
    })

    it('should return empty array when limit is negative', async () => {
      const result = await getLatestAgents(-1)

      expect(result).toEqual([])
    })

    it('should return empty array and log error when content service fails', async () => {
      const error = new Error('Content service failed')
      mockReadPromptzLibrary.mockRejectedValue(error)

      const result = await getLatestAgents(5)

      expect(result).toEqual([])
      expect(mockConsoleError).toHaveBeenCalledWith('Error fetching agents:', error)
    })
  })
})