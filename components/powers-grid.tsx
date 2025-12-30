import { PowerCard, PowerCardSkeleton } from "@/components/power-card"
import type { Power } from "@/lib/types/content"

interface PowersGridProps {
  powers: Power[]
  maxItems?: number
  className?: string
}

export function PowersGrid({ powers, maxItems, className = "" }: PowersGridProps) {
  // Apply maxItems limit if specified
  const displayPowers = maxItems !== undefined ? powers.slice(0, maxItems) : powers

  // Handle empty state
  if (displayPowers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No powers available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for new Kiro powers and tools
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {displayPowers.map((power) => (
        <PowerCard 
          key={power.id} 
          power={power}
          className="h-full"
        />
      ))}
    </div>
  )
}

export function PowersGridSkeleton({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <PowerCardSkeleton 
          key={i}
          className="h-full"
        />
      ))}
    </div>
  )
}