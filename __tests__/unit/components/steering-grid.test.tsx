import { render, screen } from '@testing-library/react'
import { SteeringGrid, SteeringGridSkeleton } from '@/components/steering-grid'
import type { SteeringDocument } from '@/lib/types/content'

// Mock the SteeringCard component
jest.mock('@/components/steering-card', () => ({
  SteeringCard: ({ steering, className }: { steering: SteeringDocument; className?: string }) => (
    <div data-testid="steering-card" className={className}>
      {steering.title}
    </div>
  ),
  SteeringCardSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="steering-card-skeleton" className={className}>
      Skeleton
    </div>
  )
}))

describe('SteeringGrid', () => {
  const mockSteeringDocs: SteeringDocument[] = [
    {
      id: 'steering-1',
      title: 'Steering Document 1',
      author: 'Author 1',
      date: '2024-01-15',
      path: 'libraries/promptz/steering/doc1.md',
      type: 'steering',
      content: 'Content 1'
    },
    {
      id: 'steering-2',
      title: 'Steering Document 2',
      author: 'Author 2',
      date: '2024-01-16',
      path: 'libraries/kiro-powers/steering/doc2.md',
      type: 'steering',
      content: 'Content 2'
    },
    {
      id: 'steering-3',
      title: 'Steering Document 3',
      author: 'Author 3',
      date: '2024-01-17',
      path: 'libraries/promptz/steering/doc3.md',
      type: 'steering',
      content: 'Content 3'
    }
  ]

  it('should render all steering documents when no maxItems is specified', () => {
    render(<SteeringGrid steering={mockSteeringDocs} />)
    
    expect(screen.getByText('Steering Document 1')).toBeInTheDocument()
    expect(screen.getByText('Steering Document 2')).toBeInTheDocument()
    expect(screen.getByText('Steering Document 3')).toBeInTheDocument()
    
    const cards = screen.getAllByTestId('steering-card')
    expect(cards).toHaveLength(3)
  })

  it('should limit displayed steering documents when maxItems is specified', () => {
    render(<SteeringGrid steering={mockSteeringDocs} maxItems={2} />)
    
    expect(screen.getByText('Steering Document 1')).toBeInTheDocument()
    expect(screen.getByText('Steering Document 2')).toBeInTheDocument()
    expect(screen.queryByText('Steering Document 3')).not.toBeInTheDocument()
    
    const cards = screen.getAllByTestId('steering-card')
    expect(cards).toHaveLength(2)
  })

  it('should display all steering documents when maxItems is larger than available', () => {
    render(<SteeringGrid steering={mockSteeringDocs} maxItems={10} />)
    
    const cards = screen.getAllByTestId('steering-card')
    expect(cards).toHaveLength(3)
  })

  it('should apply custom className to the grid container', () => {
    const { container } = render(<SteeringGrid steering={mockSteeringDocs} className="custom-grid-class" />)
    
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toHaveClass('custom-grid-class')
  })

  it('should apply h-full className to each steering card', () => {
    render(<SteeringGrid steering={mockSteeringDocs} />)
    
    const cards = screen.getAllByTestId('steering-card')
    cards.forEach(card => {
      expect(card).toHaveClass('h-full')
    })
  })

  it('should use responsive grid classes', () => {
    const { container } = render(<SteeringGrid steering={mockSteeringDocs} />)
    
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toHaveClass(
      'grid',
      'gap-6',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'auto-rows-fr'
    )
  })

  describe('Empty State', () => {
    it('should display empty state when no steering documents are provided', () => {
      render(<SteeringGrid steering={[]} />)
      
      expect(screen.getByText('No steering documents available')).toBeInTheDocument()
      expect(screen.getByText('Check back later for new AI guidance and configuration files')).toBeInTheDocument()
      expect(screen.queryByTestId('steering-card')).not.toBeInTheDocument()
    })

    it('should display all steering documents when maxItems is 0 (falsy)', () => {
      render(<SteeringGrid steering={mockSteeringDocs} maxItems={0} />)
      
      // maxItems of 0 is falsy, so should display all documents
      const cards = screen.getAllByTestId('steering-card')
      expect(cards).toHaveLength(3)
    })

    it('should center the empty state message', () => {
      const { container } = render(<SteeringGrid steering={[]} />)
      
      const emptyStateContainer = container.querySelector('.flex.items-center.justify-center')
      expect(emptyStateContainer).toBeInTheDocument()
      expect(emptyStateContainer).toHaveClass('py-12')
    })
  })

  describe('Edge Cases', () => {
    it('should handle single steering document', () => {
      render(<SteeringGrid steering={[mockSteeringDocs[0]]} />)
      
      const cards = screen.getAllByTestId('steering-card')
      expect(cards).toHaveLength(1)
      expect(screen.getByText('Steering Document 1')).toBeInTheDocument()
    })

    it('should handle maxItems of 1', () => {
      render(<SteeringGrid steering={mockSteeringDocs} maxItems={1} />)
      
      const cards = screen.getAllByTestId('steering-card')
      expect(cards).toHaveLength(1)
      expect(screen.getByText('Steering Document 1')).toBeInTheDocument()
    })

    it('should handle negative maxItems by slicing from end', () => {
      render(<SteeringGrid steering={mockSteeringDocs} maxItems={-1} />)
      
      // slice(0, -1) returns all elements except the last one
      const cards = screen.getAllByTestId('steering-card')
      expect(cards).toHaveLength(2)
      expect(screen.getByText('Steering Document 1')).toBeInTheDocument()
      expect(screen.getByText('Steering Document 2')).toBeInTheDocument()
      expect(screen.queryByText('Steering Document 3')).not.toBeInTheDocument()
    })
  })
})

