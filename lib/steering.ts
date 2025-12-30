import 'server-only'
import { cache } from 'react'
import { readPromptzLibrary, readKiroLibrary } from './content-service'
import { compareDatesNewestFirst } from './utils/date-formatter'
import type { SteeringDocument } from './types/content'

/**
 * Get all steering documents from all available libraries
 * Combines steering documents from promptz and kiro-powers libraries
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllSteering = cache(async (): Promise<SteeringDocument[]> => {
  try {
    // Fetch both libraries in parallel, handling individual failures
    const [promptzResult, kiroResult] = await Promise.allSettled([
      readPromptzLibrary(),
      readKiroLibrary()
    ])
    
    // Extract steering documents from successful library reads
    const allSteering: SteeringDocument[] = []
    
    if (promptzResult.status === 'fulfilled') {
      allSteering.push(...promptzResult.value.steering)
    } else {
      console.error('Error fetching promptz library:', promptzResult.reason)
    }
    
    if (kiroResult.status === 'fulfilled') {
      allSteering.push(...kiroResult.value.steering)
    } else {
      console.error('Error fetching kiro library:', kiroResult.reason)
    }
    
    // Sort by creation date (newest first)
    // Use git creation date if available, otherwise fallback to frontmatter date
    return allSteering.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
  } catch (error) {
    console.error('Error fetching steering documents:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})

/**
 * Get the latest steering documents with optional limit
 * Used for homepage to display most recent steering documents
 * Defaults to returning all steering documents if no limit specified
 */
export const getLatestSteering = cache(async (limit?: number): Promise<SteeringDocument[]> => {
  try {
    const allSteering = await getAllSteering()
    
    // Return limited results if limit specified
    if (limit && limit > 0) {
      return allSteering.slice(0, limit)
    }
    
    // Return all steering documents if no limit
    return allSteering
    
  } catch (error) {
    console.error('Error fetching latest steering documents:', error)
    // Return empty array on error to prevent page crashes
    return []
  }
})