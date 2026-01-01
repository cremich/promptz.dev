import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getShortHash } from "@/lib/utils/git-extractor"
import { getFormattedDisplayDate } from "@/lib/formatter/date"
import { idToSlug } from "@/lib/formatter/slug"
import { 
  getContentTypeBadgeVariant, 
  getLibraryBadgeVariant, 
  getLibraryName,
  getBadgeArrangement
} from "@/lib/utils/badge-utils"
import { cn } from "@/lib/utils"
import type { Agent } from "@/lib/types/content"

interface AgentCardProps {
  agent: Agent
  className?: string
}

export function AgentCard({ agent, className }: AgentCardProps) {
  const libraryName = getLibraryName(agent.path)
  
  // Get badge configurations
  const contentTypeBadge = getContentTypeBadgeVariant('agent')
  const libraryBadge = getLibraryBadgeVariant(libraryName)
  const badgeArrangement = getBadgeArrangement('card-header')
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = agent.git?.author || agent.author
  const formattedDate = getFormattedDisplayDate(agent.git?.createdDate, agent.date)

  return (
    <Link href={`/agents/${idToSlug(agent.id)}`} className="block">
      <Card className={cn("transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50", className)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold leading-tight">
              {agent.title}
            </CardTitle>
            <div className={badgeArrangement.containerClasses}>
              <Badge 
                variant={contentTypeBadge.variant}
                className={cn(
                  badgeArrangement.badgeClasses,
                  contentTypeBadge.className
                )}
              >
                agent
              </Badge>
              <Badge 
                variant={libraryBadge.variant}
                className={cn(
                  badgeArrangement.badgeClasses,
                  libraryBadge.className
                )}
              >
                {libraryName}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">ID:</span> {agent.id}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Description:</span> {agent.description}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Author:</span> {displayAuthor}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          {agent.git?.commitHash && (
            <span className="font-mono">
              {getShortHash(agent.git.commitHash)}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

export function AgentCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className} data-testid="agent-card-skeleton">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            <Skeleton className="h-6 w-48" data-testid="skeleton" />
          </CardTitle>
          <div className="flex flex-wrap gap-1 shrink-0">
            <Skeleton className="h-5 w-14" data-testid="skeleton" /> {/* agent badge */}
            <Skeleton className="h-5 w-16" data-testid="skeleton" /> {/* library badge */}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-32" data-testid="skeleton" /> {/* ID line */}
          </div>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-40" data-testid="skeleton" /> {/* Description line */}
          </div>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-28" data-testid="skeleton" /> {/* Author line */}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <Skeleton className="h-3 w-20" data-testid="skeleton" /> {/* Date */}
        <Skeleton className="h-3 w-16" data-testid="skeleton" /> {/* Commit hash */}
      </CardFooter>
    </Card>
  )
}