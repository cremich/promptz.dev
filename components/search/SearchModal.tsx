'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import Fuse, { type FuseResult } from 'fuse.js'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { useSearch } from '@/components/search-provider'
import {
  SearchResults,
  SearchErrorDisplay,
  SearchEmptyState,
  SearchNoResults,
  SearchQueryError,
  SearchLoading
} from '@/components/search/SearchResults'
import { SearchFooter } from '@/components/search/SearchFooter'
import type { SearchIndexItem, SearchIndex } from '@/lib/types/content'
import type { SearchError } from '@/lib/search'
import { validateSearchIndex, createSearchError } from '@/lib/search'

const MAX_RETRIES = 3

export function SearchModal() {
  const { isOpen, closeSearch } = useSearch()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FuseResult<SearchIndexItem>[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fuse, setFuse] = useState<Fuse<SearchIndexItem> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<SearchError | null>(null)
  const [hasPartialData, setHasPartialData] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const initializeFuse = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const searchIndexModule = await import('@/data/search-index.json')
      const searchIndexData = searchIndexModule.default as SearchIndex
      
      const { items, isPartial, validationErrors } = validateSearchIndex(searchIndexData)
      
      if (items.length === 0 && validationErrors.length > 0) {
        throw new Error('Search index is malformed or empty')
      }
      
      if (isPartial) {
        setHasPartialData(true)
        setError(createSearchError('partial_data'))
      }
      
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
      
      setFuse(new Fuse(items, fuseOptions))
      setRetryCount(0)
    } catch (loadError) {
      const errorType = loadError instanceof SyntaxError 
        ? 'index_malformed' 
        : 'index_load_failed'
      
      setError(createSearchError(errorType, loadError))
      setFuse(null)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Initialize Fuse.js when modal opens
  useEffect(() => {
    if (isOpen && !fuse && !isLoading) {
      initializeFuse()
    }
  }, [isOpen, fuse, isLoading, initializeFuse])
  
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
        if (error?.type === 'search_failed') {
          setError(null)
        }
      } catch (searchError) {
        setError(createSearchError('search_failed', searchError))
        setResults([])
      }
    }, 150)
    
    return () => clearTimeout(timeoutId)
  }, [query, fuse, error?.type])
  
  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedIndex, results.length])
  
  const handleRetry = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1)
      setFuse(null)
      setError(null)
      initializeFuse()
    }
  }, [retryCount, initializeFuse])
  
  const handleResultSelect = useCallback((result: FuseResult<SearchIndexItem>) => {
    closeSearch()
    router.push(result.item.path)
  }, [closeSearch, router])
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : prev)
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

  const renderContent = () => {
    if (isLoading) {
      return <SearchLoading />
    }
    
    if (error && error.type !== 'partial_data' && !fuse) {
      return (
        <SearchErrorDisplay
          error={error}
          retryCount={retryCount}
          maxRetries={MAX_RETRIES}
          onRetry={handleRetry}
          onClose={closeSearch}
        />
      )
    }
    
    if (!query.trim()) {
      return <SearchEmptyState hasPartialData={hasPartialData} error={error} />
    }
    
    if (error?.type === 'search_failed') {
      return <SearchQueryError />
    }
    
    if (results.length === 0) {
      return <SearchNoResults query={query} />
    }
    
    return (
      <SearchResults
        results={results}
        selectedIndex={selectedIndex}
        onResultClick={handleResultClick}
        onSelectedIndexChange={setSelectedIndex}
        resultsRef={resultsRef}
      />
    )
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={closeSearch}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0">
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
        
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
        
        <SearchFooter />
      </DialogContent>
    </Dialog>
  )
}
