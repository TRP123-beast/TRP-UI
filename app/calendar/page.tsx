"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Plus, X, Bell } from "lucide-react"
import { format, addDays, subDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { CalendarView } from "@/components/calendar-view"
import { CalendarSidebar } from "@/components/calendar-sidebar"
import { TimeBlockSelector } from "@/components/time-block-selector"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { CalendarViewToggle } from "@/components/calendar-view-toggle"
import { NotificationSettings } from "@/components/notification-settings"
import { EventNotificationSettings } from "@/components/event-notification-settings"

// Mock data for calendar events
const INITIAL_MOCK_EVENTS = [
  {
    id: "1",
    title: "101 Park Avenue #303 Showing",
    address: "101 Park Avenue #303, Toronto, ON",
    date: "2025-04-16",
    time: "10:00 am - 11:00 am",
    members: ["John Doe", "Jane Smith"],
    agent: "John Smith",
    color: "#66FCF1",
    property: {
      id: "prop1",
      name: "101 Park Avenue #303",
      image: "/placeholder.svg?height=200&width=300",
    },
    timeBlocks: ["10:00 am - 11:00 am"],
  },
  {
    id: "2",
    title: "56 Queen Street #801 Showing",
    address: "56 Queen Street #801, Toronto, ON",
    date: "2025-04-18",
    time: "2:00 pm - 3:00 pm",
    members: ["John Doe", "Sarah Johnson", "Mike Wilson"],
    agent: "Emily Clark",
    color: "#FF44EC",
    property: {
      id: "prop2",
      name: "56 Queen Street #801",
      image: "/placeholder.svg?height=200&width=300",
    },
    timeBlocks: ["2:00 pm - 3:00 pm"],
  },
  {
    id: "3",
    title: "789 King West #1205 Showing",
    address: "789 King West #1205, Toronto, ON",
    date: "2025-04-20",
    time: "11:00 am - 12:00 pm",
    members: ["John Doe"],
    agent: "Robert Brown",
    color: "#6E44FF",
    property: {
      id: "prop3",
      name: "789 King West #1205",
      image: "/placeholder.svg?height=200&width=300",
    },
    timeBlocks: ["11:00 am - 12:00 pm"],
  },
]

// Mock properties data for selection
const MOCK_PROPERTIES = [
  {
    id: "prop1",
    name: "20 O'Neill Rd #238",
    address: "20 O'Neill Rd #238, North York, ON",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "prop2",
    name: "809 Bay Street #1501",
    address: "809 Bay Street #1501, Toronto, ON",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "prop3",
    name: "312 Queen Street West",
    address: "312 Queen Street West, Toronto, ON",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "prop4",
    name: "224 King St W #1901",
    address: "224 King St W #1901, Toronto, ON",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "prop5",
    name: "508 Wellington St W #602",
    address: "508 Wellington St W #602, Toronto, ON",
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Array of colors for events
const EVENT_COLORS = ["#66FCF1", "#FF44EC", "#6E44FF", "#00FFA3", "#45A29E"]

export default function CalendarPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<string>("April")
  const [currentYear, setCurrentYear] = useState<number>(2025)
  const [today] = useState(new Date(2025, 3, 14)) // April 14, 2025
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 3, 14)) // April 14, 2025
  const [calendarDays, setCalendarDays] = useState<any[]>([])
  const [events, setEvents] = useState(INITIAL_MOCK_EVENTS)
  const [viewType, setViewType] = useState<"month" | "week" | "day" | "3days" | "schedule">("month")
  const [calendarSidebarOpen, setCalendarSidebarOpen] = useState(false)
  const [timeBlockSelectorOpen, setTimeBlockSelectorOpen] = useState(false)
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([])
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [date, setDate] = useState<Date>(new Date(2025, 3, 14))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [showShareTooltip, setShowShareTooltip] = useState(false)

  // New state for notification settings
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false)
  const [eventNotificationSettingsOpen, setEventNotificationSettingsOpen] = useState(false)
  const [selectedEventForNotifications, setSelectedEventForNotifications] = useState<any>(null)

  // Add a ref for the calendar container
  const calendarContainerRef = useRef<HTMLDivElement>(null)

  // Generate calendar days for the current month
  useEffect(() => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const monthIndex = months.indexOf(currentMonth)

    // Get the first day of the month
    const firstDay = new Date(currentYear, monthIndex, 1)
    const lastDay = new Date(currentYear, monthIndex + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    // Generate array of days
    const days = []

    // Add days from previous month
    const prevMonthLastDay = new Date(currentYear, monthIndex, 0).getDate()
    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      days.push({
        day: i,
        month: monthIndex === 0 ? 11 : monthIndex - 1,
        year: monthIndex === 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false,
      })
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        day: i,
        month: monthIndex,
        year: currentYear,
        isCurrentMonth: true,
      })
    }

    // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: monthIndex === 11 ? 0 : monthIndex + 1,
        year: monthIndex === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false,
      })
    }

    setCalendarDays(days)
  }, [currentMonth, currentYear])

  const navigateToPreviousMonth = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const currentMonthIndex = months.indexOf(currentMonth)

    if (currentMonthIndex === 0) {
      setCurrentMonth(months[11])
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(months[currentMonthIndex - 1])
    }
  }

  const navigateToNextMonth = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const currentMonthIndex = months.indexOf(currentMonth)

    if (currentMonthIndex === 11) {
      setCurrentMonth(months[0])
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(months[currentMonthIndex + 1])
    }
  }

  const navigateToPreviousDay = () => {
    const newDate = subDays(currentDate, viewType === "3days" ? 3 : viewType === "week" ? 7 : 1)
    setCurrentDate(newDate)

    // Update month and year if needed
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    setCurrentMonth(months[newDate.getMonth()])
    setCurrentYear(newDate.getFullYear())
  }

  const navigateToNextDay = () => {
    const newDate = addDays(currentDate, viewType === "3days" ? 3 : viewType === "week" ? 7 : 1)
    setCurrentDate(newDate)

    // Update month and year if needed
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    setCurrentMonth(months[newDate.getMonth()])
    setCurrentYear(newDate.getFullYear())
  }

  const handleTimeBlockSelect = (timeBlock: string) => {
    if (selectedTimeBlocks.includes(timeBlock)) {
      setSelectedTimeBlocks(selectedTimeBlocks.filter((block) => block !== timeBlock))
    } else {
      setSelectedTimeBlocks([...selectedTimeBlocks, timeBlock])
    }
  }

  const handleAddEvent = () => {
    setTimeBlockSelectorOpen(true)
    setSelectedTimeBlocks([])
    setSelectedProperty(null)
  }

  const handleViewTypeChange = (type: "month" | "week" | "day" | "3days" | "schedule") => {
    setViewType(type)
    setCalendarSidebarOpen(false)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh with a timeout but preserve events
    setTimeout(() => {
      // We're not clearing events here, so they remain after refresh
      setIsRefreshing(false)

      // Show toast to indicate refresh is complete
      toast({
        title: "Calendar refreshed",
        description: "Your scheduled showings have been preserved",
      })
    }, 1000)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setCurrentDate(date)
      setIsCalendarOpen(false)

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]

      setCurrentMonth(months[date.getMonth()])
      setCurrentYear(date.getFullYear())
    }
  }

  const handleTimeBlockConfirm = () => {
    if (selectedProperty && selectedTimeBlocks.length > 0) {
      // Group time blocks by date
      const timeBlocksByDate = selectedTimeBlocks.reduce(
        (acc, block) => {
          const [dateStr, timeBlock] = block.split("|")
          if (!dateStr || !timeBlock) return acc

          if (!acc[dateStr]) {
            acc[dateStr] = []
          }

          // Extract just the time part from the time block
          const timeSlot = timeBlock.split("-").pop()?.trim()
          if (timeSlot) {
            acc[dateStr].push(timeSlot)
          }

          return acc
        },
        {} as Record<string, string[]>,
      )

      // Create events for each date
      const newEvents = Object.entries(timeBlocksByDate).map(([dateStr, timeBlocks], index) => {
        // Pick a random color from the EVENT_COLORS array
        const colorIndex = Math.floor(Math.random() * EVENT_COLORS.length)

        return {
          id: `new-${Date.now()}-${index}`,
          title: `${selectedProperty.name} Showing`,
          address: selectedProperty.address || "Address not available",
          date: dateStr,
          time: timeBlocks[0] || "Time not specified",
          members: ["Maureen Wariara"],
          agent: "TBD",
          color: EVENT_COLORS[colorIndex],
          property: selectedProperty,
          timeBlocks: timeBlocks,
        }
      })

      setEvents([...events, ...newEvents])
      setTimeBlockSelectorOpen(false)
      setSelectedTimeBlocks([])
      setSelectedProperty(null)

      toast({
        title: "Showings scheduled",
        description: `${newEvents.length} showings have been scheduled for ${selectedProperty.name}`,
      })
    }
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))

    toast({
      title: "Showing deleted",
      description: "The showing has been removed from your calendar",
    })
  }

  const handleShareEvent = () => {
    // Create a shareable link (in a real app, this would be a unique URL)
    const shareableLink = `https://rental-app.com/showings/${selectedEvent?.id}`

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        // Show both tooltip and toast notification for better visibility
        setShowShareTooltip(true)
        setTimeout(() => setShowShareTooltip(false), 2000)

        // Show toast notification
        toast({
          title: "Link copied!",
          description: "Shareable link has been copied to clipboard",
        })
      })
      .catch((err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Failed to copy link",
          description: "Please try again",
          variant: "destructive",
        })
      })
  }

  const handleExitPage = () => {
    router.push("/")
  }

  // New handler for opening event notification settings
  const handleOpenEventNotificationSettings = (event: any) => {
    setSelectedEventForNotifications(event)
    setEventNotificationSettingsOpen(true)
  }

  // Get navigation title based on view type
  const getNavigationTitle = () => {
    if (viewType === "day") {
      return format(currentDate, "EEEE, MMMM d")
    } else if (viewType === "3days") {
      const endDate = addDays(currentDate, 2)
      return `${format(currentDate, "MMM d")} - ${format(endDate, "MMM d")}`
    } else if (viewType === "week") {
      const endDate = addDays(currentDate, 6)
      return `${format(currentDate, "MMM d")} - ${format(endDate, "MMM d")}`
    } else {
      return currentMonth
    }
  }

  // Add touch handling for swipe gestures
  useEffect(() => {
    const container = calendarContainerRef.current
    if (!container) return

    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      const swipeThreshold = 50 // minimum distance to be considered a swipe
      const swipeDistance = touchEndX - touchStartX

      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe right - go to previous month/day
          viewType === "month" ? navigateToPreviousMonth() : navigateToPreviousDay()
        } else {
          // Swipe left - go to next month/day
          viewType === "month" ? navigateToNextMonth() : navigateToNextDay()
        }
      }
    }

    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchmove", handleTouchMove)
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [viewType, currentDate])

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Only visible on desktop */}
      <div className="hidden md:block">
        <Sidebar className={sidebarOpen ? "block" : "hidden md:block"} activePage="calendar" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#000000] hover:text-[#FFA500] hover:bg-[#FFA500]/10 active:text-[#FFA500] focus:text-[#FFA500]"
              onClick={handleExitPage}
              aria-label="Exit calendar"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="flex items-center gap-2">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="text-[#000000] hover:text-[#FFA500] hover:bg-[#FFA500]/10">
                    <h1 className="text-xl font-medium">{getNavigationTitle()}</h1>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#000000] h-8 w-8 hover:text-[#FFA500] hover:bg-[#FFA500]/10 hover:shadow-md active:text-[#FFA500] focus:text-[#FFA500] transition-all"
                onClick={viewType === "month" ? navigateToPreviousMonth : navigateToPreviousDay}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#000000] h-8 w-8 hover:text-[#FFA500] hover:bg-[#FFA500]/10 hover:shadow-md active:text-[#FFA500] focus:text-[#FFA500] transition-all"
                onClick={viewType === "month" ? navigateToNextMonth : navigateToNextDay}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* View toggle and notification settings */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationSettingsOpen(true)}
              className="text-[#000000] hover:text-[#FFA500] hover:bg-[#FFA500]/10 transition-colors"
              aria-label="Notification settings"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <CalendarViewToggle currentView={viewType} onViewChange={handleViewTypeChange} />
          </div>
        </div>

        {/* Calendar Header */}
        {viewType === "month" && (
          <div className="bg-white text-[#000000] border-b border-gray-200 py-2 shadow-sm">
            <div className="grid grid-cols-7 text-center">
              <div className="text-sm font-medium">S</div>
              <div className="text-sm font-medium">M</div>
              <div className="text-sm font-medium">T</div>
              <div className="text-sm font-medium">W</div>
              <div className="text-sm font-medium">T</div>
              <div className="text-sm font-medium">F</div>
              <div className="text-sm font-medium">S</div>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto bg-white" ref={calendarContainerRef}>
          <TooltipProvider>
            <CalendarView
              days={calendarDays}
              events={events}
              viewType={viewType}
              currentMonth={currentMonth}
              currentYear={currentYear}
              currentDate={currentDate}
              onEventClick={handleEventClick}
              onDateChange={setCurrentDate}
              onDeleteEvent={handleDeleteEvent}
              onShareEvent={handleShareEvent}
              onConfigureNotifications={handleOpenEventNotificationSettings}
            />
          </TooltipProvider>
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-24 right-6 z-40 md:bottom-6">
          <Button
            className="rounded-full w-14 h-14 bg-white text-[#FFA500] border-2 border-[#FFA500] shadow-lg hover:bg-[#FFA500] hover:text-white hover:scale-110 hover:shadow-xl focus:bg-[#FFA500] focus:text-white active:bg-[#FFA500] active:text-white transition-all duration-300"
            onClick={handleAddEvent}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <MobileNav cartItems={[]} />

        {/* Calendar Sidebar */}
        {calendarSidebarOpen && (
          <CalendarSidebar
            onClose={() => setCalendarSidebarOpen(false)}
            onViewTypeChange={handleViewTypeChange}
            currentViewType={viewType}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        )}

        {/* Time Block Selector */}
        {timeBlockSelectorOpen && (
          <TimeBlockSelector
            onClose={() => setTimeBlockSelectorOpen(false)}
            onTimeBlockSelect={handleTimeBlockSelect}
            selectedTimeBlocks={selectedTimeBlocks}
            onConfirm={handleTimeBlockConfirm}
            onPropertySelect={setSelectedProperty}
            properties={MOCK_PROPERTIES}
          />
        )}

        {/* Global Notification Settings */}
        <NotificationSettings isOpen={notificationSettingsOpen} onClose={() => setNotificationSettingsOpen(false)} />

        {/* Event-specific Notification Settings */}
        {selectedEventForNotifications && (
          <EventNotificationSettings
            isOpen={eventNotificationSettingsOpen}
            onClose={() => setEventNotificationSettingsOpen(false)}
            eventId={selectedEventForNotifications.id}
            eventTitle={selectedEventForNotifications.title}
          />
        )}
      </div>
    </div>
  )
}
