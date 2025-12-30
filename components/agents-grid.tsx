import { AgentCard, AgentCardSkeleton } from "@/components/agent-card"
import type { Agent } from "@/lib/types/content"

interface AgentsGridProps {
  agents: Agent[]
  maxItems?: number
  className?: string
}

export function AgentsGrid({ agents, maxItems, className = "" }: AgentsGridProps) {
  // Apply maxItems limit if specified
  const displayAgents = maxItems !== undefined ? agents.slice(0, maxItems) : agents

  // Handle empty state
  if (displayAgents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No agents available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for new AI agents and specialized assistants
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {displayAgents.map((agent) => (
        <AgentCard 
          key={agent.id} 
          agent={agent}
          className="h-full"
        />
      ))}
    </div>
  )
}

export function AgentsGridSkeleton({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <AgentCardSkeleton 
          key={i}
          className="h-full"
        />
      ))}
    </div>
  )
}