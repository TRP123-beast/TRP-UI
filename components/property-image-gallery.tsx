"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertyImageGalleryProps {
  images: string[]
  address: string
}

export function PropertyImageGallery({ images, address }: PropertyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const navigateImages = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
    } else {
      setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
      <div className="md:col-span-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image src={images[selectedImage] || "/placeholder.svg"} alt={address} fill className="object-cover" />
          {/* Navigation controls */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white shadow-md"
            onClick={() => navigateImages("prev")}
          >
            <ChevronLeft className="h-5 w-5 text-futuristic-darker" />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white shadow-md"
            onClick={() => navigateImages("next")}
          >
            <ChevronRight className="h-5 w-5 text-futuristic-darker" />
          </button>

          {/* Pagination indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            {selectedImage + 1} / {images.length}
          </div>

          {/* Pagination dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full ${selectedImage === index ? "bg-white" : "bg-white/50"}`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer ${selectedImage === index ? "ring-2 ring-teal-500" : ""}`}
            onClick={() => setSelectedImage(index)}
          >
            <Image src={image || "/placeholder.svg"} alt={`Property view ${index + 1}`} fill className="object-cover" />
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                {images.length - 4}+
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
