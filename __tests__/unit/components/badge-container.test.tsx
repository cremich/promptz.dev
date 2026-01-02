import { render, screen } from '@testing-library/react'
import { BadgeContainer } from '@/components/badge-container'

describe('BadgeContainer', () => {
  const mockChildren = (
    <>
      <span data-testid="badge-1">Badge 1</span>
      <span data-testid="badge-2">Badge 2</span>
      <span data-testid="badge-3">Badge 3</span>
    </>
  )

  describe('default context', () => {
    it('should render with default context classes when no context is provided', () => {
      render(<BadgeContainer>{mockChildren}</BadgeContainer>)
      
      const container = screen.getByTestId('badge-1').parentElement
      expect(container).toHaveClass('flex flex-wrap gap-1')
    })

    it('should render with default context classes when context is explicitly set to default', () => {
      render(<BadgeContainer context="default">{mockChildren}</BadgeContainer>)
      
      const container = screen.getByTestId('badge-1').parentElement
      expect(container).toHaveClass('flex flex-wrap gap-1')
    })

    it('should render all children in default context', () => {
      render(<BadgeContainer context="default">{mockChildren}</BadgeContainer>)
      
      expect(screen.getByTestId('badge-1')).toBeInTheDocument()
      expect(screen.getByTestId('badge-2')).toBeInTheDocument()
      expect(screen.getByTestId('badge-3')).toBeInTheDocument()
    })
  })

  describe('card-header context', () => {
    it('should render with card-header context classes', () => {
      render(<BadgeContainer context="card-header">{mockChildren}</BadgeContainer>)
      
      const container = screen.getByTestId('badge-1').parentElement
      expect(container).toHaveClass('flex flex-wrap gap-1 shrink-0')
    })

    it('should render all children in card-header context', () => {
      render(<BadgeContainer context="card-header">{mockChildren}</BadgeContainer>)
      
      expect(screen.getByTestId('badge-1')).toBeInTheDocument()
      expect(screen.getByTestId('badge-2')).toBeInTheDocument()
      expect(screen.getByTestId('badge-3')).toBeInTheDocument()
    })
  })

  describe('card-footer context', () => {
    it('should render with card-footer context classes', () => {
      render(<BadgeContainer context="card-footer">{mockChildren}</BadgeContainer>)
      
      const container = screen.getByTestId('badge-1').parentElement
      expect(container).toHaveClass('flex gap-1')
    })

    it('should render all children in card-footer context', () => {
      render(<BadgeContainer context="card-footer">{mockChildren}</BadgeContainer>)
      
      expect(screen.getByTestId('badge-1')).toBeInTheDocument()
      expect(screen.getByTestId('badge-2')).toBeInTheDocument()
      expect(screen.getByTestId('badge-3')).toBeInTheDocument()
    })
  })

  describe('list-item context', () => {
    it('should render with list-item context classes', () => {
      render(<BadgeContainer context="list-item">{mockChildren}</BadgeContainer>)
      
      const container = screen.getByTestId('badge-1').parentElement
      expect(container).toHaveClass('flex gap-1')
    })

    it('should render all children in list-item context', () => {
      render(<BadgeContainer context="list-item">{mockChildren}</BadgeContainer>)
      
      expect(screen.getByTestId('badge-1')).toBeInTheDocument()
      expect(screen.getByTestId('badge-2')).toBeInTheDocument()
      expect(screen.getByTestId('badge-3')).toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('should apply custom className along with context classes', () => {
      render(
        <BadgeContainer context="card-header" className="custom-class">
          {mockChildren}
        </BadgeContainer>
      )
      
      const container = screen.getByTestId('badge-1').parentElement
      expect(container).toHaveClass('flex flex-wrap gap-1 shrink-0 custom-class')
    })

    it('should apply custom className with default context', () => {
      render(
        <BadgeContainer className="another-custom-class">
          {mockChildren}
        </BadgeContainer>
      )
      
      const container = screen.getByTestId('badge-1').parentElement
      expect(container).toHaveClass('flex flex-wrap gap-1 another-custom-class')
    })
  })

  describe('children rendering', () => {
    it('should render single child', () => {
      render(
        <BadgeContainer>
          <span data-testid="single-badge">Single Badge</span>
        </BadgeContainer>
      )
      
      expect(screen.getByTestId('single-badge')).toBeInTheDocument()
      expect(screen.getByTestId('single-badge')).toHaveTextContent('Single Badge')
    })

    it('should render multiple children', () => {
      render(<BadgeContainer>{mockChildren}</BadgeContainer>)
      
      expect(screen.getByTestId('badge-1')).toBeInTheDocument()
      expect(screen.getByTestId('badge-2')).toBeInTheDocument()
      expect(screen.getByTestId('badge-3')).toBeInTheDocument()
    })

    it('should render complex children with nested elements', () => {
      render(
        <BadgeContainer>
          <div data-testid="complex-child">
            <span>Nested content</span>
            <button>Button</button>
          </div>
        </BadgeContainer>
      )
      
      const complexChild = screen.getByTestId('complex-child')
      expect(complexChild).toBeInTheDocument()
      expect(complexChild).toHaveTextContent('Nested content')
      expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument()
    })
  })

  describe('getBadgeArrangement function coverage', () => {
    it('should handle all context variants correctly', () => {
      // Test each context to ensure all switch cases are covered
      const contexts: Array<'card-header' | 'card-footer' | 'list-item' | 'default'> = [
        'card-header',
        'card-footer', 
        'list-item',
        'default'
      ]

      contexts.forEach(context => {
        render(
          <BadgeContainer context={context}>
            <span data-testid={`test-${context}`}>Test</span>
          </BadgeContainer>
        )
        
        const container = screen.getByTestId(`test-${context}`).parentElement
        expect(container).toBeInTheDocument()
        
        // Verify specific classes for each context
        switch (context) {
          case 'card-header':
            expect(container).toHaveClass('flex flex-wrap gap-1 shrink-0')
            break
          case 'card-footer':
            expect(container).toHaveClass('flex gap-1')
            break
          case 'list-item':
            expect(container).toHaveClass('flex gap-1')
            break
          case 'default':
            expect(container).toHaveClass('flex flex-wrap gap-1')
            break
        }
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty children gracefully', () => {
      const { container } = render(<BadgeContainer>{null}</BadgeContainer>)
      
      // Should render container even with no children
      const badgeContainer = container.firstChild as HTMLElement
      expect(badgeContainer).toBeInTheDocument()
      expect(badgeContainer).toHaveClass('flex flex-wrap gap-1')
    })

    it('should handle undefined children gracefully', () => {
      const { container } = render(<BadgeContainer>{undefined}</BadgeContainer>)
      
      const badgeContainer = container.firstChild as HTMLElement
      expect(badgeContainer).toBeInTheDocument()
      expect(badgeContainer).toHaveClass('flex flex-wrap gap-1')
    })

    it('should handle false children gracefully', () => {
      const { container } = render(<BadgeContainer>{false}</BadgeContainer>)
      
      const badgeContainer = container.firstChild as HTMLElement
      expect(badgeContainer).toBeInTheDocument()
      expect(badgeContainer).toHaveClass('flex flex-wrap gap-1')
    })
  })
})