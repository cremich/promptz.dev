import type { VariantProps } from "class-variance-authority"
import type { badgeVariants } from "@/components/ui/badge"
import { getLibraryName } from "@/lib/library"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

/**
 * Badge configuration for different content types and libraries
 */
export interface BadgeConfig {
  variant: BadgeVariant
  className?: string
}

/**
 * Get the appropriate badge variant for content type badges
 */
export function getContentTypeBadgeVariant(contentType: string): BadgeConfig {
  switch (contentType.toLowerCase()) {
    case 'prompt':
      return { variant: 'secondary' }
    case 'agent':
      return { variant: 'default' }
    case 'power':
      return { variant: 'default' }
    case 'hook':
      return { variant: 'outline' }
    case 'steering':
      return { variant: 'outline' }
    default:
      return { variant: 'secondary' }
  }
}

/**
 * Get the appropriate badge variant and styling for library source badges
 */
export function getLibraryBadgeVariant(libraryName: string): BadgeConfig {
  switch (libraryName.toLowerCase()) {
    case 'promptz':
      return { 
        variant: 'outline',
        className: 'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300'
      }
    case 'kiro-powers':
      return { 
        variant: 'outline',
        className: 'border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300'
      }
    default:
      return { variant: 'outline' }
  }
}

/**
 * Get standardized badge spacing classes for consistent arrangement
 */
export function getBadgeContainerClasses(): string {
  return 'flex flex-wrap gap-1 shrink-0'
}

/**
 * Get standardized badge classes for consistent sizing and appearance
 */
export function getStandardBadgeClasses(): string {
  return 'text-xs font-medium'
}

/**
 * Badge arrangement configuration for different contexts
 */
export interface BadgeArrangement {
  containerClasses: string
  badgeClasses: string
  maxBadges?: number
}

/**
 * Get badge arrangement configuration for different display contexts
 */
export function getBadgeArrangement(context: 'card-header' | 'card-footer' | 'list-item'): BadgeArrangement {
  switch (context) {
    case 'card-header':
      return {
        containerClasses: 'flex flex-wrap gap-1 shrink-0',
        badgeClasses: 'text-xs font-medium',
        maxBadges: 3
      }
    case 'card-footer':
      return {
        containerClasses: 'flex gap-1',
        badgeClasses: 'text-xs font-medium',
        maxBadges: 2
      }
    case 'list-item':
      return {
        containerClasses: 'flex gap-1',
        badgeClasses: 'text-xs font-medium',
        maxBadges: 4
      }
    default:
      return {
        containerClasses: 'flex flex-wrap gap-1',
        badgeClasses: 'text-xs font-medium'
      }
  }
}

/**
 * Validate and normalize badge text for consistent display
 */
export function normalizeBadgeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-')
}

/**
 * Get priority order for badge display (higher number = higher priority)
 */
export function getBadgePriority(badgeType: 'content-type' | 'library' | 'category' | 'status'): number {
  switch (badgeType) {
    case 'content-type':
      return 3
    case 'library':
      return 2
    case 'category':
      return 1
    case 'status':
      return 0
    default:
      return 0
  }
}