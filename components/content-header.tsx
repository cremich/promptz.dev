import { ContentTypeBadge } from '@/components/content-type-badge'
import { LibraryBadge } from '@/components/library-badge'
import { BadgeContainer } from '@/components/badge-container'
import type { ContentItem } from '@/lib/types/content'

interface ContentHeaderProps {
  content: ContentItem
}

function getContentTitle(content: ContentItem): string {
  if (content.type === 'power') {
    return content.displayName || content.title
  }
  return content.title
}

export function ContentHeader({ content }: ContentHeaderProps) {
  const title = getContentTitle(content)

  return (
    <div className="mb-6">
      {/* Badges */}
      <BadgeContainer context="detail-header" className="mb-4">
        <ContentTypeBadge contentType={content.type} />
        <LibraryBadge content={content} />
      </BadgeContainer>

      {/* Title */}
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>

      {/* Description */}
      {'description' in content && content.description && (
        <p className="text-lg text-muted-foreground">{content.description}</p>
      )}
    </div>
  )
}
