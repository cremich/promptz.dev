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
import type { SteeringDocument } from "@/lib/types/content"

interface SteeringCardProps {
  steering: SteeringDocument
  className?: string
}

export function SteeringCard({ steering, className }: SteeringCardProps) {
  const libraryName = getLibraryName(steering.path)
  
  // Get badge configurations
  const contentTypeBadge = getContentTypeBadgeVariant('steering')
  const libraryBadge = getLibraryBadgeVariant(libraryName)
  const badgeArrangement = getBadgeArrangement('card-header')
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = steering.git?.author || steering.author
  const formattedDate = getFormattedDisplayDate(steering.git?.createdDate, steering.date)

  return (
    <Link href={`/steering/${idToSlug(steering.id)}`} className="block">
      <Card className={cn("transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50", className)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold leading-tight">
              {steering.title}
            </CardTitle>
            <div className={badgeArrangement.containerClasses}>
              <Badge 
                variant={contentTypeBadge.variant}
                className={cn(
                  badgeArrangement.badgeClasses,
                  contentTypeBadge.className
                )}
              >
                steering
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
              <span className="font-medium">ID:</span> {steering.id}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Author:</span> {displayAuthor}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          {steering.git?.commitHash && (
            <span className="font-mono">
              {getShortHash(steering.git.commitHash)}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

export function SteeringCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className} data-testid="steering-card-skeleton">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            <Skeleton className="h-6 w-48" data-testid="skeleton" />
          </CardTitle>
          <div className="flex flex-wrap gap-1 shrink-0">
            <Skeleton className="h-5 w-16" data-testid="skeleton" /> {/* steering badge */}
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