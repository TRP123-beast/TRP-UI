"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PropertyShowingCardProps {
  property: any
  showing: any
  orientation?: "portrait" | "landscape"
  status?: string
  onReschedule?: (id: string) => void
  onCancel?: (id: string) => void
}

export function PropertyShowingCard({
  property,
  showing,
  orientation = "portrait",
  status,
  onReschedule,
  onCancel,
}: PropertyShowingCardProps) {
  const router = useRouter()

  const handlePropertyClick = () => {
    router.push(`/property/${property.id}`)
  }

  if (orientation === "landscape") {
    return (
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200"
        onClick={handlePropertyClick}
      >
        <div className="flex">
          <div className="w-1/3 relative">
            <Image
              src={property.image || "/placeholder.svg"}
              alt={property.address}
              width={120}
              height={120}
              className="object-cover h-full"
            />
          </div>
          <div className="w-2/3 p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-black text-sm truncate">{property.address}</h3>
              {status && (
                <div
                  className={`px-2 py-1 text-xs rounded-md text-white ${
                    status === "Confirmed"
                      ? "bg-[#FFA500]"
                      : status === "Pending"
                        ? "bg-black"
                        : status === "Cancelled"
                          ? "bg-red-500"
                          : "bg-gray-700"
                  }`}
                >
                  {status}
                </div>
              )}
            </div>
            <p className="text-gray-600 text-xs mt-1">{property.price}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>{property.beds} beds</span>
              <span>{property.baths} baths</span>
            </div>
            {showing.cancelReason && <p className="text-xs text-red-500 mt-2">Reason: {showing.cancelReason}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={handlePropertyClick}
    >
      <div className="relative aspect-[4/3]">
        <Image src={property.image || "/placeholder.svg"} alt={property.address} fill className="object-cover" />
        {status && (
          <div
            className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-md text-white ${
              status === "Confirmed"
                ? "bg-[#FFA500]"
                : status === "Pending"
                  ? "bg-black"
                  : status === "Cancelled"
                    ? "bg-red-500"
                    : "bg-gray-700"
            }`}
          >
            {status}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-black truncate">{property.address}</h3>
        <p className="text-gray-600 text-sm">{property.price}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>{property.beds} beds</span>
          <span>{property.baths} baths</span>
          <span>{property.sqft} sqft</span>
        </div>
        <div className="mt-4">
          {showing.scheduledDate && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Date:</span> {showing.scheduledDate}
            </p>
          )}
          {showing.time && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Time:</span> {showing.time}
            </p>
          )}
        </div>
        {(onReschedule || onCancel) && (
          <div className="mt-4 flex gap-2">
            {onReschedule && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onReschedule(showing.id)
                }}
                className="flex-1 bg-white text-black border border-black hover:bg-gray-100"
              >
                Reschedule
              </Button>
            )}
            {onCancel && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onCancel(showing.id)
                }}
                className="flex-1 bg-white text-black border border-black hover:bg-gray-100"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
