import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LibraryBadgeProps {
  libraryName: string;
  className?: string;
}

export function LibraryBadge({ libraryName, className }: LibraryBadgeProps) {
  const getLibraryStyles = (name: string) => {
    switch (name.toLowerCase()) {
      case 'promptz':
        return 'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300';
      case 'kiro-powers':
        return 'border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant="outline"
      className={cn("text-xs", getLibraryStyles(libraryName), className)}
    >
      {libraryName}
    </Badge>
  );
}