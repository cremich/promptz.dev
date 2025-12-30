import { render, screen } from '@testing-library/react'
import HooksPage from '@/app/hooks/page'
import { getAllHooks } from '@/lib/hooks'
import type { Hook } from '@/lib/types/content'

// Mock the hooks service
jest.mock('@/lib/hooks')
const mockGetAllHooks = getAllHooks as jest.MockedFunction<typeof getAllHooks>

// Mock the HooksGrid component
jest.mock('@/components/hooks-grid', () => ({
  HooksGrid: ({ hooks }: { hooks: Hook[] }) => (
    <div data-testid="hooks-grid">
      {hooks.map((hook) => (
        <div key={hook.id} data-testid="hook-item">
          {hook.title}
        </div>
      ))}
    </div>
  ),
  HooksGridSkeleton: ({ count }: { count?: number }) => (
    <div data-testid="hooks-grid-skeleton">
      Loading {count} hooks...
    </div>
  )
}))

const mockHooks: Hook[] = [
  {
    type: 'hook',
    id: 'promptz/hooks/test-hook-1',
    title: 'Test Hook 1',
    author: 'Test Author 1',
    date: '2024-01-15',
    path: '/libraries/promptz/hooks/test-hook-1.kiro.hook',
    description: 'Test hook 1 description',
    content: 'Test hook 1 content',
    trigger: 'userTriggered'
  },
  {
    type: 'hook',
    id: 'promptz/hooks/test-hook-2',
    title: 'Test Hook 2',
    author: 'Test Author 2',
    date: '2024-01-14',
    path: '/libraries/promptz/hooks/test-hook-2.kiro.hook',
    description: 'Test hook 2 description',
    content: 'Test hook 2 content',
    trigger: 'onFileSave'
  }
]

describe('HooksPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render page header correctly', async () => {
    mockGetAllHooks.mockResolvedValue(mockHooks)
    
    const page = await HooksPage()
    render(page)

    expect(screen.getByText('All Agent Hooks')).toBeInTheDocument()
    expect(screen.getByText(/Explore our complete collection of agent hooks and automation tools/)).toBeInTheDocument()
  })

  it('should render hooks grid with all hooks', async () => {
    mockGetAllHooks.mockResolvedValue(mockHooks)
    
    const page = await HooksPage()
    render(page)

    expect(screen.getByTestId('hooks-grid')).toBeInTheDocument()
    expect(screen.getByText('Test Hook 1')).toBeInTheDocument()
    expect(screen.getByText('Test Hook 2')).toBeInTheDocument()
  })

  it('should have correct page structure', async () => {
    mockGetAllHooks.mockResolvedValue(mockHooks)
    
    const page = await HooksPage()
    render(page)
    
    // Check for main container
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for header section
    expect(screen.getByText('All Agent Hooks')).toBeInTheDocument()
    
    // Check for hooks section
    expect(screen.getByTestId('hooks-grid')).toBeInTheDocument()
  })

  it('should call getAllHooks service', async () => {
    mockGetAllHooks.mockResolvedValue(mockHooks)
    
    await HooksPage()
    
    expect(mockGetAllHooks).toHaveBeenCalledTimes(1)
  })

  it('should render empty grid when no hooks available', async () => {
    mockGetAllHooks.mockResolvedValue([])
    
    const page = await HooksPage()
    render(page)

    expect(screen.getByTestId('hooks-grid')).toBeInTheDocument()
    expect(screen.queryByTestId('hook-item')).not.toBeInTheDocument()
  })
})