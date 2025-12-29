import type { ContentItem } from '@/lib/types/content'
import { getShortHash, formatGitDate } from '@/lib/utils/git-extractor'

// Example of how ContentItem union type is used in practice

/**
 * Generic content processing function - works with any ContentItem
 */
export function getContentSummary(item: ContentItem): string {
  // TypeScript knows all ContentItem types have these common properties
  const gitInfo = item.git ? ` (${getShortHash(item.git.commitHash)})` : ''
  return `${item.title} by ${item.author} (${item.type})${gitInfo}`
}

/**
 * Git information component
 */
function GitInfo({ item }: { item: ContentItem }) {
  if (!item.git) return null
  
  return (
    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="font-semibold">Author:</span> {item.git.author}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {item.git.authorEmail}
        </div>
        <div>
          <span className="font-semibold">Created:</span> {formatGitDate(item.git.createdDate)}
        </div>
        <div>
          <span className="font-semibold">Modified:</span> {formatGitDate(item.git.lastModifiedDate)}
        </div>
        <div className="col-span-2">
          <span className="font-semibold">Commit:</span> {getShortHash(item.git.commitHash)} - {item.git.commitMessage}
        </div>
      </div>
    </div>
  )
}
/**
 * Type discrimination with switch statement
 */
export function ContentRenderer({ item }: { item: ContentItem }) {
  switch (item.type) {
    case 'prompt':
      // TypeScript knows this is a Prompt with category property
      return (
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="font-semibold text-green-800">{item.title}</h3>
          <p className="text-sm text-gray-600">Prompt by {item.author}</p>
          {item.category && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {item.category}
            </span>
          )}
          <GitInfo item={item} />
        </div>
      )
    
    case 'agent':
      // TypeScript knows this is an Agent with config and description
      return (
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="font-semibold text-blue-800">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
          <p className="text-xs text-gray-500">
            MCP Servers: {item.config.mcpServers?.length || 0}
          </p>
          <GitInfo item={item} />
        </div>
      )
    
    case 'power':
      // TypeScript knows this is a Power with keywords and displayName
      return (
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="font-semibold text-purple-800">{item.displayName}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.keywords.map((keyword, i) => (
              <span key={i} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                {keyword}
              </span>
            ))}
          </div>
          <GitInfo item={item} />
        </div>
      )
    
    case 'steering':
      // TypeScript knows this is a SteeringDocument
      return (
        <div className="border-l-4 border-orange-500 pl-4">
          <h3 className="font-semibold text-orange-800">{item.title}</h3>
          <p className="text-sm text-gray-600">Steering Document</p>
          {item.category && (
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              {item.category}
            </span>
          )}
          <GitInfo item={item} />
        </div>
      )
    
    case 'hook':
      // TypeScript knows this is a Hook with trigger property
      return (
        <div className="border-l-4 border-red-500 pl-4">
          <h3 className="font-semibold text-red-800">{item.title}</h3>
          <p className="text-sm text-gray-600">Agent Hook</p>
          {item.trigger && (
            <p className="text-xs text-gray-500">Trigger: {item.trigger}</p>
          )}
          <GitInfo item={item} />
        </div>
      )
    
    default:
      // TypeScript ensures exhaustive checking - this will error if we miss a type
      const _exhaustive: never = item
      return null
  }
}

/**
 * Type guard functions for filtering
 */
export function isPrompt(item: ContentItem): item is import('@/lib/types/content').Prompt {
  return item.type === 'prompt'
}

export function isPower(item: ContentItem): item is import('@/lib/types/content').Power {
  return item.type === 'power'
}

/**
 * Example of filtering with type guards
 */
export function ContentByType({ items }: { items: ContentItem[] }) {
  const prompts = items.filter(isPrompt)
  const powers = items.filter(isPower)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold mb-3">Prompts ({prompts.length})</h3>
        {prompts.map(prompt => (
          <div key={prompt.id} className="mb-2">
            {/* TypeScript knows these are Prompt objects */}
            <p className="font-medium">{prompt.title}</p>
            {prompt.category && (
              <p className="text-sm text-gray-500">Category: {prompt.category}</p>
            )}
          </div>
        ))}
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Powers ({powers.length})</h3>
        {powers.map(power => (
          <div key={power.id} className="mb-2">
            {/* TypeScript knows these are Power objects */}
            <p className="font-medium">{power.displayName}</p>
            <p className="text-sm text-gray-500">
              Keywords: {power.keywords.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Search function that works across all content types
 */
export function searchContent(items: ContentItem[], query: string): ContentItem[] {
  const lowerQuery = query.toLowerCase()
  
  return items.filter(item => {
    // Common properties available on all ContentItem types
    const matchesCommon = 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.author.toLowerCase().includes(lowerQuery)
    
    // Type-specific searching
    switch (item.type) {
      case 'power':
        return matchesCommon || 
               item.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
               item.description.toLowerCase().includes(lowerQuery)
      
      case 'agent':
        return matchesCommon || 
               item.description.toLowerCase().includes(lowerQuery)
      
      case 'prompt':
      case 'steering':
        return matchesCommon ||
               item.content.toLowerCase().includes(lowerQuery)
      
      case 'hook':
        return matchesCommon ||
               (item.trigger && item.trigger.toLowerCase().includes(lowerQuery))
      
      default:
        return matchesCommon
    }
  })
}