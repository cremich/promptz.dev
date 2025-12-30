import { HookCard, HookCardSkeleton } from "@/components/hook-card"
import type { Hook } from "@/lib/types/content"

interface HooksGridProps {
  hooks: Hook[]
  maxItems?: number
  className?: string
}

export function HooksGrid({ hooks, maxItems, className = "" }: HooksGridProps) {
  // Apply maxItems limit if specified
  const displayHooks = maxItems !== undefined ? hooks.slice(0, Math.max(0, maxItems)) : hooks

  // Handle empty state
  if (displayHooks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No hooks available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for new agent hooks
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {displayHooks.map((hook) => (
        <HookCard 
          key={hook.id} 
          hook={hook}
          className="h-full"
        />
      ))}
    </div>
  )
}

export function HooksGridSkeleton({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <HookCardSkeleton 
          key={i}
          className="h-full"
        />
      ))}
    </div>
  )
}