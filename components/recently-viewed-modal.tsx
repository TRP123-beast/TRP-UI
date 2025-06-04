"use client"

import { X } from "lucide-react"
import Image from "next/image"

interface RecentlyViewedModalProps {
  onClose: () => void
}

export function RecentlyViewedModal({ onClose }: RecentlyViewedModalProps) {
  // Mock recently viewed homes
  const recentHomes = [
    { id: "1", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" },
    { id: "2", image: "https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=2070&auto=format&fit=crop" },
    { id: "3", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop" },
    { id: "4", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" },
  ]

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-6">
      <button onClick={onClose} className="absolute top-6 left-6 p-2 z-10">
        <X className="h-6 w-6" />
      </button>

      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-md p-3 mb-8">
          <div className="grid grid-cols-2 gap-2">
            {recentHomes.map((home, index) => (
              <div key={home.id} className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={home.image || "/placeholder.svg"}
                  alt={`Recently viewed home ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">We've gathered your recently viewed homes</h2>
        <p className="text-gray-700 text-lg">We'll automatically save homes as you view them to help you keep track.</p>
      </div>
    </div>
  )
}
