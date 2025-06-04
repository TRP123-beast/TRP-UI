"use client"

import { useState, useEffect } from "react"
import { Star, History } from "lucide-react"
import { getRecentlyViewedProperties } from "@/utils/search-utils"

interface PropertySuggestionsProps {
  properties: any[]
  onSelect: (property: any) => void
}

export function PropertySuggestions({ properties, onSelect }: PropertySuggestionsProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
  const [popularProperties, setPopularProperties] = useState<any[]>([])

  useEffect(() => {
    // Get recently viewed property IDs
    const recentIds = getRecentlyViewedProperties()

    // Find the corresponding property objects
    const recentProperties = recentIds
      .map((id) => properties.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 5) // Limit to 5 recent properties

    setRecentlyViewed(recentProperties)

    // Set some popular properties (in a real app, this would be based on real metrics)
    // Here we're just using a sample for demonstration
    setPopularProperties(properties.filter((p) => p.price.includes("4,200") || p.price.includes("3,800")).slice(0, 3))
  }, [properties])

  if (recentlyViewed.length === 0 && popularProperties.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {recentlyViewed.length > 0 && (
        <>
          <div className="px-3 py-1 bg-gray-50">
            <span className="text-xs font-medium text-gray-500">Recently Viewed</span>
          </div>
          {recentlyViewed.map((property) => (
            <div
              key={property.id}
              className="px-3 py-1.5 hover:bg-[#FFA500]/10 cursor-pointer"
              onClick={() => onSelect(property)}
            >
              <div className="flex items-center">
                <History className="h-3 w-3 text-gray-400 mr-1.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-black truncate">{property.address}</span>
                  <span className="text-[10px] text-gray-500">
                    {property.price} · {property.beds} beds
                  </span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {popularProperties.length > 0 && (
        <>
          <div className="px-3 py-1 bg-gray-50">
            <span className="text-xs font-medium text-gray-500">Popular Properties</span>
          </div>
          {popularProperties.map((property) => (
            <div
              key={property.id}
              className="px-3 py-1.5 hover:bg-[#FFA500]/10 cursor-pointer"
              onClick={() => onSelect(property)}
            >
              <div className="flex items-center">
                <Star className="h-3 w-3 text-[#FFA500] mr-1.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-black truncate">{property.address}</span>
                  <span className="text-[10px] text-gray-500">
                    {property.price} · {property.beds} beds
                  </span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
