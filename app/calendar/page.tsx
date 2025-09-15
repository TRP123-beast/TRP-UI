"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, X, Calendar, Clock, Info, CheckCircle, Loader2, ChevronDown, RotateCcw } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { insertUserSchedules, type ScheduleData } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function CalendarPage() {
  const router = useRouter()
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // New state for year, month, and date selection
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const [selectedMonth, setSelectedMonth] = useState<number>(3) // April (0-indexed)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Time slots for the selected date
  const timeSlots = [
    "8:00 - 9:00 AM",
    "9:00 - 10:00 AM", 
    "10:00 - 11:00 AM",
    "11:00 - 12:00 PM",
    "12:00 - 1:00 PM",
    "1:00 - 2:00 PM",
    "2:00 - 3:00 PM",
    "3:00 - 4:00 PM",
    "4:00 - 5:00 PM",
    "5:00 - 6:00 PM",
    "6:00 - 7:00 PM",
    "7:00 - 8:00 PM",
  ]

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Generate years for dropdown (current year ± 5 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  // Initialize with current date
  useEffect(() => {
    const now = new Date()
    setSelectedYear(now.getFullYear())
    setSelectedMonth(now.getMonth())
    setSelectedDate(now.getDate())
  }, [])

  const handleTimeSlotClick = (timeSlot: string) => {
    console.log('🖱️ Time slot clicked:', timeSlot)
    console.log('📅 Current selected date:', selectedDate)
    console.log('📅 Current selected year:', selectedYear)
    console.log('📅 Current selected month:', selectedMonth)
    
    if (!selectedDate) {
      console.log('❌ No date selected, ignoring click')
      return
    }
    
    const blockId = `${selectedYear}-${selectedMonth + 1}-${selectedDate}-${timeSlot}`
    console.log('🆔 Generated block ID:', blockId)
    console.log('📋 Current time blocks:', selectedTimeBlocks)

    if (selectedTimeBlocks.includes(blockId)) {
      const newBlocks = selectedTimeBlocks.filter((id) => id !== blockId)
      console.log('➖ Removed block, new array:', newBlocks)
      setSelectedTimeBlocks(newBlocks)
    } else {
      const newBlocks = [...selectedTimeBlocks, blockId]
      console.log('➕ Added block, new array:', newBlocks)
      setSelectedTimeBlocks(newBlocks)
    }
  }

  const handleDateSelect = (date: number) => {
    setSelectedDate(date)
  }

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month)
    setSelectedDate(null) // Reset selected date when month changes
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    setSelectedDate(null) // Reset selected date when year changes
  }

  const handleSaveAvailability = () => {
    // Show confirmation screen
    setShowConfirmation(true)
  }

  const handleConfirmAvailability = async () => {
    console.log('🎯 Starting handleConfirmAvailability...')
    console.log('📅 Selected Date:', selectedDate)
    console.log('📅 Selected Year:', selectedYear)
    console.log('📅 Selected Month:', selectedMonth)
    console.log('⏰ Selected Time Blocks:', selectedTimeBlocks)
    
    // Validate selected date
    if (!validateSelectedDate()) {
      console.log('❌ Date validation failed - date is in the past')
      toast({
        title: "Invalid Date",
        description: "You cannot schedule for dates in the past. Please select a future date.",
        variant: "destructive"
      })
      return
    }

    // Validate time slots selected
    if (selectedTimeBlocks.length === 0) {
      console.log('❌ No time slots selected')
      toast({
        title: "No Time Slots Selected",
        description: "Please select at least one time slot before updating your schedule.",
        variant: "destructive"
      })
      return
    }

    console.log('✅ Validation passed, proceeding with API call...')
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const schedules = convertTimeSlotsToSchedules()
      console.log('🔄 Converted schedules:', schedules)
      
      if (schedules.length === 0) {
        throw new Error('No time slots selected')
      }

      console.log('📤 Calling insertUserSchedules API...')
      const result = await insertUserSchedules(schedules)
      console.log('📥 API Result:', result)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update schedule')
      }

      console.log('✅ API call successful!')
      // Show success
      setIsSuccess(true)
      setShowSuccessDialog(true)
      
      // Show success toast
      toast({
        title: "Schedule Updated Successfully",
        description: `Your schedule has been updated with ${schedules.length} time slot(s).`,
      })

      // Clear selected time slots
      setSelectedTimeBlocks([])
      
    } catch (error) {
      console.error('💥 Error updating schedule:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update schedule'
      setSubmitError(errorMessage)
      
      toast({
        title: "Error Updating Schedule",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
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

  const handleRefresh = () => {
    setSelectedTimeBlocks([])
  }

  // Convert time slots to API format
  const convertTimeSlotsToSchedules = (): ScheduleData[] => {
    console.log('🔄 Converting time slots to schedules...')
    console.log('📅 Selected Date:', selectedDate)
    console.log('📅 Selected Year:', selectedYear)
    console.log('📅 Selected Month:', selectedMonth)
    console.log('⏰ Selected Time Blocks:', selectedTimeBlocks)
    
    if (!selectedDate) {
      console.log('❌ No selected date, returning empty array')
      return []
    }
    
    const schedules = selectedTimeBlocks.map(block => {
      console.log('🔍 Processing block:', block)
      const [year, month, date, timeSlot] = block.split('-')
      const [startTime, endTime] = timeSlot.split(' - ')
      
      const schedule = {
        profile_id: "03f57cc0-c8c0-463a-bc52-a2b091d4d4a6", // Hardcoded for now
        schedule_date: `${year}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`,
        start_time: startTime,
        end_time: endTime
      }
      
      console.log('✅ Converted to schedule:', schedule)
      return schedule
    })
    
    console.log('📦 Final schedules array:', schedules)
    return schedules
  }

  // Validate selected date is not in the past
  const validateSelectedDate = (): boolean => {
    if (!selectedDate) return false
    
    const selectedDateTime = new Date(selectedYear, selectedMonth, selectedDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    
    return selectedDateTime >= today
  }

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1)
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0)

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
  const monthName = monthNames[selectedMonth]
  const selectedDateFormatted = selectedDate ? `${monthName} ${selectedDate}, ${selectedYear}` : "Select a date"

  return (
    <div className="flex h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleExitPage} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full" aria-label="Exit page">
              <X className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {showConfirmation ? "Confirm Schedule" : "Schedule for Showings"}
            </span>
          </div>
        </div>
      </div>

      {/* Left Sidebar - Month and Date Selection */}
      <div className={`fixed left-0 top-16 bottom-0 w-80 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 z-10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 h-full overflow-y-auto">
          {/* Month Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Month</h3>
            <div className="grid grid-cols-3 gap-2">
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthChange(index)}
                  className={`p-2 text-xs rounded-md transition-colors ${
                    selectedMonth === index
                      ? 'bg-[#FFA500] text-black'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{monthName} {selectedYear}</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div key={`day-${index}`} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day}
                    className={`
                      p-2 text-sm transition-colors
                      ${!day ? 'bg-gray-50' : ''}
                      ${day && selectedDate === day
                        ? 'bg-[#FFA500] text-black'
                        : day
                        ? 'bg-white text-gray-700 hover:bg-gray-100'
                        : ''
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Date Info */}
          {selectedDate && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Date</h4>
              <p className="text-lg font-semibold text-[#FFA500]">{selectedDateFormatted}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedTimeBlocks.filter(block => block.includes(`${selectedYear}-${selectedMonth + 1}-${selectedDate}`)).length} time slots selected
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Time Selection */}
      <div className="flex-1 ml-0 lg:ml-80 pt-16">
        {!showConfirmation ? (
          <div className="h-full flex flex-col">
            {/* Time Selection Header */}
            <div className="p-6 border-b border-gray-200">
              {/* Error Display */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {selectedDate ? `Select Time Slots for ${selectedDateFormatted}` : "Select a Date First"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedDate 
                      ? "Click on time slots to indicate when you're available for property showings."
                      : "Choose a date from the sidebar to select your available time slots."
                    }
                  </p>
                </div>
                
                {/* Year Selection Dropdown - Center */}
                <div className="flex items-center gap-2 mx-8">
                  <Calendar className="h-4 w-4 text-[#FFA500]" />
                  <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
                    <SelectTrigger className="w-24 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Refresh Icon - Right */}
                {selectedDate && selectedTimeBlocks.length > 0 && (
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={handleRefresh}
                      className="p-2 text-gray-500 hover:text-[#FFA500] hover:bg-gray-100 rounded-full transition-colors"
                      title="Undo all selected time slots"
                      aria-label="Undo all selected time slots"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Time Slots Grid */}
            {selectedDate ? (
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {timeSlots.map((timeSlot) => {
                    const blockId = `${selectedYear}-${selectedMonth + 1}-${selectedDate}-${timeSlot}`
                    const isSelected = selectedTimeBlocks.includes(blockId)

                    return (
                      <button
                        key={timeSlot}
                        onClick={() => handleTimeSlotClick(timeSlot)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 text-left
                          ${isSelected
                            ? 'border-[#FFA500] bg-[#FFA500] text-black shadow-md'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#FFA500] hover:bg-[#FFA500]/5'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className={`h-5 w-5 ${isSelected ? 'text-black' : 'text-gray-400'}`} />
                          <span className="font-medium">{timeSlot}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No Date Selected</h3>
                  <p className="text-sm text-gray-400">Choose a date from the sidebar to select time slots</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#FFA500] text-black hover:bg-[#FFA500]/90"
                  onClick={handleSaveAvailability}
                  disabled={!selectedDate || selectedTimeBlocks.length === 0}
                >
                  Update Schedule ({selectedTimeBlocks.length})
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Confirm Your Availability</h2>
              <p className="text-sm text-gray-600">Review your selected time slots before confirming</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {selectedTimeBlocks.map((block, index) => {
                  const [year, month, date, timeSlot] = block.split('-')
                  const monthName = monthNames[parseInt(month) - 1]
                  
                  return (
                    <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FFA500] text-black rounded-full flex items-center justify-center text-sm font-bold">
                          {date}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{monthName} {date}, {year}</h3>
                          <p className="text-sm text-gray-500">{timeSlot}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  disabled={isSubmitting || isSuccess}
                  className={`
                    flex items-center gap-2 transition-colors
                    ${isSuccess
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-[#FFA500] text-black hover:bg-[#FFA500]/90"
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
                    "Update Schedule"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav cartItems={cartItems} />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Schedule Updated Successfully
            </DialogTitle>
            <DialogDescription>
              Your schedule has been updated successfully. You can continue selecting more time slots or close this dialog.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-[#FFA500] text-black hover:bg-[#FFA500]/90"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
