import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getShortHash } from "@/lib/utils/git-extractor"
import { getFormattedDisplayDate } from "@/lib/utils/date-formatter"
import { 
  getContentTypeBadgeVariant, 
  getLibraryBadgeVariant, 
  getLibraryName,
  getBadgeArrangement
} from "@/lib/utils/badge-utils"
import { cn } from "@/lib/utils"
import type { Power } from "@/lib/types/content"

interface PowerCardProps {
  power: Power
  className?: string
}

export function PowerCard({ power, className }: PowerCardProps) {
  const libraryName = getLibraryName(power.path)
  
  // Get badge configurations
  const contentTypeBadge = getContentTypeBadgeVariant('power')
  const libraryBadge = getLibraryBadgeVariant(libraryName)
  const badgeArrangement = getBadgeArrangement('card-header')
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = power.git?.author || power.author
  const formattedDate = getFormattedDisplayDate(power.git?.createdDate, power.date)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            {power.displayName || power.title}
          </CardTitle>
          <div className={badgeArrangement.containerClasses}>
            <Badge 
              variant={contentTypeBadge.variant}
              className={cn(
                badgeArrangement.badgeClasses,
                contentTypeBadge.className
              )}
            >
              power
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
          <div className="text-sm text-muted-foreground line-clamp-2">
            {power.description}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">ID:</span> {power.id}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Author:</span> {displayAuthor}
          </div>
          {power.keywords && power.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {power.keywords.slice(0, 3).map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5"
                >
                  {keyword}
                </Badge>
              ))}
              {power.keywords.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{power.keywords.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formattedDate}</span>
        {power.git?.commitHash && (
          <span className="font-mono">
            {getShortHash(power.git.commitHash)}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}

export function PowerCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className} data-testid="power-card-skeleton">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            <Skeleton className="h-6 w-48" data-testid="skeleton" />
          </CardTitle>
          <div className="flex flex-wrap gap-1 shrink-0">
            <Skeleton className="h-5 w-14" data-testid="skeleton" /> {/* power badge */}
            <Skeleton className="h-5 w-20" data-testid="skeleton" /> {/* library badge */}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-full" data-testid="skeleton" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-3/4 mt-1" data-testid="skeleton" /> {/* Description line 2 */}
          </div>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-32" data-testid="skeleton" /> {/* ID line */}
          </div>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-28" data-testid="skeleton" /> {/* Author line */}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Skeleton className="h-5 w-16" data-testid="skeleton" /> {/* Keyword 1 */}
            <Skeleton className="h-5 w-20" data-testid="skeleton" /> {/* Keyword 2 */}
            <Skeleton className="h-5 w-14" data-testid="skeleton" /> {/* Keyword 3 */}
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