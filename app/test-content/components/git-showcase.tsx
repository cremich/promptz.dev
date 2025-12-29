import type { ContentItem } from '@/lib/types/content'
import { getShortHash, formatGitDate } from '@/lib/utils/git-extractor'

interface GitShowcaseProps {
  items: ContentItem[]
}

export function GitShowcase({ items }: GitShowcaseProps) {
  const itemsWithGit = items.filter(item => item.git)
  
  if (itemsWithGit.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          No git information available. This could be because:
        </p>
        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
          <li>Git submodules are not initialized</li>
          <li>Files are not tracked in git</li>
          <li>Git repositories are not accessible</li>
        </ul>
        <pre className="mt-2 text-sm bg-yellow-100 p-2 rounded">
          git submodule update --init --recursive
        </pre>
      </div>
    )
  }
  
  // Get the most recently modified item
  const mostRecent = itemsWithGit.reduce((latest, item) => {
    const itemDate = new Date(item.git!.lastModifiedDate)
    const latestDate = new Date(latest.git!.lastModifiedDate)
    return itemDate > latestDate ? item : latest
  })
  
  // Get the oldest item
  const oldest = itemsWithGit.reduce((oldest, item) => {
    const itemDate = new Date(item.git!.createdDate)
    const oldestDate = new Date(oldest.git!.createdDate)
    return itemDate < oldestDate ? item : oldest
  })
  
  return (
    <div className="space-y-6">
      {/* Git Coverage Stats */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Git Integration Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{itemsWithGit.length}</div>
            <div className="text-sm text-gray-600">Items with Git Info</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((itemsWithGit.length / items.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Coverage</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(itemsWithGit.map(item => item.git!.author)).size}
            </div>
            <div className="text-sm text-gray-600">Contributors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {itemsWithGit.filter(item => {
                const commitDate = new Date(item.git!.lastModifiedDate)
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                return commitDate > thirtyDaysAgo
              }).length}
            </div>
            <div className="text-sm text-gray-600">Recent Updates</div>
          </div>
        </div>
      </div>
      
      {/* Most Recent and Oldest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Most Recently Modified</h4>
          <div className="space-y-2">
            <p className="font-medium">{mostRecent.title}</p>
            <p className="text-sm text-gray-600">by {mostRecent.git!.author}</p>
            <p className="text-sm text-gray-500">
              {formatGitDate(mostRecent.git!.lastModifiedDate)} • {getShortHash(mostRecent.git!.commitHash)}
            </p>
            <p className="text-xs text-gray-500 italic">
              "{mostRecent.git!.commitMessage}"
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Oldest Content</h4>
          <div className="space-y-2">
            <p className="font-medium">{oldest.title}</p>
            <p className="text-sm text-gray-600">by {oldest.git!.author}</p>
            <p className="text-sm text-gray-500">
              Created: {formatGitDate(oldest.git!.createdDate)}
            </p>
            <p className="text-xs text-gray-500">
              Age: {Math.round((Date.now() - new Date(oldest.git!.createdDate).getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Timeline */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Recent Activity</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {itemsWithGit
            .sort((a, b) => new Date(b.git!.lastModifiedDate).getTime() - new Date(a.git!.lastModifiedDate).getTime())
            .slice(0, 10)
            .map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {item.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.git!.author} • {formatGitDate(item.git!.lastModifiedDate)}
                  </p>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {getShortHash(item.git!.commitHash)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}