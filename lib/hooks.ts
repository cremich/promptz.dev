import 'server-only'
import { cache } from 'react'
import { readPromptzLibrary } from './content-service'
import { compareDatesNewestFirst } from './utils/date-formatter'
import type { Hook } from './types/content'

/**
 * Get all hooks from all available libraries
 * Currently fetches from promptz library (kiro-powers contains only powers, not hooks)
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllHooks = cache(async (): Promise<Hook[]> => {
  try {
    // Fetch promptz library which contains the hooks
    const promptzLibrary = await readPromptzLibrary()
    const allHooks = promptzLibrary.hooks
    
    // Sort by creation date (newest first)
    // Use git creation date if available, otherwise fallback to frontmatter date
    return allHooks.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
  } catch (error) {
    console.error('Error fetching hooks:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get the latest hooks with optional limit
 * Used for homepage to display most recent hooks
 * Defaults to returning all hooks if no limit specified
 */
export const getLatestHooks = cache(async (limit?: number): Promise<Hook[]> => {
  try {
    const allHooks = await getAllHooks()
    
    // Return limited results if limit specified and greater than 0
    if (limit !== undefined && limit > 0) {
      return allHooks.slice(0, limit)
    }
    
    // Return empty array if limit is 0 or negative
    if (limit !== undefined && limit <= 0) {
      return []
    }
    
    // Return all hooks if no limit
    return allHooks
    
  } catch (error) {
    console.error('Error fetching latest hooks:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get a specific hook by its ID
 * Used for hook detail pages
 * Returns null if hook not found
 */
export const getHookById = cache(async (id: string): Promise<Hook | null> => {
  try {
    const allHooks = await getAllHooks()
    
    // Find hook with matching ID
    const hook = allHooks.find(h => h.id === id)
    
    return hook || null
    
  } catch (error) {
    console.error('Error fetching hook by ID:', error)
    // Return null on error to trigger 404 page
    return null
  }
})