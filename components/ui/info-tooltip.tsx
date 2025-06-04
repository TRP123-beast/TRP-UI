"use client"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface InfoTooltipProps {
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

export function InfoTooltip({ content, side = "right" }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-help ml-2" />
        </TooltipTrigger>
        <TooltipContent side={side}>
          <div className="text-sm max-w-xs p-2 bg-white border border-gray-200 rounded shadow-lg">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

import * as React from "react"

const TooltipContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)

  return <TooltipContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</TooltipContext.Provider>
}
