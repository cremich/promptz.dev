'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
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
  SearchLoading
} from '@/components/search/SearchResults'
import { SearchFooter } from '@/components/search/SearchFooter'
import { useSearchModal } from '@/components/search/useSearchModal'

export function SearchModal() {
  const { isOpen, closeSearch } = useSearch()
  const router = useRouter()

  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    isLoading,
    error,
    hasPartialData,
    inputRef,
    resultsRef,
    handleKeyDown,
    handleResultClick
  } = useSearchModal({
    isOpen,
    onNavigate: (path) => router.push(path),
    onClose: closeSearch
  })

  const renderContent = () => {
    if (isLoading) {
      return <SearchLoading />
    }

    if (error && error.type !== 'partial_data') {
      return <SearchErrorDisplay error={error} onClose={closeSearch} />
    }

    if (!query.trim()) {
      return <SearchEmptyState hasPartialData={hasPartialData} error={error} />
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