describe('SteeringGridSkeleton', () => {
  it('should render default number of skeleton cards', () => {
    render(<SteeringGridSkeleton />)
    
    const skeletons = screen.getAllByTestId('steering-card-skeleton')
    expect(skeletons).toHaveLength(6) // Default count
  })

  it('should render specified number of skeleton cards', () => {
    render(<SteeringGridSkeleton count={3} />)
    
    const skeletons = screen.getAllByTestId('steering-card-skeleton')
    expect(skeletons).toHaveLength(3)
  })

  it('should apply custom className to the grid container', () => {
    const { container } = render(<SteeringGridSkeleton className="custom-skeleton-class" />)
    
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toHaveClass('custom-skeleton-class')
  })

  it('should apply h-full className to each skeleton card', () => {
    render(<SteeringGridSkeleton count={2} />)
    
    const skeletons = screen.getAllByTestId('steering-card-skeleton')
    skeletons.forEach(skeleton => {
      expect(skeleton).toHaveClass('h-full')
    })
  })

  it('should use the same responsive grid classes as SteeringGrid', () => {
    const { container } = render(<SteeringGridSkeleton />)
    
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toHaveClass(
      'grid',
      'gap-6',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'auto-rows-fr'
    )
  })

  it('should handle zero count gracefully', () => {
    render(<SteeringGridSkeleton count={0} />)
    
    const skeletons = screen.queryAllByTestId('steering-card-skeleton')
    expect(skeletons).toHaveLength(0)
  })

  it('should handle large count values', () => {
    render(<SteeringGridSkeleton count={12} />)
    
    const skeletons = screen.getAllByTestId('steering-card-skeleton')
    expect(skeletons).toHaveLength(12)
  })

  it('should match the grid structure of SteeringGrid', () => {
    const { container: skeletonContainer } = render(<SteeringGridSkeleton count={3} />)
    const { container: gridContainer } = render(<SteeringGrid steering={[
      {
        id: 'test-1',
        title: 'Test 1',
        author: 'Author',
        date: '2024-01-15',
        path: 'libraries/promptz/steering/test1.md',
        type: 'steering',
        content: 'Content'
      },
      {
        id: 'test-2',
        title: 'Test 2',
        author: 'Author',
        date: '2024-01-16',
        path: 'libraries/promptz/steering/test2.md',
        type: 'steering',
        content: 'Content'
      },
      {
        id: 'test-3',
        title: 'Test 3',
        author: 'Author',
        date: '2024-01-17',
        path: 'libraries/promptz/steering/test3.md',
        type: 'steering',
        content: 'Content'
      }
    ]} />)
    
    const skeletonGrid = skeletonContainer.querySelector('.grid')
    const actualGrid = gridContainer.querySelector('.grid')
    
    // Both should have the same grid classes
    expect(skeletonGrid?.className).toBe(actualGrid?.className)
  })
})