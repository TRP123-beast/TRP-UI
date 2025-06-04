"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Property {
  id: string
  name: string
  address: string
  image: string
  price?: string
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
}

interface TimeBlockSelectorProps {
  onClose: () => void
  onTimeBlockSelect: (timeBlock: string) => void
  selectedTimeBlocks: string[]
  onConfirm: () => void
  onPropertySelect?: (property: any) => void
  properties?: Property[]
}

export function TimeBlockSelector({
  onClose,
  onTimeBlockSelect,
  selectedTimeBlocks,
  onConfirm,
  onPropertySelect,
  properties = [
    {
      id: "1",
      name: "809 Bay Street #1501",
      address: "809 Bay Street #1501, Toronto, ON",
      image: "/placeholder.svg?height=160&width=240",
      price: "$2,300/mo",
      bedrooms: 1,
      bathrooms: 1,
      propertyType: "Condo",
    },
    {
      id: "2",
      name: "312 Queen Street West",
      address: "312 Queen Street West, Toronto, ON",
      image: "/placeholder.svg?height=160&width=240",
      price: "$2,800/mo",
      bedrooms: 2,
      bathrooms: 1,
      propertyType: "Apartment",
    },
    {
      id: "3",
      name: "224 King St W #1901",
      address: "224 King St W #1901, Toronto, ON",
      image: "/placeholder.svg?height=160&width=240",
      price: "$3,500/mo",
      bedrooms: 2,
      bathrooms: 2,
      propertyType: "Condo",
    },
    {
      id: "4",
      name: "508 Wellington St W #602",
      address: "508 Wellington St W #602, Toronto, ON",
      image: "/placeholder.svg?height=160&width=240",
      price: "$4,200/mo",
      bedrooms: 3,
      bathrooms: 2,
      propertyType: "Loft",
    },
  ],
}: TimeBlockSelectorProps) {
  // For demo purposes, we're setting April 8, 2025 as "today"
  const [today] = useState(new Date(2025, 3, 8)) // April 8, 2025 (Tue)
  const [currentDate, setCurrentDate] = useState(today)
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartBlock, setDragStartBlock] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [step, setStep] = useState<"property" | "timeblock">("property")
  const [selectedPropertyData, setSelectedPropertyData] = useState<Property | null>(null)

  // Time slots
  const timeSlots = [
    "8 - 9 AM",
    "9 - 10 AM",
    "10 - 11 AM",
    "11 - 12 PM",
    "12 - 1 PM",
    "1 - 2 PM",
    "2 - 3 PM",
    "3 - 4 PM",
    "4 - 5 PM",
  ]

  // Update week days when current date changes
  useEffect(() => {
    // Start from Monday for this week
    const monday = startOfWeek(currentDate, { weekStartsOn: 1 })
    const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
    setWeekDays(days)
  }, [currentDate])

  const navigateToPreviousWeek = () => {
    const newDate = subWeeks(currentDate, 1)
    setCurrentDate(newDate)
  }

  const navigateToNextWeek = () => {
    const newDate = addWeeks(currentDate, 1)
    setCurrentDate(newDate)
  }

  const handleTimeBlockClick = (dayIndex: number, timeIndex: number) => {
    const day = weekDays[dayIndex]
    const dayStr = format(day, "EEE-dd")
    const time = timeSlots[timeIndex]
    const blockId = `${dayStr}-${time}`

    // Store the actual date in ISO format with the time block
    const dateStr = format(day, "yyyy-MM-dd")

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
        const newSelectedBlocks = [...selectedTimeBlocks]

        // Add all blocks in the range
        for (let d = minDayIndex; d <= maxDayIndex; d++) {
          for (let t = minTimeIndex; t <= maxTimeIndex; t++) {
            const day = weekDays[d]
            const dayStr = format(day, "EEE-dd")
            const dateStr = format(day, "yyyy-MM-dd")
            const time = timeSlots[t]
            const blockId = `${dayStr}-${time}`
            const fullBlockId = `${dateStr}|${blockId}`

            if (!newSelectedBlocks.includes(fullBlockId)) {
              newSelectedBlocks.push(fullBlockId)
              onTimeBlockSelect(fullBlockId)
            }
          }
        }

        setDragStartBlock(null)
      }
    } else {
      // Start of selection or toggle single block
      const fullBlockId = `${dateStr}|${blockId}`

      if (selectedTimeBlocks.includes(fullBlockId)) {
        onTimeBlockSelect(fullBlockId) // This should toggle it off
      } else {
        onTimeBlockSelect(fullBlockId)
        setIsDragging(true)
        setDragStartBlock(blockId)
      }
    }
  }

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(propertyId)
    const property = properties.find((p) => p.id === propertyId)
    if (property) {
      setSelectedPropertyData(property)
      if (onPropertySelect) {
        onPropertySelect(property)
      }
    }
  }

  const handleNextStep = () => {
    if (step === "property" && selectedProperty) {
      setStep("timeblock")
    } else if (step === "timeblock" && selectedTimeBlocks.length > 0) {
      onConfirm()
    }
  }

  // Format the date range for display
  const formatDateRange = () => {
    if (weekDays.length === 0) return ""
    return `${format(weekDays[0], "MMM dd")} - ${format(weekDays[6], "MMM dd")}`
  }

  // Check if a time block is selected
  const isTimeBlockSelected = (dayIndex: number, timeIndex: number) => {
    const day = weekDays[dayIndex]
    const dayStr = format(day, "EEE-dd")
    const dateStr = format(day, "yyyy-MM-dd")
    const time = timeSlots[timeIndex]
    const blockId = `${dayStr}-${time}`
    const fullBlockId = `${dateStr}|${blockId}`

    return selectedTimeBlocks.includes(fullBlockId)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 pb-16 md:pb-4">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
      <div className="bg-white text-black rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">
            {step === "property" ? "Select Property for Showing" : "Select Availability"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-black hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 flex-1 overflow-auto custom-scrollbar">
          {step === "property" ? (
            <div className="space-y-4">
              <p className="text-gray-600">Select a property you want to schedule a showing for:</p>

              <RadioGroup value={selectedProperty || ""} onValueChange={handlePropertySelect}>
                <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className={`flex items-start space-x-4 p-4 border rounded-lg transition-all duration-200 ${
                        selectedProperty === property.id
                          ? "border-[#FFA500] bg-[#FFA500]/5 shadow-md transform scale-[1.02]"
                          : "border-gray-200 hover:border-[#FFA500] hover:shadow-sm"
                      }`}
                    >
                      <RadioGroupItem value={property.id} id={property.id} className="sr-only" />
                      <Label htmlFor={property.id} className="flex items-start gap-4 cursor-pointer flex-1">
                        <div className="w-24 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={property.image || "/placeholder.svg?height=160&width=240"}
                            alt={property.name}
                            width={96}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-black text-lg">{property.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{property.address}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            {property.price && <span className="text-sm font-medium text-black">{property.price}</span>}
                            {property.bedrooms !== undefined && (
                              <span className="text-sm text-gray-600">
                                {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
                              </span>
                            )}
                            {property.bathrooms !== undefined && (
                              <span className="text-sm text-gray-600">
                                {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
                              </span>
                            )}
                            {property.propertyType && (
                              <span className="text-sm text-gray-600">{property.propertyType}</span>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          ) : (
            <>
              {selectedPropertyData && (
                <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={selectedPropertyData.image || "/placeholder.svg"}
                        alt={selectedPropertyData.name}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">{selectedPropertyData.name}</h3>
                      <p className="text-xs text-gray-500">{selectedPropertyData.address}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500]/5"
                  onClick={navigateToPreviousWeek}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="font-medium text-black">{formatDateRange()}</div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500]/5"
                  onClick={navigateToNextWeek}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="w-32 p-2 text-left font-medium text-gray-500">Time</th>
                      {/* Day headers */}
                      {weekDays.map((day, index) => {
                        const isToday = isSameDay(day, today)
                        const dayName = format(day, "EEE")
                        const dayNumber = format(day, "dd")

                        return (
                          <th
                            key={format(day, "yyyy-MM-dd")}
                            className={`text-center p-2 font-medium ${isToday ? "bg-[#FFA500]/5 rounded-t" : ""}`}
                          >
                            <div className="text-black">{dayName}</div>
                            <div className={`${isToday ? "text-[#FFA500] font-bold" : "text-black"}`}>{dayNumber}</div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Time slots */}
                    {timeSlots.map((slot, timeIndex) => (
                      <tr key={slot}>
                        <td className="p-2 border border-gray-200 font-medium text-gray-500">{slot}</td>
                        {weekDays.map((day, dayIndex) => {
                          const isToday = isSameDay(day, today)
                          const isSelected = isTimeBlockSelected(dayIndex, timeIndex)

                          return (
                            <td
                              key={`${format(day, "yyyy-MM-dd")}-${slot}`}
                              className={`border border-gray-200 p-0 text-center cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-[#FFA500] hover:bg-[#FFA500]/90"
                                  : isToday
                                    ? "bg-[#FFA500]/5 hover:bg-[#FFA500]/10"
                                    : "bg-white hover:bg-gray-50"
                              }`}
                              onClick={() => handleTimeBlockClick(dayIndex, timeIndex)}
                            >
                              <div className="py-3 px-2">
                                <span className={`text-xs ${isSelected ? "text-white font-medium" : "text-black"}`}>
                                  &nbsp;
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

              {selectedTimeBlocks.length > 0 && (
                <div className="mt-4 p-3 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-medium text-black mb-2">Selected Time Blocks:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTimeBlocks.map((block, index) => {
                      const [dateStr, timeBlock] = block.split("|")
                      const [dayStr, timeSlot] = timeBlock ? timeBlock.split("-") : ["", ""]
                      const formattedDate = dateStr ? format(new Date(dateStr), "MMM dd") : ""

                      return (
                        <div key={index} className="bg-[#FFA500] text-white text-xs px-2 py-1 rounded">
                          {formattedDate}: {timeSlot}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between gap-2 sticky bottom-0 bg-white shadow-md z-10">
          {step === "timeblock" && (
            <Button
              variant="outline"
              onClick={() => setStep("property")}
              className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500]/5"
            >
              Back
            </Button>
          )}
          <div className="flex-1"></div>
          <Button variant="outline" onClick={onClose} className="border-black text-black hover:bg-black/5">
            Cancel
          </Button>
          <Button
            className="bg-[#FFA500] text-white hover:bg-[#FFA500]/90"
            onClick={handleNextStep}
            disabled={
              (step === "property" && !selectedProperty) || (step === "timeblock" && selectedTimeBlocks.length === 0)
            }
          >
            {step === "timeblock" ? "Confirm" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}
