import { render, screen } from '@testing-library/react'
import { Grid, GridSkeleton } from '@/components/grid'
import type { ContentItem } from '@/lib/types/content'

// Mock all the individual card components
jest.mock('@/components/agent-card', () => ({
  AgentCard: ({ agent, className }: { agent: { title: string }; className?: string }) => (
    <div data-testid="agent-card" className={className}>
      {agent.title}
    </div>
  ),
  AgentCardSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="agent-card-skeleton" className={className}>
      Loading agent...
    </div>
  )
}))

jest.mock('@/components/hook-card', () => ({
  HookCard: ({ hook, className }: { hook: { title: string }; className?: string }) => (
    <div data-testid="hook-card" className={className}>
      {hook.title}
    </div>
  ),
  HookCardSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="hook-card-skeleton" className={className}>
      Loading hook...
    </div>
  )
}))

jest.mock('@/components/power-card', () => ({
  PowerCard: ({ power, className }: { power: { title: string }; className?: string }) => (
    <div data-testid="power-card" className={className}>
      {power.title}
    </div>
  ),
  PowerCardSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="power-card-skeleton" className={className}>
      Loading power...
    </div>
  )
}))

jest.mock('@/components/prompt-card', () => ({
  PromptCard: ({ prompt, className }: { prompt: { title: string }; className?: string }) => (
    <div data-testid="prompt-card" className={className}>
      {prompt.title}
    </div>
  ),
  PromptCardSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="prompt-card-skeleton" className={className}>
      Loading prompt...
    </div>
  )
}))

jest.mock('@/components/steering-card', () => ({
  SteeringCard: ({ steering, className }: { steering: { title: string }; className?: string }) => (
    <div data-testid="steering-card" className={className}>
      {steering.title}
    </div>
  ),
  SteeringCardSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="steering-card-skeleton" className={className}>
      Loading steering...
    </div>
  )
}))

const mockContentItems: ContentItem[] = [
  {
    type: 'prompt',
    id: 'promptz/prompts/prompt-1',
    title: 'Test Prompt 1',
    author: 'Author 1',
    date: '2024-01-15',
    path: '/libraries/promptz/prompts/prompt-1.md',
    content: 'Prompt 1 content'
  },
  {
    type: 'agent',
    id: 'promptz/agents/agent-1',
    title: 'Test Agent 1',
    author: 'Author 2',
    date: '2024-01-14',
    path: '/libraries/promptz/agents/agent-1',
    description: 'Test agent 1 description',
    config: { mcpServers: ['test-server'] },
    content: 'Agent 1 content'
  },
  {
    type: 'power',
    id: 'kiro-powers/power-1',
    title: 'Test Power 1',
    displayName: 'Test Power 1',
    author: 'Author 3',
    date: '2024-01-13',
    path: '/libraries/kiro-powers/power-1',
    description: 'Test power 1 description',
    keywords: ['test', 'power'],
    content: 'Power 1 content'
  },
  {
    type: 'hook',
    id: 'promptz/hooks/hook-1',
    title: 'Test Hook 1',
    author: 'Author 4',
    date: '2024-01-12',
    path: '/libraries/promptz/hooks/hook-1.kiro.hook',
    description: 'Test hook 1 description',
    content: 'Hook 1 content',
    trigger: 'userTriggered'
  },
  {
    type: 'steering',
    id: 'promptz/steering/steering-1',
    title: 'Test Steering 1',
    author: 'Author 5',
    date: '2024-01-11',
    path: '/libraries/promptz/steering/steering-1.md',
    content: 'Steering 1 content'
  }
]

