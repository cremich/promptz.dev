import { render, screen } from '@testing-library/react'
import { LibraryBadge } from '@/components/library-badge'

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

describe('LibraryBadge', () => {
  it('should render promptz library with blue styling', () => {
    render(<LibraryBadge libraryName="promptz" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('promptz')
    expect(badge).toHaveAttribute('data-variant', 'outline')
    expect(badge).toHaveClass('text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300')
  })

  it('should render kiro-powers library with purple styling', () => {
    render(<LibraryBadge libraryName="kiro-powers" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('kiro-powers')
    expect(badge).toHaveAttribute('data-variant', 'outline')
    expect(badge).toHaveClass('text-xs border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300')
  })

  it('should render unknown library with default styling', () => {
    render(<LibraryBadge libraryName="unknown-lib" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('unknown-lib')
    expect(badge).toHaveAttribute('data-variant', 'outline')
    expect(badge).toHaveClass('text-xs')
  })

  it('should be case insensitive for library names', () => {
    render(<LibraryBadge libraryName="PROMPTZ" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300')
  })

  it('should apply custom className', () => {
    render(<LibraryBadge libraryName="promptz" className="custom-class" />)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300 custom-class')
  })
})