import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getShortHash } from "@/lib/utils/git-extractor"
import { getFormattedDisplayDate } from "@/lib/formatter/date"
import { idToSlug } from "@/lib/utils/slug-utils"
import { 
  getContentTypeBadgeVariant, 
  getLibraryBadgeVariant, 
  getLibraryName,
  getBadgeArrangement
} from "@/lib/utils/badge-utils"
import { cn } from "@/lib/utils"
import type { Hook } from "@/lib/types/content"

interface HookCardProps {
  hook: Hook
  className?: string
}

export function HookCard({ hook, className }: HookCardProps) {
  const libraryName = getLibraryName(hook.path)
  
  // Get badge configurations
  const contentTypeBadge = getContentTypeBadgeVariant('hook')
  const libraryBadge = getLibraryBadgeVariant(libraryName)
  const badgeArrangement = getBadgeArrangement('card-header')
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = hook.git?.author || hook.author
  const formattedDate = getFormattedDisplayDate(hook.git?.createdDate, hook.date)

  return (
    <Link href={`/hooks/${idToSlug(hook.id)}`} className="block">
      <Card className={cn("transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50", className)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold leading-tight">
              {hook.title}
            </CardTitle>
            <div className={badgeArrangement.containerClasses}>
              <Badge 
                variant={contentTypeBadge.variant}
                className={cn(
                  badgeArrangement.badgeClasses,
                  contentTypeBadge.className
                )}
              >
                hook
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
              <span className="font-medium">ID:</span> {hook.id}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Description:</span> {hook.description}
            </div>
            {hook.trigger && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Trigger:</span> {hook.trigger}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Author:</span> {displayAuthor}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          {hook.git?.commitHash && (
            <span className="font-mono">
              {getShortHash(hook.git.commitHash)}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

export function HookCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className} data-testid="hook-card-skeleton">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            <Skeleton className="h-6 w-48" data-testid="skeleton" />
          </CardTitle>
          <div className="flex flex-wrap gap-1 shrink-0">
            <Skeleton className="h-5 w-12" data-testid="skeleton" /> {/* hook badge */}
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
            <Skeleton className="h-4 w-36" data-testid="skeleton" /> {/* Trigger line */}
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