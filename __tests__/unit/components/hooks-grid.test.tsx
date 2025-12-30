import { render, screen } from '@testing-library/react'
import { HooksGrid, HooksGridSkeleton } from '@/components/hooks-grid'
import type { Hook } from '@/lib/types/content'

// Mock the HookCard component
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
    trigger: 'userTriggered'
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

describe('HooksGrid', () => {
  it('should render all hooks when no maxItems specified', () => {
    render(<HooksGrid hooks={mockHooks} />)
    
    expect(screen.getByText('Test Hook 1')).toBeInTheDocument()
    expect(screen.getByText('Test Hook 2')).toBeInTheDocument()
    expect(screen.getByText('Test Hook 3')).toBeInTheDocument()
    
    const hookCards = screen.getAllByTestId('hook-card')
    expect(hookCards).toHaveLength(3)
  })

  it('should limit hooks when maxItems is specified', () => {
    render(<HooksGrid hooks={mockHooks} maxItems={2} />)
    
    expect(screen.getByText('Test Hook 1')).toBeInTheDocument()
    expect(screen.getByText('Test Hook 2')).toBeInTheDocument()
    expect(screen.queryByText('Test Hook 3')).not.toBeInTheDocument()
    
    const hookCards = screen.getAllByTestId('hook-card')
    expect(hookCards).toHaveLength(2)
  })

  it('should render empty state when no hooks provided', () => {
    render(<HooksGrid hooks={[]} />)
    
    expect(screen.getByText('No hooks available')).toBeInTheDocument()
    expect(screen.getByText('Check back later for new agent hooks')).toBeInTheDocument()
    expect(screen.queryByTestId('hook-card')).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<HooksGrid hooks={mockHooks} className="custom-grid-class" />)
    
    expect(container.firstChild).toHaveClass('custom-grid-class')
  })

  it('should use responsive grid layout', () => {
    const { container } = render(<HooksGrid hooks={mockHooks} />)
    
    expect(container.firstChild).toHaveClass('grid')
    expect(container.firstChild).toHaveClass('grid-cols-1')
    expect(container.firstChild).toHaveClass('md:grid-cols-2')
    expect(container.firstChild).toHaveClass('lg:grid-cols-3')
  })

  it('should apply h-full class to hook cards', () => {
    render(<HooksGrid hooks={mockHooks} />)
    
    const hookCards = screen.getAllByTestId('hook-card')
    hookCards.forEach(card => {
      expect(card).toHaveClass('h-full')
    })
  })

  it('should handle maxItems of 0', () => {
    render(<HooksGrid hooks={mockHooks} maxItems={0} />)
    
    expect(screen.getByText('No hooks available')).toBeInTheDocument()
    expect(screen.queryByTestId('hook-card')).not.toBeInTheDocument()
  })

  it('should handle maxItems larger than hooks array', () => {
    render(<HooksGrid hooks={mockHooks} maxItems={10} />)
    
    const hookCards = screen.getAllByTestId('hook-card')
    expect(hookCards).toHaveLength(3) // Should still only render 3 hooks
  })
})

describe('HooksGridSkeleton', () => {
  it('should render default number of skeleton cards', () => {
    render(<HooksGridSkeleton />)
    
    const skeletonCards = screen.getAllByTestId('hook-card-skeleton')
    expect(skeletonCards).toHaveLength(6) // Default count
  })

  it('should render custom number of skeleton cards', () => {
    render(<HooksGridSkeleton count={3} />)
    
    const skeletonCards = screen.getAllByTestId('hook-card-skeleton')
    expect(skeletonCards).toHaveLength(3)
  })

  it('should apply custom className', () => {
    const { container } = render(<HooksGridSkeleton className="custom-skeleton-grid" />)
    
    expect(container.firstChild).toHaveClass('custom-skeleton-grid')
  })

  it('should use responsive grid layout', () => {
    const { container } = render(<HooksGridSkeleton />)
    
    expect(container.firstChild).toHaveClass('grid')
    expect(container.firstChild).toHaveClass('grid-cols-1')
    expect(container.firstChild).toHaveClass('md:grid-cols-2')
    expect(container.firstChild).toHaveClass('lg:grid-cols-3')
  })

  it('should apply h-full class to skeleton cards', () => {
    render(<HooksGridSkeleton />)
    
    const skeletonCards = screen.getAllByTestId('hook-card-skeleton')
    skeletonCards.forEach(card => {
      expect(card).toHaveClass('h-full')
    })
  })

  it('should handle count of 0', () => {
    render(<HooksGridSkeleton count={0} />)
    
    const skeletonCards = screen.queryAllByTestId('hook-card-skeleton')
    expect(skeletonCards).toHaveLength(0)
  })
})