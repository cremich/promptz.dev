/**
 * Library utilities for extracting and working with library information from content paths
 */

/**
 * Extract library name from content path
 * @param path - The full path to the content file
 * @returns The library name or 'unknown' if not found
 * 
 * @example
 * getLibraryName('libraries/kiro-powers/agents/test-agent') // returns 'kiro-powers'
 * getLibraryName('libraries/promptz/prompts/test-prompt') // returns 'promptz'
 * getLibraryName('invalid/path') // returns 'unknown'
 */
export function getLibraryName(path: string): string {
  const pathParts = path.split('/');
  const librariesIndex = pathParts.indexOf('libraries');
  if (librariesIndex !== -1 && librariesIndex + 1 < pathParts.length) {
    const libraryName = pathParts[librariesIndex + 1];
    return libraryName || 'unknown';
  }
  return 'unknown';
}