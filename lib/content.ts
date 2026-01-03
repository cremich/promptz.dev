import 'server-only'
import { cache } from 'react'
import { compareDatesNewestFirst } from './formatter/date'
import { getLatestPrompts } from './prompts'
import { getLatestAgents } from './agents'
import { getLatestPowers } from './powers'
import { getLatestSteering } from './steering'
import { getLatestHooks } from './hooks'
import type { ContentItem } from './types/content'

/**
 * Get the latest content items across all content types
 * Combines prompts, agents, powers, steering, and hooks
 * Sorted by date (newest first)
 */
export const getLatestContent = cache(async (limit: number = 6): Promise<ContentItem[]> => {
  try {
    // Fetch content from all types in parallel
    // Get more than needed to ensure we have enough after sorting
    const fetchLimit = Math.ceil(limit / 5) + 2
    
    const [prompts, agents, powers, steering, hooks] = await Promise.all([
      getLatestPrompts(fetchLimit),
      getLatestAgents(fetchLimit),
      getLatestPowers(fetchLimit),
      getLatestSteering(fetchLimit),
      getLatestHooks(fetchLimit),
    ])

    // Combine all content
    const allContent: ContentItem[] = [
      ...prompts,
      ...agents,
      ...powers,
      ...steering,
      ...hooks,
    ]

    // Sort by date (newest first)
    const sorted = allContent.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })

    // Return limited results
    return sorted.slice(0, limit)
  } catch (error) {
    console.error('Error fetching latest content:', error)
    return []
  }
})
