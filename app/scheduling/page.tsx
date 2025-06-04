"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, X, Calendar, Clock, Info, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"

export default function SchedulingPage() {
  const router = useRouter()
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartBlock, setDragStartBlock] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [currentWeek, setCurrentWeek] = useState<string>("Apr 07 - Apr 13")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 3, 1)) // April 2025
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Mock days of the week
  const days = [
    { day: "Mon", date: "07" },
    { day: "Tue", date: "08" },
    { day: "Wed", date: "09" },
    { day: "Thu", date: "10" },
    { day: "Fri", date: "11" },
    { day: "Sat", date: "12" },
    { day: "Sun", date: "13" },
  ]

  // Mock time slots
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

  // Pre-selected time blocks (for demo purposes)
  const preSelectedBlocks = ["Thu-10-9 - 10 AM", "Thu-10-10 - 11 AM", "Fri-11-1 - 2 PM", "Fri-11-2 - 3 PM"]

  // Initialize selected blocks with pre-selected ones
  useEffect(() => {
    setSelectedTimeBlocks(preSelectedBlocks)
  }, [])

  const handleTimeBlockClick = (dayIndex: number, timeIndex: number) => {
    const day = days[dayIndex]
    const time = timeSlots[timeIndex]
    const blockId = `${day.day}-${day.date}-${time}`

    if (selectedTimeBlocks.includes(blockId)) {
      setSelectedTimeBlocks(selectedTimeBlocks.filter((id) => id !== blockId))
    } else {
      setSelectedTimeBlocks([...selectedTimeBlocks, blockId])
    }
  }

  const handleSaveAvailability = () => {
    // Show confirmation screen
    setShowConfirmation(true)
  }

  const handleConfirmAvailability = () => {
    // Show loading state
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Navigate after showing success
      setTimeout(() => {
        router.push("/showings?tab=pending")
      }, 1500)
    }, 2000)
  }

  const navigateToPreviousWeek = () => {
    setCurrentWeek("Mar 31 - Apr 06")
  }

  const navigateToNextWeek = () => {
    setCurrentWeek("Apr 14 - Apr 20")
  }

  const handleExitPage = () => {
    router.push("/")
  }

  const handleBack = () => {
    setShowConfirmation(false)
  }

  const handleCancel = () => {
    router.push("/")
  }

  const navigateToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const navigateToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() || 7 // Convert Sunday (0) to 7 for easier calculation

    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 1; i < startingDayOfWeek; i++) {
      calendarDays.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i)
    }

    return calendarDays
  }

  const calendarDays = generateCalendarDays()
  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={handleExitPage} className="p-2 -ml-2 text-gray-700" aria-label="Exit page">
            <X className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {showConfirmation ? "Confirm Availability" : "Select Availability"}
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TRP%20Logo-3ydAc5tBUCO0lbj7kiIrCEoYebKQVt.png"
            alt="The Rental Project Logo"
            width={120}
            height={40}
            className="h-9 w-auto"
          />
        </div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {!showConfirmation && (
        <div className="px-4 pt-4 pb-2">
          <p className="text-black text-sm">
            Select your available time slots for property showings. Click on multiple time slots to indicate when you're
            available.
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {showConfirmation ? (
          <div className="p-4">
            {/* Calendar Navigation */}
            <div className="border rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 h-9 w-9 p-0"
                  onClick={navigateToPreviousMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="font-medium text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4 text-[#FF5A5F]" />
                    <span>
                      {monthName} {year}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 h-9 w-9 p-0"
                  onClick={navigateToNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        h-9 flex items-center justify-center text-sm rounded-full
                        ${day === null ? "invisible" : "cursor-pointer"}
                        ${day === 10 || day === 11 ? "bg-[#FF5A5F] text-white" : "hover:bg-gray-100"}
                      `}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-medium text-gray-800 text-center flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-[#FF5A5F]" />
                  <span>Your Selected Availability</span>
                </h2>
              </div>

              <div className="space-y-6 p-6">
                {days.map((day, dayIndex) => {
                  const dayTimeBlocks = selectedTimeBlocks.filter((block) => block.startsWith(`${day.day}-${day.date}`))

                  if (dayTimeBlocks.length === 0) return null

                  return (
                    <div key={`${day.day}-${day.date}`} className="border rounded-lg shadow-sm p-4 bg-white">
                      <div className="flex items-center gap-4 mb-3 border-b pb-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-500">{day.day}</div>
                            <div className="text-lg font-bold text-gray-800">{day.date}</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">Available for showings</h3>
                          <p className="text-xs text-gray-500">April {day.date}, 2025</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {dayTimeBlocks.map((block, blockIndex) => {
                          const time = block.split("-")[2]
                          const isFirst = blockIndex === 0

                          return (
                            <div
                              key={blockIndex}
                              className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                                isFirst ? "bg-[#FF5A5F] text-white" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <Clock className={`h-4 w-4 ${isFirst ? "text-white" : "text-gray-500"}`} />
                              <span className="text-sm font-medium">{time}</span>
                              {isFirst && (
                                <span className="text-xs ml-auto bg-white text-[#FF5A5F] px-2 py-0.5 rounded-full">
                                  Showing
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-between">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  disabled={isSubmitting || isSuccess}
                  className={`
                    flex items-center gap-2 transition-colors
                    ${
                      isSuccess
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 active:bg-[#FF5A5F] active:text-white active:border-[#FF5A5F]"
                    }
                  `}
                  onClick={handleConfirmAvailability}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirmed!</span>
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-200 rounded-lg p-5 mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold text-gray-800 mb-2">Important Information</h2>
                  <p className="text-gray-700 text-sm">
                    Your selected time slots will be used to schedule showings for the properties in your cart. Property
                    owners will be notified of your availability and will confirm specific showing times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 h-9 w-9 p-0"
                  onClick={navigateToPreviousWeek}
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="font-medium">{currentWeek}</div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 h-9 w-9 p-0"
                  onClick={navigateToNextWeek}
                  aria-label="Next week"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-gray-500">Time</th>
                      {days.map((day) => (
                        <th key={day.day} className="p-3 text-center">
                          <div className="font-medium">{day.day}</div>
                          <div className="text-lg font-bold">{day.date}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot, timeIndex) => (
                      <tr key={timeSlot} className="border-t border-gray-200">
                        <td className="p-3 text-sm text-gray-500">{timeSlot}</td>
                        {days.map((day, dayIndex) => {
                          const blockId = `${day.day}-${day.date}-${timeSlot}`
                          const isSelected = selectedTimeBlocks.includes(blockId)

                          return (
                            <td
                              key={`${day.day}-${timeSlot}`}
                              className="border-l border-gray-200 p-0"
                              onClick={() => handleTimeBlockClick(dayIndex, timeIndex)}
                            >
                              <div
                                className={`w-full h-full p-3 cursor-pointer transition-colors ${
                                  isSelected ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-100"
                                }`}
                              >
                                {isSelected && (
                                  <div className="flex justify-center items-center h-full">
                                    <div className="w-3 h-3 bg-[#FF5A5F] rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-between">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-[#FF5A5F] active:text-white active:border-[#FF5A5F] transition-colors"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 active:bg-[#FF5A5F] active:text-white active:border-[#FF5A5F] transition-colors"
                  onClick={handleSaveAvailability}
                >
                  Save Availability
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav cartItems={cartItems} />
    </div>
  )
}