describe('Grid', () => {
  it('should render all content items when no maxItems specified', () => {
    render(<Grid items={mockContentItems} />)
    
    expect(screen.getByText('Test Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Test Agent 1')).toBeInTheDocument()
    expect(screen.getByText('Test Power 1')).toBeInTheDocument()
    expect(screen.getByText('Test Hook 1')).toBeInTheDocument()
    expect(screen.getByText('Test Steering 1')).toBeInTheDocument()
    
    expect(screen.getByTestId('prompt-card')).toBeInTheDocument()
    expect(screen.getByTestId('agent-card')).toBeInTheDocument()
    expect(screen.getByTestId('power-card')).toBeInTheDocument()
    expect(screen.getByTestId('hook-card')).toBeInTheDocument()
    expect(screen.getByTestId('steering-card')).toBeInTheDocument()
  })

  it('should limit items when maxItems is specified', () => {
    render(<Grid items={mockContentItems} maxItems={3} />)
    
    expect(screen.getByText('Test Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Test Agent 1')).toBeInTheDocument()
    expect(screen.getByText('Test Power 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Hook 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Steering 1')).not.toBeInTheDocument()
    
    const allCards = screen.getAllByTestId(/-(card)$/)
    expect(allCards).toHaveLength(3)
  })

  it('should render empty state when no items provided', () => {
    render(<Grid items={[]} />)
    
    expect(screen.getByText('No content available')).toBeInTheDocument()
    expect(screen.getByText('Check back later for new content')).toBeInTheDocument()
    expect(screen.queryByTestId(/-(card)$/)).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Grid items={mockContentItems} className="custom-grid-class" />)
    
    expect(container.firstChild).toHaveClass('custom-grid-class')
  })

  it('should use responsive grid layout', () => {
    const { container } = render(<Grid items={mockContentItems} />)
    
    expect(container.firstChild).toHaveClass('grid')
    expect(container.firstChild).toHaveClass('grid-cols-1')
    expect(container.firstChild).toHaveClass('md:grid-cols-2')
    expect(container.firstChild).toHaveClass('lg:grid-cols-3')
  })

  it('should apply h-full class to all cards', () => {
    render(<Grid items={mockContentItems} />)
    
    const allCards = screen.getAllByTestId(/-(card)$/)
    allCards.forEach(card => {
      expect(card).toHaveClass('h-full')
    })
  })

  it('should handle maxItems of 0', () => {
    render(<Grid items={mockContentItems} maxItems={0} />)
    
    expect(screen.getByText('No content available')).toBeInTheDocument()
    expect(screen.queryByTestId(/-(card)$/)).not.toBeInTheDocument()
  })

  it('should handle maxItems larger than items array', () => {
    render(<Grid items={mockContentItems} maxItems={10} />)
    
    const allCards = screen.getAllByTestId(/-(card)$/)
    expect(allCards).toHaveLength(5) // Should still only render 5 items
  })

  it('should render different content types correctly', () => {
    const singleTypeItems = [mockContentItems[0]] // Just the prompt
    render(<Grid items={singleTypeItems} />)
    
    expect(screen.getByTestId('prompt-card')).toBeInTheDocument()
    expect(screen.queryByTestId('agent-card')).not.toBeInTheDocument()
  })
})

describe('GridSkeleton', () => {
  it('should render default number of skeleton cards', () => {
    render(<GridSkeleton />)
    
    const skeletonCards = screen.getAllByTestId(/-(card-skeleton)$/)
    expect(skeletonCards).toHaveLength(6) // Default count
  })

  it('should render custom number of skeleton cards', () => {
    render(<GridSkeleton count={3} />)
    
    const skeletonCards = screen.getAllByTestId(/-(card-skeleton)$/)
    expect(skeletonCards).toHaveLength(3)
  })

  it('should apply custom className', () => {
    const { container } = render(<GridSkeleton className="custom-skeleton-grid" />)
    
    expect(container.firstChild).toHaveClass('custom-skeleton-grid')
  })

  it('should use responsive grid layout', () => {
    const { container } = render(<GridSkeleton />)
    
    expect(container.firstChild).toHaveClass('grid')
    expect(container.firstChild).toHaveClass('grid-cols-1')
    expect(container.firstChild).toHaveClass('md:grid-cols-2')
    expect(container.firstChild).toHaveClass('lg:grid-cols-3')
  })

  it('should apply h-full class to skeleton cards', () => {
    render(<GridSkeleton />)
    
    const skeletonCards = screen.getAllByTestId(/-(card-skeleton)$/)
    skeletonCards.forEach(card => {
      expect(card).toHaveClass('h-full')
    })
  })

  it('should handle count of 0', () => {
    render(<GridSkeleton count={0} />)
    
    const skeletonCards = screen.queryAllByTestId(/-(card-skeleton)$/)
    expect(skeletonCards).toHaveLength(0)
  })

  it('should render variety of skeleton types', () => {
    render(<GridSkeleton count={5} />)
    
    // Should have different skeleton types due to rotating pattern
    const skeletonCards = screen.getAllByTestId(/-(card-skeleton)$/)
    expect(skeletonCards).toHaveLength(5)
    
    // Check that we have different types (the rotating pattern should give us variety)
    const skeletonTypes = skeletonCards.map(card => card.getAttribute('data-testid'))
    const uniqueTypes = new Set(skeletonTypes)
    expect(uniqueTypes.size).toBeGreaterThan(1) // Should have multiple types
  })
})