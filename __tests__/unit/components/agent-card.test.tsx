import { render, screen } from '@testing-library/react'
import { AgentCard, AgentCardSkeleton } from '@/components/agent-card'
import type { Agent } from '@/lib/types/content'

// Mock the utility functions
jest.mock('@/lib/formatter/git', () => ({
  getShortHash: jest.fn((hash: string) => hash.substring(0, 7))
}))

jest.mock('@/lib/formatter/date', () => ({
  getFormattedDisplayDate: jest.fn((gitDate?: string, fallbackDate?: string) => {
    return gitDate ? 'Jan 2, 2024' : fallbackDate ? 'Jan 1, 2024' : 'Unknown Date'
  })
}))

describe('AgentCard', () => {
  const mockAgent: Agent = {
    type: 'agent',
    id: 'promptz/agents/test-agent',
    title: 'Test Agent',
    author: 'Test Author',
    date: '2024-01-01',
    path: '/libraries/promptz/agents/test-agent.md',
    description: 'A test agent for development',
    config: {
      mcpServers: ['test-server'],
      tools: ['test-tool']
    },
    content: 'Test agent content'
  }

  const mockAgentWithGit: Agent = {
    ...mockAgent,
    git: {
      author: 'Git Author',
      authorEmail: 'git@example.com',
      createdDate: '2024-01-02T10:00:00Z',
      lastModifiedDate: '2024-01-02T10:00:00Z',
      commitHash: 'abc123def456',
      commitMessage: 'Add test agent'
    }
  }

  it('should render agent information correctly', () => {
    render(<AgentCard agent={mockAgent} />)

    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByText('promptz/agents/test-agent')).toBeInTheDocument()
    expect(screen.getByText('A test agent for development')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('agent')).toBeInTheDocument()
    expect(screen.getByText('promptz')).toBeInTheDocument()
  })

  it('should display git information when available', () => {
    render(<AgentCard agent={mockAgentWithGit} />)

    expect(screen.getByText('Git Author')).toBeInTheDocument()
    expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument()
    expect(screen.getByText('abc123d')).toBeInTheDocument()
  })

  it('should fallback to frontmatter data when git info is not available', () => {
    render(<AgentCard agent={mockAgent} />)

    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument()
    expect(screen.queryByText(/[a-f0-9]{7}/)).not.toBeInTheDocument()
  })

  it('should apply custom className when provided', () => {
    const { container } = render(<AgentCard agent={mockAgent} className="custom-class" />)
    
    // The className is applied to the Card component, which is inside the Link wrapper
    const linkElement = container.firstChild as HTMLElement
    const cardElement = linkElement.firstChild as HTMLElement
    
    expect(linkElement).toHaveClass('block') // Link has block class
    expect(cardElement).toHaveClass('custom-class') // Card has the custom class
  })

  it('should render all required sections', () => {
    render(<AgentCard agent={mockAgent} />)

    // Check for card structure - CardTitle renders as div, not heading
    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    
    // Check for ID section
    expect(screen.getByText('ID:')).toBeInTheDocument()
    
    // Check for Description section
    expect(screen.getByText('Description:')).toBeInTheDocument()
    
    // Check for Author section
    expect(screen.getByText('Author:')).toBeInTheDocument()
  })
})

describe('AgentCardSkeleton', () => {
  it('should render skeleton elements', () => {
    render(<AgentCardSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should apply custom className when provided', () => {
    const { container } = render(<AgentCardSkeleton className="custom-skeleton-class" />)
    
    expect(container.firstChild).toHaveClass('custom-skeleton-class')
  })

  it('should have correct test id', () => {
    render(<AgentCardSkeleton />)
    
    expect(screen.getByTestId('agent-card-skeleton')).toBeInTheDocument()
  })

  it('should render expected number of skeleton elements', () => {
    render(<AgentCardSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    // Title, agent badge, library badge, ID, Description, Author, Date, Commit hash
    expect(skeletons).toHaveLength(8)
  })
})