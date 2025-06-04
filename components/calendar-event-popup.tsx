"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { X, Trash2, MapPin, ChevronLeft, ChevronRight, Share2, Eye, Lock, Calendar, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { MapView } from "@/components/map-view"

interface CalendarEventPopupProps {
  event: any
  onClose: () => void
  onDelete: (id: string) => void
  onShare?: () => void
  onConfigureNotifications?: () => void
}

export function CalendarEventPopup({
  event,
  onClose,
  onDelete,
  onShare,
  onConfigureNotifications,
}: CalendarEventPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mapZoomLevel, setMapZoomLevel] = useState(1)
  const popupRef = useRef<HTMLDivElement>(null)
  const [shareExpanded, setShareExpanded] = useState(false)
  const [shareOptions, setShareOptions] = useState({
    includePhotos: true,
    includeLocation: true,
    includeAttendees: false,
    includeNotes: false,
  })

  // Sample property images - in a real app, these would come from props
  const propertyImages = [
    "/placeholder.svg?height=400&width=600&text=Living+Room",
    "/placeholder.svg?height=400&width=600&text=Kitchen",
    "/placeholder.svg?height=400&width=600&text=Bedroom",
    "/placeholder.svg?height=400&width=600&text=Bathroom",
    "/placeholder.svg?height=400&width=600&text=Exterior",
  ]

  // Time blocks breakdown with brand color gradients
  const timeBlocks = [
    {
      name: "Travel",
      duration: "15 mins",
      timeFrame: "9:00 AM - 9:15 AM",
      gradient: "bg-gradient-to-r from-[#FFA500] to-[#FFB733]",
      percentage: 25,
      description: "Time to travel to the property location",
    },
    {
      name: "Showing",
      duration: "30 mins",
      timeFrame: "9:15 AM - 9:45 AM",
      gradient: "bg-gradient-to-r from-[#000000] to-[#333333]",
      percentage: 50,
      description: "Guided tour of the property with agent",
    },
    {
      name: "Evaluation",
      duration: "15 mins",
      timeFrame: "9:45 AM - 10:00 AM",
      gradient: "bg-gradient-to-r from-[#FFFFFF] to-[#F0F0F0]",
      percentage: 25,
      textColor: "text-[#000000]", // Dark text for light background
      description: "Time to discuss and evaluate the property",
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % propertyImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1))
  }

  const zoomIn = () => {
    setMapZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const zoomOut = () => {
    setMapZoomLevel((prev) => Math.max(prev - 0.2, 0.8))
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this showing?")) {
      onDelete(event.id)
    }
  }

  const handleCopyLink = () => {
    const shareableLink = `https://rental-app.com/showings/${event.id}`
    navigator.clipboard.writeText(shareableLink)
    alert("Link copied to clipboard!")
    if (onShare) {
      onShare()
    }
  }

  const toggleShareOption = (option: keyof typeof shareOptions) => {
    setShareOptions({
      ...shareOptions,
      [option]: !shareOptions[option],
    })
  }

  const handleViewMap = () => {
    alert("Opening map in a new tab...")
  }

  const handleConfigureNotifications = () => {
    if (onConfigureNotifications) {
      onConfigureNotifications()
    }
  }

  // Create a property object for the MapView component
  const propertyForMap = {
    id: event.id || "event-property",
    address: event.property?.address || "101 Park Avenue #303",
    price: event.property?.price || "$2,500/mo",
    beds: event.property?.beds || 2,
    baths: event.property?.baths || 1,
    image: event.property?.image || "/placeholder.svg?height=400&width=600",
    location: event.property?.location || "New York",
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
        ref={popupRef}
      >
        {/* Header with title and action icons */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#000000]">
            {event.property?.address || "101 Park Avenue #303"} Appointment
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-[#000000] hover:text-red-500 transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#000000] hover:text-[#FFA500] transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Property Card with Image Gallery */}
          <div className="m-4 rounded-lg overflow-hidden shadow-lg bg-white">
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image
                src={
                  propertyImages[currentImageIndex] || event.property?.image || "/placeholder.svg?height=400&width=600"
                }
                alt={event.property?.name || "Property"}
                fill
                className="object-cover"
              />
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md hover:bg-[#FFA500] hover:text-white transition-colors"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md hover:bg-[#FFA500] hover:text-white transition-colors"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                {currentImageIndex + 1} / {propertyImages.length}
              </div>
            </div>

            {/* Property details */}
            <div className="p-4 bg-gray-50">
              <h3 className="font-semibold text-[#000000] text-lg">
                {event.property?.address || "101 Park Avenue #303"}
              </h3>
              <p className="text-gray-500">{format(parseISO(event.date), "EEEE, MMMM d, yyyy")}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-[#000000] hover:bg-[#FFA500]/10 hover:text-[#FFA500] hover:border-[#FFA500]"
            >
              Reschedule
            </Button>
            <Button variant="outline" className="flex-1 border-red-300 text-red-500 hover:bg-red-50">
              Cancel
            </Button>
          </div>

          {/* Notification settings button */}
          <div className="px-4 mt-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500]/10"
              onClick={handleConfigureNotifications}
            >
              <Bell className="h-4 w-4" />
              Configure Notifications
            </Button>
          </div>

          {/* Time blocks breakdown with visual timeline using gradients */}
          <div className="p-4 mt-4">
            <h4 className="font-medium text-[#000000] mb-3">Time Allocation:</h4>

            {/* Visual timeline with gradients */}
            <div className="mb-4">
              <div className="relative flex h-16 rounded-lg overflow-hidden shadow-md">
                {timeBlocks.map((block, index) => (
                  <div
                    key={index}
                    className={`${block.gradient} relative group cursor-pointer transition-all duration-300 ease-in-out hover:scale-y-105`}
                    style={{ width: `${block.percentage}%` }}
                    aria-label={`${block.name}: ${block.duration}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={`${block.textColor || "text-white"} text-sm font-medium drop-shadow-md`}>
                        {block.name}
                      </span>
                      <span className={`${block.textColor || "text-white"} text-xs font-medium opacity-80`}>
                        {block.duration}
                      </span>
                    </div>

                    {/* Enhanced tooltip with animation */}
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 
                      bg-[#2D3748] px-4 py-3 rounded-md shadow-lg text-white opacity-0 
                      group-hover:opacity-100 transition-all duration-300 ease-in-out
                      pointer-events-none z-10 w-56 scale-95 group-hover:scale-100 origin-top"
                      role="tooltip"
                      aria-hidden="true"
                    >
                      <div className="text-center font-bold text-base mb-1">{block.name}</div>
                      <div className="text-center text-lg font-bold text-[#FFA500]">{block.timeFrame}</div>
                      <div className="text-center text-sm mt-1">{block.duration}</div>
                      <div className="text-center text-xs mt-2 text-gray-300">{block.description}</div>
                      <div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          rotate-45 w-3 h-3 bg-[#2D3748]"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Start and end time with improved styling */}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-[#000000]">Start</span>
                  <span>9:00 AM</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-[#000000]">End</span>
                  <span>10:00 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Minimap */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="font-medium text-[#000000] mb-3">Location:</h4>
            <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200">
              {/* Replace the static map with MapView component */}
              <MapView isOpen={true} onClose={() => {}} properties={[propertyForMap]} isMiniMap={true} />
            </div>

            {/* Address details below map */}
            <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-[#FFA500] mt-0.5 mr-1 flex-shrink-0" />
                <div>
                  <p className="text-[#000000]">{event.property?.address || "101 Park Avenue #303"}</p>
                  <p className="text-gray-500 text-xs">40.7505° N, 73.9764° W</p>
                </div>
              </div>
              <div className="mt-1 flex gap-2">
                <a
                  href="#"
                  className="text-xs text-[#FFA500] hover:underline flex items-center"
                  onClick={(e) => {
                    e.preventDefault()
                    alert("Opening directions in Maps app")
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                  Get Directions
                </a>
                <a
                  href="#"
                  className="text-xs text-[#FFA500] hover:underline flex items-center"
                  onClick={(e) => {
                    e.preventDefault()
                    alert("Copying address to clipboard")
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                  Copy Address
                </a>
              </div>
              <button
                onClick={handleViewMap}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#FFA500] border border-[#FFA500] rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
              >
                <MapPin className="h-4 w-4" />
                View Map
              </button>
            </div>
          </div>

          {/* Attendees */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="font-medium text-[#000000] mb-3">Attendees:</h4>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg shadow-sm">
              {event.members && event.members.length > 0 ? (
                event.members.map((name: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg transition-colors shadow-sm"
                  >
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={name} />
                      <AvatarFallback>{name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-[#000000] font-medium">{name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-gray-400 hover:text-[#FFA500] transition-colors"
                        title="Send email"
                        onClick={() => alert(`Sending email to ${name}`)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                      </button>
                      <button
                        className="text-gray-400 hover:text-[#FFA500] transition-colors"
                        title="Call"
                        onClick={() => alert(`Calling ${name}`)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic p-3 bg-white rounded-lg">No attendees added yet</p>
              )}
            </div>
          </div>

          {/* Agent */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="font-medium text-[#000000] mb-3">Agent:</h4>
            <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
              {event.agent ? (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg transition-colors shadow-sm">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={event.agent} />
                    <AvatarFallback>{event.agent?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-[#000000] font-medium">{event.agent}</p>
                    <p className="text-xs text-gray-500">Your showing agent</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-gray-400 hover:text-[#FFA500] transition-colors"
                      title="Send email"
                      onClick={() => alert(`Sending email to ${event.agent}`)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </button>
                    <button
                      className="text-gray-400 hover:text-[#FFA500] transition-colors"
                      title="Call"
                      onClick={() => alert(`Calling ${event.agent}`)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                  <p className="text-gray-500">Agent details not provided</p>
                  <button className="mt-2 text-sm text-[#FFA500] hover:underline">Request an agent</button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Share Link Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header with expand/collapse functionality */}
              <div
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                onClick={() => setShareExpanded(!shareExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-[#FFA500]" />
                  <h4 className="font-medium text-[#000000]">Share Showing Details</h4>
                </div>
                <button className="text-gray-400">
                  <ChevronRight
                    className={`h-5 w-5 transition-transform duration-300 ${shareExpanded ? "rotate-90" : ""}`}
                  />
                </button>
              </div>

              {/* Shareable link */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded p-2 flex justify-between items-center group hover:bg-gray-200 transition-colors">
                    <span className="text-sm text-gray-600 truncate">https://rental-app.com/showings/{event.id}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-[#000000] hover:text-[#FFA500]"
                      onClick={handleCopyLink}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {shareExpanded && (
                <div className="p-3">
                  {/* Preview of shared page */}
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h5 className="text-sm font-medium text-[#000000] mb-2 flex items-center gap-1">
                      <Eye className="h-4 w-4 text-[#FFA500]" />
                      <span>Preview of shared page</span>
                    </h5>
                    <div className="bg-white rounded border border-gray-200 p-2 text-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-md flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">{event.property?.address || "101 Park Avenue #303"}</p>
                          <p className="text-gray-500">{format(parseISO(event.date), "EEEE, MMMM d, yyyy")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-3 w-3 text-[#FFA500]" />
                        <span>9:00 AM - 10:00 AM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-[#FFA500]" />
                        <span>{event.property?.address || "101 Park Avenue #303"}</span>
                      </div>
                      {shareOptions.includePhotos && (
                        <div className="mt-2 flex gap-1">
                          <div className="w-10 h-10 bg-gray-200 rounded"></div>
                          <div className="w-10 h-10 bg-gray-200 rounded"></div>
                          <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        </div>
                      )}
                      {shareOptions.includeAttendees && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-gray-500">Attendees:</span>
                          <span>{event.members?.join(", ") || "None"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Share options */}
                  <div>
                    <h5 className="text-sm font-medium text-[#000000] mb-2 flex items-center gap-1">
                      <Lock className="h-4 w-4 text-[#FFA500]" />
                      <span>Information to include</span>
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Property Photos</label>
                        <Switch
                          checked={shareOptions.includePhotos}
                          onCheckedChange={() => toggleShareOption("includePhotos")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Location Details</label>
                        <Switch
                          checked={shareOptions.includeLocation}
                          onCheckedChange={() => toggleShareOption("includeLocation")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Attendee Information</label>
                        <Switch
                          checked={shareOptions.includeAttendees}
                          onCheckedChange={() => toggleShareOption("includeAttendees")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Notes & Comments</label>
                        <Switch
                          checked={shareOptions.includeNotes}
                          onCheckedChange={() => toggleShareOption("includeNotes")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Share buttons */}
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1 bg-[#FFA500] text-white hover:bg-[#FFA500]/90" onClick={handleCopyLink}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300"
                      onClick={() => window.open(`https://rental-app.com/showings/${event.id}`, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
