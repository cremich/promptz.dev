import { render, screen } from '@testing-library/react'
import { AgentsGrid, AgentsGridSkeleton } from '@/components/agents-grid'
import type { Agent } from '@/lib/types/content'

// Mock the AgentCard component
jest.mock('@/components/agent-card', () => ({
  AgentCard: ({ agent, className }: { agent: Agent; className?: string }) => (
    <div data-testid="agent-card" className={className}>
      {agent.title}
    </div>
  ),
  AgentCardSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="agent-card-skeleton" className={className}>
      Skeleton
    </div>
  )
}))

describe('AgentsGrid', () => {
  const mockAgents: Agent[] = [
    {
      type: 'agent',
      id: 'promptz/agents/agent-1',
      title: 'Agent 1',
      author: 'Author 1',
      date: '2024-01-01',
      path: '/libraries/promptz/agents/agent-1.md',
      description: 'First test agent',
      config: {},
      content: 'Content 1'
    },
    {
      type: 'agent',
      id: 'promptz/agents/agent-2',
      title: 'Agent 2',
      author: 'Author 2',
      date: '2024-01-02',
      path: '/libraries/promptz/agents/agent-2.md',
      description: 'Second test agent',
      config: {},
      content: 'Content 2'
    },
    {
      type: 'agent',
      id: 'promptz/agents/agent-3',
      title: 'Agent 3',
      author: 'Author 3',
      date: '2024-01-03',
      path: '/libraries/promptz/agents/agent-3.md',
      description: 'Third test agent',
      config: {},
      content: 'Content 3'
    }
  ]

  it('should render all agents when no maxItems specified', () => {
    render(<AgentsGrid agents={mockAgents} />)

    expect(screen.getByText('Agent 1')).toBeInTheDocument()
    expect(screen.getByText('Agent 2')).toBeInTheDocument()
    expect(screen.getByText('Agent 3')).toBeInTheDocument()
    expect(screen.getAllByTestId('agent-card')).toHaveLength(3)
  })

  it('should limit agents when maxItems is specified', () => {
    render(<AgentsGrid agents={mockAgents} maxItems={2} />)

    expect(screen.getByText('Agent 1')).toBeInTheDocument()
    expect(screen.getByText('Agent 2')).toBeInTheDocument()
    expect(screen.queryByText('Agent 3')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('agent-card')).toHaveLength(2)
  })

  it('should render all agents when maxItems is larger than available agents', () => {
    render(<AgentsGrid agents={mockAgents} maxItems={10} />)

    expect(screen.getAllByTestId('agent-card')).toHaveLength(3)
  })

  it('should apply custom className', () => {
    const { container } = render(<AgentsGrid agents={mockAgents} className="custom-grid-class" />)
    
    expect(container.firstChild).toHaveClass('custom-grid-class')
  })

  it('should pass h-full className to agent cards', () => {
    render(<AgentsGrid agents={mockAgents} />)

    const agentCards = screen.getAllByTestId('agent-card')
    agentCards.forEach(card => {
      expect(card).toHaveClass('h-full')
    })
  })

  it('should render empty state when no agents provided', () => {
    render(<AgentsGrid agents={[]} />)

    expect(screen.getByText('No agents available')).toBeInTheDocument()
    expect(screen.getByText('Check back later for new AI agents and specialized assistants')).toBeInTheDocument()
    expect(screen.queryByTestId('agent-card')).not.toBeInTheDocument()
  })

  it('should render empty state when agents array is empty after maxItems filter', () => {
    render(<AgentsGrid agents={mockAgents} maxItems={0} />)

    expect(screen.getByText('No agents available')).toBeInTheDocument()
    expect(screen.queryByTestId('agent-card')).not.toBeInTheDocument()
  })

  it('should use correct grid classes for responsive layout', () => {
    const { container } = render(<AgentsGrid agents={mockAgents} />)
    
    expect(container.firstChild).toHaveClass(
      'grid',
      'gap-6',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'auto-rows-fr'
    )
  })
})

describe('AgentsGridSkeleton', () => {
  it('should render default number of skeleton cards', () => {
    render(<AgentsGridSkeleton />)

    expect(screen.getAllByTestId('agent-card-skeleton')).toHaveLength(6)
  })

  it('should render custom number of skeleton cards', () => {
    render(<AgentsGridSkeleton count={3} />)

    expect(screen.getAllByTestId('agent-card-skeleton')).toHaveLength(3)
  })

  it('should apply custom className', () => {
    const { container } = render(<AgentsGridSkeleton className="custom-skeleton-grid" />)
    
    expect(container.firstChild).toHaveClass('custom-skeleton-grid')
  })

  it('should pass h-full className to skeleton cards', () => {
    render(<AgentsGridSkeleton count={2} />)

    const skeletonCards = screen.getAllByTestId('agent-card-skeleton')
    skeletonCards.forEach(card => {
      expect(card).toHaveClass('h-full')
    })
  })

  it('should use correct grid classes for responsive layout', () => {
    const { container } = render(<AgentsGridSkeleton />)
    
    expect(container.firstChild).toHaveClass(
      'grid',
      'gap-6',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'auto-rows-fr'
    )
  })
})