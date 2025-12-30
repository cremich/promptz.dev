import { SteeringCard, SteeringCardSkeleton } from "@/components/steering-card"
import type { SteeringDocument } from "@/lib/types/content"

interface SteeringGridProps {
  steering: SteeringDocument[]
  maxItems?: number
  className?: string
}

export function SteeringGrid({ steering, maxItems, className = "" }: SteeringGridProps) {
  // Apply maxItems limit if specified
  const displaySteering = maxItems ? steering.slice(0, maxItems) : steering

  // Handle empty state
  if (displaySteering.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No steering documents available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for new AI guidance and configuration files
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {displaySteering.map((steeringDoc) => (
        <SteeringCard 
          key={steeringDoc.id} 
          steering={steeringDoc}
          className="h-full"
        />
      ))}
    </div>
  )
}

export function SteeringGridSkeleton({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <SteeringCardSkeleton 
          key={i}
          className="h-full"
        />
      ))}
    </div>
  )
}