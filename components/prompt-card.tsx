import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatGitDate, getShortHash } from "@/lib/utils/git-extractor"
import type { Prompt } from "@/lib/types/content"

interface PromptCardProps {
  prompt: Prompt
  className?: string
}

export function PromptCard({ prompt, className }: PromptCardProps) {
  // Extract library name from path (e.g., "libraries/promptz/prompts/..." -> "promptz")
  const getLibraryName = (path: string): string => {
    const pathParts = path.split('/')
    const librariesIndex = pathParts.indexOf('libraries')
    if (librariesIndex !== -1 && librariesIndex + 1 < pathParts.length) {
      return pathParts[librariesIndex + 1]
    }
    return 'unknown'
  }

  const libraryName = getLibraryName(prompt.path)
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = prompt.git?.author || prompt.author
  const displayDate = prompt.git?.createdDate || prompt.date
  const formattedDate = formatGitDate(displayDate)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            {prompt.title}
          </CardTitle>
          <div className="flex flex-wrap gap-1 shrink-0">
            <Badge variant="secondary">prompt</Badge>
            <Badge variant="outline">{libraryName}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">ID:</span> {prompt.id}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Author:</span> {displayAuthor}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formattedDate}</span>
        {prompt.git?.commitHash && (
          <span className="font-mono">
            {getShortHash(prompt.git.commitHash)}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}