import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/lib/types/content";

interface ContentTypeBadgeProps {
  contentType: ContentItem['type'];
  className?: string;
}

export function ContentTypeBadge({ contentType, className }: ContentTypeBadgeProps) {
  const getVariant = (type: ContentItem['type']) => {
    switch (type) {
      case 'prompt':
        return 'secondary';
      case 'agent':
        return 'default';
      case 'power':
        return 'default';
      case 'hook':
        return 'outline';
      case 'steering':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge 
      variant={getVariant(contentType)}
      className={cn("text-xs", className)}
    >
      {contentType}
    </Badge>
  );
}