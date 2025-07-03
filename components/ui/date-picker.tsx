import * as React from "react"
import { cn } from "@/lib/utils"

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(({ className, ...props }, ref) => {
  // Log props to help debug issues
  console.log("DatePicker props:", { ...props })

  return (
    <input
      type="date"
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 font-quicksand",
        className,
      )}
      ref={ref}
      autoComplete="off" // Prevent browser autocomplete from interfering
      {...props}
    />
  )
})
DatePicker.displayName = "DatePicker"

export { DatePicker }
