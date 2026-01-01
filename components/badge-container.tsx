import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BadgeContainerProps {
  children: ReactNode
  context?: 'card-header' | 'card-footer' | 'list-item' | 'default'
  className?: string
  maxBadges?: number
}

/**
 * Get badge arrangement configuration for different display contexts
 */
function getBadgeArrangement(context: 'card-header' | 'card-footer' | 'list-item' | 'default') {
  switch (context) {
    case 'card-header':
      return {
        containerClasses: 'flex flex-wrap gap-1 shrink-0',
        maxBadges: 3
      }
    case 'card-footer':
      return {
        containerClasses: 'flex gap-1',
        maxBadges: 2
      }
    case 'list-item':
      return {
        containerClasses: 'flex gap-1',
        maxBadges: 4
      }
    case 'default':
    default:
      return {
        containerClasses: 'flex flex-wrap gap-1'
      }
  }
}

/**
 * BadgeContainer component for consistent badge arrangement and spacing
 */
export function BadgeContainer({ 
  children, 
  context = 'default', 
  className
}: BadgeContainerProps) {
  const arrangement = getBadgeArrangement(context)
  
  return (
    <div className={cn(arrangement.containerClasses, className)}>
      {children}
    </div>
  )
}