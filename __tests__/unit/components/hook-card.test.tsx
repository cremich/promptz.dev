import { render, screen } from '@testing-library/react'
import { HookCard, HookCardSkeleton } from '@/components/hook-card'
import type { Hook } from '@/lib/types/content'

// Mock the utility functions
jest.mock('@/lib/utils/git-extractor', () => ({
  getShortHash: jest.fn((hash: string) => hash.substring(0, 7))
}))

jest.mock('@/lib/formatter/date', () => ({
  getFormattedDisplayDate: jest.fn((gitDate?: string, fallbackDate?: string) => {
    return gitDate || fallbackDate || 'Unknown Date'
  })
}))

const mockHook: Hook = {
  type: 'hook',
  id: 'promptz/hooks/test-hook',
  title: 'Test Hook',
  author: 'Test Author',
  date: '2024-01-15',
  path: '/libraries/promptz/hooks/test-hook.kiro.hook',
  description: 'Test hook description',
  content: 'Test hook content',
  trigger: 'userTriggered',
  git: {
    author: 'Git Author',
    authorEmail: 'git@example.com',
    createdDate: '2024-01-15T10:00:00Z',
    lastModifiedDate: '2024-01-16T10:00:00Z',
    commitHash: 'abc123def456',
    commitMessage: 'Add test hook'
  }
}

const mockHookWithoutGit: Hook = {
  type: 'hook',
  id: 'promptz/hooks/simple-hook',
  title: 'Simple Hook',
  author: 'Simple Author',
  date: '2024-01-10',
  path: '/libraries/promptz/hooks/simple-hook.kiro.hook',
  description: 'Simple hook description',
  content: 'Simple hook content'
}

describe('HookCard', () => {
  it('should render hook information correctly', () => {
    render(<HookCard hook={mockHook} />)
    
    expect(screen.getByText('Test Hook')).toBeInTheDocument()
    expect(screen.getByText('promptz/hooks/test-hook')).toBeInTheDocument()
    expect(screen.getByText('Test hook description')).toBeInTheDocument()
    expect(screen.getByText('userTriggered')).toBeInTheDocument()
    expect(screen.getByText('Git Author')).toBeInTheDocument()
    expect(screen.getByText('abc123d')).toBeInTheDocument() // Short hash
  })

  it('should render hook badges correctly', () => {
    render(<HookCard hook={mockHook} />)
    
    expect(screen.getByText('hook')).toBeInTheDocument()
    expect(screen.getByText('promptz')).toBeInTheDocument()
  })

  it('should handle hook without git information', () => {
    render(<HookCard hook={mockHookWithoutGit} />)
    
    expect(screen.getByText('Simple Hook')).toBeInTheDocument()
    expect(screen.getByText('Simple Author')).toBeInTheDocument()
    expect(screen.queryByText(/[a-f0-9]{7}/)).not.toBeInTheDocument() // No commit hash
  })

  it('should handle hook without trigger', () => {
    render(<HookCard hook={mockHookWithoutGit} />)
    
    expect(screen.getByText('Simple Hook')).toBeInTheDocument()
    expect(screen.queryByText('Trigger:')).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<HookCard hook={mockHook} className="custom-class" />)
    
    // The className is applied to the Card element, not the Link wrapper
    const card = container.querySelector('[data-slot="card"]')
    expect(card).toHaveClass('custom-class')
  })

  it('should display ID field', () => {
    render(<HookCard hook={mockHook} />)
    
    expect(screen.getByText('ID:')).toBeInTheDocument()
    expect(screen.getByText('promptz/hooks/test-hook')).toBeInTheDocument()
  })

  it('should display description field', () => {
    render(<HookCard hook={mockHook} />)
    
    expect(screen.getByText('Description:')).toBeInTheDocument()
    expect(screen.getByText('Test hook description')).toBeInTheDocument()
  })

  it('should display trigger field when present', () => {
    render(<HookCard hook={mockHook} />)
    
    expect(screen.getByText('Trigger:')).toBeInTheDocument()
    expect(screen.getByText('userTriggered')).toBeInTheDocument()
  })

  it('should display author field', () => {
    render(<HookCard hook={mockHook} />)
    
    expect(screen.getByText('Author:')).toBeInTheDocument()
    expect(screen.getByText('Git Author')).toBeInTheDocument()
  })
})

describe('HookCardSkeleton', () => {
  it('should render skeleton elements', () => {
    render(<HookCardSkeleton />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should have correct test id', () => {
    render(<HookCardSkeleton />)
    
    expect(screen.getByTestId('hook-card-skeleton')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<HookCardSkeleton className="custom-skeleton-class" />)
    
    expect(container.firstChild).toHaveClass('custom-skeleton-class')
  })

  it('should render expected number of skeleton elements', () => {
    render(<HookCardSkeleton />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    // Title, 2 badges, ID, Description, Trigger, Author, Date, Commit hash = 9 skeletons
    expect(skeletons).toHaveLength(9)
  })
})