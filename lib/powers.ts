import 'server-only'
import { cache } from 'react'
import { compareDatesNewestFirst } from './utils/date-formatter'
import type { Power } from './types/content'

// Import static JSON data generated at build time
import powersData from '@/data/powers.json'

/**
 * Get all powers from all available libraries
 * Uses static JSON data generated at build time for optimal performance
 * Handles errors gracefully by returning empty array on failure
 */
export const getAllPowers = cache(async (): Promise<Power[]> => {
  try {
    // Cast imported JSON to proper TypeScript type
    const allPowers = powersData as Power[]
    
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

/**
 * Get a specific power by its ID
 * Used for power detail pages
 * Returns null if power is not found
 */
export const getPowerById = cache(async (id: string): Promise<Power | null> => {
  try {
    const allPowers = await getAllPowers()
    
    // Find power by exact ID match
    const power = allPowers.find(p => p.id === id)
    
    return power || null
    
  } catch (error) {
    console.error('Error fetching power by ID:', error)
    // Return null on error to trigger 404 page
    return null
  }
})