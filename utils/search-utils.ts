// Utility functions for search functionality

// Type for saved search
export interface SavedSearch {
  id: string
  query: string
  timestamp: number
  count: number // How many times this search was performed
}

// Get saved searches from localStorage
export function getSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return []

  const savedSearches = localStorage.getItem("savedSearches")
  return savedSearches ? JSON.parse(savedSearches) : []
}

// Save a search to localStorage
export function saveSearch(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return

  const searches = getSavedSearches()
  const existingSearch = searches.find((s) => s.query.toLowerCase() === query.toLowerCase())

  if (existingSearch) {
    // Update existing search
    existingSearch.timestamp = Date.now()
    existingSearch.count += 1
  } else {
    // Add new search
    searches.unshift({
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
      count: 1,
    })
  }

  // Limit to 10 saved searches
  const limitedSearches = searches.slice(0, 10)

  localStorage.setItem("savedSearches", JSON.stringify(limitedSearches))
}

// Remove a saved search
export function removeSearch(id: string): void {
  if (typeof window === "undefined") return

  const searches = getSavedSearches()
  const updatedSearches = searches.filter((s) => s.id !== id)
  localStorage.setItem("savedSearches", JSON.stringify(updatedSearches))
}

// Get recently viewed properties
export function getRecentlyViewedProperties(): string[] {
  if (typeof window === "undefined") return []

  const recentlyViewed = localStorage.getItem("recentlyViewedProperties")
  return recentlyViewed ? JSON.parse(recentlyViewed) : []
}

// Add a property to recently viewed
export function addToRecentlyViewed(propertyId: string): void {
  if (typeof window === "undefined") return

  const recentlyViewed = getRecentlyViewedProperties()

  // Remove if already exists (to move it to the top)
  const filteredList = recentlyViewed.filter((id) => id !== propertyId)

  // Add to beginning of array
  filteredList.unshift(propertyId)

  // Limit to 20 properties
  const limitedList = filteredList.slice(0, 20)

  localStorage.setItem("recentlyViewedProperties", JSON.stringify(limitedList))
}

// Improved similarity calculation for search results
export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()

  // Check for exact substring match first
  if (s2.includes(s1)) return 100 + s1.length / s2.length

  // Check for word match (higher priority than character matching)
  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  let wordMatches = 0

  for (const word of words1) {
    if (word.length < 2) continue // Skip very short words
    if (words2.some((w) => w.includes(word) || word.includes(w))) {
      wordMatches++
    }
  }

  if (wordMatches > 0) {
    return 80 + (wordMatches / Math.max(words1.length, 1)) * 20
  }

  // Calculate similarity based on common characters
  let matches = 0
  for (let i = 0; i < s1.length; i++) {
    if (s2.includes(s1[i])) matches++
  }

  return (matches / Math.max(s1.length, s2.length)) * 70
}
