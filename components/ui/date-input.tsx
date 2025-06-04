"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
}

export function DateInput({ value, onChange, className, ...props }: DateInputProps) {
  // Convert date to string format for input
  const dateString = value instanceof Date ? value.toISOString().split("T")[0] : ""

  // Handle date change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (!newValue) {
      onChange?.(undefined)
      return
    }

    const newDate = new Date(newValue)
    if (!isNaN(newDate.getTime())) {
      onChange?.(newDate)
    }
  }

  return (
    <input
      type="date"
      value={dateString}
      onChange={handleChange}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
