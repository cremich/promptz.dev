import { render, screen } from '@testing-library/react'
import { PowersGrid, PowersGridSkeleton } from '@/components/powers-grid'
import type { Power } from '@/lib/types/content'

// Mock the PowerCard component
jest.mock('@/components/power-card', () => ({
  PowerCard: ({ power }: { power: Power }) => (
    <div data-testid="power-card">{power.displayName || power.title}</div>
  ),
  PowerCardSkeleton: () => <div data-testid="power-card-skeleton">Loading...</div>
}))

describe('PowersGrid', () => {
  const mockPowers: Power[] = [
    {
      id: 'power-1',
      title: 'Power 1',
      displayName: 'First Power',
      author: 'Author 1',
      date: '2024-01-15',
      path: 'libraries/kiro-powers/power1/POWER.md',
      type: 'power',
      description: 'First test power',
      keywords: ['test'],
      content: 'Content 1'
    },
    {
      id: 'power-2',
      title: 'Power 2',
      displayName: 'Second Power',
      author: 'Author 2',
      date: '2024-01-16',
      path: 'libraries/kiro-powers/power2/POWER.md',
      type: 'power',
      description: 'Second test power',
      keywords: ['test'],
      content: 'Content 2'
    },
    {
      id: 'power-3',
      title: 'Power 3',
      displayName: 'Third Power',
      author: 'Author 3',
      date: '2024-01-17',
      path: 'libraries/kiro-powers/power3/POWER.md',
      type: 'power',
      description: 'Third test power',
      keywords: ['test'],
      content: 'Content 3'
    }
  ]

  it('should render all powers when no maxItems limit is set', () => {
    render(<PowersGrid powers={mockPowers} />)
    
    expect(screen.getByText('First Power')).toBeInTheDocument()
    expect(screen.getByText('Second Power')).toBeInTheDocument()
    expect(screen.getByText('Third Power')).toBeInTheDocument()
    
    const powerCards = screen.getAllByTestId('power-card')
    expect(powerCards).toHaveLength(3)
  })

  it('should limit powers display when maxItems is specified', () => {
    render(<PowersGrid powers={mockPowers} maxItems={2} />)
    
    expect(screen.getByText('First Power')).toBeInTheDocument()
    expect(screen.getByText('Second Power')).toBeInTheDocument()
    expect(screen.queryByText('Third Power')).not.toBeInTheDocument()
    
    const powerCards = screen.getAllByTestId('power-card')
    expect(powerCards).toHaveLength(2)
  })

  it('should handle maxItems larger than available powers', () => {
    render(<PowersGrid powers={mockPowers} maxItems={10} />)
    
    const powerCards = screen.getAllByTestId('power-card')
    expect(powerCards).toHaveLength(3)
  })

  it('should handle maxItems of 0', () => {
    render(<PowersGrid powers={mockPowers} maxItems={0} />)
    
    const powerCards = screen.queryAllByTestId('power-card')
    expect(powerCards).toHaveLength(0)
  })

  it('should apply custom className to grid container', () => {
    const { container } = render(
      <PowersGrid powers={mockPowers} className="custom-grid-class" />
    )
    
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveClass('custom-grid-class')
  })

  it('should use responsive grid classes', () => {
    const { container } = render(<PowersGrid powers={mockPowers} />)
    
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveClass(
      'grid',
      'gap-6',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'auto-rows-fr'
    )
  })

  it('should display empty state when no powers are provided', () => {
    render(<PowersGrid powers={[]} />)
    
    expect(screen.getByText('No powers available')).toBeInTheDocument()
    expect(screen.getByText('Check back later for new Kiro powers and tools')).toBeInTheDocument()
    expect(screen.queryByTestId('power-card')).not.toBeInTheDocument()
  })

  it('should display empty state when maxItems is 0', () => {
    render(<PowersGrid powers={mockPowers} maxItems={0} />)
    
    expect(screen.getByText('No powers available')).toBeInTheDocument()
    expect(screen.queryByTestId('power-card')).not.toBeInTheDocument()
  })

  it('should center empty state content', () => {
    const { container } = render(<PowersGrid powers={[]} />)
    
    const emptyState = container.querySelector('.flex.items-center.justify-center')
    expect(emptyState).toBeInTheDocument()
    expect(emptyState).toHaveClass('py-12')
  })
})

describe('PowersGridSkeleton', () => {
  it('should render default number of skeleton cards', () => {
    render(<PowersGridSkeleton />)
    
    const skeletonCards = screen.getAllByTestId('power-card-skeleton')
    expect(skeletonCards).toHaveLength(6)
  })

  it('should render custom number of skeleton cards', () => {
    render(<PowersGridSkeleton count={3} />)
    
    const skeletonCards = screen.getAllByTestId('power-card-skeleton')
    expect(skeletonCards).toHaveLength(3)
  })

  it('should apply custom className to grid container', () => {
    const { container } = render(<PowersGridSkeleton className="custom-skeleton-class" />)
    
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveClass('custom-skeleton-class')
  })

  it('should use same responsive grid classes as PowersGrid', () => {
    const { container } = render(<PowersGridSkeleton />)
    
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveClass(
      'grid',
      'gap-6',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'auto-rows-fr'
    )
  })

  it('should handle count of 0', () => {
    render(<PowersGridSkeleton count={0} />)
    
    const skeletonCards = screen.queryAllByTestId('power-card-skeleton')
    expect(skeletonCards).toHaveLength(0)
  })
})