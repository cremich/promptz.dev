import 'server-only'
import { cache } from 'react'
import { readPromptzLibrary } from './content-service'
import { compareDatesNewestFirst } from './utils/date-formatter'
import type { Agent } from './types/content'

/**
 * Get all agents from all available libraries
 * Currently fetches from promptz library (kiro-powers contains only powers, not agents)
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllAgents = cache(async (): Promise<Agent[]> => {
  try {
    // Fetch promptz library which contains the agents
    const promptzLibrary = await readPromptzLibrary()
    const allAgents = promptzLibrary.agents
    
    // Sort by creation date (newest first)
    // Use git creation date if available, otherwise fallback to frontmatter date
    return allAgents.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
  } catch (error) {
    console.error('Error fetching agents:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get the latest agents with optional limit
 * Used for homepage to display most recent agents
 * Defaults to returning all agents if no limit specified
 */
export const getLatestAgents = cache(async (limit?: number): Promise<Agent[]> => {
  try {
    const allAgents = await getAllAgents()
    
    // Return limited results if limit specified and greater than 0
    if (limit !== undefined && limit > 0) {
      return allAgents.slice(0, limit)
    }
    
    // Return empty array if limit is 0 or negative
    if (limit !== undefined && limit <= 0) {
      return []
    }
    
    // Return all agents if no limit
    return allAgents
    
  } catch (error) {
    console.error('Error fetching latest agents:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})