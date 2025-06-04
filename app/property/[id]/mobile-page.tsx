"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MobilePropertyView } from "@/components/mobile-property-view"
import { MobileNav } from "@/components/mobile-nav"
import { ToastNotification } from "@/components/toast-notification"

export default function MobilePropertyPage() {
  const params = useParams()
  const propertyId = params.id as string
  const [property, setProperty] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showingRequests, setShowingRequests] = useState<string[]>([])
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Load property data and user preferences
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll fetch from our mock data
        const storedProperties = localStorage.getItem("properties")
        const parsedProperties = storedProperties ? JSON.parse(storedProperties) : []
        const foundProperty = parsedProperties.find((p: any) => p.id === propertyId)
        setProperty(foundProperty)

        // Load user preferences from localStorage
        const storedFavorites = localStorage.getItem("favorites")
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites))
        }

        const storedShowingRequests = localStorage.getItem("showingRequests")
        if (storedShowingRequests) {
          setShowingRequests(JSON.parse(storedShowingRequests))
        }
      } catch (error) {
        console.error("Error loading property:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [propertyId])

  // Toggle showing request
  const toggleShowingRequest = () => {
    const newShowingRequests = showingRequests.includes(propertyId)
      ? showingRequests.filter((id) => id !== propertyId)
      : [...showingRequests, propertyId]

    setShowingRequests(newShowingRequests)
    localStorage.setItem("showingRequests", JSON.stringify(newShowingRequests))

    // Show toast
    setToastMessage(
      showingRequests.includes(propertyId) ? "Removed from showing requests" : "Added to showing requests",
    )
    setToastVisible(true)
  }

  // Toggle favorite
  const toggleFavorite = () => {
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter((id) => id !== propertyId)
      : [...favorites, propertyId]

    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))

    // Show toast
    setToastMessage(favorites.includes(propertyId) ? "Removed from favorites" : "Added to favorites")
    setToastVisible(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-[#FFA500] border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold mb-2">Property Not Found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <MobilePropertyView
        property={property}
        onAddToCart={toggleShowingRequest}
        onToggleFavorite={toggleFavorite}
        isFavorite={favorites.includes(propertyId)}
        isInCart={showingRequests.includes(propertyId)}
      />
      <MobileNav cartItems={showingRequests.map((id) => ({ id }))} />
      <ToastNotification
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        variant="success"
      />
    </>
  )
}
