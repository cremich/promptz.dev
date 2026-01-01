import { render, screen } from '@testing-library/react'
import { SteeringCard, SteeringCardSkeleton } from '@/components/steering-card'
import type { SteeringDocument } from '@/lib/types/content'

// Mock the git utility functions
jest.mock('@/lib/formatter/git', () => ({
  getShortHash: jest.fn((hash: string) => hash.substring(0, 7))
}))

// Mock the date formatter functions
jest.mock('@/lib/formatter/date', () => ({
  getFormattedDisplayDate: jest.fn(() => 'Jan 15, 2024')
}))

describe('SteeringCard', () => {
  const mockSteering: SteeringDocument = {
    id: 'promptz/steering/test-steering',
    title: 'Test Steering Document',
    author: 'Test Author',
    date: '2024-01-15',
    path: 'libraries/promptz/steering/test-steering.md',
    type: 'steering',
    content: 'Test steering content',
    git: {
      author: 'Git Author',
      authorEmail: 'git@example.com',
      createdDate: '2024-01-15T10:00:00Z',
      lastModifiedDate: '2024-01-16T10:00:00Z',
      commitHash: 'abc1234567890',
      commitMessage: 'Add test steering document'
    }
  }

  it('should render steering document title prominently', () => {
    render(<SteeringCard steering={mockSteering} />)
    
    const title = screen.getByText('Test Steering Document')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-lg', 'font-semibold')
  })

  it('should display steering document ID', () => {
    render(<SteeringCard steering={mockSteering} />)
    
    expect(screen.getByText('ID:')).toBeInTheDocument()
    expect(screen.getByText('promptz/steering/test-steering')).toBeInTheDocument()
  })

  it('should show steering type badge with outline variant', () => {
    render(<SteeringCard steering={mockSteering} />)
    
    const steeringBadge = screen.getByText('steering')
    expect(steeringBadge).toBeInTheDocument()
  })

  it('should show library source badge', () => {
    render(<SteeringCard steering={mockSteering} />)
    
    const libraryBadge = screen.getByText('promptz')
    expect(libraryBadge).toBeInTheDocument()
  })

  it('should display git author when git information is available', () => {
    render(<SteeringCard steering={mockSteering} />)
    
    expect(screen.getByText('Author:')).toBeInTheDocument()
    expect(screen.getByText('Git Author')).toBeInTheDocument()
  })

  it('should display git creation date when git information is available', () => {
    render(<SteeringCard steering={mockSteering} />)
    
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  it('should display short commit hash when git information is available', () => {
    render(<SteeringCard steering={mockSteering} />)
    
    const commitHash = screen.getByText('abc1234')
    expect(commitHash).toBeInTheDocument()
    expect(commitHash).toHaveClass('font-mono')
  })

  it('should fall back to frontmatter data when git information is not available', () => {
    const steeringWithoutGit: SteeringDocument = {
      ...mockSteering,
      git: undefined
    }
    
    render(<SteeringCard steering={steeringWithoutGit} />)
    
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    expect(screen.queryByText('abc1234')).not.toBeInTheDocument()
  })

  it('should extract library name from different paths', () => {
    const kiroSteering: SteeringDocument = {
      ...mockSteering,
      id: 'kiro-powers/steering/test',
      path: 'libraries/kiro-powers/steering/test.md'
    }
    
    render(<SteeringCard steering={kiroSteering} />)
    
    expect(screen.getByText('kiro-powers')).toBeInTheDocument()
  })

  it('should handle unknown library paths', () => {
    const unknownSteering: SteeringDocument = {
      ...mockSteering,
      id: 'unknown/steering/test',
      path: 'some/other/path/test.md'
    }
    
    render(<SteeringCard steering={unknownSteering} />)
    
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })

  it('should apply custom className when provided', () => {
    const { container } = render(<SteeringCard steering={mockSteering} className="custom-class" />)
    
    const card = container.querySelector('[data-slot="card"]')
    expect(card).toHaveClass('custom-class')
  })

  it('should display all required metadata fields', () => {
    render(<SteeringCard steering={mockSteering} />)
    
    // Check that all required fields are present
    expect(screen.getByText('Test Steering Document')).toBeInTheDocument() // title
    expect(screen.getByText('promptz/steering/test-steering')).toBeInTheDocument() // ID
    expect(screen.getByText('Git Author')).toBeInTheDocument() // author
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument() // date
    expect(screen.getByText('abc1234')).toBeInTheDocument() // commit hash
  })

  it('should handle steering documents with category', () => {
    const steeringWithCategory: SteeringDocument = {
      ...mockSteering,
      category: 'development'
    }
    
    render(<SteeringCard steering={steeringWithCategory} />)
    
    // Should still render normally with category
    expect(screen.getByText('Test Steering Document')).toBeInTheDocument()
  })
})

describe('SteeringCardSkeleton', () => {
  it('should render skeleton elements with proper structure', () => {
    render(<SteeringCardSkeleton />)
    
    // Check that skeleton elements are present
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should apply custom className when provided', () => {
    const { container } = render(<SteeringCardSkeleton className="custom-class" />)
    
    const card = container.querySelector('[data-testid="steering-card-skeleton"]')
    expect(card).toHaveClass('custom-class')
  })

  it('should have the same card structure as SteeringCard', () => {
    const { container } = render(<SteeringCardSkeleton />)
    
    // Check for card structure elements
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
  })

  it('should include skeleton elements for all card sections', () => {
    render(<SteeringCardSkeleton />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    
    // Should have skeletons for:
    // - Title (1)
    // - Badges (2: steering + library)
    // - ID line (1)
    // - Author line (1)
    // - Date (1)
    // - Commit hash (1)
    expect(skeletons).toHaveLength(7)
  })

  it('should match the visual structure of the actual SteeringCard', () => {
    const { container: skeletonContainer } = render(<SteeringCardSkeleton />)
    const { container: cardContainer } = render(<SteeringCard steering={{
      id: 'promptz/steering/test',
      title: 'Test',
      author: 'Author',
      date: '2024-01-15',
      path: 'libraries/promptz/steering/test.md',
      type: 'steering',
      content: 'Content'
    }} />)
    
    // Both should have the same basic card structure
    const skeletonCard = skeletonContainer.querySelector('[data-slot="card"]')
    const actualCard = cardContainer.querySelector('[data-slot="card"]')
    
    expect(skeletonCard).toBeInTheDocument()
    expect(actualCard).toBeInTheDocument()
  })
})