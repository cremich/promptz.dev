import { render, screen } from '@testing-library/react'
import { ContentTypeBadge } from '@/components/content-type-badge'

// Mock the Badge component
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode, variant: string, className: string }) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  )
}))

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}))

describe('ContentTypeBadge', () => {
  it('should render prompt badge with secondary variant', () => {
    render(<ContentTypeBadge contentType="prompt" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('prompt')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
    expect(badge).toHaveClass('text-xs')
  })

  it('should render agent badge with default variant', () => {
    render(<ContentTypeBadge contentType="agent" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('agent')
    expect(badge).toHaveAttribute('data-variant', 'default')
  })

  it('should render power badge with default variant', () => {
    render(<ContentTypeBadge contentType="power" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('power')
    expect(badge).toHaveAttribute('data-variant', 'default')
  })

  it('should render hook badge with outline variant', () => {
    render(<ContentTypeBadge contentType="hook" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('hook')
    expect(badge).toHaveAttribute('data-variant', 'outline')
  })

  it('should render steering badge with outline variant', () => {
    render(<ContentTypeBadge contentType="steering" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('steering')
    expect(badge).toHaveAttribute('data-variant', 'outline')
  })

  it('should apply custom className', () => {
    render(<ContentTypeBadge contentType="prompt" className="custom-class" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('text-xs custom-class')
  })

  it('should use secondary variant for unknown content type', () => {
    render(<ContentTypeBadge contentType="unknown" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('data-variant', 'secondary')
  })
})