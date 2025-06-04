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
    <div className="flex flex-col h-full max-h-[90vh]">
      <div className="flex items-center justify-between p-4 border-b border-airbnb-cement">
        <h2 className="text-xl font-bold text-airbnb-hof">{property.address}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-airbnb-hof hover:bg-airbnb-bg">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image src={property.image || "/placeholder.svg"} alt={property.address} fill className="object-cover" />
          </div>

          <div className="bg-airbnb-bg rounded-xl aspect-[4/3] flex items-center justify-center">
            <p className="text-lg text-airbnb-foggy">+0 photos</p>
          </div>

          <div className="flex items-center gap-6 py-2">
            <div className="flex items-center gap-1 text-airbnb-foggy">
              <Eye className="h-5 w-5" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1 text-airbnb-foggy">
              <Heart className="h-5 w-5" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-airbnb-foggy">
              <ThumbsDown className="h-5 w-5" />
              <span>{dislikes}</span>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-airbnb-hof">{property.price}</h3>
            <h4 className="text-xl font-semibold mt-2 text-airbnb-hof">{property.address}</h4>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-airbnb-bg p-3 rounded-md">
                <p className="text-sm text-airbnb-foggy">Bedrooms</p>
                <p className="font-semibold text-airbnb-hof">{property.beds}</p>
              </div>
              <div className="bg-airbnb-bg p-3 rounded-md">
                <p className="text-sm text-airbnb-foggy">Bathrooms</p>
                <p className="font-semibold text-airbnb-hof">{property.baths}</p>
              </div>
              <div className="bg-airbnb-bg p-3 rounded-md">
                <p className="text-sm text-airbnb-foggy">Parking</p>
                <p className="font-semibold text-airbnb-hof">{property.parking}</p>
              </div>
              <div className="bg-airbnb-bg p-3 rounded-md">
                <p className="text-sm text-airbnb-foggy">Square Feet</p>
                <p className="font-semibold text-airbnb-hof">{property.sqft || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-airbnb-hof">Description</h3>
            <p className="text-airbnb-foggy">
              This beautiful property located in {property.location} features {property.beds} bedrooms and{" "}
              {property.baths} bathrooms.
              {property.parking > 0 ? ` Includes ${property.parking} parking space.` : ""}
              {property.sqft ? ` The property is ${property.sqft} square feet.` : ""}
              Perfect for families or investors looking for a great opportunity in a prime location.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-airbnb-hof">Location</h3>
            <div className="bg-airbnb-bg rounded-lg h-[200px] flex items-center justify-center">
              <p className="text-airbnb-foggy">Map of {property.address}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-airbnb-hof">Contact Agent</h3>
            <div className="bg-airbnb-bg p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-airbnb-cement rounded-full"></div>
                <div>
                  <p className="font-semibold text-airbnb-hof">Real Estate Agent</p>
                  <p className="text-sm text-airbnb-foggy">Available for showings</p>
                </div>
              </div>
              <Button className="w-full mt-3 bg-airbnb-rausch text-white hover:bg-airbnb-rausch/90">
                Contact Agent
              </Button>
            </div>
          </div>

          {/* Notes section moved to bottom */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-airbnb-hof">Notes</h3>
            <div className="bg-airbnb-babu/10 rounded-lg p-4 mb-4">
              <Textarea
                placeholder="Add your comment here"
                className="min-h-[120px] border-none bg-transparent focus-visible:ring-0 text-airbnb-hof"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button className="bg-airbnb-babu hover:bg-airbnb-babu/90 text-white" onClick={addNote}>
                Add Note
              </Button>
            </div>
          </div>

          {notes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-airbnb-hof">Your Notes</h4>
              {notes.map((noteText, index) => (
                <div key={index} className="bg-airbnb-bg p-3 rounded-md">
                  <p className="text-sm text-airbnb-hof">{noteText}</p>
                  <p className="text-xs text-airbnb-foggy mt-1">Just now</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
