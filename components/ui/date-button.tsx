"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Calendar } from "./calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface DateButtonProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateButton({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
}: DateButtonProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [open, setOpen] = React.useState(false)

  // Update internal state when external value changes
  React.useEffect(() => {
    setDate(value)
  }, [value])

  // Handle date selection
  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (onChange) onChange(newDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
