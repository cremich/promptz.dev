import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatGitDate, getShortHash } from "@/lib/utils/git-extractor"
import { 
  getContentTypeBadgeVariant, 
  getLibraryBadgeVariant, 
  getLibraryName,
  getBadgeArrangement
} from "@/lib/utils/badge-utils"
import { cn } from "@/lib/utils"
import type { Prompt } from "@/lib/types/content"

interface PromptCardProps {
  prompt: Prompt
  className?: string
}

export function PromptCard({ prompt, className }: PromptCardProps) {
  const libraryName = getLibraryName(prompt.path)
  
  // Get badge configurations
  const contentTypeBadge = getContentTypeBadgeVariant('prompt')
  const libraryBadge = getLibraryBadgeVariant(libraryName)
  const badgeArrangement = getBadgeArrangement('card-header')
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = prompt.git?.author || prompt.author
  const displayDate = prompt.git?.createdDate || prompt.date
  const formattedDate = formatGitDate(displayDate)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            {prompt.title}
          </CardTitle>
          <div className={badgeArrangement.containerClasses}>
            <Badge 
              variant={contentTypeBadge.variant}
              className={cn(
                badgeArrangement.badgeClasses,
                contentTypeBadge.className
              )}
            >
              prompt
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
            <span className="font-medium">ID:</span> {prompt.id}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Author:</span> {displayAuthor}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formattedDate}</span>
        {prompt.git?.commitHash && (
          <span className="font-mono">
            {getShortHash(prompt.git.commitHash)}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}

export function PromptCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className} data-testid="prompt-card-skeleton">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            <Skeleton className="h-6 w-48" data-testid="skeleton" />
          </CardTitle>
          <div className="flex flex-wrap gap-1 shrink-0">
            <Skeleton className="h-5 w-14" data-testid="skeleton" /> {/* prompt badge */}
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