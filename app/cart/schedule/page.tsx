"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { MobileNav } from "@/components/mobile-nav"

export default function SchedulePage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartBlock, setDragStartBlock] = useState<string | null>(null)

  // Mock date range
  const dateRange = "Apr 02 - Apr 08"

  // Mock days of the week
  const days = [
    { day: "Wed", date: "02" },
    { day: "Thu", date: "03" },
    { day: "Fri", date: "04" },
    { day: "Sat", date: "05" },
    { day: "Sun", date: "06" },
    { day: "Mon", date: "07" },
    { day: "Tue", date: "08" },
  ]

  // Mock time slots
  const timeSlots = [
    "8:00 am - 9:00 am",
    "9:00 am - 10:00 am",
    "10:00 am - 11:00 am",
    "11:00 am - 12:00 pm",
    "12:00 pm - 1:00 pm",
    "1:00 pm - 2:00 pm",
    "2:00 pm - 3:00 pm",
    "3:00 pm - 4:00 pm",
    "4:00 pm - 5:00 pm",
  ]

  // Pre-selected time blocks (for demo purposes)
  const preSelectedBlocks = [
    "Thu-03-9:00 am - 10:00 am",
    "Thu-03-10:00 am - 11:00 am",
    "Thu-03-11:00 am - 12:00 pm",
    "Fri-04-1:00 pm - 2:00 pm",
    "Fri-04-2:00 pm - 3:00 pm",
  ]

  // Initialize selected blocks with pre-selected ones
  useState(() => {
    setSelectedTimeBlocks(preSelectedBlocks)
  })

  const handleTimeBlockClick = (dayIndex: number, timeIndex: number) => {
    const day = days[dayIndex]
    const time = timeSlots[timeIndex]
    const blockId = `${day.day}-${day.date}-${time}`

    if (isDragging) {
      // End of drag selection
      setIsDragging(false)
      if (dragStartBlock) {
        // Calculate all blocks between start and current
        const startDayIndex = days.findIndex((d) => dragStartBlock.startsWith(`${d.day}-${d.date}`))
        const startTimeIndex = timeSlots.findIndex((t) => dragStartBlock.endsWith(t))

        // Determine the range of blocks to select
        const minDayIndex = Math.min(startDayIndex, dayIndex)
        const maxDayIndex = Math.max(startDayIndex, dayIndex)
        const minTimeIndex = Math.min(startTimeIndex, timeIndex)
        const maxTimeIndex = Math.max(startTimeIndex, timeIndex)

        // Create a new array of selected blocks
        const newSelectedBlocks = [...selectedTimeBlocks]

        // Add all blocks in the range
        for (let d = minDayIndex; d <= maxDayIndex; d++) {
          for (let t = minTimeIndex; t <= maxTimeIndex; t++) {
            const day = days[d]
            const time = timeSlots[t]
            const blockId = `${day.day}-${day.date}-${time}`
            if (!newSelectedBlocks.includes(blockId)) {
              newSelectedBlocks.push(blockId)
            }
          }
        }

        setSelectedTimeBlocks(newSelectedBlocks)
        setDragStartBlock(null)
      }
    } else {
      // Start of selection or toggle single block
      if (selectedTimeBlocks.includes(blockId)) {
        setSelectedTimeBlocks(selectedTimeBlocks.filter((id) => id !== blockId))
      } else {
        setSelectedTimeBlocks([...selectedTimeBlocks, blockId])
        setIsDragging(true)
        setDragStartBlock(blockId)
      }
    }
  }

  const handleMouseEnter = (dayIndex: number, timeIndex: number) => {
    if (isDragging) {
      // Highlight blocks during drag
      // This would be more complex in a real implementation
    }
  }

  const handleConfirmSchedule = () => {
    // In a real app, you would save the selected time blocks to your backend
    alert(`Schedule confirmed with ${selectedTimeBlocks.length} available time slots`)
    router.push("/")
  }

  const navigateToPreviousWeek = () => {
    // In a real app, you would update the date range and fetch new data
    alert("Navigating to previous week")
  }

  const navigateToNextWeek = () => {
    // In a real app, you would update the date range and fetch new data
    alert("Navigating to next week")
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? "block" : "hidden md:block"} activePage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} cartItems={[]} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Schedule Your Showings</h1>
            </div>

            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Info className="h-4 w-4 mr-2" />
                  <p>
                    Set your availability for property showings. Select multiple time slots by clicking and dragging.
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" className="text-teal-500" onClick={navigateToPreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="font-medium">{dateRange}</div>

                  <Button variant="outline" size="sm" className="text-teal-500" onClick={navigateToNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-1 p-2">
                  {/* Day headers */}
                  {days.map((day) => (
                    <div key={day.day + day.date} className="text-center p-2 font-medium">
                      <div>{day.day}</div>
                      <div>{day.date}</div>
                    </div>
                  ))}

                  {/* Time blocks for each day */}
                  {days.map((day, dayIndex) => (
                    <div key={`day-${day.day}-${day.date}`} className="flex flex-col gap-1">
                      {timeSlots.map((slot, timeIndex) => {
                        const blockId = `${day.day}-${day.date}-${slot}`
                        const isSelected = selectedTimeBlocks.includes(blockId)

                        return (
                          <div
                            key={blockId}
                            className={`p-2 border rounded text-xs cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-100 hover:bg-teal-200 border-teal-300"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                            }`}
                            onClick={() => handleTimeBlockClick(dayIndex, timeIndex)}
                            onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex)}
                          >
                            {slot.split(" - ")[0]}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-between">
                <Button variant="outline" onClick={() => router.push("/cart")}>
                  Back to Cart
                </Button>
                <Button className="bg-teal-500 hover:bg-teal-600" onClick={handleConfirmSchedule}>
                  Confirm Schedule
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-yellow-800 mb-2">Important Information</h2>
              <p className="text-yellow-700 text-sm">
                Your selected time slots will be used to schedule showings for the properties in your cart. Property
                owners will be notified of your availability and will confirm specific showing times.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav cartItems={[]} onOpenCart={() => {}} />
      </div>
    </div>
  )
}
