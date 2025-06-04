"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function SchedulingCalendar({ onClose }: { onClose?: () => void }) {
  // Update the current date to April 14, 2025
  const [today] = useState(new Date(2025, 3, 14)) // April 14, 2025 (Mon)
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartBlock, setDragStartBlock] = useState<string | null>(null)
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])

  // Time slots
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
    "2025-04-09-9:00 am - 10:00 am",
    "2025-04-10-10:00 am - 11:00 am",
    "2025-04-11-9:00 am - 10:00 am",
  ]

  // Generate the current week days
  useEffect(() => {
    const days = []
    // Start from Monday
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1) // Monday is 1, Sunday is 0

    for (let i = 0; i < 7; i++) {
      days.push(addDays(monday, i))
    }
    setCurrentWeek(days)
  }, [today])

  // Initialize selected blocks with pre-selected ones
  useEffect(() => {
    setSelectedTimeBlocks(preSelectedBlocks)
  }, [])

  const handleTimeBlockClick = (dateStr: string, timeSlot: string) => {
    const blockId = `${dateStr}-${timeSlot}`

    if (isDragging) {
      // End of drag selection
      setIsDragging(false)
      setDragStartBlock(null)
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

  const handleUpdateSchedule = () => {
    // In a real app, you would save the selected time blocks to your backend
    alert(`Schedule updated with ${selectedTimeBlocks.length} available time slots`)
  }

  const navigateToPreviousWeek = () => {
    // In a real app, you would update the date range and fetch new data
    alert("Navigating to previous week")
  }

  const navigateToNextWeek = () => {
    // In a real app, you would update the date range and fetch new data
    alert("Navigating to next week")
  }

  // Format the date range for display
  const formatDateRange = () => {
    if (currentWeek.length === 0) return ""
    return `Apr 07 - Apr 13`
  }

  function renderEventDetails(event: any) {
    return (
      <div className="p-4">
        {/* ... other event details ... */}

        <h4 className="font-medium mb-2">Attendees:</h4>
        <div className="space-y-2">
          {(event.attendees || []).map((attendee: any) => (
            <div key={attendee.id} className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                <Image
                  src={attendee.image || "/placeholder.svg?height=32&width=32"}
                  alt={attendee.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span>{attendee.name}</span>
            </div>
          ))}
        </div>

        {event.agent && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Agent:</h4>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                <Image
                  src={event.agent.image || "/placeholder.svg?height=32&width=32"}
                  alt={event.agent.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span>{event.agent.name}</span>
            </div>
          </div>
        )}

        {/* ... other event details ... */}
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white text-navy-blue">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center text-sm text-navy-blue mb-4">
          <Info className="h-4 w-4 mr-2 text-[#66FCF1]" />
          <p>Here is your showings schedule, set your availability here.</p>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-navy-blue border-navy-blue hover:bg-navy-blue hover:text-white"
            onClick={navigateToPreviousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="font-medium text-navy-blue">{formatDateRange()}</div>

          <Button
            variant="outline"
            size="sm"
            className="bg-white text-navy-blue border-navy-blue hover:bg-navy-blue hover:text-white"
            onClick={navigateToNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {currentWeek.map((day) => {
                const isToday = isSameDay(day, today)
                const dayName = format(day, "EEE")
                const dayNumber = format(day, "dd")

                return (
                  <th
                    key={format(day, "yyyy-MM-dd")}
                    className={`p-2 text-center border-b border-gray-200 ${isToday ? "bg-gray-100 rounded-t" : ""}`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-navy-blue">{dayName}</span>
                    </div>
                    <div className={`${isToday ? "text-navy-blue font-bold" : "text-navy-blue"}`}>{dayNumber}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => (
              <tr key={timeSlot}>
                {currentWeek.map((day) => {
                  const isToday = isSameDay(day, today)
                  const dateStr = format(day, "yyyy-MM-dd")
                  const blockId = `${dateStr}-${timeSlot}`
                  const isSelected = selectedTimeBlocks.includes(blockId)

                  return (
                    <td
                      key={`${dateStr}-${timeSlot}`}
                      className={`border border-gray-200 p-0 text-center cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#45A29E] hover:bg-[#45A29E]/90 text-white"
                          : isToday
                            ? "bg-gray-100 hover:bg-gray-200"
                            : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleTimeBlockClick(dateStr, timeSlot)}
                    >
                      <div className="py-3 px-2">
                        <span className={`text-xs ${isSelected ? "text-white font-medium" : "text-navy-blue"}`}>
                          {timeSlot}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
        {onClose && (
          <Button
            className="bg-white text-navy-blue border border-navy-blue hover:bg-navy-blue hover:text-white mr-2"
            onClick={onClose}
          >
            Cancel
          </Button>
        )}
        <Button className="bg-[#66FCF1] text-navy-blue hover:bg-[#66FCF1]/90" onClick={handleUpdateSchedule}>
          Update Schedule
        </Button>
      </div>
    </div>
  )
}
