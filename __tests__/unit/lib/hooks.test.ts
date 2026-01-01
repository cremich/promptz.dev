import { getAllHooks, getLatestHooks } from '@/lib/hooks'

// Mock the JSON import - Jest will automatically use the mock file
jest.mock('@/data/hooks.json', () => jest.requireActual('../../../__mocks__/data/hooks.json'))

describe('getAllHooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return all hooks from JSON data', async () => {
    const result = await getAllHooks()

    expect(result).toHaveLength(3)
    expect(result[0].id).toBe('hook-1')
    expect(result[1].id).toBe('hook-2')
    expect(result[2].id).toBe('hook-3')
  })

  test('should return hooks sorted by creation date (newest first)', async () => {
    const result = await getAllHooks()

    // Should be sorted by git creation date (newest first): hook-1 (2024-01-15), hook-2 (2024-01-14), hook-3 (2024-01-13)
    expect(result[0].date).toBe('2024-01-15')
    expect(result[1].date).toBe('2024-01-14')
    expect(result[2].date).toBe('2024-01-13')
  })

  test('should return empty array when JSON processing fails', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the JSON data to be invalid
    jest.doMock('@/data/hooks.json', () => null)
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getAllHooks: getAllHooksWithError } = await import('@/lib/hooks')
    
    const result = await getAllHooksWithError()

    expect(result).toHaveLength(0)
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching hooks:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  test('should use git creation date for sorting when available', async () => {
    const result = await getAllHooks()

    // Hook 1 has git info, should be sorted by git creation date
    expect(result[0].git?.createdDate).toBe('2024-01-15T10:00:00Z')
  })
})

describe('getLatestHooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return all hooks when no limit specified', async () => {
    const result = await getLatestHooks()

    expect(result).toHaveLength(3)
  })

  test('should return limited number of hooks when limit specified', async () => {
    const result = await getLatestHooks(2)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('hook-1') // Should be the newest
    expect(result[1].id).toBe('hook-2')
  })

  test('should return all hooks when limit is larger than available hooks', async () => {
    const result = await getLatestHooks(10)

    expect(result).toHaveLength(3)
  })

  test('should return empty array when limit is 0', async () => {
    const result = await getLatestHooks(0)

    expect(result).toEqual([])
  })

  test('should return empty array when limit is negative', async () => {
    const result = await getLatestHooks(-1)

    expect(result).toEqual([])
  })

  test('should handle errors gracefully', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the JSON data to be invalid
    jest.doMock('@/data/hooks.json', () => null)
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getLatestHooks: getLatestHooksWithError } = await import('@/lib/hooks')

    const result = await getLatestHooksWithError(5)

    expect(result).toHaveLength(0)
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching hooks:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  test('should return empty array when no hooks available', async () => {
    // Mock empty array
    jest.doMock('@/data/hooks.json', () => [])
    
    // Re-import the module to get the new mock
    jest.resetModules()
    const { getLatestHooks: getLatestHooksEmpty } = await import('@/lib/hooks')

    const result = await getLatestHooksEmpty(5)

    expect(result).toEqual([])
  })
})