import { Badge } from "@/components/ui/badge";

interface KeywordsProps {
  keywords: string[];
  className?: string;
}

export function Keywords({ keywords, className }: KeywordsProps) {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <div className={className || "flex flex-wrap gap-2 mb-4"}>
      {keywords.map((keyword) => (
        <Badge key={keyword} variant="secondary" className="text-xs">
          {keyword}
        </Badge>
      ))}
    </div>
  );
}