"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, addDays, addWeeks, subWeeks } from "date-fns"

interface MobileCalendarProps {
  onTimeBlockSelect?: (timeBlock: string) => void
  selectedTimeBlocks?: string[]
}

export function MobileCalendar({ onTimeBlockSelect, selectedTimeBlocks = [] }: MobileCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartBlock, setDragStartBlock] = useState<string | null>(null)
  const [localSelectedBlocks, setLocalSelectedBlocks] = useState<string[]>(selectedTimeBlocks)

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

  // Update week days when current date changes
  useEffect(() => {
    // Set current date to April 14, 2025
    setCurrentDate(new Date(2025, 3, 14))
  }, [])

  // Update local state when prop changes
  useEffect(() => {
    setLocalSelectedBlocks(selectedTimeBlocks)
  }, [selectedTimeBlocks])

  const navigateToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1))
  }

  const navigateToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1))
  }

  const handleTimeBlockClick = (dayIndex: number, timeIndex: number) => {
    const day = weekDays[dayIndex]
    const dayStr = format(day, "EEE-dd")
    const time = timeSlots[timeIndex]
    const blockId = `${dayStr}-${time}`

    if (isDragging) {
      // End of drag selection
      setIsDragging(false)
      if (dragStartBlock) {
        // Calculate all blocks between start and current
        const startDayIndex = weekDays.findIndex((d) => dragStartBlock.startsWith(format(d, "EEE-dd")))
        const startTimeIndex = timeSlots.findIndex((t) => dragStartBlock.endsWith(t))

        // Determine the range of blocks to select
        const minDayIndex = Math.min(startDayIndex, dayIndex)
        const maxDayIndex = Math.max(startDayIndex, dayIndex)
        const minTimeIndex = Math.min(startTimeIndex, timeIndex)
        const maxTimeIndex = Math.max(startTimeIndex, timeIndex)

        // Create a new array of selected blocks
        const newSelectedBlocks = [...localSelectedBlocks]

        // Add all blocks in the range
        for (let d = minDayIndex; d <= maxDayIndex; d++) {
          for (let t = minTimeIndex; t <= maxTimeIndex; t++) {
            const day = weekDays[d]
            const dayStr = format(day, "EEE-dd")
            const time = timeSlots[t]
            const blockId = `${dayStr}-${time}`
            if (!newSelectedBlocks.includes(blockId)) {
              newSelectedBlocks.push(blockId)
            }
          }
        }

        setLocalSelectedBlocks(newSelectedBlocks)
        if (onTimeBlockSelect) {
          onTimeBlockSelect(blockId)
        }
        setDragStartBlock(null)
      }
    } else {
      // Start of selection or toggle single block
      if (localSelectedBlocks.includes(blockId)) {
        setLocalSelectedBlocks(localSelectedBlocks.filter((id) => id !== blockId))
      } else {
        setLocalSelectedBlocks([...localSelectedBlocks, blockId])
        setIsDragging(true)
        setDragStartBlock(blockId)
        if (onTimeBlockSelect) {
          onTimeBlockSelect(blockId)
        }
      }
    }
  }

  const handleMouseEnter = (dayIndex: number, timeIndex: number) => {
    if (isDragging) {
      // Highlight blocks during drag
      // This would be more complex in a real implementation
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Info className="h-4 w-4 mr-2 text-[#FFA500]" />
          <p>Set your availability for property showings.</p>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="text-[#FFA500] border-[#FFA500] hover:bg-[#FFA500]/10 hover:shadow-sm transition-all"
            onClick={navigateToPreviousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="font-medium text-[#000000]">
            {format(weekDays[0] || currentDate, "MMM dd")} - {format(weekDays[6] || addDays(currentDate, 6), "MMM dd")}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-[#FFA500] border-[#FFA500] hover:bg-[#FFA500]/10 hover:shadow-sm transition-all"
            onClick={navigateToNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 p-2 min-w-[640px]">
          {/* Day headers */}
          {weekDays.map((day) => (
            <div key={format(day, "yyyy-MM-dd")} className="text-center p-2 font-medium">
              <div>{format(day, "EEE")}</div>
              <div>{format(day, "dd")}</div>
            </div>
          ))}

          {/* Time blocks for each day */}
          {weekDays.map((day, dayIndex) => (
            <div key={`day-${format(day, "yyyy-MM-dd")}`} className="flex flex-col gap-1">
              {timeSlots.map((slot, timeIndex) => {
                const dayStr = format(day, "EEE-dd")
                const blockId = `${dayStr}-${slot}`
                const isSelected = localSelectedBlocks.includes(blockId)

                return (
                  <div
                    key={blockId}
                    className={`p-2 border rounded text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#FFA500]/20 hover:bg-[#FFA500]/30 border-[#FFA500] text-black font-medium shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 hover:border-[#FFA500]/30 border-gray-200"
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
    </div>
  )
}
