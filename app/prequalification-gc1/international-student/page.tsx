"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function InternationalStudentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isInternationalStudent, setIsInternationalStudent] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get the ET_LS flag from the URL
  const etLsFlag = searchParams.get("flag")

  // Get the corresponding MI_LS code
  const miLsCode = etLsFlag?.replace("ET_", "MI_")

  const handleSubmit = () => {
    if (isInternationalStudent === null) return

    setIsSubmitting(true)

    // If they are an international student, set FLAG21
    if (isInternationalStudent) {
      console.log("Setting FLAG21: International Student")
      // In a real app, you would save this flag to your state management or database
      localStorage.setItem("FLAG21", "true")
    } else {
      localStorage.removeItem("FLAG21")
    }

    // Redirect to the corresponding MI_LS page
    if (miLsCode) {
      router.push(`/prequalification-gc1/${miLsCode}`)
    } else {
      // Fallback to dashboard if no flag is provided
      router.push("/")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-sm border p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Pre-Qualification</span>
          <span className="text-sm font-medium">90% Complete</span>
        </div>
        <Progress value={90} className="h-2 bg-gray-200" indicatorClassName="bg-orange-500" />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-black">International Student Status</h2>
        <p className="text-gray-600">Are you an international student?</p>

        <RadioGroup
          value={isInternationalStudent === null ? undefined : isInternationalStudent.toString()}
          onValueChange={(value) => setIsInternationalStudent(value === "true")}
        >
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="true" id="international-yes" />
            <Label htmlFor="international-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="international-no" />
            <Label htmlFor="international-no">No</Label>
          </div>
        </RadioGroup>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isInternationalStudent === null || isSubmitting}
            className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
          >
            {isSubmitting ? "Processing..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}
