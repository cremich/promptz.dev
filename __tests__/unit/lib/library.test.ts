import { getLibraryName } from '@/lib/library'

describe('getLibraryName', () => {
  it('should extract library name from valid path with libraries directory', () => {
    expect(getLibraryName('libraries/kiro-powers/agents/test-agent')).toBe('kiro-powers')
    expect(getLibraryName('libraries/promptz/prompts/test-prompt')).toBe('promptz')
  })

  it('should handle paths with full directory structure', () => {
    expect(getLibraryName('/full/path/to/libraries/kiro-powers/category/subcategory/test-agent')).toBe('kiro-powers')
    expect(getLibraryName('some/prefix/libraries/promptz/prompts/test-prompt.md')).toBe('promptz')
  })

  it('should return "unknown" for paths without libraries directory', () => {
    expect(getLibraryName('agents/test-agent')).toBe('unknown')
    expect(getLibraryName('prompts/test-prompt')).toBe('unknown')
    expect(getLibraryName('invalid/path/structure')).toBe('unknown')
  })

  it('should return "unknown" for paths with libraries but no library name', () => {
    expect(getLibraryName('libraries/')).toBe('unknown')
    expect(getLibraryName('libraries')).toBe('unknown')
  })

  it('should handle empty library name', () => {
    expect(getLibraryName('libraries//agents/test-agent')).toBe('unknown')
  })

  it('should handle edge cases', () => {
    expect(getLibraryName('')).toBe('unknown')
    expect(getLibraryName('/')).toBe('unknown')
    expect(getLibraryName('libraries')).toBe('unknown')
  })

  it('should handle multiple libraries directories (use first one)', () => {
    expect(getLibraryName('libraries/first-lib/libraries/second-lib/test')).toBe('first-lib')
  })
})