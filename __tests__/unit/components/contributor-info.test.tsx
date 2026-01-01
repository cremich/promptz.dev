import { render, screen } from '@testing-library/react'
import { ContributorInfo } from '@/components/contributor-info'
import type { Agent, ContentItem } from '@/lib/types/content'

// Mock the date formatter
jest.mock('@/lib/formatter/date', () => ({
  getFormattedDisplayDate: jest.fn((gitDate: string | undefined, fallbackDate: string | null) => {
    if (gitDate) return `Formatted: ${gitDate}`
    if (fallbackDate) return `Formatted: ${fallbackDate}`
    return null
  })
}))

// Mock the GitHubLink component
jest.mock('@/components/github-link', () => ({
  GitHubLink: ({ content }: { content: ContentItem }) => (
    <a 
      href={`https://github.com/test/repo/blob/main/${content.id}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="github-link"
    >
      View on GitHub
    </a>
  )
}))

describe('ContributorInfo', () => {
  const mockAgent: Agent = {
    id: 'test-agent',
    type: 'agent',
    title: 'Test Agent',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/test-lib/agents/test-agent',
    description: 'A test agent',
    config: { mcpServers: ['test-server'] },
    content: 'Test content'
  }

  it('should render basic contributor information', () => {
    render(<ContributorInfo content={mockAgent} />)
    
    expect(screen.getByText('Contributor Information')).toBeInTheDocument()
    expect(screen.getByText('Author')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
  })

  it('should render git information when available', () => {
    const agentWithGit: Agent = {
      ...mockAgent,
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '2024-01-02T00:00:00Z',
        commitHash: 'abc123def456',
        commitMessage: 'Initial commit'
      }
    }

    render(<ContributorInfo content={agentWithGit} />)
    
    expect(screen.getByText('Git Author')).toBeInTheDocument()
    expect(screen.getByText('Last Modified')).toBeInTheDocument()
    expect(screen.getByText('Latest Commit')).toBeInTheDocument()
    expect(screen.getByText('abc123d')).toBeInTheDocument() // Short hash
  })

  it('should fallback to frontmatter data when git info is not available', () => {
    render(<ContributorInfo content={mockAgent} />)
    
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.queryByText('Last Modified')).not.toBeInTheDocument()
    expect(screen.queryByText('Latest Commit')).not.toBeInTheDocument()
  })

  it('should render GitHub link', () => {
    render(<ContributorInfo content={mockAgent} />)
    
    const githubLink = screen.getByTestId('github-link')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should not render last modified date when not available', () => {
    const agentWithPartialGit: Agent = {
      ...mockAgent,
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '',
        commitHash: 'abc123def456',
        commitMessage: 'Initial commit'
      }
    }

    render(<ContributorInfo content={agentWithPartialGit} />)
    
    expect(screen.queryByText('Last Modified')).not.toBeInTheDocument()
  })

  it('should not render commit hash when not available', () => {
    const agentWithoutCommitHash: Agent = {
      ...mockAgent,
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '2024-01-02T00:00:00Z',
        commitHash: '',
        commitMessage: 'Initial commit'
      }
    }

    render(<ContributorInfo content={agentWithoutCommitHash} />)
    
    expect(screen.queryByText('Latest Commit')).not.toBeInTheDocument()
  })
})