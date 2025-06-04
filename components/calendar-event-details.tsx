// NOTE: This component is no longer used in the calendar view.
// The calendar now uses an inline popup that matches the design in attachment 1.
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, MapPin, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Phone, Mail, Navigation, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CalendarEventDetailsProps {
  title: string
  address: string
  date: string
  timeBlocks: string[]
  attendees: { id: string; name: string; image: string; role?: string; email?: string; phone?: string }[]
  agent?: { id: string; name: string; image: string; email?: string; phone?: string }
  onClose: () => void
  locationDetails?: {
    neighborhood?: string
    distance?: string
    transit?: string
  }
}

// Update the time block segment interface
interface TimeBlockSegment {
  name: string
  duration: string
  color: string
  gradient: string
  description: string
}

// Sample property images - in a real app, these would come from props or an API
const propertyImages = [
  "/placeholder.svg?height=400&width=600&text=Living+Room",
  "/placeholder.svg?height=400&width=600&text=Kitchen",
  "/placeholder.svg?height=400&width=600&text=Bedroom",
  "/placeholder.svg?height=400&width=600&text=Bathroom",
  "/placeholder.svg?height=400&width=600&text=Exterior",
]

// Replace the existing CalendarEventDetails component with this enhanced version
export function CalendarEventDetails({
  title,
  address,
  date,
  timeBlocks,
  attendees,
  agent,
  onClose,
  locationDetails = {
    neighborhood: "Downtown",
    distance: "2.5 miles from your location",
    transit: "15 min by car, 25 min by transit",
  },
}: CalendarEventDetailsProps) {
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllAttendees, setShowAllAttendees] = useState(false)
  const [mapZoomLevel, setMapZoomLevel] = useState(1)
  const [activeTimeSegment, setActiveTimeSegment] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // For responsive design
  const [isMobile, setIsMobile] = useState(false)

  // Define time block segments with gradients
  const timeSegments: TimeBlockSegment[] = [
    {
      name: "Travel",
      duration: "15 mins",
      color: "bg-[#484848]",
      gradient: "bg-gradient-to-r from-[#484848] to-[#5a5a5a]",
      description: "Travel time to the property location",
    },
    {
      name: "Showing",
      duration: "30 mins",
      color: "bg-[#FF5A5F]",
      gradient: "bg-gradient-to-r from-[#FF5A5F] to-[#ff7e82]",
      description: "Time allocated for viewing the property",
    },
    {
      name: "Evaluation",
      duration: "15 mins",
      color: "bg-[#F7F7F7]",
      gradient: "bg-gradient-to-r from-[#F7F7F7] to-[#ffffff]",
      description: "Time to evaluate and discuss the property",
    },
  ]

  // Cleanup function to ensure proper unmounting
  useEffect(() => {
    return () => {
      // Cleanup code to ensure proper unmounting
      document.body.classList.remove("popup-open")
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Add class to body to prevent multiple popups
    document.body.classList.add("popup-open")

    return () => {
      window.removeEventListener("resize", checkMobile)
      document.body.classList.remove("popup-open")
    }
  }, [])

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const handleReschedule = () => {
    setShowRescheduleDialog(true)
  }

  const confirmCancel = () => {
    // In a real app, this would call an API to cancel the showing
    alert("Showing cancelled")
    setShowCancelDialog(false)
    onClose()
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % propertyImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1))
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const zoomIn = () => {
    setMapZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const zoomOut = () => {
    setMapZoomLevel((prev) => Math.max(prev - 0.2, 0.8))
  }

  const getDirections = () => {
    // In a real app, this would open maps with directions
    window.open(`https://maps.google.com/maps?q=${encodeURIComponent(address)}`, "_blank")
  }

  const handleContactAttendee = (type: "email" | "phone", contact: string) => {
    if (type === "email") {
      window.location.href = `mailto:${contact}`
    } else {
      window.location.href = `tel:${contact}`
    }
  }

  // Display limited attendees on mobile, or when not showing all
  const displayedAttendees = showAllAttendees ? attendees : isMobile ? attendees.slice(0, 3) : attendees.slice(0, 5)
  const hasMoreAttendees = attendees.length > displayedAttendees.length

  return (
    <div className="flex flex-col h-full max-h-[90vh] bg-white rounded-t-xl shadow-lg" ref={popupRef}>
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-4 border-b border-airbnb-cement sticky top-0 bg-white z-10 rounded-t-xl">
        <h2 className="text-lg font-semibold text-airbnb-hof">{title} Showing</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 text-airbnb-hof hover:text-[#FF5A5F] transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {/* Property Image Gallery */}
        <div className="rounded-lg overflow-hidden shadow-sm">
          <div className="relative aspect-[4/3] bg-airbnb-cement">
            <Image
              src={propertyImages[currentImageIndex] || "/placeholder.svg"}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />

            {/* Navigation arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-[#FF5A5F] hover:text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-airbnb-hof" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-[#FF5A5F] hover:text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-airbnb-hof" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              {currentImageIndex + 1} / {propertyImages.length}
            </div>
          </div>

          {/* Thumbnail pagination */}
          <div className="flex justify-center mt-2 gap-1 py-2">
            {propertyImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-[#FF5A5F]" : "bg-airbnb-cement"
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentImageIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-airbnb-hof text-lg">{title}</h3>
          <p className="text-airbnb-foggy">{address}</p>
          <p className="text-airbnb-foggy mt-1">{date}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-airbnb-cement text-airbnb-hof hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F] hover:border-[#FF5A5F] transition-colors"
            onClick={handleReschedule}
          >
            Reschedule
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-red-300 text-red-500 hover:bg-red-50 transition-colors"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>

        {/* Time Blocks with Enhanced Visualization */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-3 text-airbnb-hof">Time Blocks:</h4>
          {timeBlocks.map((block, index) => (
            <div key={index} className="mb-4 border border-airbnb-cement rounded-lg overflow-hidden">
              <div className="bg-airbnb-bg p-3 border-b border-airbnb-cement">
                <p className="font-medium text-airbnb-hof">{block}</p>
              </div>
              <div className="p-3">
                <TooltipProvider>
                  <div className="flex items-center mb-2 relative h-8">
                    {timeSegments.map((segment, segIndex) => (
                      <Tooltip key={segIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-full ${segIndex === 0 ? "rounded-l-full" : ""} ${
                              segIndex === timeSegments.length - 1 ? "rounded-r-full" : ""
                            } ${segment.gradient} relative flex-1 cursor-pointer transition-all duration-200 ${
                              activeTimeSegment === segment.name ? "scale-y-110" : ""
                            }`}
                            onMouseEnter={() => setActiveTimeSegment(segment.name)}
                            onMouseLeave={() => setActiveTimeSegment(null)}
                            role="button"
                            tabIndex={0}
                            onFocus={() => setActiveTimeSegment(segment.name)}
                            onBlur={() => setActiveTimeSegment(null)}
                          >
                            {/* Dynamic label directly on the time block */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className={`text-xs font-medium drop-shadow-md ${segment.name === "Evaluation" ? "text-[#484848]" : "text-white"}`}
                              >
                                {segment.name}
                              </span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={8}
                          className="p-4 w-40 rounded-xl shadow-lg border border-gray-200 bg-white z-50"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-lg font-bold">{segment.duration}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{segment.name}</div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>

                {/* Time labels below the segments */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-airbnb-foggy">9:00 AM</span>
                  <span className="text-xs text-airbnb-foggy">10:00 AM</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Map Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-3 text-airbnb-hof">Location:</h4>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Map with zoom controls */}
            <div className="relative rounded-lg overflow-hidden border border-airbnb-cement h-40 md:w-2/3 flex-shrink-0">
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ transform: `scale(${mapZoomLevel})`, transformOrigin: "center" }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Kv5f52tvzwCGojfSR1wLi9hFCIm1y5.png"
                  alt="Property location"
                  fill
                  className="object-cover transition-transform duration-300"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="h-8 w-8 text-[#FF5A5F] drop-shadow-lg" />
                </div>
              </div>

              {/* Zoom controls */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <button
                  onClick={zoomIn}
                  className="bg-white rounded-full p-1 shadow-md hover:bg-[#FF5A5F] hover:text-white transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={zoomOut}
                  className="bg-white rounded-full p-1 shadow-md hover:bg-[#FF5A5F] hover:text-white transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>

              {/* Get directions button */}
              <button
                onClick={getDirections}
                className="absolute bottom-2 left-2 bg-white text-airbnb-hof px-2 py-1 rounded-md text-xs font-medium shadow-md flex items-center gap-1 hover:bg-[#FF5A5F] hover:text-white transition-colors"
              >
                <Navigation className="h-3 w-3" />
                Directions
              </button>
            </div>

            {/* Location summary */}
            <div className="md:w-1/3 text-sm">
              <p className="text-airbnb-hof font-medium">{locationDetails.neighborhood}</p>
              <p className="text-airbnb-foggy mt-1">{locationDetails.distance}</p>
              <p className="text-airbnb-foggy">{locationDetails.transit}</p>
              <button
                onClick={getDirections}
                className="mt-2 text-[#FF5A5F] text-sm font-medium hover:underline md:hidden flex items-center gap-1"
              >
                <Navigation className="h-3 w-3" />
                Get directions
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Attendees Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-3 text-airbnb-hof">Attendees:</h4>
          <div className="space-y-3">
            {displayedAttendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-airbnb-cement">
                  <AvatarImage src={attendee.image || "/placeholder.svg"} alt={attendee.name} />
                  <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-airbnb-hof font-medium">{attendee.name}</p>
                  {attendee.role && <p className="text-xs text-airbnb-foggy">{attendee.role}</p>}
                </div>
                <div className="flex gap-2">
                  {attendee.email && (
                    <button
                      onClick={() => handleContactAttendee("email", attendee.email || "")}
                      className="p-1 text-airbnb-foggy hover:text-[#FF5A5F] transition-colors"
                      aria-label={`Email ${attendee.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  )}
                  {attendee.phone && (
                    <button
                      onClick={() => handleContactAttendee("phone", attendee.phone || "")}
                      className="p-1 text-airbnb-foggy hover:text-[#FF5A5F] transition-colors"
                      aria-label={`Call ${attendee.name}`}
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {hasMoreAttendees && (
              <button
                onClick={() => setShowAllAttendees(!showAllAttendees)}
                className="text-[#FF5A5F] text-sm font-medium hover:underline mt-2"
              >
                {showAllAttendees ? "Show less" : `Show ${attendees.length - displayedAttendees.length} more attendees`}
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Agent Section */}
        {agent && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-3 text-airbnb-hof">Agent:</h4>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-airbnb-cement">
                <AvatarImage src={agent.image || "/placeholder.svg"} alt={agent.name} />
                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-airbnb-hof font-medium">{agent.name}</p>
                <p className="text-xs text-airbnb-foggy">Your showing agent</p>
              </div>
              <div className="flex gap-2">
                {agent.email && (
                  <button
                    onClick={() => handleContactAttendee("email", agent.email || "")}
                    className="p-1 text-airbnb-foggy hover:text-[#FF5A5F] transition-colors"
                    aria-label={`Email ${agent.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                )}
                {agent.phone && (
                  <button
                    onClick={() => handleContactAttendee("phone", agent.phone || "")}
                    className="p-1 text-airbnb-foggy hover:text-[#FF5A5F] transition-colors"
                    aria-label={`Call ${agent.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-airbnb-hof">Cancel Showing</h3>
            <p className="mb-6 text-airbnb-foggy">
              Are you sure you want to cancel this showing? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-airbnb-cement text-airbnb-hof hover:bg-[#FF5A5F]/10 hover:text-[#FF5A5F] hover:border-[#FF5A5F]"
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Showing
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={confirmCancel}>
                Yes, Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-airbnb-hof">Reschedule Showing</h3>
            <p className="mb-6 text-airbnb-foggy">This would open a calendar to select a new date and time.</p>
            <Button
              className="w-full bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white"
              onClick={() => setShowRescheduleDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
