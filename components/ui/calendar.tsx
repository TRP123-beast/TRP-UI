"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalendarProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
  initialFocus?: boolean
  showOutsideDays?: boolean
  classNames?: Record<string, string>
  [key: string]: any
}

function Calendar({ className, selected, onSelect, disabled = false, ...props }: CalendarProps) {
  // Local state to manage the input value
  const [inputValue, setInputValue] = React.useState(
    selected instanceof Date ? selected.toISOString().split("T")[0] : "",
  )

  // Handle date change from input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value) // Update local state immediately

    if (!onSelect) return

    if (!value) {
      onSelect(undefined)
      return
    }

    const newDate = new Date(value)
    // Check if valid date
    if (!isNaN(newDate.getTime())) {
      onSelect(newDate)
    } else {
      // Optionally reset to last valid date if invalid
      setInputValue(selected instanceof Date ? selected.toISOString().split("T")[0] : "")
    }
  }

  // Sync inputValue with selected prop if it changes externally
  React.useEffect(() => {
    if (selected instanceof Date) {
      setInputValue(selected.toISOString().split("T")[0])
    } else if (!selected) {
      setInputValue("")
    }
  }, [selected])

  return (
    <div className={cn("calendar-wrapper", className)}>
      <input
        type="date"
        value={inputValue}
        onChange={handleDateChange}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
