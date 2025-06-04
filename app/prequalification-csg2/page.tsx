"use client"

import { PrequalificationCSG2Wizard } from "@/components/prequalification-csg2-wizard"
import { TooltipProvider } from "@/components/ui/tooltip"
import "../prequalification-csg1/prequalification.css"

export default function PrequalificationCSG2Page() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="container mx-auto">
          <PrequalificationCSG2Wizard />
        </div>
      </div>
    </TooltipProvider>
  )
}
