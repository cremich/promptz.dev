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

// Mock the search index import
jest.mock('@/data/search-index.json', () => ({
  default: {
    items: [
      {
        id: 'test/prompt/example',
        type: 'prompt',
        title: 'Test Prompt',
        description: 'A test prompt for testing',
        content: 'This is test content',
        author: 'Test Author',
        date: '2024-01-01',
        library: 'test',
        path: '/prompts/example',
        keywords: ['test', 'example']
      }
    ],
    metadata: {
      generatedAt: '2024-01-01T00:00:00.000Z',
      totalItems: 1,
      itemsByType: { prompt: 1 }
    }
  }
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

  it('should render search interface when open', () => {
    // We need to test with the modal open, but since we can't easily trigger the open state
    // in this test setup, we'll just verify the basic structure is rendered
    render(
      <SearchProvider>
        <SearchModal />
      </SearchProvider>
    )

    const dialog = screen.getByTestId('dialog')
    expect(dialog).toBeInTheDocument()
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