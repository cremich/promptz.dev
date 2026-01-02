import React from 'react'
import { render, screen } from '@testing-library/react'
import { SearchModal } from '@/components/search/SearchModal'
import { SearchProvider } from '@/components/search-provider'

// Mock the dialog component to avoid portal rendering issues in tests
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
}))

describe('SearchModal', () => {
  it('should render when search is closed', () => {
    render(
      <SearchProvider>
        <SearchModal />
      </SearchProvider>
    )

    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
  })

  it('should render basic content', () => {
    render(
      <SearchProvider>
        <SearchModal />
      </SearchProvider>
    )

    expect(screen.getByText('Search Modal - Basic Implementation')).toBeInTheDocument()
    expect(screen.getByText('Press ESC to close or click outside')).toBeInTheDocument()
  })

  it('should have correct dialog content styling', () => {
    render(
      <SearchProvider>
        <SearchModal />
      </SearchProvider>
    )

    const dialogContent = screen.getByTestId('dialog-content')
    expect(dialogContent).toHaveClass('max-w-2xl', 'max-h-[80vh]', 'p-0', 'gap-0')
  })
})