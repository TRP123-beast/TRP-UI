"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, ArrowLeft, X, MapPin, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveSearch, getSavedSearches, removeSearch } from "@/utils/search-utils"
import { useRouter } from "next/navigation"

interface MobileSearchProps {
  properties: any[]
  onSearch: (query: string) => void
  initialQuery?: string
}

export function MobileSearch({ properties, onSearch, initialQuery = "" }: MobileSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load saved searches on mount
  useEffect(() => {
    setSavedSearches(getSavedSearches())
  }, [])

  // Handle clicks outside the expanded search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])

  // Update suggestions when query changes
  useEffect(() => {
    if (query) {
      // Generate suggestions from properties
      const propertyAddresses = properties.map((p) => p.address)
      const propertyLocations = properties.map((p) => p.location)
      const allOptions = [...new Set([...propertyAddresses, ...propertyLocations])]

      // Filter by query
      const filteredSuggestions = allOptions
        .filter((option) => option.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)

      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }, [query, properties])

  const expandSearch = () => {
    setIsExpanded(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleSearch = (searchTerms: string[]) => {
    // Pass search terms to parent component
    if (onSearch) {
      onSearch(searchTerms.join(" "))
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Save search and perform search
    if (query.trim()) {
      saveSearch(query)
      setSavedSearches(getSavedSearches())
      handleSearch([query])
      setSelectedSuggestion(null)
    }

    setIsExpanded(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setSelectedSuggestion(suggestion)

    // Perform search immediately
    saveSearch(suggestion)
    setSavedSearches(getSavedSearches())
    handleSearch([suggestion])

    setIsExpanded(false)
  }

  const handleRecentSearchClick = (search: any) => {
    setQuery(search.query)
    setSelectedSuggestion(search.query)

    // Perform search immediately
    saveSearch(search.query)
    setSavedSearches(getSavedSearches())
    handleSearch([search.query])

    setIsExpanded(false)
  }

  const handleRemoveSearch = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    removeSearch(id)
    setSavedSearches(getSavedSearches())
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      {/* Collapsed Search */}
      {!isExpanded ? (
        <div
          className="flex items-center w-full bg-white rounded-full border border-gray-300 shadow-sm px-3 py-2 cursor-text"
          onClick={expandSearch}
        >
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <div className="text-sm text-gray-500 truncate flex-1">
            {selectedSuggestion || initialQuery || "Search properties..."}
          </div>
        </div>
      ) : (
        // Expanded Search
        <div className="fixed inset-0 bg-white z-50 pb-safe">
          <div className="flex items-center gap-2 p-3 border-b border-gray-200">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <form onSubmit={handleSubmit} className="flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full border-none outline-none text-sm"
                autoFocus
              />
              {query && (
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setQuery("")}>
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </form>
          </div>

          <div className="p-3">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Suggestions</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {savedSearches.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Recent Searches</p>
                <div className="space-y-2">
                  {savedSearches.map((search) => (
                    <div
                      key={search.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <div className="flex items-center">
                        <History className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{search.query}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleRemoveSearch(e, search.id)}
                      >
                        <X className="h-3 w-3 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
