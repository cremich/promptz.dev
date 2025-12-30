import { render, screen } from '@testing-library/react'
import AgentsPage from '@/app/agents/page'
import { getAllAgents } from '@/lib/agents'
import type { Agent } from '@/lib/types/content'

// Mock the agents service
jest.mock('@/lib/agents')
const mockGetAllAgents = getAllAgents as jest.MockedFunction<typeof getAllAgents>

// Mock the AgentsGrid component
jest.mock('@/components/agents-grid', () => ({
  AgentsGrid: ({ agents }: { agents: Agent[] }) => (
    <div data-testid="agents-grid">
      {agents.map(agent => (
        <div key={agent.id} data-testid="agent-item">
          {agent.title}
        </div>
      ))}
    </div>
  ),
  AgentsGridSkeleton: ({ count }: { count?: number }) => (
    <div data-testid="agents-grid-skeleton">
      Loading {count || 6} agents...
    </div>
  )
}))

describe('AgentsPage', () => {
  const mockAgents: Agent[] = [
    {
      type: 'agent',
      id: 'promptz/agents/test-agent-1',
      title: 'Test Agent 1',
      author: 'Test Author',
      date: '2024-01-01',
      path: '/libraries/promptz/agents/test-agent-1.md',
      description: 'A test agent',
      config: {},
      content: 'Test agent content'
    },
    {
      type: 'agent',
      id: 'promptz/agents/test-agent-2',
      title: 'Test Agent 2',
      author: 'Test Author 2',
      date: '2024-01-02',
      path: '/libraries/promptz/agents/test-agent-2.md',
      description: 'Another test agent',
      config: {},
      content: 'Another test agent content'
    }
  ]

  beforeEach(() => {
    mockGetAllAgents.mockResolvedValue(mockAgents)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render page header correctly', async () => {
    const page = await AgentsPage()
    render(page)

    expect(screen.getByText('All Custom Agents')).toBeInTheDocument()
    expect(screen.getByText(/Explore our complete collection of custom AI agents/)).toBeInTheDocument()
  })

  it('should render agents grid with all agents', async () => {
    const page = await AgentsPage()
    render(page)

    expect(screen.getByTestId('agents-grid')).toBeInTheDocument()
    expect(screen.getByText('Test Agent 1')).toBeInTheDocument()
    expect(screen.getByText('Test Agent 2')).toBeInTheDocument()
  })

  it('should have correct page structure', async () => {
    const page = await AgentsPage()
    render(page)

    // Check for main container
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for header section
    expect(screen.getByText('All Custom Agents')).toBeInTheDocument()
    
    // Check for agents section
    expect(screen.getByTestId('agents-grid')).toBeInTheDocument()
  })

  it('should call getAllAgents service', async () => {
    const page = await AgentsPage()
    render(page)

    expect(mockGetAllAgents).toHaveBeenCalledTimes(1)
  })

  it('should render empty grid when no agents available', async () => {
    mockGetAllAgents.mockResolvedValue([])
    
    const page = await AgentsPage()
    render(page)

    expect(screen.getByTestId('agents-grid')).toBeInTheDocument()
    expect(screen.queryByTestId('agent-item')).not.toBeInTheDocument()
  })
})