"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MapView } from "@/components/map-view"
// Import the MapInitializer component
import MapInitializer from "@/components/map-initializer"

export default function MapPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load properties from localStorage on component mount
  useEffect(() => {
    setIsLoading(true)
    const storedProperties = localStorage.getItem("properties")
    if (storedProperties) {
      setProperties(JSON.parse(storedProperties))
    }

    // Add a small delay to allow for animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const handleExit = () => {
    setIsExiting(true)

    // Navigate back after animation completes
    setTimeout(() => {
      router.back()
    }, 600) // Animation duration
  }

  // Add the MapInitializer component at the top of the returned JSX
  return (
    <>
      <MapInitializer />
      <div
        className={`fixed inset-0 bg-white z-50 transition-all duration-500 ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${isExiting ? "bg-black/50" : ""}`}
      >
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-white shadow-md border border-gray-200"
            onClick={() => router.back()}
            aria-label="Back to listings"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Exit button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-white shadow-lg border-2 border-gray-300 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            onClick={handleExit}
            aria-label="Exit map view"
          >
            <X className="h-6 w-6 text-gray-700" />
          </Button>
        </div>

        <div
          ref={mapContainerRef}
          className={`h-full w-full transition-all duration-500 ease-in-out ${
            isExiting
              ? "scale-[0.033] rounded-lg border-8 border-white shadow-2xl mx-auto my-auto transform-origin-center"
              : ""
          }`}
          style={{
            transformOrigin: "center center",
            boxShadow: isExiting ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "none",
          }}
        >
          <MapView
            isOpen={true}
            onClose={() => router.back()}
            properties={properties}
            isFullPage={true}
            className="animate-fade-in"
          />
        </div>
      </div>
    </>
  )
}
