"use client"

import { useState, useEffect } from "react"
import { Calendar, X, Upload, Star } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchedulingCalendar } from "@/components/scheduling-calendar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MapView } from "@/components/map-view"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ToastNotification } from "@/components/toast-notification"

// Mock data for the application
const mockData = {
  currentUser: {
    id: "user1",
    firstName: "John",
    lastName: "Doe",
    profilePic: "/placeholder.svg?height=40&width=40",
    userSat: {
      activeGroup: "group1",
    },
  },
  groups: [
    {
      id: "group1",
      name: "Blue Team",
      members: [
        {
          id: "member1",
          connectedUser: "user1",
          showingStatus: "confirmed",
          lastNudge: null,
          schedule: ["2025-04-20T09:00:00", "2025-04-21T14:00:00"],
        },
        {
          id: "member2",
          connectedUser: "user2",
          showingStatus: "pending",
          lastNudge: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          schedule: [],
        },
        {
          id: "member3",
          connectedUser: "user3",
          showingStatus: "confirmed",
          lastNudge: null,
          schedule: ["2025-04-20T09:00:00", "2025-04-22T16:00:00"],
        },
      ],
      cart: [
        { id: "prop1", name: "123 Main St Apartment" },
        { id: "prop2", name: "456 Park Ave Condo" },
      ],
    },
  ],
  users: [
    {
      id: "user1",
      firstName: "John",
      lastName: "Doe",
      profilePic: "/placeholder.svg?height=40&width=40",
      email: "john@example.com",
      phone: "555-123-4567",
    },
    {
      id: "user2",
      firstName: "Jane",
      lastName: "Smith",
      profilePic: "/placeholder.svg?height=40&width=40",
      email: "jane@example.com",
      phone: "555-987-6543",
    },
    {
      id: "user3",
      firstName: "Mike",
      lastName: "Johnson",
      profilePic: "/placeholder.svg?height=40&width=40",
      email: "mike@example.com",
      phone: "555-456-7890",
    },
    {
      id: "agent1",
      firstName: "Robert",
      lastName: "Agent",
      profilePic: "/placeholder.svg?height=40&width=40",
      email: "robert@example.com",
      phone: "555-111-2222",
      isAgent: true,
    },
    {
      id: "agent2",
      firstName: "Lisa",
      lastName: "Agent",
      profilePic: "/placeholder.svg?height=40&width=40",
      email: "lisa@example.com",
      phone: "555-333-4444",
      isAgent: true,
    },
  ],
  properties: [
    {
      id: "prop1",
      name: "123 Main St Apartment",
      address: "123 Main St, New York, NY 10001",
      price: "$2,500/mo",
      beds: 2,
      baths: 1,
      sqft: 850,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
      ],
      location: "New York",
    },
    {
      id: "prop2",
      name: "456 Park Ave Condo",
      address: "456 Park Ave, New York, NY 10022",
      price: "$3,200/mo",
      beds: 1,
      baths: 1,
      sqft: 700,
      image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
      ],
      location: "New York",
    },
    {
      id: "prop3",
      name: "789 Broadway Loft",
      address: "789 Broadway, New York, NY 10003",
      price: "$3,800/mo",
      beds: 2,
      baths: 2,
      sqft: 950,
      image: "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
      ],
      location: "New York",
    },
    {
      id: "prop4",
      name: "321 5th Ave Penthouse",
      address: "321 5th Ave, New York, NY 10016",
      price: "$4,200/mo",
      beds: 3,
      baths: 2,
      sqft: 1200,
      image: "https://images.unsplash.com/photo-1560449752-3fd74f5f4d56?q=80&w=2071&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1560449752-3fd74f5f4d56?q=80&w=2071&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
      ],
      location: "New York",
    },
    {
      id: "prop5",
      name: "555 W 42nd St Studio",
      address: "555 W 42nd St, New York, NY 10036",
      price: "$3,500/mo",
      beds: 1,
      baths: 1,
      sqft: 800,
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
      ],
      location: "New York",
    },
    {
      id: "prop6",
      name: "888 1st Ave Apartment",
      address: "888 1st Ave, New York, NY 10022",
      price: "$2,800/mo",
      beds: 1,
      baths: 1,
      sqft: 750,
      image: "https://images.unsplash.com/photo-1560185008-a8a0c5d1562c?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1560185008-a8a0c5d1562c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
      ],
      location: "New York",
    },
  ],
  showings: [
    {
      id: "showing1",
      status: "pending",
      linkedProperty: "prop1",
      group: "group1",
      scheduledDate: "2025-04-15",
      time: "10:00 AM - 11:00 AM",
      rescheduleRequests: [],
      requestType: null,
      assignedAgent: null,
      suggestedTimes: [
        { id: "time1", date: "2025-04-20", time: "9:00 AM - 10:00 AM" },
        { id: "time2", date: "2025-04-20", time: "2:00 PM - 3:00 PM" },
        { id: "time3", date: "2025-04-21", time: "11:00 AM - 12:00 PM" },
        { id: "time4", date: "2025-04-22", time: "4:00 PM - 5:00 PM" },
      ],
      files: [],
    },
    {
      id: "showing2",
      status: "pending",
      linkedProperty: "prop2",
      group: "group1",
      scheduledDate: "2025-04-16",
      time: "2:00 PM - 3:00 PM",
      rescheduleRequests: [],
      requestType: null,
      assignedAgent: null,
      suggestedTimes: [
        { id: "time5", date: "2025-04-21", time: "10:00 AM - 11:00 AM" },
        { id: "time6", date: "2025-04-21", time: "3:00 PM - 4:00 PM" },
        { id: "time7", date: "2025-04-22", time: "1:00 PM - 2:00 PM" },
      ],
      files: [],
    },
    {
      id: "showing3",
      status: "confirmed",
      linkedProperty: "prop3",
      group: "group1",
      scheduledDate: "2025-04-18",
      time: "11:00 AM - 12:00 PM",
      rescheduleRequests: [],
      requestType: null,
      assignedAgent: "agent1",
      suggestedTimes: [],
      files: [],
    },
    {
      id: "showing4",
      status: "not_booked",
      linkedProperty: "prop4",
      group: "group1",
      scheduledDate: null,
      time: null,
      rescheduleRequests: [],
      requestType: null,
      assignedAgent: null,
      suggestedTimes: [
        { id: "time8", date: "2025-04-20", time: "9:00 AM - 10:00 AM" },
        { id: "time9", date: "2025-04-20", time: "2:00 PM - 3:00 PM" },
        { id: "time10", date: "2025-04-21", time: "11:00 AM - 12:00 PM" },
        { id: "time11", date: "2025-04-22", time: "4:00 PM - 5:00 PM" },
      ],
      files: [],
    },
    {
      id: "showing5",
      status: "cancelled",
      linkedProperty: "prop5",
      group: "group1",
      scheduledDate: "2025-04-10",
      time: "1:00 PM - 2:00 PM",
      rescheduleRequests: [],
      requestType: null,
      assignedAgent: null,
      cancelReason: "Agent unavailable",
      suggestedTimes: [],
      files: [],
    },
    {
      id: "showing6",
      status: "done",
      linkedProperty: "prop6",
      group: "group1",
      scheduledDate: "2025-04-05",
      time: "10:00 AM - 11:00 AM",
      rescheduleRequests: [],
      requestType: null,
      assignedAgent: "agent2",
      suggestedTimes: [],
      files: [
        { id: "file1", name: "Living Room.jpg", url: "/placeholder.svg?height=200&width=300&text=Living+Room" },
        { id: "file2", name: "Kitchen.jpg", url: "/placeholder.svg?height=200&width=300&text=Kitchen" },
      ],
    },
  ],
  reviews: [
    {
      id: "review1",
      showing: "showing6",
      groupMember: "member1",
      agent: "agent2",
      rate: 4,
      comment: "Great property, very spacious",
      createdDate: "2025-04-05",
    },
  ],
}

