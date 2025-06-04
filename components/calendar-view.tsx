"use client"
import { format, parseISO, isSameDay, addDays, startOfWeek } from "date-fns"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Check, Bell } from "lucide-react"
import { useState } from "react"
import { CalendarEventPopup } from "@/components/calendar-event-popup"

interface CalendarViewProps {
  days: any[]
  events: any[]
  viewType: "month" | "week" | "day" | "3days" | "schedule"
  currentMonth: string
  currentYear: number
  currentDate: Date
  onEventClick?: (event: any) => void
  onDateChange?: (date: Date) => void
  onDeleteEvent?: (id: string) => void
  onShareEvent?: () => void
  onConfigureNotifications?: (event: any) => void
}

export function CalendarView({
  days,
  events,
  viewType,
  currentMonth,
  currentYear,
  currentDate,
  onEventClick,
  onDeleteEvent,
  onShareEvent,
  onConfigureNotifications,
}: CalendarViewProps) {
  // Get current date for highlighting today
  const today = new Date(2025, 3, 14) // April 14, 2025 (Mon)
  const currentDateObj = currentDate || today

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

  // Function to get events for a specific day
  const getEventsForDay = (day: number, month: number, year: number) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.date)
      return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year
    })
  }

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.date)
      return isSameDay(eventDate, date)
    })
  }

  // Group events by property for a specific day
  const getGroupedEventsForDay = (day: number, month: number, year: number) => {
    const dayEvents = getEventsForDay(day, month, year)

    // Group by property ID
    const groupedEvents = dayEvents.reduce(
      (acc, event) => {
        const propertyId = event.property?.id || "unknown"

        if (!acc[propertyId]) {
          acc[propertyId] = {
            property: event.property,
            events: [],
            color: event.color,
          }
        }

        acc[propertyId].events.push(event)

        return acc
      },
      {} as Record<string, { property: any; events: any[]; color: string }>,
    )

    return Object.values(groupedEvents)
  }

  // Group events by time for a specific date
  const getGroupedEventsByTime = (date: Date) => {
    const dateEvents = getEventsForDate(date)

    // Group by time
    const groupedEvents = dateEvents.reduce(
      (acc, event) => {
        const time = event.time.split(" - ")[0].trim()

        if (!acc[time]) {
          acc[time] = []
        }

        acc[time].push(event)

        return acc
      },
      {} as Record<string, any[]>,
    )

    return groupedEvents
  }

  // Function to get the hour from a time string like "10:00 am"
  const getHourFromTimeString = (timeString: string) => {
    const [hourStr, period] = timeString.split(":")[0].split(" ")
    let hour = Number.parseInt(hourStr)

    if (period && period.toLowerCase() === "pm" && hour < 12) {
      hour += 12
    } else if (period && period.toLowerCase() === "am" && hour === 12) {
      hour = 0
    }

    return hour
  }

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [showEventPopup, setShowEventPopup] = useState(false)

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setShowEventPopup(true)
    if (onEventClick) {
      onEventClick(event)
    }
  }

  const handleClosePopup = () => {
    setShowEventPopup(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (id: string) => {
    if (onDeleteEvent) {
      onDeleteEvent(id)
    }
    setShowEventPopup(false)
    setSelectedEvent(null)
  }

  const handleShareEvent = () => {
    if (onShareEvent) {
      onShareEvent()
    }
  }

  const handleConfigureNotifications = (event: any) => {
    if (onConfigureNotifications) {
      onConfigureNotifications(event)
    }
  }

  if (viewType === "day") {
    // Day view
    const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8am to 7pm
    const dayEvents = getGroupedEventsByTime(currentDateObj)

    return (
      <div className="flex flex-col h-full bg-white text-airbnb-hof">
        <div className="text-center py-4 border-b border-airbnb-cement">
          <div className="text-lg font-medium">{format(currentDateObj, "EEEE")}</div>
          <div className="text-3xl font-bold bg-white text-[#FFA500] border-2 border-[#FFA500] rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            {format(currentDateObj, "d")}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {hours.map((hour) => {
            const timeLabel = hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour} AM`

            const hourEvents = Object.entries(dayEvents).filter(([time]) => {
              const eventHour = getHourFromTimeString(time)
              return eventHour === hour
            })

            return (
              <div key={hour} className="flex border-b border-airbnb-cement">
                <div className="w-20 py-4 px-2 text-right text-airbnb-foggy font-medium border-r border-airbnb-cement">
                  {timeLabel}
                </div>
                <div className="flex-1 min-h-[80px] p-2 relative">
                  {hourEvents.map(([time, events]) =>
                    events.map((event, idx) => (
                      <div
                        key={`${event.id}-${idx}`}
                        className="absolute left-2 right-2 p-2 rounded-md mb-1 cursor-pointer border border-[#FFA500] bg-white hover:bg-[#FFA500]/5 hover:scale-[1.02] hover:shadow-md transition-all"
                        style={{
                          top: `${idx * 28}px`,
                          zIndex: 10 + idx,
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-1 text-[#FFA500]" />
                          <p className="font-medium text-[#000000] text-sm truncate">{event.title}</p>
                        </div>
                        <p className="text-xs text-[#000000] truncate">{event.time}</p>
                      </div>
                    )),
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {selectedEvent && showEventPopup && (
          <CalendarEventPopup
            event={selectedEvent}
            onClose={handleClosePopup}
            onDelete={handleDeleteEvent}
            onShare={handleShareEvent}
            onConfigureNotifications={() => handleConfigureNotifications(selectedEvent)}
          />
        )}
      </div>
    )
  } else if (viewType === "3days") {
    // 3-day view
    const daysToShow = 3
    const startDate = currentDateObj
    const weekDays = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i))
    const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8am to 7pm

    return (
      <div className="flex flex-col h-full bg-white text-airbnb-hof">
        {/* Day headers */}
        <div className="grid grid-cols-3 border-b border-airbnb-cement">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center py-4">
              <div className="text-sm font-medium">{format(day, "EEE")}</div>
              <div
                className={`text-xl font-bold w-10 h-10 flex items-center justify-center mx-auto rounded-full ${
                  isSameDay(day, today) ? "bg-[#FFA500] text-white" : ""
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Hour slots */}
        <div className="flex-1 overflow-y-auto">
          {hours.map((hour) => {
            const timeLabel = hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour} AM`

            return (
              <div key={hour} className="grid grid-cols-3 border-b border-airbnb-cement">
                <div className="col-span-3 grid grid-cols-3 relative">
                  <div className="absolute left-0 top-0 w-20 py-4 px-2 text-right text-airbnb-foggy font-medium border-r border-airbnb-cement">
                    {timeLabel}
                  </div>

                  {weekDays.map((day, dayIndex) => {
                    const dayEvents = getGroupedEventsByTime(day)
                    const hourEvents = Object.entries(dayEvents).filter(([time]) => {
                      const eventHour = getHourFromTimeString(time)
                      return eventHour === hour
                    })

                    return (
                      <div key={dayIndex} className="min-h-[80px] border-r border-airbnb-cement pl-20 p-2 relative">
                        {hourEvents.map(([time, events]) =>
                          events.map((event, idx) => (
                            <div
                              key={`${event.id}-${idx}`}
                              className="absolute left-2 right-2 p-2 rounded-md mb-1 cursor-pointer border border-[#FFA500] bg-white hover:bg-[#FFA500]/5 hover:scale-[1.02] hover:shadow-md transition-all"
                              style={{
                                top: `${idx * 28}px`,
                                zIndex: 10 + idx,
                                left: dayIndex === 0 ? "22px" : "2px",
                              }}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex items-center">
                                <Check className="h-4 w-4 mr-1 text-[#FFA500]" />
                                <p className="font-medium text-[#000000] text-sm truncate">{event.title}</p>
                              </div>
                              <p className="text-xs text-[#000000] truncate">{event.time}</p>
                            </div>
                          )),
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {selectedEvent && showEventPopup && (
          <CalendarEventPopup
            event={selectedEvent}
            onClose={handleClosePopup}
            onDelete={handleDeleteEvent}
            onShare={handleShareEvent}
            onConfigureNotifications={() => handleConfigureNotifications(selectedEvent)}
          />
        )}
      </div>
    )
  } else if (viewType === "week") {
    // Week view
    // Start from Sunday for this week
    const sunday = startOfWeek(currentDateObj)
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(sunday, i))
    const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8am to 7pm

    return (
      <div className="flex flex-col h-full bg-white text-airbnb-hof">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-airbnb-cement">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center py-4">
              <div className="text-sm font-medium">{format(day, "EEE")}</div>
              <div
                className={`text-xl font-bold w-10 h-10 flex items-center justify-center mx-auto rounded-full ${
                  isSameDay(day, today) ? "bg-[#FFA500] text-white" : ""
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Hour slots */}
        <div className="flex-1 overflow-y-auto">
          {hours.map((hour) => {
            const timeLabel = hour >= 12 ? `${hour === 12 ? 12 : hour - 12} PM` : `${hour} AM`

            return (
              <div key={hour} className="grid grid-cols-7 border-b border-airbnb-cement">
                <div className="col-span-7 grid grid-cols-7 relative">
                  <div className="absolute left-0 top-0 w-16 py-4 px-2 text-right text-airbnb-foggy font-medium border-r border-airbnb-cement">
                    {timeLabel}
                  </div>

                  {weekDays.map((day, dayIndex) => {
                    const dayEvents = getGroupedEventsByTime(day)
                    const hourEvents = Object.entries(dayEvents).filter(([time]) => {
                      const eventHour = getHourFromTimeString(time)
                      return eventHour === hour
                    })

                    return (
                      <div key={dayIndex} className="min-h-[80px] border-r border-airbnb-cement pl-16 p-2 relative">
                        {dayIndex === 0 && (
                          <div className="absolute left-0 top-0 w-16 py-4 px-2 text-right text-airbnb-foggy font-medium border-r border-airbnb-cement">
                            {timeLabel}
                          </div>
                        )}

                        {hourEvents.map(([time, events]) =>
                          events.map((event, idx) => (
                            <div
                              key={`${event.id}-${idx}`}
                              className="absolute left-2 right-2 p-1 rounded-md mb-1 cursor-pointer border border-[#FFA500] bg-white hover:bg-[#FFA500]/5 hover:scale-[1.02] hover:shadow-md transition-all"
                              style={{
                                top: `${idx * 24}px`,
                                zIndex: 10 + idx,
                                left: dayIndex === 0 ? "18px" : "2px",
                              }}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex items-center">
                                <Check className="h-3 w-3 mr-1 text-[#FFA500]" />
                                <p className="font-medium text-[#000000] text-xs truncate">{event.title}</p>
                              </div>
                            </div>
                          )),
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {selectedEvent && showEventPopup && (
          <CalendarEventPopup
            event={selectedEvent}
            onClose={handleClosePopup}
            onDelete={handleDeleteEvent}
            onShare={handleShareEvent}
            onConfigureNotifications={() => handleConfigureNotifications(selectedEvent)}
          />
        )}
      </div>
    )
  } else if (viewType === "month") {
    // Month view (default)
    return (
      <TooltipProvider>
        <div className="grid grid-cols-7 auto-rows-fr bg-white text-airbnb-hof">
          {days.map((day, index) => {
            const isToday =
              day.day === today.getDate() && day.month === today.getMonth() && day.year === today.getFullYear()

            const groupedEvents = getGroupedEventsForDay(day.day, day.month, day.year)

            return (
              <div
                key={index}
                className={`border-b border-r border-airbnb-cement min-h-[100px] p-1 ${
                  day.isCurrentMonth ? "opacity-100" : "opacity-40"
                } ${isToday ? "bg-[#FFA500]/15 border-2 border-[#FFA500]" : ""}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div
                    className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${
                      isToday ? "bg-[#FFA500] text-white font-bold" : ""
                    }`}
                  >
                    {day.day}
                  </div>
                </div>

                <div className="space-y-1">
                  {groupedEvents.map((group, groupIndex) => (
                    <Tooltip key={groupIndex}>
                      <TooltipTrigger asChild>
                        <div
                          className="text-xs p-1.5 rounded-md truncate cursor-pointer border border-[#FFA500] bg-white hover:bg-[#FFA500]/5 hover:shadow-md transition-all"
                          onClick={() => handleEventClick(group.events[0])}
                        >
                          <span className="text-[#000000] font-medium">
                            {group.property?.name || "Property"}
                            {group.events.length > 1 ? ` (${group.events.length})` : ""}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white p-3 shadow-lg border border-gray-200">
                        <div className="max-w-[200px]">
                          <p className="font-medium text-[#000000]">{group.property?.name || "Property"}</p>
                          <p className="text-xs text-gray-600 break-words">{group.events[0].address}</p>
                          <p className="text-xs text-[#FFA500] font-medium mt-1">{group.events[0].time}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {selectedEvent && showEventPopup && (
          <CalendarEventPopup
            event={selectedEvent}
            onClose={handleClosePopup}
            onDelete={handleDeleteEvent}
            onShare={handleShareEvent}
            onConfigureNotifications={() => handleConfigureNotifications(selectedEvent)}
          />
        )}
      </TooltipProvider>
    )
  } else if (viewType === "schedule") {
    // Schedule view (list of events)
    // Group events by date
    const eventsByDate = events.reduce(
      (acc, event) => {
        const dateStr = event.date
        if (!acc[dateStr]) {
          acc[dateStr] = []
        }
        acc[dateStr].push(event)
        return acc
      },
      {} as Record<string, any[]>,
    )

    // Sort dates
    const sortedDates = Object.keys(eventsByDate).sort()

    // Group dates by week
    const weekGroups: Record<string, { dates: string[]; label: string }> = {}

    sortedDates.forEach((dateStr) => {
      const date = parseISO(dateStr)
      const weekStart = startOfWeek(date, { weekStartsOn: 0 }) // Start week on Sunday
      const weekEnd = addDays(weekStart, 6)
      const weekKey = format(weekStart, "yyyy-MM-dd")

      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = {
          dates: [],
          label: `${format(weekStart, "MMM d")} – ${format(weekEnd, "d")}`,
        }
      }

      weekGroups[weekKey].dates.push(dateStr)
    })

    return (
      <div className="p-4 bg-white text-airbnb-hof">
        <h2 className="text-xl font-bold mb-4">Scheduled Showings</h2>

        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-airbnb-foggy">No scheduled showings</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(weekGroups).map(([weekKey, weekData]) => (
              <div key={weekKey} className="space-y-4">
                <h3 className="text-sm font-medium text-airbnb-foggy mt-6 mb-2">{weekData.label}</h3>

                {weekData.dates.map((dateStr) => (
                  <div key={dateStr} className="space-y-2">
                    <div className="flex items-start">
                      <div className="w-16 text-center mr-4">
                        <div className="text-sm text-airbnb-foggy">{format(parseISO(dateStr), "EEE")}</div>
                        <div className="text-2xl font-bold text-[#FFA500]">{format(parseISO(dateStr), "d")}</div>
                      </div>

                      <div className="flex-1 space-y-2">
                        {eventsByDate[dateStr].map((event, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-[#FFA500]/10 cursor-pointer hover:bg-[#FFA500]/20 transition-colors"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-[#FFA500]" />
                              <div>
                                <p className="font-medium text-[#000000]">{event.title}</p>
                                <p className="text-sm text-gray-600">{event.time}</p>
                              </div>
                              <Bell className="h-4 w-4 ml-auto text-[#FFA500]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {selectedEvent && showEventPopup && (
          <CalendarEventPopup
            event={selectedEvent}
            onClose={handleClosePopup}
            onDelete={handleDeleteEvent}
            onShare={handleShareEvent}
            onConfigureNotifications={() => handleConfigureNotifications(selectedEvent)}
          />
        )}
      </div>
    )
  }

  // Fallback
  return <div className="p-4 text-center text-airbnb-foggy">Select a view type from the sidebar</div>
}
