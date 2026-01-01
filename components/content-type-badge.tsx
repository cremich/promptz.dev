import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"
import type { badgeVariants } from "@/components/ui/badge"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

interface ContentTypeBadgeProps {
  contentType: string
  className?: string
}

/**
 * Get the appropriate badge variant for content type badges
 */
function getContentTypeBadgeVariant(contentType: string): {
  variant: BadgeVariant
  className?: string
} {
  switch (contentType.toLowerCase()) {
    case 'prompt':
      return { variant: 'secondary' }
    case 'agent':
      return { variant: 'default' }
    case 'power':
      return { variant: 'default' }
    case 'hook':
      return { variant: 'outline' }
    case 'steering':
      return { variant: 'outline' }
    default:
      return { variant: 'secondary' }
  }
}

/**
 * ContentTypeBadge component for displaying content type badges with consistent styling
 */
export function ContentTypeBadge({ contentType, className }: ContentTypeBadgeProps) {
  const badgeConfig = getContentTypeBadgeVariant(contentType)
  
  return (
    <Badge 
      variant={badgeConfig.variant}
      className={cn(
        "text-xs font-medium",
        badgeConfig.className,
        className
      )}
    >
      {contentType.toLowerCase()}
    </Badge>
  )
}