// Helper functions to work with the mock data
const getPropertyById = (id) => mockData.properties.find((prop) => prop.id === id)
const getUserById = (id) => mockData.users.find((user) => user.id === id)
const getGroupById = (id) => mockData.groups.find((group) => group.id === id)
const getShowingsByStatus = (status) => mockData.showings.filter((showing) => showing.status === status)
const getShowingsByGroup = (groupId) => mockData.showings.filter((showing) => showing.group === groupId)
const getActiveGroup = () => {
  const activeGroupId = mockData.currentUser.userSat.activeGroup
  return getGroupById(activeGroupId)
}
const getGroupMembers = (groupId) => {
  const group = getGroupById(groupId)
  return group ? group.members : []
}
const getConnectedUser = (memberId) => {
  const group = getActiveGroup()
  const member = group.members.find((m) => m.id === memberId)
  return member ? getUserById(member.connectedUser) : null
}
const getShowingProperty = (showing) => {
  return getPropertyById(showing.linkedProperty)
}
const getShowingAgent = (showing) => {
  return showing.assignedAgent ? getUserById(showing.assignedAgent) : null
}
const getReviewsByShowing = (showingId) => {
  return mockData.reviews.filter((review) => review.showing === showingId)
}

// Group showings by date for the confirmed tab
const groupShowingsByDate = (showings) => {
  const grouped = {}
  showings.forEach((showing) => {
    if (showing.scheduledDate) {
      if (!grouped[showing.scheduledDate]) {
        grouped[showing.scheduledDate] = []
      }
      grouped[showing.scheduledDate].push(showing)
    }
  })
  return grouped
}

