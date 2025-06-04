"use client"

import type React from "react"
import { Heart, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PropertyImageCarousel } from "@/components/property-image-carousel"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface PropertyCardProps {
  property: any
  onToggleShowingRequest: (id: string, e: React.MouseEvent) => void
  onToggleFavorite: (id: string, e: React.MouseEvent) => void
  onToggleDismiss: (id: string, e: React.MouseEvent) => void
  showingRequests: string[]
  favorites: string[]
  dismissed: string[]
  onClick?: () => void
  showTooltips?: boolean
}

export function PropertyCard({
  property,
  onToggleShowingRequest,
  onToggleFavorite,
  onToggleDismiss,
  showingRequests,
  favorites,
  dismissed,
  onClick,
  showTooltips = false,
}: PropertyCardProps) {
  const router = useRouter()
  const [isPressed, setIsPressed] = useState(false)

  // Touch interaction handlers
  const handleTouchStart = () => setIsPressed(true)
  const handleTouchEnd = () => setIsPressed(false)
  const handleTouchCancel = () => setIsPressed(false)

  const handlePropertyDetails = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    router.push(`/property/${id}`)
  }

  return (
    <TooltipProvider>
      <div
        className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
          isPressed ? "scale-98 opacity-95" : "scale-100"
        }`}
        onClick={onClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <div className="relative aspect-[4/3]">
          <PropertyImageCarousel
            images={property.images && property.images.length > 0 ? property.images : [property.image]}
            address={property.address}
            autoPlay={false}
          />
          <div className="absolute top-2 right-2 flex gap-3">
            {/* Heart icon with tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full active:bg-white active:scale-90 touch-manipulation transition-transform shadow-sm"
                  onClick={(e) => onToggleFavorite(property.id, e)}
                  aria-label={favorites.includes(property.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(property.id) ? "text-[#FFA500] fill-[#FFA500]" : "text-gray-700"
                    }`}
                  />
                </button>
              </TooltipTrigger>
              {showTooltips && (
                <TooltipContent side="bottom" className="bg-black text-white p-2 text-xs">
                  {favorites.includes(property.id) ? "Remove from favorites" : "Add to favorites"}
                </TooltipContent>
              )}
            </Tooltip>

            {/* Thumbs down icon with tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full active:bg-white active:scale-90 touch-manipulation transition-transform shadow-sm"
                  onClick={(e) => onToggleDismiss(property.id, e)}
                  aria-label={dismissed.includes(property.id) ? "Restore property" : "Dismiss property"}
                >
                  <ThumbsDown
                    className={`h-5 w-5 ${
                      dismissed.includes(property.id) ? "text-gray-700 fill-gray-700" : "text-gray-700"
                    }`}
                  />
                </button>
              </TooltipTrigger>
              {showTooltips && (
                <TooltipContent side="bottom" className="bg-black text-white p-2 text-xs">
                  {dismissed.includes(property.id) ? "Restore property" : "Dismiss property"}
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-gray-800 text-lg truncate">{property.price}</h3>
          <p className="text-sm text-gray-600 truncate mb-2">{property.address}</p>

          {/* Property Icons */}
          <div className="flex flex-wrap items-center gap-3 mt-3 mb-4 text-sm text-gray-600 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-1">
              <span>{property.beds} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{property.baths} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{property.sqft} sqft</span>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            {/* Request Showing Button with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showingRequests.includes(property.id) ? "outline" : "default"}
                  className={`flex-1 text-base py-3 px-4 h-12 rounded-lg shadow-md active:scale-95 transition-transform touch-manipulation ${
                    showingRequests.includes(property.id)
                      ? "bg-[#FFA500] text-white border-[#FFA500] hover:bg-[#FF8C00]"
                      : "bg-black hover:bg-gray-800 text-white"
                  }`}
                  onClick={(e) => onToggleShowingRequest(property.id, e)}
                >
                  {showingRequests.includes(property.id) ? "Cancel Request" : "Request Showing"}
                </Button>
              </TooltipTrigger>
              {showTooltips && (
                <TooltipContent side="bottom" className="bg-black text-white p-2 text-xs max-w-[200px]">
                  {showingRequests.includes(property.id)
                    ? "Cancel your showing request"
                    : "Schedule a time to view this property"}
                </TooltipContent>
              )}
            </Tooltip>

            {/* Details Button with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 text-base py-3 px-4 h-12 rounded-lg shadow-md bg-gray-100 text-black hover:bg-gray-200 active:bg-[#FFA500] active:text-white active:border-[#FFA500] active:scale-95 transition-transform touch-manipulation"
                  onClick={(e) => handlePropertyDetails(property.id, e)}
                >
                  Details
                </Button>
              </TooltipTrigger>
              {showTooltips && (
                <TooltipContent side="bottom" className="bg-black text-white p-2 text-xs">
                  View full property details
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
