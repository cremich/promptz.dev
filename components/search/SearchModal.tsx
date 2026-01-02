'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import Fuse, { type FuseResult, type FuseResultMatch } from 'fuse.js'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Badge } from '@/components/ui/badge'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { useSearch } from '@/components/search-provider'
import type { SearchIndexItem } from '@/lib/types/content'

export function SearchModal() {
  const { isOpen, closeSearch } = useSearch()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FuseResult<SearchIndexItem>[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fuse, setFuse] = useState<Fuse<SearchIndexItem> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  
  // Initialize Fuse.js when modal opens
  useEffect(() => {
    if (isOpen && !fuse) {
      initializeFuse()
    }
  }, [isOpen, fuse])
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setError(null)
    }
  }, [isOpen])
  
  // Debounced search when query changes
  useEffect(() => {
    if (!fuse) return
    
    const timeoutId = setTimeout(() => {
      if (!query.trim()) {
        setResults([])
        setSelectedIndex(0)
        return
      }
      
      try {
        const searchResults = fuse.search(query, { limit: 10 })
        setResults(searchResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setError('Search temporarily unavailable')
      }
    }, 150) // Debounce search by 150ms
    
    return () => clearTimeout(timeoutId)
  }, [query, fuse])
  
  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }
  }, [selectedIndex, results.length])
  
  const initializeFuse = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const searchIndexData = await import('@/data/search-index.json')
      const index = searchIndexData.default.items as SearchIndexItem[]
      
      const fuseOptions = {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'description', weight: 0.3 },
          { name: 'content', weight: 0.2 },
          { name: 'keywords', weight: 0.1 }
        ],
        threshold: 0.4,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true
      }
      
      setFuse(new Fuse(index, fuseOptions))
    } catch (error) {
      console.error('Error loading search index:', error)
      setError('Failed to load search index. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleResultSelect = useCallback((result: FuseResult<SearchIndexItem>) => {
    const path = result.item.path
    closeSearch()
    router.push(path)
  }, [closeSearch, router])
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        event.preventDefault()
        if (results[selectedIndex]) {
          handleResultSelect(results[selectedIndex])
        }
        break
    }
  }, [results, selectedIndex, handleResultSelect])
  
  const handleResultClick = useCallback((result: FuseResult<SearchIndexItem>, index: number) => {
    setSelectedIndex(index)
    handleResultSelect(result)
  }, [handleResultSelect])
  
  const contentTypeConfig = {
    prompt: { badge: 'Prompt', color: 'blue' },
    agent: { badge: 'Agent', color: 'green' },
    power: { badge: 'Power', color: 'purple' },
    steering: { badge: 'Steering', color: 'orange' },
    hook: { badge: 'Hook', color: 'red' }
  } as const
  
  const highlightMatches = (text: string, matches?: readonly FuseResultMatch[]) => {
    if (!matches || matches.length === 0) return text
    
    // Find matches for the title field
    const titleMatch = matches.find(match => match.key === 'title')
    if (!titleMatch || !titleMatch.indices) return text
    
    let highlightedText = text
    const indices = [...titleMatch.indices].reverse() // Reverse to avoid index shifting
    
    indices.forEach(([start, end]) => {
      const before = highlightedText.slice(0, start)
      const match = highlightedText.slice(start, end + 1)
      const after = highlightedText.slice(end + 1)
      highlightedText = `${before}<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">${match}</mark>${after}`
    })
    
    return highlightedText
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={closeSearch}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] p-0 gap-0"
      >
        {/* Search Input */}
        <div className="p-4 pb-0">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              placeholder="What are you searching for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-base border-0 shadow-none focus-visible:ring-0"
              disabled={isLoading}
            />
            <InputGroupAddon align="inline-end">
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </InputGroupAddon>
          </InputGroup>
        </div>
        
        {/* Search Results */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Loading search index...
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-sm text-destructive mb-2">
                {error}
              </div>
              <button 
                onClick={initializeFuse}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Try again
              </button>
            </div>
          ) : !query.trim() ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Start typing to search across all libraries...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground text-sm mb-2">
                No results found for &ldquo;{query}&rdquo;
              </div>
              <div className="text-xs text-muted-foreground">
                Try different keywords or check spelling
              </div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto" ref={resultsRef}>
              {results.map((result, index) => {
                const config = contentTypeConfig[result.item.type] || { badge: 'Content', color: 'gray' }
                
                return (
                  <div
                    key={result.item.id}
                    className={`p-3 cursor-pointer border-b border-border last:border-b-0 transition-colors ${
                      index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleResultClick(result, index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-0.5 shrink-0">
                        {config.badge}
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-medium text-sm truncate mb-1"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatches(result.item.title, result.matches)
                          }}
                        />
                        
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {result.item.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {result.item.library}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            by {result.item.author}
                          </span>
                          {result.score && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              {Math.round((1 - result.score) * 100)}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Footer with keyboard shortcuts */}
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <KbdGroup>
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>↵</Kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}