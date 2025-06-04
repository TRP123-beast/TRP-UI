"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Share2, Phone, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyImageCarousel } from "@/components/property-image-carousel"

interface MobilePropertyViewProps {
  property: any
  onAddToCart: () => void
  onToggleFavorite: () => void
  isFavorite: boolean
  isInCart: boolean
}

export function MobilePropertyView({
  property,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  isInCart,
}: MobilePropertyViewProps) {
  const router = useRouter()
  const [showContactInfo, setShowContactInfo] = useState(false)

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md border-gray-200"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md border-gray-200"
          onClick={onToggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-[#FFA500] text-[#FFA500]" : ""}`} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md border-gray-200"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: property.address,
                text: `Check out this property: ${property.address} for ${property.price}`,
                url: window.location.href,
              })
            }
          }}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Image carousel */}
      <div className="relative w-full h-[40vh]">
        <PropertyImageCarousel
          images={property.images || [property.image]}
          address={property.address}
          autoPlay={false}
        />
      </div>

      {/* Property info */}
      <div className="p-4 flex-grow">
        <h1 className="text-2xl font-bold text-gray-900">{property.price}</h1>
        <p className="text-gray-600 my-1">{property.address}</p>

        <div className="flex items-center gap-3 my-3 py-3 border-y border-gray-100">
          <div className="flex-1 text-center">
            <p className="text-xl font-semibold">{property.beds}</p>
            <p className="text-xs text-gray-500">Beds</p>
          </div>
          <div className="flex-1 text-center border-x border-gray-100 px-3">
            <p className="text-xl font-semibold">{property.baths}</p>
            <p className="text-xs text-gray-500">Baths</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xl font-semibold">{property.sqft}</p>
            <p className="text-xs text-gray-500">Sq ft</p>
          </div>
        </div>

        <div className="my-4">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-sm text-gray-600">
            This beautiful property located in {property.location} features {property.beds} bedrooms and{" "}
            {property.baths} bathrooms.
            {property.parking > 0 ? ` Includes ${property.parking} parking space.` : ""}
            {property.sqft ? ` The property is ${property.sqft} square feet.` : ""}
            Perfect for families or investors looking for a great opportunity in a prime location.
          </p>
        </div>

        <div className="mt-3 mb-20">
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg mb-3"
            onClick={() => setShowContactInfo(!showContactInfo)}
          >
            Contact Agent
          </Button>

          {showContactInfo && (
            <div className="animate-fade-in bg-gray-50 p-3 rounded-lg mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">John Smith</h3>
                  <p className="text-sm text-gray-600">Rental Agent</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => (window.location.href = "tel:+15555555555")}
                  >
                    <Phone className="h-5 w-5 text-[#FFA500]" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => (window.location.href = "mailto:agent@example.com")}
                  >
                    <Mail className="h-5 w-5 text-[#FFA500]" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Button
            className={`w-full py-3 rounded-lg mb-3 ${
              isInCart ? "bg-[#FFA500] hover:bg-[#FFA500]/90" : "bg-white border border-black hover:bg-gray-50"
            } text-${isInCart ? "white" : "black"}`}
            onClick={onAddToCart}
          >
            {isInCart ? "Remove from Cart" : "Request Showing"}
          </Button>
        </div>
      </div>

      {/* Bottom safe area for mobile navigation */}
      <div className="h-16" />
    </div>
  )
}
