import { AgentCard, AgentCardSkeleton } from "@/components/agent-card"
import { HookCard, HookCardSkeleton } from "@/components/hook-card"
import { PowerCard, PowerCardSkeleton } from "@/components/power-card"
import { PromptCard, PromptCardSkeleton } from "@/components/prompt-card"
import { SteeringCard, SteeringCardSkeleton } from "@/components/steering-card"
import type { ContentItem } from "@/lib/types/content"

interface GridProps {
  items: ContentItem[]
  maxItems?: number
  className?: string
}

function renderCard(item: ContentItem, className?: string) {
  switch (item.type) {
    case 'agent':
      return <AgentCard key={item.id} agent={item} className={className} />
    case 'hook':
      return <HookCard key={item.id} hook={item} className={className} />
    case 'power':
      return <PowerCard key={item.id} power={item} className={className} />
    case 'prompt':
      return <PromptCard key={item.id} prompt={item} className={className} />
    case 'steering':
      return <SteeringCard key={item.id} steering={item} className={className} />
    default:
      // TypeScript exhaustiveness check - this should never happen
      return null
  }
}

function renderSkeletonCard(index: number, className?: string) {
  // Use a rotating pattern for skeleton variety
  const skeletonTypes = ['agent', 'hook', 'power', 'prompt', 'steering'] as const
  const type = skeletonTypes[index % skeletonTypes.length]
  
  switch (type) {
    case 'agent':
      return <AgentCardSkeleton key={index} className={className} />
    case 'hook':
      return <HookCardSkeleton key={index} className={className} />
    case 'power':
      return <PowerCardSkeleton key={index} className={className} />
    case 'prompt':
      return <PromptCardSkeleton key={index} className={className} />
    case 'steering':
      return <SteeringCardSkeleton key={index} className={className} />
  }
}

export function Grid({ items, maxItems, className = "" }: GridProps) {
  // Apply maxItems limit if specified
  const displayItems = maxItems !== undefined ? items.slice(0, maxItems) : items

  // Handle empty state
  if (displayItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No content available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for new content
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {displayItems.map((item) => renderCard(item, "h-full"))}
    </div>
  )
}

export function GridSkeleton({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {Array.from({ length: count }, (_, i) => renderSkeletonCard(i, "h-full"))}
    </div>
  )
}