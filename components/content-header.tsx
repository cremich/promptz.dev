import { ContentTypeBadge } from "@/components/content-type-badge";
import { LibraryBadge } from "@/components/library-badge";
import type { ContentItem } from "@/lib/types/content";

interface ContentHeaderProps {
  content: ContentItem;
}

export function ContentHeader({ content }: ContentHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
          {content.title}
        </h1>
        <div className="flex flex-wrap gap-2 shrink-0">
          <ContentTypeBadge contentType={content.type} />
          <LibraryBadge content={content} />
        </div>
      </div>
      
      {'description' in content && content.description && (
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
          {content.description}
        </p>
      )}
      
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        ID: <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">{content.id}</code>
      </p>
    </div>
  );
}