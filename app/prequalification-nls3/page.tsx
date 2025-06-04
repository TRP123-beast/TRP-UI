"use client"

import { PrequalificationNLS3Wizard } from "@/components/prequalification-nls3-wizard"
import "./prequalification.css"

export default function PrequalificationNLS3Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Non-Leaseholder Pre-Qualification</h1>
      <PrequalificationNLS3Wizard />
    </div>
  )
}
