import 'server-only'
import { cache } from 'react'
import { readPromptzLibrary, readKiroLibrary } from './content-service'
import { compareDatesNewestFirst } from './utils/date-formatter'
import type { Power } from './types/content'

/**
 * Get all powers from all available libraries
 * Fetches from both promptz and kiro-powers libraries
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllPowers = cache(async (): Promise<Power[]> => {
  try {
    // Fetch both libraries in parallel
    const [promptzLibrary, kiroLibrary] = await Promise.all([
      readPromptzLibrary(),
      readKiroLibrary()
    ])
    
    // Combine powers from both libraries
    const allPowers = [
      ...promptzLibrary.powers,
      ...kiroLibrary.powers
    ]
    
    // Sort by creation date (newest first)
    // Use git creation date if available, otherwise fallback to frontmatter date
    return allPowers.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
  } catch (error) {
    console.error('Error fetching powers:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get the latest powers with optional limit
 * Used for homepage to display most recent powers
 * Defaults to returning all powers if no limit specified
 */
export const getLatestPowers = cache(async (limit?: number): Promise<Power[]> => {
  try {
    const allPowers = await getAllPowers()
    
    // Return limited results if limit specified
    if (limit && limit > 0) {
      return allPowers.slice(0, limit)
    }
    
    // Return all powers if no limit
    return allPowers
    
  } catch (error) {
    console.error('Error fetching latest powers:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})