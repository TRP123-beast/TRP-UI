"use client"

import { useState } from "react"
import { Calendar, LayoutGrid, Layers } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface CalendarViewToggleProps {
  currentView: "day" | "3days" | "week" | "month" | "schedule"
  onViewChange: (view: "day" | "3days" | "week" | "month" | "schedule") => void
}

export function CalendarViewToggle({ currentView, onViewChange }: CalendarViewToggleProps) {
  const [open, setOpen] = useState(false)

  const getViewIcon = () => {
    switch (currentView) {
      case "day":
        return <Calendar className="h-5 w-5" />
      case "3days":
        return <Layers className="h-5 w-5" />
      case "week":
        return <LayoutGrid className="h-5 w-5" />
      case "month":
        return <Calendar className="h-5 w-5" />
      case "schedule":
        return <Calendar className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getViewLabel = () => {
    switch (currentView) {
      case "day":
        return "Day"
      case "3days":
        return "3 Days"
      case "week":
        return "Week"
      case "month":
        return "Month"
      case "schedule":
        return "Schedule"
      default:
        return "View"
    }
  }

  return (
    <TooltipProvider>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-[#000000] border-gray-300 hover:bg-[#FFA500]/10 hover:text-[#FFA500] hover:border-[#FFA500] transition-colors shadow-sm"
              >
                {getViewIcon()}
                <span className="ml-2">{getViewLabel()}</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Change calendar view</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-40 bg-white border border-gray-200 shadow-lg">
          <DropdownMenuItem
            className={
              currentView === "day"
                ? "!bg-[#FFA500]/20 !text-[#FFA500] font-medium"
                : "hover:!bg-[#FFA500]/10 hover:!text-[#FFA500]"
            }
            onClick={() => {
              onViewChange("day")
              setOpen(false)
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Day</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={
              currentView === "3days"
                ? "!bg-[#FFA500]/20 !text-[#FFA500] font-medium"
                : "hover:!bg-[#FFA500]/10 hover:!text-[#FFA500]"
            }
            onClick={() => {
              onViewChange("3days")
              setOpen(false)
            }}
          >
            <Layers className="mr-2 h-4 w-4" />
            <span>3 Days</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={
              currentView === "week"
                ? "!bg-[#FFA500]/20 !text-[#FFA500] font-medium"
                : "hover:!bg-[#FFA500]/10 hover:!text-[#FFA500]"
            }
            onClick={() => {
              onViewChange("week")
              setOpen(false)
            }}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Week</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={
              currentView === "month"
                ? "!bg-[#FFA500]/20 !text-[#FFA500] font-medium"
                : "hover:!bg-[#FFA500]/10 hover:!text-[#FFA500]"
            }
            onClick={() => {
              onViewChange("month")
              setOpen(false)
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Month</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={
              currentView === "schedule"
                ? "!bg-[#FFA500]/20 !text-[#FFA500] font-medium"
                : "hover:!bg-[#FFA500]/10 hover:!text-[#FFA500]"
            }
            onClick={() => {
              onViewChange("schedule")
              setOpen(false)
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Schedule</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
