import 'server-only'
import { cache } from 'react'
import { readPromptzLibrary } from './content-service'
import type { Prompt } from './types/content'

/**
 * Get all prompts from all available libraries
 * Currently fetches from promptz library (kiro-powers contains only powers, not prompts)
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllPrompts = cache(async (): Promise<Prompt[]> => {
  try {
    // Fetch promptz library which contains the prompts
    const promptzLibrary = await readPromptzLibrary()
    const allPrompts = promptzLibrary.prompts
    
    // Sort by creation date (newest first)
    // Use git creation date if available, otherwise fallback to frontmatter date
    return allPrompts.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
    
  } catch (error) {
    console.error('Error fetching prompts:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get the latest prompts with optional limit
 * Used for homepage to display most recent prompts
 * Defaults to returning all prompts if no limit specified
 */
export const getLatestPrompts = cache(async (limit?: number): Promise<Prompt[]> => {
  try {
    const allPrompts = await getAllPrompts()
    
    // Return limited results if limit specified
    if (limit && limit > 0) {
      return allPrompts.slice(0, limit)
    }
    
    // Return all prompts if no limit
    return allPrompts
    
  } catch (error) {
    console.error('Error fetching latest prompts:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})