"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Heart, ThumbsDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Property {
  id: string
  image: string
  price: string
  address: string
  added: string
  beds: number
  baths: number
  parking: number
  sqft: string
  location: string
}

interface PropertyDetailsProps {
  property: Property
  onClose: () => void
}

export function PropertyDetails({ property, onClose }: PropertyDetailsProps) {
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState<string[]>([])
  const [views] = useState(4)
  const [likes] = useState(1)
  const [dislikes] = useState(0)

  const addNote = () => {
    if (note.trim()) {
      setNotes([...notes, note])
      setNote("")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mx-4 my-4">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{property.address}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Image and Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Image Section */}
        <div className="relative aspect-w-16 aspect-h-9">
          <Image
            src={property.image || "/placeholder.svg"}
            alt={property.address}
            fill
            className="object-cover rounded-md"
          />
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold">{property.price}</h3>
            <p className="text-gray-600">{property.address}</p>
            <p className="text-gray-500 text-sm mt-2">Studio · 1 bed · 1 bath · {property.sqft || "N/A"} sqft</p>

            {/* Amenities */}
            <div className="mt-4">
              <h4 className="text-md font-semibold">Amenities</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                <li>Beach access – Beachfront</li>
                <li>Wifi</li>
                <li>Dedicated workspace</li>
                <li>Free parking on premises</li>
                <li>Shared outdoor pool</li>
              </ul>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h4 className="text-md font-semibold">Description</h4>
              <p className="text-gray-600 text-sm">
                {`This beautiful property located in ${property.location} features ${property.beds} bedrooms and ${property.baths} bathrooms. ${property.parking > 0 ? `Includes ${property.parking} parking space.` : ""} ${property.sqft ? `The property is ${property.sqft} square feet.` : ""} Perfect for families or investors looking for a great opportunity in a prime location.`}
              </p>
            </div>
          </div>

          {/* Booking and Notes */}
          <div>
            <Button className="w-full mb-2">Request Showing</Button>

            {/* Notes Section */}
            <div>
              <h4 className="text-md font-semibold">Notes</h4>
              <Textarea
                placeholder="Add your comment here"
                className="w-full border rounded-md p-2 text-sm"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button className="mt-2 w-full" onClick={addNote}>
                Add Note
              </Button>
              {notes.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold text-sm">Your Notes</h5>
                  {notes.map((noteText, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded-md mt-2 text-sm">
                      {noteText}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Views, Likes, Dislikes */}
      <div className="flex items-center justify-around p-4 border-t bg-gray-50">
        <div className="flex items-center gap-1 text-gray-500">
          <Eye className="h-4 w-4" />
          <span>{views}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Heart className="h-4 w-4" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <ThumbsDown className="h-4 w-4" />
          <span>{dislikes}</span>
        </div>
      </div>
    </div>
  )
}
