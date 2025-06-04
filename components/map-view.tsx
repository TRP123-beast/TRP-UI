"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X, MapPin, ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapViewProps {
  isOpen: boolean
  onClose: () => void
  properties: any[]
  isMiniMap?: boolean
  isFullPage?: boolean
  className?: string
}

export function MapView({
  isOpen,
  onClose,
  properties,
  isMiniMap = false,
  isFullPage = false,
  className = "",
}: MapViewProps) {
  const [mapType, setMapType] = useState<"map" | "satellite">("map")
  const [activeProperty, setActiveProperty] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState<{ id: string; x: number; y: number } | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(5) // Default zoom level
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  // Animation effect when component mounts
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow for CSS transition
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Handle marker hover
  const handleMarkerHover = (id: string, e: React.MouseEvent) => {
    // Get position relative to the container
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setShowPopup({ id, x, y })
    setActiveProperty(id)
  }

  // Handle marker leave
  const handleMarkerLeave = () => {
    setShowPopup(null)
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 10)) // Max zoom level 10
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 1)) // Min zoom level 1
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (mapContainerRef.current) {
      if (!isFullscreen) {
        if (mapContainerRef.current.requestFullscreen) {
          mapContainerRef.current.requestFullscreen()
          setIsFullscreen(true)
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
          setIsFullscreen(false)
        }
      }
    }
  }

  // Calculate marker positions based on property locations
  const getMarkerPosition = (property: any) => {
    // In a real app, you would use the property's latitude and longitude
    // For this demo, we'll generate positions based on the property's location

    // Map different locations to different areas on the map
    const locationMap: Record<string, { left: string; top: string }> = {
      Toronto: { left: "48%", top: "65%" },
      Vancouver: { left: "12%", top: "55%" },
      Montreal: { left: "55%", top: "62%" },
      Ottawa: { left: "52%", top: "63%" },
      Halifax: { left: "65%", top: "60%" },
      Mississauga: { left: "47%", top: "66%" },
      Amherst: { left: "60%", top: "64%" },
      // Default position if location not found
      default: { left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 80 + 10}%` },
    }

    return locationMap[property.location] || locationMap.default
  }

  // Get marker color based on property status
  const getMarkerColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#FFA500"
      case "pending":
        return "#000000"
      case "not_booked":
        return "#767676"
      default:
        return "#FFA500"
    }
  }

  const containerClasses = `
    ${isMiniMap ? "" : "fixed inset-0"} 
    bg-white z-50 flex flex-col 
    ${isMiniMap ? "h-full" : ""} 
    ${isFullPage ? "h-screen" : ""}
    ${className}
    transition-all duration-500 ease-in-out
    ${isVisible ? "opacity-100 transform-none" : "opacity-0 transform translate-y-4"}
  `

  return (
    <div className={containerClasses} ref={mapContainerRef}>
      {!isMiniMap && (
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-4 py-2 ${mapType === "map" ? "bg-gray-100 font-medium" : ""} text-black`}
              onClick={() => setMapType("map")}
            >
              Map
            </button>
            <button
              className={`px-4 py-2 ${mapType === "satellite" ? "bg-gray-100 font-medium" : ""} text-black`}
              onClick={() => setMapType("satellite")}
            >
              Satellite
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              aria-label="Zoom in"
              className="border-gray-300 text-black"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              aria-label="Zoom out"
              className="border-gray-300 text-black"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="border-gray-300 text-black"
            >
              <Maximize className="h-5 w-5" />
            </Button>
            {!isMiniMap && !isFullPage && (
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                aria-label="Close map"
                className="border-gray-300 text-black"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="relative flex-1 overflow-hidden">
        {/* Map image with zoom effect */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out"
          style={{
            transform: `scale(${1 + (zoomLevel - 5) * 0.2})`,
            transformOrigin: "center",
          }}
        >
          <Image
            src={
              mapType === "map"
                ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VULspR4xKEs1UPe0wte155y1r1TV0r.png"
                : "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2031&auto=format&fit=crop"
            }
            alt="Map showing property locations"
            fill
            className="object-cover"
          />

          {/* Property markers */}
          {properties.map((property) => {
            const position = getMarkerPosition(property)
            const markerColor = getMarkerColor(property.status)

            return (
              <div
                key={property.id}
                className="absolute"
                style={{ left: position.left, top: position.top }}
                onMouseEnter={(e) => handleMarkerHover(property.id, e)}
                onMouseLeave={handleMarkerLeave}
                onClick={(e) => handleMarkerHover(property.id, e)}
              >
                <div className="relative">
                  <MapPin
                    className={`h-8 w-8 drop-shadow-md transform -translate-x-1/2 -translate-y-full transition-all duration-300 ${
                      activeProperty === property.id ? "scale-125" : "scale-100"
                    }`}
                    fill={activeProperty === property.id ? markerColor : "transparent"}
                    color={markerColor}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Popup when hovering */}
                {showPopup && showPopup.id === property.id && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 z-10 w-56 border border-gray-200 animate-fade-in">
                    <div className="flex items-start gap-2">
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={property.image || "/placeholder.svg"}
                          alt={property.address}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-black">{property.price}</p>
                        <p className="text-xs truncate text-gray-600">{property.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {property.beds} beds • {property.baths} baths
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!isMiniMap && !isFullPage && (
          <>
            {/* Centered View Map button */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
              <Button
                className="bg-white text-black border border-black hover:bg-gray-50 px-6 py-2 rounded-full shadow-lg"
                onClick={() => alert("This would open a full-screen map view in a real application")}
              >
                View Map
              </Button>
            </div>

            {/* Map usage instructions */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md text-xs">
              <p className="font-medium mb-1 text-black">To use Google Maps integration:</p>
              <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                <li>
                  Create a Google Maps API key at{" "}
                  <a
                    href="https://console.cloud.google.com/"
                    className="text-[#FFA500] underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Cloud Console
                  </a>
                </li>
                <li>Enable the Maps JavaScript API for your key</li>
                <li>Add the key to your environment variables</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
