"use client"

import { LS3WorkflowTester } from "@/components/ls3-workflow-tester"

export default function LS3TestingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <LS3WorkflowTester />
      </div>
    </div>
  )
}
