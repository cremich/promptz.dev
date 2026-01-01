import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GitHubLink } from "@/components/github-link";
import { getFormattedDisplayDate } from "@/lib/utils/date-formatter";
import type { ContentItem } from "@/lib/types/content";

interface ContributorInfoProps {
  content: ContentItem;
}

function getShortHash(fullHash: string): string {
  return fullHash.substring(0, 7);
}

export function ContributorInfo({ content }: ContributorInfoProps) {
  const displayAuthor = content.git?.author || content.author;
  const createdDate = getFormattedDisplayDate(content.git?.createdDate, content.date);
  const lastModifiedDate = content.git?.lastModifiedDate 
    ? getFormattedDisplayDate(content.git.lastModifiedDate, null)
    : null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Contributor Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Author</h3>
            <p className="text-sm">
              {displayAuthor}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Created</h3>
            <p className="text-sm">{createdDate}</p>
          </div>
          
          {lastModifiedDate && (
            <div>
              <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Last Modified</h3>
              <p className="text-sm">{lastModifiedDate}</p>
            </div>
          )}
          
          {content.git?.commitHash && (
            <div>
              <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Latest Commit</h3>
              <p className="text-sm font-mono">
                {getShortHash(content.git.commitHash)}
              </p>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div>
          <GitHubLink content={content} />
        </div>
      </CardContent>
    </Card>
  );
}