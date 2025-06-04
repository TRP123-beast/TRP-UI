"use client"

import { X, RefreshCw, CalendarIcon, Grid3X3, Grid2X2, AlignJustify } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CalendarSidebarProps {
  onClose: () => void
  onViewTypeChange: (type: "month" | "week" | "day" | "3days" | "schedule") => void
  currentViewType: "month" | "week" | "day" | "3days" | "schedule"
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function CalendarSidebar({
  onClose,
  onViewTypeChange,
  currentViewType,
  onRefresh,
  isRefreshing,
}: CalendarSidebarProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-start">
      <div className="w-80 h-full bg-white text-[#000000] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-medium text-[#000000]">Showing Calendar</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:text-[#FFA500] hover:bg-[#FFA500]/10 active:text-[#FFA500] focus:text-[#FFA500] transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* View Type Options */}
          <div className="space-y-2">
            <button
              className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
                currentViewType === "schedule"
                  ? "bg-[#FFA500]/20 text-[#FFA500] font-medium border-l-2 border-[#FFA500]"
                  : "hover:bg-[#FFA500]/10 hover:text-[#FFA500] hover:border-l-2 hover:border-[#FFA500]/50"
              }`}
              onClick={() => onViewTypeChange("schedule")}
            >
              <AlignJustify className="h-5 w-5" />
              <span>Schedule</span>
            </button>

            <button
              className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
                currentViewType === "day"
                  ? "bg-[#FFA500]/20 text-[#FFA500] font-medium border-l-2 border-[#FFA500]"
                  : "hover:bg-[#FFA500]/10 hover:text-[#FFA500] hover:border-l-2 hover:border-[#FFA500]/50"
              }`}
              onClick={() => onViewTypeChange("day")}
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Day</span>
            </button>

            <button
              className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
                currentViewType === "3days"
                  ? "bg-[#FFA500]/20 text-[#FFA500] font-medium border-l-2 border-[#FFA500]"
                  : "hover:bg-[#FFA500]/10 hover:text-[#FFA500] hover:border-l-2 hover:border-[#FFA500]/50"
              }`}
              onClick={() => onViewTypeChange("3days")}
            >
              <Grid2X2 className="h-5 w-5" />
              <span>3 days</span>
            </button>

            <button
              className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
                currentViewType === "week"
                  ? "bg-[#FFA500]/20 text-[#FFA500] font-medium border-l-2 border-[#FFA500]"
                  : "hover:bg-[#FFA500]/10 hover:text-[#FFA500] hover:border-l-2 hover:border-[#FFA500]/50"
              }`}
              onClick={() => onViewTypeChange("week")}
            >
              <Grid3X3 className="h-5 w-5" />
              <span>Week</span>
            </button>

            <button
              className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
                currentViewType === "month"
                  ? "bg-[#FFA500]/20 text-[#FFA500] font-medium border-l-2 border-[#FFA500]"
                  : "hover:bg-[#FFA500]/10 hover:text-[#FFA500] hover:border-l-2 hover:border-[#FFA500]/50"
              }`}
              onClick={() => onViewTypeChange("month")}
            >
              <Grid3X3 className="h-5 w-5" />
              <span>Month</span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <button
              className={`w-full flex items-center gap-3 p-3 rounded-md transition-all hover:bg-[#FFA500]/10 hover:text-[#FFA500] ${isRefreshing ? "opacity-50" : ""}`}
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
