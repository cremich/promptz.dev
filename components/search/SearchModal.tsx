'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { useSearch } from '@/components/search-provider'

export function SearchModal() {
  const { isOpen, closeSearch } = useSearch()
  
  return (
    <Dialog open={isOpen} onOpenChange={closeSearch}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] p-0 gap-0"
      >
        <div className="p-4">
          <p>Search Modal - Basic Implementation</p>
          <p>Press ESC to close or click outside</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}