export default function ShowingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState(tabParam || "upcoming")
  const [showAvailability, setShowAvailability] = useState(false)
  const [mapView, setMapView] = useState("map")
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "",
    id: "",
    title: "",
    description: "",
  })
  const [feedbackDialog, setFeedbackDialog] = useState({
    isOpen: false,
    showingId: "",
    agentId: "",
    rating: 0,
    comment: "",
  })
  const [rescheduleDialog, setRescheduleDialog] = useState({
    isOpen: false,
    showingId: "",
  })
  const [cancelDialog, setCancelDialog] = useState({
    isOpen: false,
    showingId: "",
  })
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    variant: "success" as "success" | "error" | "info",
  })

  // Get active group and related data
  const activeGroup = getActiveGroup()
  const pendingShowings = getShowingsByStatus("pending").filter((s) => s.group === activeGroup.id)
  const confirmedShowings = getShowingsByStatus("confirmed").filter((s) => s.group === activeGroup.id)
  const notBookedShowings = getShowingsByStatus("not_booked").filter((s) => s.group === activeGroup.id)
  const cancelledShowings = getShowingsByStatus("cancelled").filter((s) => s.group === activeGroup.id)
  const doneShowings = getShowingsByStatus("done").filter((s) => s.group === activeGroup.id)
  const groupedConfirmedShowings = groupShowingsByDate(confirmedShowings)

  // Stats for overview
  const confirmedCount = confirmedShowings.length
  const pendingCount = pendingShowings.length
  const notBookedCount = notBookedShowings.length
  const cartCount = activeGroup.cart.length

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    if (selectedTimeSlots.includes(slotId)) {
      setSelectedTimeSlots(selectedTimeSlots.filter((id) => id !== slotId))
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slotId])
    }
  }

  // Handle nudge button click
  const handleNudge = (memberId: string) => {
    // Find the member
    const member = activeGroup.members.find((m) => m.id === memberId)
    const user = getConnectedUser(memberId)

    setConfirmDialog({
      isOpen: true,
      type: "nudge",
      id: memberId,
      title: "Send Reminder",
      description: `Are you sure you want to send a reminder to ${user?.firstName} ${user?.lastName}?`,
    })
  }

  // Handle reschedule button click
  const handleReschedule = (showingId: string) => {
    setRescheduleDialog({
      isOpen: true,
      showingId,
    })
  }

  // Handle cancel button click
  const handleCancel = (showingId: string) => {
    setCancelDialog({
      isOpen: true,
      showingId,
    })
  }

  // Handle confirm time slots
  const handleConfirmTimeSlots = (propertyId: string) => {
    if (selectedTimeSlots.length === 0) {
      setToast({
        isVisible: true,
        message: "Please select at least one time slot",
        variant: "error",
      })
      return
    }

    setConfirmDialog({
      isOpen: true,
      type: "confirm",
      id: propertyId,
      title: "Confirm Time Slots",
      description: `Are you sure you want to confirm the selected time slots for this property?`,
    })
  }

  // Handle confirm dialog action
  const handleConfirmAction = () => {
    const { type, id } = confirmDialog

    switch (type) {
      case "nudge":
        setToast({
          isVisible: true,
          message: `Reminder sent successfully`,
          variant: "success",
        })
        // In a real app, this would update the lastNudge timestamp and send notifications
        break
      case "confirm":
        setToast({
          isVisible: true,
          message: `Time slots confirmed successfully`,
          variant: "success",
        })
        // In a real app, this would update the member's schedule
        break
    }

    setConfirmDialog({ ...confirmDialog, isOpen: false })
  }

  // Handle feedback submission
  const handleSubmitFeedback = () => {
    const { showingId, agentId, rating, comment } = feedbackDialog

    // In a real app, this would create a new review in the database
    setToast({
      isVisible: true,
      message: `Feedback submitted successfully`,
      variant: "success",
    })

    setFeedbackDialog({
      isOpen: false,
      showingId: "",
      agentId: "",
      rating: 0,
      comment: "",
    })
  }

  // Handle reschedule confirmation
  const handleConfirmReschedule = () => {
    const { showingId } = rescheduleDialog

    // In a real app, this would update the showing's rescheduleRequests and send notifications
    setToast({
      isVisible: true,
      message: `Reschedule requested successfully`,
      variant: "success",
    })

    setRescheduleDialog({
      isOpen: false,
      showingId: "",
    })
  }

  // Handle cancel confirmation
  const handleConfirmCancel = () => {
    const { showingId } = cancelDialog

    // In a real app, this would update the showing's status to cancelled and send notifications
    setToast({
      isVisible: true,
      message: `Cancellation requested successfully`,
      variant: "success",
    })

    setCancelDialog({
      isOpen: false,
      showingId: "",
    })
  }

  // Get property data for map
  const mapProperties = [
    ...pendingShowings.map((showing) => {
      const property = getShowingProperty(showing)
      return {
        id: showing.id,
        address: property.address,
        price: property.price,
        beds: property.beds,
        baths: property.baths,
        image: property.image,
        location: property.location,
        status: "pending",
      }
    }),
    ...confirmedShowings.map((showing) => {
      const property = getShowingProperty(showing)
      return {
        id: showing.id,
        address: property.address,
        price: property.price,
        beds: property.beds,
        baths: property.baths,
        image: property.image,
        location: property.location,
        status: "confirmed",
      }
    }),
    ...notBookedShowings.map((showing) => {
      const property = getShowingProperty(showing)
      return {
        id: showing.id,
        address: property.address,
        price: property.price,
        beds: property.beds,
        baths: property.baths,
        image: property.image,
        location: property.location,
        status: "not_booked",
      }
    }),
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
        {/* Toast Notification */}
        <ToastNotification
          message={toast.message}
          isVisible={toast.isVisible}
          variant={toast.variant}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />

        {/* Main Content Area */}
        <div className="px-4 md:px-8 lg:px-10 py-6 pb-20">
          {/* Top section with just the availability button */}
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setShowAvailability(!showAvailability)}
              className="bg-black text-white border border-black hover:bg-black/90 px-5 py-2.5 text-sm shadow-sm transition-all duration-200 hover:shadow-md rounded-md"
              aria-label={showAvailability ? "Hide your schedule" : "Update your availability"}
            >
              {showAvailability ? "Hide Schedule" : "Update Your Availability"}
              <Calendar className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Scheduling Calendar (conditionally rendered) */}
          {showAvailability && (
            <div className="mb-6">
              <SchedulingCalendar onClose={() => setShowAvailability(false)} />
            </div>
          )}

          {/* Tabs - Only shown when availability is hidden */}
          {!showAvailability && (
            <>
              {isMobile && (
                <div className="mb-4">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:border-gray-400 focus:outline-none"
                    aria-label="Select tab view"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="notbooked">Not Booked</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              )}

              {!isMobile && (
                <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="bg-white mb-6 overflow-x-auto flex whitespace-nowrap w-full border-b border-gray-200 p-1 gap-1">
                    <TabsTrigger
                      value="upcoming"
                      className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md px-8 py-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-md"
                      aria-label="View upcoming showings"
                    >
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md px-8 py-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-md"
                      aria-label="View pending showings"
                    >
                      Pending
                    </TabsTrigger>
                    <TabsTrigger
                      value="confirmed"
                      className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md px-8 py-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-md"
                      aria-label="View confirmed showings"
                    >
                      Confirmed
                    </TabsTrigger>
                    <TabsTrigger
                      value="notbooked"
                      className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md px-8 py-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-md"
                      aria-label="View not booked showings"
                    >
                      Not Booked
                    </TabsTrigger>
                    <TabsTrigger
                      value="cancelled"
                      className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md px-8 py-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-md"
                      aria-label="View cancelled showings"
                    >
                      Cancelled
                    </TabsTrigger>
                    <TabsTrigger
                      value="past"
                      className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md px-8 py-3 text-gray-600 transition-all duration-300 hover:bg-gray-100 rounded-md"
                      aria-label="View past showings"
                    >
                      Past
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab Content */}
                  <TabsContent value="upcoming" className="mt-0">
                    <h2 className="text-3xl font-extrabold mb-6 text-black tracking-tight">
                      Upcoming Showings Requested
                    </h2>

                    {/* Pie Chart */}
                    <div className="mb-8 border border-gray-200 rounded-lg shadow-md">
                      <div className="w-full p-6 bg-white">
                        <h3 className="text-xl font-bold mb-4 text-center text-black">Showings Distribution</h3>
                        <div className="flex flex-col md:flex-row items-center justify-center">
                          {/* Pie Chart SVG */}
                          <div className="relative w-64 h-64">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              {/* Use defs for gradients */}
                              <defs>
                                <linearGradient id="confirmedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#FFA500" />
                                  <stop offset="100%" stopColor="#FF8C00" />
                                </linearGradient>
                                <linearGradient id="pendingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#000000" />
                                  <stop offset="100%" stopColor="#333333" />
                                </linearGradient>
                                <linearGradient id="notBookedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#565656" />
                                  <stop offset="100%" stopColor="#767676" />
                                </linearGradient>
                              </defs>

                              {/* Pie slices with gradients and hover effects */}
                              {/* Confirmed slice - 33% */}
                              <path
                                d="M 50 50 L 50 0 A 50 50 0 0 1 97.55 34.55 Z"
                                fill="url(#confirmedGradient)"
                                stroke="white"
                                strokeWidth="1"
                                className="transition-all duration-200 hover:opacity-90 hover:transform hover:scale-105"
                              >
                                <title>Confirmed: {confirmedCount}</title>
                              </path>

                              {/* Pending slice - 50% */}
                              <path
                                d="M 50 50 L 97.55 34.55 A 50 50 0 0 1 27.32 95.63 Z"
                                fill="url(#pendingGradient)"
                                stroke="white"
                                strokeWidth="1"
                                className="transition-all duration-200 hover:opacity-90 hover:transform hover:scale-105"
                              >
                                <title>Pending: {pendingCount}</title>
                              </path>

                              {/* Not Booked slice - 17% */}
                              <path
                                d="M 50 50 L 27.32 95.63 A 50 50 0 0 1 50 0 Z"
                                fill="url(#notBookedGradient)"
                                stroke="white"
                                strokeWidth="1"
                                className="transition-all duration-200 hover:opacity-90 hover:transform hover:scale-105"
                              >
                                <title>Not Booked: {notBookedCount}</title>
                              </path>

                              {/* Center circle for donut effect */}
                              <circle cx="50" cy="50" r="25" fill="white" />
                            </svg>
                          </div>

                          {/* Legend */}
                          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col space-y-4">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-[#FFA500] rounded-sm mr-2"></div>
                              <span className="text-sm font-medium text-black">Confirmed: {confirmedCount}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-black rounded-sm mr-2"></div>
                              <span className="text-sm font-medium text-black">Pending: {pendingCount}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-[#767676] rounded-sm mr-2"></div>
                              <span className="text-sm font-medium text-black">Not Booked: {notBookedCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Sections - improved responsive grid */}
                    <div className="mb-8 rounded-md p-4 sm:p-6 shadow-md border border-gray-200 bg-white">
                      <h3 className="text-2xl font-bold mb-6 text-black text-center border-b pb-2 border-gray-200">
                        Showings Overview
                      </h3>
                      <div className="flex flex-col space-y-4">
                        <TooltipProvider>
                          <div className="flex justify-between items-center px-4 py-4 bg-gray-50 rounded-md border border-gray-200 hover:shadow-sm transition-all duration-200">
                            <p className="text-sm font-medium text-black">New Properties Added to Cart</p>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-2xl font-extrabold text-[#FFA500] ml-3 cursor-help">{cartCount}</p>
                              </TooltipTrigger>
                              <TooltipContent className="w-64 p-3 bg-white shadow-lg border border-gray-200 rounded-md">
                                <div className="space-y-2">
                                  {activeGroup.cart.map((item, index) => {
                                    const property = getPropertyById(item.id)
                                    return (
                                      <div
                                        key={index}
                                        className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                                      >
                                        <p className="font-medium text-sm text-black">{property.address}</p>
                                        <div className="flex justify-between text-xs text-gray-600">
                                          <span>{property.price}</span>
                                          <span>
                                            {property.beds} beds • {property.baths} baths
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>

                        <TooltipProvider>
                          <div className="flex justify-between items-center px-4 py-4 bg-gray-50 rounded-md border border-gray-200 hover:shadow-sm transition-all duration-200">
                            <p className="text-sm font-medium text-black">Confirmed Showings</p>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-2xl font-extrabold text-[#FFA500] ml-3 cursor-help">
                                  {confirmedCount}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="w-64 p-3 bg-white shadow-lg border border-gray-200 rounded-md">
                                <div className="space-y-2">
                                  {confirmedShowings.map((showing, index) => {
                                    const property = getShowingProperty(showing)
                                    return (
                                      <div
                                        key={index}
                                        className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                                      >
                                        <p className="font-medium text-sm text-black">{property.address}</p>
                                        <div className="flex justify-between text-xs text-gray-600">
                                          <span>{property.price}</span>
                                          <span>
                                            {property.beds} beds • {property.baths} baths
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>

                        <TooltipProvider>
                          <div className="flex justify-between items-center px-4 py-4 bg-gray-50 rounded-md border border-gray-200 hover:shadow-sm transition-all duration-200">
                            <p className="text-sm font-medium text-black">Showings Not Yet Scheduled</p>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-2xl font-extrabold text-[#FFA500] ml-3 cursor-help">
                                  {notBookedCount}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="w-64 p-3 bg-white shadow-lg border border-gray-200 rounded-md">
                                <div className="space-y-2">
                                  {notBookedShowings.map((showing, index) => {
                                    const property = getShowingProperty(showing)
                                    return (
                                      <div
                                        key={index}
                                        className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                                      >
                                        <p className="font-medium text-sm text-black">{property.address}</p>
                                        <div className="flex justify-between text-xs text-gray-600">
                                          <span>{property.price}</span>
                                          <span>
                                            {property.beds} beds • {property.baths} baths
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Map View */}
                    <div className="rounded-lg overflow-hidden relative h-[400px] shadow-md border border-gray-200 mb-10">
                      <MapView isOpen={true} onClose={() => {}} properties={mapProperties} isMiniMap={true} />
                    </div>
                  </TabsContent>

                  {/* Pending Tab Content */}
                  <TabsContent value="pending" className="mt-0">
                    {pendingShowings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-xl font-medium text-black">Nothing here for now!</p>
                        <p className="text-gray-500 mt-2">You don't have any pending showings at the moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Pending Showings List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {pendingShowings.map((showing) => {
                            const property = getShowingProperty(showing)
                            return (
                              <div
                                key={showing.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                              >
                                <div className="relative aspect-[4/3]">
                                  <Image
                                    src={property.image || "/placeholder.svg"}
                                    alt={property.address}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs rounded-md">
                                    Pending
                                  </div>
                                </div>
                                <div className="p-4">
                                  <h3 className="font-bold text-black truncate">{property.address}</h3>
                                  <p className="text-gray-600 text-sm">{property.price}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span>{property.beds} beds</span>
                                    <span>{property.baths} baths</span>
                                    <span>{property.sqft} sqft</span>
                                  </div>
                                  <div className="mt-4 flex justify-between items-center">
                                    <p className="text-sm text-gray-600">
                                      {showing.scheduledDate ? showing.scheduledDate : "Not scheduled"}
                                    </p>
                                    <p className="text-sm text-gray-600">{showing.time || ""}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Group Members Note Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                          <h3 className="text-lg font-bold text-black mb-4">Group Members Status</h3>
                          <p className="text-gray-600 mb-4">
                            The following group members have not provided their availability.
                          </p>
                          <div className="space-y-4">
                            {activeGroup.members
                              .filter((member) => member.showingStatus === "pending")
                              .map((member) => {
                                const user = getConnectedUser(member)
                                const canNudge =
                                  !member.lastNudge ||
                                  new Date(member.lastNudge).getTime() < Date.now() - 4 * 60 * 60 * 1000
                                return (
                                  <div
                                    key={member.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                          src={user?.profilePic || "/placeholder.svg"}
                                          alt={`${user?.firstName} ${user?.lastName}`}
                                          width={40}
                                          height={40}
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <p className="font-medium text-black">
                                          {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() => handleNudge(member.id)}
                                      disabled={!canNudge}
                                      className={`${
                                        canNudge
                                          ? "bg-[#FFA500] hover:bg-[#FFA500]/90 text-white"
                                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                      }`}
                                    >
                                      Nudge
                                    </Button>
                                  </div>
                                )
                              })}
                          </div>
                        </div>

                        {/* Map View */}
                        <div className="rounded-lg overflow-hidden relative h-[400px] shadow-md border border-gray-200 mb-10">
                          <MapView isOpen={true} onClose={() => {}} properties={mapProperties} isMiniMap={true} />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Confirmed Tab Content */}
                  <TabsContent value="confirmed" className="mt-0">
                    {confirmedShowings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-xl font-medium text-black">Nothing here for now!</p>
                        <p className="text-gray-500 mt-2">You don't have any confirmed showings at the moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Confirmed Showings List Grouped by Date */}
                        {Object.entries(groupedConfirmedShowings).map(([date, showings]) => (
                          <div key={date} className="space-y-4">
                            <h3 className="text-xl font-bold text-black">{date}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {showings.map((showing) => {
                                const property = getShowingProperty(showing)
                                const agent = getShowingAgent(showing)
                                return (
                                  <div
                                    key={showing.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                                  >
                                    <div className="relative aspect-[4/3]">
                                      <Image
                                        src={property.image || "/placeholder.svg"}
                                        alt={property.address}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-[#FFA500] text-white px-2 py-1 text-xs rounded-md">
                                        Confirmed
                                      </div>
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
                                        <p className="text-sm text-gray-600">
                                          <span className="font-medium">Time:</span> {showing.time}
                                        </p>
                                        {agent && (
                                          <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium">Agent:</span> {agent.firstName}{" "}
                                            {agent.lastName}
                                          </p>
                                        )}
                                      </div>
                                      <div className="mt-4 flex gap-2">
                                        <Button
                                          onClick={() => handleReschedule(showing.id)}
                                          className="flex-1 bg-white text-black border border-black hover:bg-gray-100"
                                        >
                                          Reschedule
                                        </Button>
                                        <Button
                                          onClick={() => handleCancel(showing.id)}
                                          className="flex-1 bg-white text-black border border-black hover:bg-gray-100"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}

                        {/* Map View */}
                        <div className="rounded-lg overflow-hidden relative h-[400px] shadow-md border border-gray-200 mb-10">
                          <MapView isOpen={true} onClose={() => {}} properties={mapProperties} isMiniMap={true} />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Not Booked Tab Content */}
                  <TabsContent value="notbooked" className="mt-0">
                    {notBookedShowings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-xl font-medium text-black">Nothing here for now!</p>
                        <p className="text-gray-500 mt-2">You don't have any not booked showings at the moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Not Booked Showings List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {notBookedShowings.map((showing) => {
                            const property = getShowingProperty(showing)
                            return (
                              <div
                                key={showing.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                              >
                                <div className="relative aspect-[4/3]">
                                  <Image
                                    src={property.image || "/placeholder.svg"}
                                    alt={property.address}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded-md">
                                    Not Booked
                                  </div>
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
                                    <p className="text-sm font-medium text-black mb-2">
                                      Note: The property is only available for showings at the following times. Please
                                      select what works for you:
                                    </p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                      {showing.suggestedTimes.map((timeSlot) => (
                                        <div
                                          key={timeSlot.id}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                                        >
                                          <div>
                                            <p className="text-sm font-medium text-black">{timeSlot.date}</p>
                                            <p className="text-xs text-gray-500">{timeSlot.time}</p>
                                          </div>
                                          <Checkbox
                                            id={timeSlot.id}
                                            checked={selectedTimeSlots.includes(timeSlot.id)}
                                            onCheckedChange={() => handleTimeSlotSelect(timeSlot.id)}
                                            className="border-[#FFA500] data-[state=checked]:bg-[#FFA500] data-[state=checked]:text-white"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="mt-4 flex gap-2">
                                    <Button
                                      onClick={() => handleConfirmTimeSlots(property.id)}
                                      disabled={selectedTimeSlots.length === 0}
                                      className={`flex-1 ${
                                        selectedTimeSlots.length > 0
                                          ? "bg-[#FFA500] hover:bg-[#FFA500]/90 text-white"
                                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                      }`}
                                    >
                                      Confirm
                                    </Button>
                                    <Button className="flex-1 bg-white text-black border border-black hover:bg-gray-100">
                                      None of these work
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Map View */}
                        <div className="rounded-lg overflow-hidden relative h-[400px] shadow-md border border-gray-200 mb-10">
                          <MapView isOpen={true} onClose={() => {}} properties={mapProperties} isMiniMap={true} />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Cancelled Tab Content */}
                  <TabsContent value="cancelled" className="mt-0">
                    {cancelledShowings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-xl font-medium text-black">Nothing here for now!</p>
                        <p className="text-gray-500 mt-2">You don't have any cancelled showings at the moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Cancelled Showings List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {cancelledShowings.map((showing) => {
                            const property = getShowingProperty(showing)
                            return (
                              <div
                                key={showing.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
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
                                      <div className="bg-red-500 text-white px-2 py-1 text-xs rounded-md">
                                        Cancelled
                                      </div>
                                    </div>
                                    <p className="text-gray-600 text-xs mt-1">{property.price}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                      <span>{property.beds} beds</span>
                                      <span>{property.baths} baths</span>
                                    </div>
                                    {showing.cancelReason && (
                                      <p className="text-xs text-red-500 mt-2">Reason: {showing.cancelReason}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Past Tab Content */}
                  <TabsContent value="past" className="mt-0">
                    {doneShowings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-xl font-medium text-black">Nothing here for now!</p>
                        <p className="text-gray-500 mt-2">You don't have any past showings at the moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Past Showings List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {doneShowings.map((showing) => {
                            const property = getShowingProperty(showing)
                            const agent = getShowingAgent(showing)
                            const reviews = getReviewsByShowing(showing.id)
                            return (
                              <div
                                key={showing.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                              >
                                <div className="relative aspect-[4/3]">
                                  <Image
                                    src={property.image || "/placeholder.svg"}
                                    alt={property.address}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded-md">
                                    Completed
                                  </div>
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
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Date:</span> {showing.scheduledDate}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      <span className="font-medium">Time:</span> {showing.time}
                                    </p>
                                  </div>

                                  {/* Agent Section */}
                                  {agent && (
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                      <h4 className="font-medium text-black mb-2">Showing Agent</h4>
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                          <Image
                                            src={agent.profilePic || "/placeholder.svg"}
                                            alt={`${agent.firstName} ${agent.lastName}`}
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                          />
                                        </div>
                                        <div>
                                          <p className="font-medium text-black">
                                            {agent.firstName} {agent.lastName}
                                          </p>
                                          <p className="text-xs text-gray-500">{agent.email}</p>
                                        </div>
                                      </div>
                                      <Button
                                        onClick={() =>
                                          setFeedbackDialog({
                                            isOpen: true,
                                            showingId: showing.id,
                                            agentId: agent.id,
                                            rating: 0,
                                            comment: "",
                                          })
                                        }
                                        className="mt-3 w-full bg-white text-black border border-black hover:bg-gray-100"
                                      >
                                        Report Agent
                                      </Button>
                                    </div>
                                  )}

                                  {/* Rate This Showing Section */}
                                  <div className="mt-4 border-t border-gray-200 pt-4">
                                    <h4 className="font-medium text-black mb-2">Rate this Showing</h4>
                                    <div className="flex items-center gap-1 mb-3">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-5 w-5 cursor-pointer ${
                                            star <= (feedbackDialog.rating || 0)
                                              ? "fill-[#FFA500] text-[#FFA500]"
                                              : "text-gray-300"
                                          }`}
                                          onClick={() =>
                                            setFeedbackDialog({
                                              ...feedbackDialog,
                                              rating: star,
                                            })
                                          }
                                        />
                                      ))}
                                    </div>
                                    <Textarea
                                      placeholder="Share your thoughts about this showing..."
                                      className="w-full border-gray-300 focus:border-[#FFA500] focus:ring-[#FFA500]"
                                      value={feedbackDialog.comment}
                                      onChange={(e) =>
                                        setFeedbackDialog({
                                          ...feedbackDialog,
                                          comment: e.target.value,
                                        })
                                      }
                                    />
                                    <div className="mt-3 flex gap-2">
                                      <Button className="flex-1 bg-white text-black border border-black hover:bg-gray-100">
                                        Rebook Showing
                                      </Button>
                                      <Button
                                        onClick={handleSubmitFeedback}
                                        className="flex-1 bg-[#FFA500] hover:bg-[#FFA500]/90 text-white"
                                      >
                                        Rate
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Reviews Section */}
                                  {reviews.length > 0 && (
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                      <h4 className="font-medium text-black mb-2">Reviews Shared</h4>
                                      <div className="space-y-3 max-h-40 overflow-y-auto">
                                        {reviews.map((review) => {
                                          const member = activeGroup.members.find((m) => m.id === review.groupMember)
                                          const user = member ? getConnectedUser(member.id) : null
                                          return (
                                            <div key={review.id} className="bg-gray-50 p-3 rounded-md">
                                              <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                                  <Image
                                                    src={user?.profilePic || "/placeholder.svg"}
                                                    alt={`${user?.firstName} ${user?.lastName}`}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                  />
                                                </div>
                                                <div>
                                                  <p className="text-sm font-medium text-black">
                                                    {user?.firstName} {user?.lastName}
                                                  </p>
                                                  <p className="text-xs text-gray-500">{review.createdDate}</p>
                                                </div>
                                              </div>
                                              <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                                              <div className="flex items-center gap-1 mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  <Star
                                                    key={star}
                                                    className={`h-3 w-3 ${
                                                      star <= review.rate
                                                        ? "fill-[#FFA500] text-[#FFA500]"
                                                        : "text-gray-300"
                                                    }`}
                                                  />
                                                ))}
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* File Upload Section */}
                                  <div className="mt-4 border-t border-gray-200 pt-4">
                                    <h4 className="font-medium text-black mb-2">Attachments</h4>
                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                      <Upload className="h-6 w-6 mx-auto text-gray-400" />
                                      <p className="text-sm text-gray-500 mt-2">
                                        Click here to upload a video or image
                                      </p>
                                    </div>

                                    {showing.files.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        {showing.files.map((file) => (
                                          <div
                                            key={file.id}
                                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                                                <Image
                                                  src={file.url || "/placeholder.svg"}
                                                  alt={file.name}
                                                  width={40}
                                                  height={40}
                                                  className="object-cover"
                                                />
                                              </div>
                                              <p className="text-sm text-black">{file.name}</p>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-gray-500 hover:text-red-500"
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Map View */}
                        <div className="rounded-lg overflow-hidden relative h-[400px] shadow-md border border-gray-200 mb-10">
                          <MapView isOpen={true} onClose={() => {}} properties={mapProperties} isMiniMap={true} />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, isOpen: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAction}
              className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white shadow-sm hover:shadow-md"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={rescheduleDialog.isOpen}
        onOpenChange={(open) => setRescheduleDialog({ ...rescheduleDialog, isOpen: open })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rescheduling Notice</DialogTitle>
            <DialogDescription>
              Rescheduling a showing does not guarantee a slot for another time, as schedules are tight and showings are
              limited to 45 minutes. Availability is based on landlord and agent schedules, and slots are assigned on a
              first-come, first-served basis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRescheduleDialog({ ...rescheduleDialog, isOpen: false })}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReschedule}
              className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white shadow-sm hover:shadow-md"
            >
              Agree to Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog.isOpen} onOpenChange={(open) => setCancelDialog({ ...cancelDialog, isOpen: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancellation Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this showing? This action will notify all group members and the assigned
              agent.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelDialog({ ...cancelDialog, isOpen: open })}
              className="border-gray-300 hover:bg-gray-100"
            >
              Keep Appointment
            </Button>
            <Button
              type="button"
              onClick={handleConfirmCancel}
              className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white shadow-sm hover:shadow-md"
            >
              Approve Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialog.isOpen}
        onOpenChange={(open) => setFeedbackDialog({ ...feedbackDialog, isOpen: open })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Feedback Form</DialogTitle>
            <DialogDescription>Share feedback for the assigned showing agent.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    star <= feedbackDialog.rating ? "fill-[#FFA500] text-[#FFA500]" : "text-gray-300"
                  }`}
                  onClick={() =>
                    setFeedbackDialog({
                      ...feedbackDialog,
                      rating: star,
                    })
                  }
                />
              ))}
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-black mb-1">
                Comments About the Agent
              </label>
              <Textarea
                id="comment"
                placeholder="Share your experience with the agent..."
                className="w-full border-gray-300 focus:border-[#FFA500] focus:ring-[#FFA500]"
                value={feedbackDialog.comment}
                onChange={(e) =>
                  setFeedbackDialog({
                    ...feedbackDialog,
                    comment: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFeedbackDialog({ ...feedbackDialog, isOpen: false })}
              className="border-gray-300 hover:bg-gray-100"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleSubmitFeedback}
              className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white shadow-sm hover:shadow-md"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
