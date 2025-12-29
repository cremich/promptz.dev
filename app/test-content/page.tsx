import { readPromptzLibrary, readKiroLibrary } from '@/lib/content-service'
import type { ContentItem } from '@/lib/types/content'
import { getShortHash, formatGitDate } from '@/lib/utils/git-extractor'
import { 
  ContentRenderer, 
  ContentByType, 
  getContentSummary, 
  searchContent 
} from './components/content-renderer'
import { GitShowcase } from './components/git-showcase'

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
          {item.type}
        </span>
        <h3 className="font-semibold">{item.title}</h3>
        {item.git && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono">
            {getShortHash(item.git.commitHash)}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">
        by {item.author} • {item.date}
        {item.git && (
          <span className="ml-2 text-gray-500">
            (Git: {item.git.author} • {formatGitDate(item.git.lastModifiedDate)})
          </span>
        )}
      </p>
      <p className="text-sm text-gray-500 mb-2">ID: {item.id}</p>
      
      {/* Type-specific rendering */}
      {item.type === 'power' && (
        <div>
          <p className="text-sm mb-2">{item.description}</p>
          {item.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.keywords.map((keyword, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      
      {item.type === 'agent' && (
        <p className="text-sm">{item.description}</p>
      )}
      
      {item.type === 'prompt' && item.category && (
        <p className="text-sm">Category: {item.category}</p>
      )}
      
      <details className="mt-2">
        <summary className="text-sm cursor-pointer text-blue-600">
          View Content
        </summary>
        <pre className="text-xs bg-gray-50 p-2 mt-2 rounded overflow-auto max-h-40">
          {item.content.substring(0, 500)}
          {item.content.length > 500 && '...'}
        </pre>
      </details>
    </div>
  )
}

export default async function TestContentPage() {
  try {
    const [promptzLibrary, kiroLibrary] = await Promise.all([
      readPromptzLibrary(),
      readKiroLibrary()
    ])
    
    // Combine all content for testing
    const allContent: ContentItem[] = [
      ...promptzLibrary.prompts,
      ...promptzLibrary.agents,
      ...promptzLibrary.powers,
      ...promptzLibrary.steering,
      ...promptzLibrary.hooks,
      ...kiroLibrary.powers
    ]
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Content Service Test</h1>
        
        {/* Library Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Promptz Library</h2>
            <ul className="space-y-2 text-sm">
              <li>Prompts: {promptzLibrary.prompts.length}</li>
              <li>Agents: {promptzLibrary.agents.length}</li>
              <li>Powers: {promptzLibrary.powers.length}</li>
              <li>Steering: {promptzLibrary.steering.length}</li>
              <li>Hooks: {promptzLibrary.hooks.length}</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Kiro Powers Library</h2>
            <ul className="space-y-2 text-sm">
              <li>Powers: {kiroLibrary.powers.length}</li>
            </ul>
          </div>
        </div>
        
        {/* Git Integration Showcase */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Git Integration Showcase
          </h2>
          <GitShowcase items={allContent} />
        </div>
        
        {/* Content Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Union Type Examples
          </h2>
          
          {allContent.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                No content found. Make sure the git submodules are initialized:
              </p>
              <pre className="mt-2 text-sm bg-yellow-100 p-2 rounded">
                git submodule update --init --recursive
              </pre>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Example 1: Generic content processing */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  1. Generic Content Processing (Union Type)
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    This demonstrates how the ContentItem union type allows processing any content type:
                  </p>
                  <ul className="text-sm space-y-1">
                    {allContent.slice(0, 3).map(item => (
                      <li key={item.id} className="font-mono">
                        {getContentSummary(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Example 2: Type discrimination with rendering */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  2. Type Discrimination (Switch Statement)
                </h3>
                <div className="space-y-3">
                  {allContent.slice(0, 5).map(item => (
                    <ContentRenderer key={item.id} item={item} />
                  ))}
                </div>
              </div>
              
              {/* Example 3: Type filtering */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  3. Type Guards and Filtering
                </h3>
                <ContentByType items={allContent} />
              </div>
              
              {/* Example 4: Git Information Statistics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  4. Git Information Statistics
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {(() => {
                    const itemsWithGit = allContent.filter(item => item.git)
                    const totalItems = allContent.length
                    const gitCoverage = totalItems > 0 ? Math.round((itemsWithGit.length / totalItems) * 100) : 0
                    
                    // Get unique authors from git
                    const gitAuthors = new Set(itemsWithGit.map(item => item.git!.author))
                    
                    // Get recent commits (last 30 days)
                    const thirtyDaysAgo = new Date()
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                    
                    const recentCommits = itemsWithGit.filter(item => {
                      const commitDate = new Date(item.git!.lastModifiedDate)
                      return commitDate > thirtyDaysAgo
                    })
                    
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{gitCoverage}%</div>
                          <div className="text-gray-600">Git Coverage</div>
                          <div className="text-xs text-gray-500">{itemsWithGit.length}/{totalItems} items</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{gitAuthors.size}</div>
                          <div className="text-gray-600">Contributors</div>
                          <div className="text-xs text-gray-500">via git history</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{recentCommits.length}</div>
                          <div className="text-gray-600">Recent Updates</div>
                          <div className="text-xs text-gray-500">last 30 days</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {itemsWithGit.length > 0 ? Math.round(itemsWithGit.reduce((acc, item) => {
                              const created = new Date(item.git!.createdDate)
                              const modified = new Date(item.git!.lastModifiedDate)
                              return acc + (modified.getTime() - created.getTime())
                            }, 0) / itemsWithGit.length / (1000 * 60 * 60 * 24)) : 0}
                          </div>
                          <div className="text-gray-600">Avg Lifespan</div>
                          <div className="text-xs text-gray-500">days (created to last modified)</div>
                        </div>
                      </div>
                    )
                  })()}
                  
                  {/* Top contributors */}
                  {(() => {
                    const itemsWithGit = allContent.filter(item => item.git)
                    if (itemsWithGit.length === 0) return null
                    
                    const authorStats = itemsWithGit.reduce((acc, item) => {
                      const author = item.git!.author
                      acc[author] = (acc[author] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                    
                    const topAuthors = Object.entries(authorStats)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                    
                    return (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Top Contributors (by git history):</h4>
                        <div className="space-y-1">
                          {topAuthors.map(([author, count]) => (
                            <div key={author} className="flex justify-between text-sm">
                              <span>{author}</span>
                              <span className="text-gray-500">{count} items</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
              
              {/* Example 5: Cross-Type Search */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  5. Cross-Type Search
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Search results for "aws" across all content types:
                  </p>
                  {(() => {
                    const results = searchContent(allContent, 'aws')
                    return results.length > 0 ? (
                      <ul className="text-sm space-y-1">
                        {results.slice(0, 5).map(item => (
                          <li key={item.id} className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {item.type}
                            </span>
                            <span>{item.title}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No results found</p>
                    )
                  })()}
                </div>
              </div>
              
              {/* Raw content cards */}
              <details>
                <summary className="text-lg font-semibold cursor-pointer">
                  6. All Content Details
                </summary>
                <div className="mt-4 space-y-4">
                  {allContent.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
        
        {/* Debug Info */}
        <details className="bg-gray-50 p-4 rounded-lg">
          <summary className="cursor-pointer font-semibold">
            Debug Information
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold">Library Paths:</h3>
              <ul className="text-sm space-y-1">
                <li>Promptz: {promptzLibrary.path}</li>
                <li>Kiro Powers: {kiroLibrary.path}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Content by Type:</h3>
              <ul className="text-sm space-y-1">
                {Object.entries(
                  allContent.reduce((acc, item) => {
                    acc[item.type] = (acc[item.type] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <li key={type}>{type}: {count}</li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Error</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load content libraries:
          </p>
          <pre className="mt-2 text-sm bg-red-100 p-2 rounded">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    )
  }
}