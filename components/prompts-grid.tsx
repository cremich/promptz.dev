import { PromptCard } from "@/components/prompt-card"
import type { Prompt } from "@/lib/types/content"

interface PromptsGridProps {
  prompts: Prompt[]
  maxItems?: number
  className?: string
}

export function PromptsGrid({ prompts, maxItems, className = "" }: PromptsGridProps) {
  // Apply maxItems limit if specified
  const displayPrompts = maxItems ? prompts.slice(0, maxItems) : prompts

  // Handle empty state
  if (displayPrompts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No prompts available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for new AI development prompts
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr ${className}`}
    >
      {displayPrompts.map((prompt) => (
        <PromptCard 
          key={prompt.id} 
          prompt={prompt}
          className="h-full"
        />
      ))}
    </div>
  )
}