"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X, Check, MapPin, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveSearch, getSavedSearches, removeSearch, calculateStringSimilarity } from "@/utils/search-utils"
import type { SavedSearch } from "@/utils/search-utils"

interface SearchBarProps {
  onSearch: (locations: string[]) => void
  onFilterClick?: () => void
  propertyCount?: number
  properties?: any[]
}

export function SearchBar({ onSearch, onFilterClick, propertyCount = 0, properties = [] }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load saved searches on component mount
  useEffect(() => {
    setSavedSearches(getSavedSearches())
  }, [])

  useEffect(() => {
    // Always update suggestions when query changes
    if (query.length > 1) {
      const propertyAddresses = properties.map((p) => p.address)
      const propertyLocations = properties.map((p) => p.location)
      const uniqueLocations = [...new Set([...propertyAddresses, ...propertyLocations])]

      // Sort locations by similarity to query using our enhanced utility function
      const matchingLocations = uniqueLocations
        .filter((location) => location.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => calculateStringSimilarity(query, b) - calculateStringSimilarity(query, a))

      // Add generic suggestions if not enough matches
      const genericSuggestions = [
        `${query}, Toronto, ON`,
        `${query}, Vancouver, BC`,
        `${query}, Montreal, QC`,
        `${query} Avenue, Calgary, AB`,
        `${query} Street, Ottawa, ON`,
      ]

      const allSuggestions = [...matchingLocations]

      if (allSuggestions.length < 5) {
        genericSuggestions.forEach((suggestion) => {
          if (!allSuggestions.some((s) => s.toLowerCase().includes(suggestion.toLowerCase()))) {
            allSuggestions.push(suggestion)
          }
        })
      }

      setSuggestions(allSuggestions)
      setShowSuggestions(true)
      setShowSavedSearches(false)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    // Always perform real-time filtering with the current query
    // This ensures filtering happens on every keystroke
    if (query.length > 0) {
      // If we have selected locations, add the current query to them
      if (selectedLocations.length > 0) {
        onSearch([...selectedLocations, query])
      } else {
        onSearch([query])
      }
    } else if (selectedLocations.length > 0) {
      // If query is empty but we have selected locations, use those
      onSearch(selectedLocations)
    } else {
      // If both query and selected locations are empty, clear search
      onSearch([])
    }
  }, [query, properties, selectedLocations, onSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setShowSavedSearches(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Set loading state when query changes
    if (query.length > 0) {
      setIsLoading(true)

      // Clear loading after a short delay to show the indicator
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setIsLoading(false)
    }
  }, [query])

  const handleSuggestionClick = (suggestion: string) => {
    if (selectedLocations.includes(suggestion)) {
      setSelectedLocations(selectedLocations.filter((loc) => loc !== suggestion))
    } else {
      setSelectedLocations([...selectedLocations, suggestion])
    }
    setQuery("")
    setShowSuggestions(true)
  }

  const handleSearch = () => {
    if (selectedLocations.length > 0) {
      setIsLoading(true)
      setShowSuggestions(false)
      setShowSavedSearches(false)

      // Save the search queries to localStorage
      selectedLocations.forEach((location) => {
        saveSearch(location)
      })

      // Refresh saved searches list
      setSavedSearches(getSavedSearches())

      // Pass selected locations for filtering
      onSearch(selectedLocations)
      setHasSearched(true)

      setTimeout(() => setIsLoading(false), 500)
    } else if (query.trim()) {
      // If no locations are selected but there is a query, use that for search
      saveSearch(query)
      setSavedSearches(getSavedSearches())
      onSearch([query])
      setHasSearched(true)
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  const handleClear = () => {
    setQuery("")
    setSelectedLocations([])
    setShowSuggestions(false)
    setShowSavedSearches(false)
    setHasSearched(false)
    onSearch([])
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (query.trim()) {
        if (suggestions.length > 0) {
          // Add first suggestion to selected locations
          handleSuggestionClick(suggestions[0])
        } else {
          setSelectedLocations([query])
        }

        // Save search when using Enter key
        saveSearch(query)
        setSavedSearches(getSavedSearches())
      }
      handleSearch()
    }
  }

  const handleSavedSearchClick = (savedSearch: SavedSearch) => {
    setSelectedLocations([savedSearch.query])
    setShowSavedSearches(false)

    // Update the saved search count and timestamp
    saveSearch(savedSearch.query)
    setSavedSearches(getSavedSearches())

    // Perform the search
    onSearch([savedSearch.query])
    setHasSearched(true)
  }

  const handleRemoveSavedSearch = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    removeSearch(id)
    setSavedSearches(getSavedSearches())
  }

  const handleFocusInput = () => {
    if (query.length === 0 && savedSearches.length > 0) {
      setShowSavedSearches(true)
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 sm:gap-3 w-full">
        {/* Filter Button */}
        {onFilterClick && (
          <Button
            variant="default"
            size="sm"
            className="bg-[#FFA500] hover:bg-[#FFA500]/90 flex items-center gap-1 rounded-lg shadow-sm text-black h-8 px-2"
            onClick={onFilterClick}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.66667 11.3333H9.33333V10H6.66667V11.3333ZM2 4.66667V6H14V4.66667H2ZM4 8.66667H12V7.33333H4V8.66667Z"
                fill="#000000"
              />
            </svg>
            <span className="text-xs text-black">Filter</span>
          </Button>
        )}

        {/* Search Box - Reduced height */}
        <div className="flex flex-1 items-center border border-gray-300 rounded-lg bg-white h-8 px-3 w-full shadow-inner">
          {isLoading ? (
            <svg
              className="animate-spin h-3.5 w-3.5 text-[#FFA500] mr-2 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : (
            <Search className="h-3.5 w-3.5 text-black mr-2 flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search locations, properties..."
            className="w-full text-xs text-black outline-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocusInput}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className="ml-1" onClick={handleClear}>
              <X className="h-3 w-3 text-black" />
            </button>
          )}
        </div>

        {/* Search/Clear Button */}
        {selectedLocations.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-black px-3 h-9 text-xs sm:h-8 border-black"
            onClick={hasSearched ? handleClear : handleSearch}
            disabled={isLoading}
          >
            {hasSearched ? (
              "Clear"
            ) : isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching
              </span>
            ) : (
              "Search"
            )}
          </Button>
        )}
      </div>

      {/* Chips */}
      {selectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedLocations.map((location, index) => (
            <div
              key={index}
              className="bg-[#FFA500]/10 text-black px-2 py-0.5 rounded-full text-[10px] flex items-center"
            >
              {location}
              <button
                className="ml-1"
                onClick={() => setSelectedLocations(selectedLocations.filter((_, i) => i !== index))}
              >
                <X className="h-2.5 w-2.5 text-black" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Saved Searches */}
      {showSavedSearches && savedSearches.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto border border-gray-200"
        >
          <div className="p-2 border-b border-gray-100">
            <h3 className="text-xs font-medium text-gray-700">Recent Searches</h3>
          </div>
          {savedSearches.map((search) => (
            <div
              key={search.id}
              className="px-3 py-1.5 hover:bg-[#FFA500]/10 cursor-pointer text-xs flex items-center justify-between"
              onClick={() => handleSavedSearchClick(search)}
            >
              <div className="flex items-center">
                <History className="h-3 w-3 text-gray-400 mr-1.5" />
                <span className="text-black">{search.query}</span>
                <span className="ml-2 text-[10px] text-gray-400">
                  {search.count > 1 ? `${search.count} times` : ""}
                </span>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => handleRemoveSavedSearch(e, search.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto border border-gray-200"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-1.5 hover:bg-[#FFA500]/10 cursor-pointer text-xs flex items-center justify-between"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                {suggestion.includes(",") ? (
                  <MapPin className="h-3 w-3 text-gray-400 mr-1.5" />
                ) : (
                  <Search className="h-3 w-3 text-gray-400 mr-1.5" />
                )}
                <span className="text-black">{suggestion}</span>
              </div>
              {selectedLocations.includes(suggestion) && <Check className="h-3 w-3 text-[#FFA500]" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
