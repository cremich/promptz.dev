import { render, screen } from '@testing-library/react'
import { PromptsGrid } from '@/components/prompts-grid'
import type { Prompt } from '@/lib/types/content'

// Mock the PromptCard component
jest.mock('@/components/prompt-card', () => ({
  PromptCard: ({ prompt }: { prompt: Prompt }) => (
    <div data-testid={`prompt-card-${prompt.id}`}>
      {prompt.title}
    </div>
  )
}))

describe('PromptsGrid', () => {
  const mockPrompts: Prompt[] = [
    {
      id: 'prompt-1',
      title: 'First Prompt',
      author: 'Author 1',
      date: '2024-01-15',
      path: 'libraries/promptz/prompts/first.md',
      type: 'prompt',
      content: 'First content'
    },
    {
      id: 'prompt-2',
      title: 'Second Prompt',
      author: 'Author 2',
      date: '2024-01-16',
      path: 'libraries/promptz/prompts/second.md',
      type: 'prompt',
      content: 'Second content'
    },
    {
      id: 'prompt-3',
      title: 'Third Prompt',
      author: 'Author 3',
      date: '2024-01-17',
      path: 'libraries/promptz/prompts/third.md',
      type: 'prompt',
      content: 'Third content'
    }
  ]

  it('should render all prompts when no maxItems is specified', () => {
    render(<PromptsGrid prompts={mockPrompts} />)
    
    expect(screen.getByTestId('prompt-card-prompt-1')).toBeInTheDocument()
    expect(screen.getByTestId('prompt-card-prompt-2')).toBeInTheDocument()
    expect(screen.getByTestId('prompt-card-prompt-3')).toBeInTheDocument()
  })

  it('should limit prompts when maxItems is specified', () => {
    render(<PromptsGrid prompts={mockPrompts} maxItems={2} />)
    
    expect(screen.getByTestId('prompt-card-prompt-1')).toBeInTheDocument()
    expect(screen.getByTestId('prompt-card-prompt-2')).toBeInTheDocument()
    expect(screen.queryByTestId('prompt-card-prompt-3')).not.toBeInTheDocument()
  })

  it('should display empty state when no prompts are provided', () => {
    render(<PromptsGrid prompts={[]} />)
    
    expect(screen.getByText('No prompts available')).toBeInTheDocument()
    expect(screen.getByText('Check back later for new AI development prompts')).toBeInTheDocument()
  })

  it('should apply responsive grid classes', () => {
    const { container } = render(<PromptsGrid prompts={mockPrompts} />)
    
    const gridElement = container.querySelector('.grid')
    expect(gridElement).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('should apply equal height grid rows', () => {
    const { container } = render(<PromptsGrid prompts={mockPrompts} />)
    
    const gridElement = container.querySelector('.grid')
    expect(gridElement).toHaveClass('auto-rows-fr')
  })

  it('should apply custom className when provided', () => {
    const { container } = render(<PromptsGrid prompts={mockPrompts} className="custom-class" />)
    
    const gridElement = container.querySelector('.grid')
    expect(gridElement).toHaveClass('custom-class')
  })

  it('should handle empty prompts with maxItems specified', () => {
    render(<PromptsGrid prompts={[]} maxItems={5} />)
    
    expect(screen.getByText('No prompts available')).toBeInTheDocument()
  })
})