"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PropertyIcons } from "@/components/property-icons"

interface CartPreviewProps {
  onClose: () => void
  properties?: any[]
  property?: any
  onRemove?: (id: string) => void
  open?: boolean
}

export function CartPreview({ onClose, properties = [], property, onRemove, open }: CartPreviewProps) {
  const router = useRouter()
  const [favorites, setFavorites] = useState<string[]>([])

  // Create a combined properties array that works with both props
  const displayProperties = property ? [property] : properties

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Update the handleRemove function to properly remove items from cart
  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove(id)
    }
  }

  const handleCheckout = () => {
    router.push("/cart")
    onClose()
  }

  // For mobile full-screen view
  if (open) {
    return (
      <div className="flex flex-col h-full">
        {displayProperties.length > 0 && (
          <div className="p-4 bg-futuristic-light text-futuristic-darker">
            <p className="text-sm font-medium">
              The following properties have been added to your showing requests and will be booked once your schedule
              has been created
            </p>
          </div>
        )}

        {displayProperties.length > 0 && (
          <div className="px-4 py-2">
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        )}

        <div className="divide-y flex-1 overflow-auto">
          {displayProperties.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No properties in cart</div>
          ) : (
            displayProperties.map((property) => (
              <div key={property.id} className="p-4 bg-white">
                <div className="relative mb-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.address}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center"
                    onClick={(e) => toggleFavorite(property.id, e)}
                  >
                    <Heart
                      className={`h-4 w-4 ${favorites.includes(property.id) ? "fill-teal-500 text-teal-500" : ""}`}
                    />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Price : {property.price}</h3>
                    <button className="text-yellow-500">
                      <span className="sr-only">Highlight</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm truncate">{property.address}</p>
                  <p className="text-gray-500 text-xs">Added {property.added}</p>

                  <PropertyIcons
                    beds={property.beds}
                    baths={property.baths}
                    parking={property.parking}
                    className="mt-2"
                    iconSize={16}
                    textClassName="text-xs"
                  />

                  <div className="flex justify-center mt-3">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => handleRemove(property.id, e)}
                      aria-label="Remove from cart"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {displayProperties.length > 0 && (
          <div className="p-4 border-t">
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        )}
      </div>
    )
  }

  // For dropdown preview
  if (displayProperties.length === 0) {
    return (
      <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border p-4 z-50 w-80">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium">Cart</p>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-500 text-center py-4">No properties in cart</p>
      </div>
    )
  }

  // Update the positioning and width for mobile
  return (
    <div className="fixed right-4 top-14 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="p-4 bg-futuristic-light text-futuristic-darker text-sm">
        <div className="flex justify-between items-center">
          <p className="font-medium">
            The following properties have been added to your showing requests and will be booked once your schedule has
            been created
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-2 flex-shrink-0 text-futuristic-darker hover:bg-futuristic-light/80"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-2">
        <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleCheckout}>
          Checkout
        </Button>
      </div>

      <div className="divide-y">
        {displayProperties.map((property) => (
          <div key={property.id} className="p-4 bg-white">
            <div className="relative mb-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={property.address}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center"
                onClick={(e) => toggleFavorite(property.id, e)}
              >
                <Heart className={`h-4 w-4 ${favorites.includes(property.id) ? "fill-teal-500 text-teal-500" : ""}`} />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Price : {property.price}</h3>
                <button className="text-yellow-500">
                  <span className="sr-only">Highlight</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 text-sm truncate">{property.address}</p>
              <p className="text-gray-500 text-xs">Added {property.added}</p>

              <PropertyIcons
                beds={property.beds}
                baths={property.baths}
                parking={property.parking}
                className="mt-2"
                iconSize={16}
                textClassName="text-xs"
              />

              <div className="flex justify-center mt-3">
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => handleRemove(property.id, e)}
                  aria-label="Remove from cart"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleCheckout}>
          Checkout
        </Button>
      </div>
    </div>
  )
}
