"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertyImageCarouselProps {
  images: string[]
  address: string
  autoPlay?: boolean
  interval?: number
}

export function PropertyImageCarousel({
  images,
  address,
  autoPlay = true,
  interval = 5000,
}: PropertyImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // If only one image is provided, use a placeholder array
  const imageArray =
    images && images.length > 0
      ? images.map((img) => img || "/placeholder.svg?height=300&width=400")
      : ["/placeholder.svg?height=300&width=400"]

  useEffect(() => {
    // Reset current index when images change
    setCurrentIndex(0)

    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageArray.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, imageArray.length, images])

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageArray.length)
  }

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl group">
      <Image
        src={imageArray[currentIndex] || "/placeholder.svg?height=300&width=400"}
        alt={`${address} - Image ${currentIndex + 1}`}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={currentIndex === 0} // Prioritize loading the first image
        onError={(e) => {
          // If image fails to load, replace with placeholder
          const target = e.target as HTMLImageElement
          target.src = "/placeholder.svg?height=300&width=400"
        }}
      />

      {/* Navigation arrows - only show on hover or if more than one image */}
      {imageArray.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4 text-deepGreen-dark" />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4 text-deepGreen-dark" />
          </button>
        </>
      )}

      {/* Pagination dots */}
      {imageArray.length > 1 && (
        <div
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1"
          role="tablist"
          aria-label="Property images"
        >
          {imageArray.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Image ${index + 1} of ${imageArray.length}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={(e) => goToSlide(index, e)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
