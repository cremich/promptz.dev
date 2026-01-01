import { render, screen } from '@testing-library/react'
import { PromptCard, PromptCardSkeleton } from '@/components/prompt-card'
import type { Prompt } from '@/lib/types/content'

// Mock the git utility functions
jest.mock('@/lib/utils/git-extractor', () => ({
  getShortHash: jest.fn((hash: string) => hash.substring(0, 7))
}))

// Mock the date formatter functions
jest.mock('@/lib/formatter/date', () => ({
  getFormattedDisplayDate: jest.fn(() => 'Jan 15, 2024')
}))

describe('PromptCard', () => {
  const mockPrompt: Prompt = {
    id: 'promptz/prompts/test-prompt',
    title: 'Test Prompt',
    author: 'Test Author',
    date: '2024-01-15',
    path: 'libraries/promptz/prompts/test-prompt.md',
    type: 'prompt',
    content: 'Test content',
    git: {
      author: 'Git Author',
      authorEmail: 'git@example.com',
      createdDate: '2024-01-15T10:00:00Z',
      lastModifiedDate: '2024-01-16T10:00:00Z',
      commitHash: 'abc1234567890',
      commitMessage: 'Add test prompt'
    }
  }

  it('should render prompt title prominently', () => {
    render(<PromptCard prompt={mockPrompt} />)
    
    const title = screen.getByText('Test Prompt')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-lg', 'font-semibold')
  })

  it('should display prompt ID', () => {
    render(<PromptCard prompt={mockPrompt} />)
    
    expect(screen.getByText('ID:')).toBeInTheDocument()
    expect(screen.getByText('promptz/prompts/test-prompt')).toBeInTheDocument()
  })

  it('should show prompt type badge', () => {
    render(<PromptCard prompt={mockPrompt} />)
    
    const promptBadge = screen.getByText('prompt')
    expect(promptBadge).toBeInTheDocument()
  })

  it('should show library source badge', () => {
    render(<PromptCard prompt={mockPrompt} />)
    
    const libraryBadge = screen.getByText('promptz')
    expect(libraryBadge).toBeInTheDocument()
  })

  it('should display git author when git information is available', () => {
    render(<PromptCard prompt={mockPrompt} />)
    
    expect(screen.getByText('Author:')).toBeInTheDocument()
    expect(screen.getByText('Git Author')).toBeInTheDocument()
  })

  it('should display git creation date when git information is available', () => {
    render(<PromptCard prompt={mockPrompt} />)
    
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  it('should display short commit hash when git information is available', () => {
    render(<PromptCard prompt={mockPrompt} />)
    
    const commitHash = screen.getByText('abc1234')
    expect(commitHash).toBeInTheDocument()
    expect(commitHash).toHaveClass('font-mono')
  })

  it('should fall back to frontmatter data when git information is not available', () => {
    const promptWithoutGit: Prompt = {
      ...mockPrompt,
      git: undefined
    }
    
    render(<PromptCard prompt={promptWithoutGit} />)
    
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    expect(screen.queryByText('abc1234')).not.toBeInTheDocument()
  })

  it('should extract library name from different paths', () => {
    const kiroPrompt: Prompt = {
      ...mockPrompt,
      id: 'kiro-powers/prompts/test',
      path: 'libraries/kiro-powers/prompts/test.md'
    }
    
    render(<PromptCard prompt={kiroPrompt} />)
    
    expect(screen.getByText('kiro-powers')).toBeInTheDocument()
  })

  it('should handle unknown library paths', () => {
    const unknownPrompt: Prompt = {
      ...mockPrompt,
      id: 'unknown/prompts/test',
      path: 'some/other/path/test.md'
    }
    
    render(<PromptCard prompt={unknownPrompt} />)
    
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})

describe('PromptCardSkeleton', () => {
  it('should render skeleton elements with proper structure', () => {
    render(<PromptCardSkeleton />)
    
    // Check that skeleton elements are present
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should apply custom className when provided', () => {
    const { container } = render(<PromptCardSkeleton className="custom-class" />)
    
    const card = container.querySelector('[data-slot="card"]')
    expect(card).toHaveClass('custom-class')
  })

  it('should have the same card structure as PromptCard', () => {
    const { container } = render(<PromptCardSkeleton />)
    
    // Check for card structure elements
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
  })
})