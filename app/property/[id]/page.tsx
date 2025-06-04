"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Share2, ChevronLeft, ChevronRight, ThumbsDown, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { ToastNotification } from "@/components/toast-notification"

// Import the MapView component at the top of the file
import { MapView } from "@/components/map-view"
// Add the following import at the top with the other imports
import { addToRecentlyViewed } from "@/utils/search-utils"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedImage, setSelectedImage] = useState(0)
  const [cartItems, setCartItems] = useState<any[]>([])
  // Toast notification state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const propertyId = params.id as string
  const id = params.id as string

  // Mock property data - in a real app, you would fetch this from an API
  const properties = [
    {
      id: "20",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      price: "$2,600/mo",
      address: "20 O'Neill Rd #238, North York, ON",
      added: "5 months ago",
      beds: 3,
      baths: 2,
      parking: 1,
      sqft: "600 - 699",
      location: "Toronto",
      areaCode: "CO1",
      propertyType: "apartment",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
      ],
    },
    {
      id: "809",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      price: "$4,200/mo",
      address: "809 Bay Street #1501, Toronto, ON",
      added: "3 months ago",
      beds: 2,
      baths: 2,
      parking: 1,
      sqft: "900",
      location: "Toronto",
      areaCode: "CO1",
      propertyType: "condo",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
      ],
    },
  ]

  useEffect(() => {
    // Find the property by ID
    const foundProperty = properties.find((p) => p.id === propertyId)
    if (foundProperty) {
      setProperty(foundProperty)
    }
    setLoading(false)
  }, [propertyId])

  // Add useEffect to track that this property was viewed
  useEffect(() => {
    // Add the property ID to recently viewed when the page loads
    if (id) {
      addToRecentlyViewed(id)
    }
  }, [id])

  const addNote = () => {
    if (note.trim()) {
      setNotes([...notes, note])
      setNote("")
    }
  }

  const handleRequestShowing = () => {
    // In a real app, you would make an API call to add the property to cart
    // For now, we'll just navigate to the cart page
    router.push(`/cart?property=${propertyId}`)

    // You could also show a success message or notification here
    alert("Property added to your showing requests!")
  }

  const handleShareLink = () => {
    // Copy the current URL to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        // Only show the toast notification, removed the tooltip
        setToastMessage("Link copied to clipboard!")
        setToastVisible(true)
      })
      .catch((err) => {
        console.error("Could not copy text: ", err)
        setToastMessage("Failed to copy link")
        setToastVisible(true)
      })
  }

  const navigateImages = (direction: "prev" | "next") => {
    if (property?.images) {
      if (direction === "prev") {
        setSelectedImage((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))
      } else {
        setSelectedImage((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4">Loading property details...</p>
        </div>
      </div>
    )
  }

  // Check if property exists
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/")} className="p-2 -ml-2 text-black" aria-label="Go back to dashboard">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-black">Detail</span>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TRP%20Logo-3ydAc5tBUCO0lbj7kiIrCEoYebKQVt.png"
            alt="The Rental Project Logo"
            width={120}
            height={40}
            className="h-9 w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={handleShareLink}
              className="p-2 text-black hover:bg-gray-100 rounded-full"
              aria-label="Share property"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <button className="p-2 text-black hover:bg-gray-100 rounded-full" aria-label="Dislike property">
            <ThumbsDown className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 text-black hover:bg-gray-100 rounded-full"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? "red" : "none"}
              stroke={isFavorite ? "red" : "currentColor"}
              className="h-5 w-5"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Image Gallery */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={property.images[selectedImage] || "/placeholder.svg"}
              alt={property.address}
              fill
              className="object-cover"
            />
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full active:bg-white"
              onClick={() => navigateImages("prev")}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full active:bg-white"
              onClick={() => navigateImages("next")}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {selectedImage + 1}/{property.images.length}
            </div>
            {/* Pagination dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full ${selectedImage === index ? "bg-white" : "bg-white/50"}`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 p-2 overflow-x-auto">
            {property.images.map((img: string, idx: number) => (
              <button
                key={idx}
                className={`relative w-16 h-16 flex-shrink-0 ${selectedImage === idx ? "ring-2 ring-teal-500" : ""}`}
                onClick={() => setSelectedImage(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <Image src={img || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">{property.price}</h1>
          <p className="text-black font-medium">{property.address}</p>

          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-gray-100 text-black hover:bg-gray-200 px-2 py-0.5 text-xs">
              {property.propertyType}
            </Badge>
            <Badge className="bg-gray-100 text-black hover:bg-gray-200 px-2 py-0.5 text-xs">
              Area: {property.areaCode}
            </Badge>
          </div>

          {/* Property Icons */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
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

          {/* Share Section */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-black">Share this property</p>
              <p className="text-xs text-gray-500 truncate">{window.location.href}</p>
            </div>
            {/* Copy icon button - now only shows toast notification */}
            <button
              onClick={handleShareLink}
              className="p-2 bg-white text-black hover:bg-gray-50 border border-gray-400 rounded-full flex items-center justify-center"
              aria-label="Copy link"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {/* Request Showing Button */}
          <button
            className="w-full bg-white text-black py-3 rounded-md mt-4 font-medium active:bg-gray-100 transition-colors border border-gray-400"
            onClick={handleRequestShowing}
          >
            Request Showing
          </button>
        </div>

        {/* Tabs */}
        <div className="border-t border-b">
          <div className="flex">
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "details" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "reviews" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === "location" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("location")}
            >
              Location
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4">
          {activeTab === "details" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 text-sm">
                This beautiful property located in {property.location} features {property.beds} bedrooms and{" "}
                {property.baths} bathrooms. Includes {property.parking} parking space. The property is {property.sqft}{" "}
                square feet. Perfect for families or investors looking for a great opportunity in a prime location.
              </p>

              <h2 className="text-lg font-semibold mt-6 mb-2">Notes</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <Textarea
                  placeholder="Add your notes here..."
                  className="min-h-[100px] border-none bg-transparent focus-visible:ring-0"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    className="bg-white hover:bg-gray-50 text-black text-sm px-4 py-2 h-9 border border-gray-400"
                    onClick={addNote}
                  >
                    Add Note
                  </Button>
                </div>
              </div>

              {notes.length > 0 && (
                <div className="space-y-3">
                  {notes.map((noteText, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded-md">
                      <p className="text-sm">{noteText}</p>
                      <p className="text-xs text-gray-500 mt-1">Just now</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">4.8 (12 reviews)</span>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center mb-1">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                    <div>
                      <p className="font-medium text-sm">John Smith</p>
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">2 weeks ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Great location and beautiful property. The agent was very helpful and responsive.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center mb-1">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                    <div>
                      <p className="font-medium text-sm">Sarah Johnson</p>
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                          <svg className="w-3 h-3 text-gray-300 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                        <span className="ml-1 text-xs text-gray-500">1 month ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Nice property but a bit overpriced for the area. The amenities are good though.
                  </p>
                </div>
              </div>

              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md mt-4 text-sm font-medium">
                See All Reviews
              </button>
            </div>
          )}

          {activeTab === "location" && (
            <div>
              <div className="h-64 rounded-lg overflow-hidden mb-4 border border-gray-200">
                <MapView isOpen={true} onClose={() => {}} properties={[property]} isMiniMap={true} />
              </div>

              <h3 className="font-semibold mb-2">Location Details</h3>
              <p className="text-sm text-gray-600 mb-4">
                This property is located in {property.location}, in the {property.areaCode} area. It's conveniently
                situated near public transportation, shopping centers, and restaurants.
              </p>

              <h3 className="font-semibold mb-2">Nearby Amenities</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                <li>Public Transportation: 0.2 miles</li>
                <li>Grocery Store: 0.5 miles</li>
                <li>Restaurants: 0.3 miles</li>
                <li>Parks: 0.7 miles</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} isVisible={toastVisible} onClose={() => setToastVisible(false)} />

      {/* Mobile Navigation */}
      <MobileNav cartItems={cartItems} />
    </div>
  )
}
