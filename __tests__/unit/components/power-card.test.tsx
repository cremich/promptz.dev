import { render, screen } from '@testing-library/react'
import { PowerCard, PowerCardSkeleton } from '@/components/power-card'
import type { Power } from '@/lib/types/content'

// Mock the git utility functions
jest.mock('@/lib/utils/git-extractor', () => ({
  getShortHash: jest.fn((hash: string) => hash.substring(0, 7))
}))

// Mock the date formatter functions
jest.mock('@/lib/utils/date-formatter', () => ({
  getFormattedDisplayDate: jest.fn(() => 'Jan 15, 2024')
}))

// Mock the badge utility functions
jest.mock('@/lib/utils/badge-utils', () => ({
  getContentTypeBadgeVariant: jest.fn(() => ({ variant: 'default' })),
  getLibraryBadgeVariant: jest.fn(() => ({ variant: 'outline' })),
  getLibraryName: jest.fn((path: string) => {
    const pathParts = path.split('/')
    const librariesIndex = pathParts.indexOf('libraries')
    if (librariesIndex !== -1 && librariesIndex + 1 < pathParts.length) {
      return pathParts[librariesIndex + 1]
    }
    return 'unknown'
  }),
  getBadgeArrangement: jest.fn(() => ({
    containerClasses: 'flex flex-wrap gap-1 shrink-0',
    badgeClasses: 'text-xs font-medium'
  })),
  getStandardBadgeClasses: jest.fn(() => 'text-xs font-medium')
}))

describe('PowerCard', () => {
  const mockPower: Power = {
    id: 'test-power',
    title: 'Test Power',
    displayName: 'Test Power Display',
    author: 'Test Author',
    date: '2024-01-15',
    path: 'libraries/kiro-powers/stripe/POWER.md',
    type: 'power',
    description: 'A test power for unit testing',
    keywords: ['test', 'power', 'stripe', 'payments'],
    content: 'Test power content',
    git: {
      author: 'Git Author',
      authorEmail: 'git@example.com',
      createdDate: '2024-01-15T10:00:00Z',
      lastModifiedDate: '2024-01-16T10:00:00Z',
      commitHash: 'abc1234567890',
      commitMessage: 'Add test power'
    }
  }

  it('should render power displayName prominently', () => {
    render(<PowerCard power={mockPower} />)
    
    const title = screen.getByText('Test Power Display')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-lg', 'font-semibold')
  })

  it('should fall back to title when displayName is not available', () => {
    const powerWithoutDisplayName: Power = {
      ...mockPower,
      displayName: ''
    }
    
    render(<PowerCard power={powerWithoutDisplayName} />)
    
    expect(screen.getByText('Test Power')).toBeInTheDocument()
  })

  it('should display power description', () => {
    render(<PowerCard power={mockPower} />)
    
    expect(screen.getByText('A test power for unit testing')).toBeInTheDocument()
  })

  it('should display power ID', () => {
    render(<PowerCard power={mockPower} />)
    
    expect(screen.getByText('ID:')).toBeInTheDocument()
    expect(screen.getByText('test-power')).toBeInTheDocument()
  })

  it('should show power type badge', () => {
    render(<PowerCard power={mockPower} />)
    
    // Check that there are multiple power badges (one for type, one for keyword)
    const powerBadges = screen.getAllByText('power')
    expect(powerBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('should show library source badge', () => {
    render(<PowerCard power={mockPower} />)
    
    const libraryBadge = screen.getByText('kiro-powers')
    expect(libraryBadge).toBeInTheDocument()
  })

  it('should display git author when git information is available', () => {
    render(<PowerCard power={mockPower} />)
    
    expect(screen.getByText('Author:')).toBeInTheDocument()
    expect(screen.getByText('Git Author')).toBeInTheDocument()
  })

  it('should display git creation date when git information is available', () => {
    render(<PowerCard power={mockPower} />)
    
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  it('should display short commit hash when git information is available', () => {
    render(<PowerCard power={mockPower} />)
    
    const commitHash = screen.getByText('abc1234')
    expect(commitHash).toBeInTheDocument()
    expect(commitHash).toHaveClass('font-mono')
  })

  it('should display keywords as badges', () => {
    render(<PowerCard power={mockPower} />)
    
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('stripe')).toBeInTheDocument()
    // Verify that power appears as both type badge and keyword badge
    const powerBadges = screen.getAllByText('power')
    expect(powerBadges.length).toBe(2) // One for type, one for keyword
  })

  it('should limit keywords display to 3 and show count for additional', () => {
    const powerWithManyKeywords: Power = {
      ...mockPower,
      keywords: ['test', 'api', 'stripe', 'payments', 'integration', 'billing']
    }
    
    render(<PowerCard power={powerWithManyKeywords} />)
    
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('api')).toBeInTheDocument()
    expect(screen.getByText('stripe')).toBeInTheDocument()
    expect(screen.getByText('+3')).toBeInTheDocument()
    expect(screen.queryByText('payments')).not.toBeInTheDocument()
  })

  it('should not display keywords section when no keywords are available', () => {
    const powerWithoutKeywords: Power = {
      ...mockPower,
      keywords: []
    }
    
    render(<PowerCard power={powerWithoutKeywords} />)
    
    expect(screen.queryByText('test')).not.toBeInTheDocument()
  })

  it('should fall back to frontmatter data when git information is not available', () => {
    const powerWithoutGit: Power = {
      ...mockPower,
      git: undefined
    }
    
    render(<PowerCard power={powerWithoutGit} />)
    
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    expect(screen.queryByText('abc1234')).not.toBeInTheDocument()
  })

  it('should extract library name from different paths', () => {
    const promptzPower: Power = {
      ...mockPower,
      path: 'libraries/promptz/powers/test.md'
    }
    
    render(<PowerCard power={promptzPower} />)
    
    expect(screen.getByText('promptz')).toBeInTheDocument()
  })

  it('should handle unknown library paths', () => {
    const unknownPower: Power = {
      ...mockPower,
      path: 'some/other/path/test.md'
    }
    
    render(<PowerCard power={unknownPower} />)
    
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})

describe('PowerCardSkeleton', () => {
  it('should render skeleton elements with proper structure', () => {
    render(<PowerCardSkeleton />)
    
    // Check that skeleton elements are present
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should apply custom className when provided', () => {
    const { container } = render(<PowerCardSkeleton className="custom-class" />)
    
    const card = container.querySelector('[data-testid="power-card-skeleton"]')
    expect(card).toHaveClass('custom-class')
  })

  it('should have the same card structure as PowerCard', () => {
    const { container } = render(<PowerCardSkeleton />)
    
    // Check for card structure elements
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
  })
})