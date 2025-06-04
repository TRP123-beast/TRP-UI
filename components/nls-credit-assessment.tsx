"use client"

import { useState } from "react"
import { CreditScoreWizard } from "./credit-score-wizard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { NLSCategorySelector } from "./nls-category-selector"

interface NLSCreditAssessmentProps {
  onComplete: (results: {
    workflowCode: string
    isRentResponsible: boolean
    flags: Record<string, boolean>
  }) => void
  onBack: () => void
}

export function NLSCreditAssessment({ onComplete, onBack }: NLSCreditAssessmentProps) {
  const [step, setStep] = useState(0)
  const [isRentResponsible, setIsRentResponsible] = useState<boolean | null>(null)
  const [employmentType, setEmploymentType] = useState<string>("")
  const [isStudent, setIsStudent] = useState<boolean | null>(null)
  const [workflowCode, setWorkflowCode] = useState<string>("")
  // Add new state for NLS category
  const [nlsCategory, setNlsCategory] = useState<"NLS1" | "NLS2" | "NLS3" | "LS3" | null>(null)

  // Employment type options based on rent responsibility and NLS category
  const getEmploymentOptions = () => {
    if (nlsCategory === "NLS1") {
      if (isRentResponsible) {
        return [
          { code: "ET_NLS55", label: "Retired", student: true },
          { code: "ET_NLS56", label: "Unemployed", student: true },
          { code: "ET_NLS57", label: "Full-Time", student: true },
          { code: "ET_NLS58", label: "Part-Time", student: true },
          { code: "ET_NLS59", label: "Self-Employed", student: true },
          { code: "ET_NLS60", label: "Full-Time, Part-Time", student: true },
          { code: "ET_NLS61", label: "Full-Time, Self-Employed", student: true },
          { code: "ET_NLS62", label: "Part-Time, Self-Employed", student: true },
          { code: "ET_NLS63", label: "Full-Time, Part-Time, Self-Employed", student: true },
          { code: "ET_NLS64", label: "Part-Time", student: false },
          { code: "ET_NLS65", label: "Full-Time", student: false },
          { code: "ET_NLS66", label: "Self-Employed", student: false },
          { code: "ET_NLS67", label: "Retired", student: false },
          { code: "ET_NLS68", label: "Unemployed", student: false },
          { code: "ET_NLS69", label: "Full-Time, Part-Time, Self-Employed", student: false },
          { code: "ET_NLS70", label: "Full-Time, Part-Time", student: false },
          { code: "ET_NLS71", label: "Full-Time, Self-Employed", student: false },
          { code: "ET_NLS72", label: "Part-Time, Self-Employed", student: false },
        ]
      } else {
        return [
          { code: "ET_NLS1", label: "Retired", student: true },
          { code: "ET_NLS2", label: "Unemployed", student: true },
          { code: "ET_NLS3", label: "Full-Time", student: true },
          { code: "ET_NLS4", label: "Part-Time", student: true },
          { code: "ET_NLS5", label: "Self-Employed", student: true },
          { code: "ET_NLS6", label: "Full-Time, Part-Time", student: true },
          { code: "ET_NLS7", label: "Full-Time, Self-Employed", student: true },
          { code: "ET_NLS8", label: "Part-Time, Self-Employed", student: true },
          { code: "ET_NLS9", label: "Full-Time, Part-Time, Self-Employed", student: true },
          { code: "ET_NLS10", label: "Part-Time", student: false },
          { code: "ET_NLS11", label: "Full-Time", student: false },
          { code: "ET_NLS12", label: "Self-Employed", student: false },
          { code: "ET_NLS13", label: "Retired", student: false },
          { code: "ET_NLS14", label: "Unemployed", student: false },
          { code: "ET_NLS15", label: "Full-Time, Part-Time, Self-Employed", student: false },
          { code: "ET_NLS16", label: "Full-Time, Part-Time", student: false },
          { code: "ET_NLS17", label: "Full-Time, Self-Employed", student: false },
          { code: "ET_NLS18", label: "Part-Time, Self-Employed", student: false },
        ]
      }
    } else if (nlsCategory === "NLS2") {
      // NLS2 category - ET_NLS19-90 (expanded range)
      return [
        // Not responsible entries (ET_NLS19-36)
        { code: "ET_NLS19", label: "Retired", student: true, responsible: false },
        { code: "ET_NLS20", label: "Unemployed", student: true, responsible: false },
        { code: "ET_NLS21", label: "Full-Time", student: true, responsible: false },
        { code: "ET_NLS22", label: "Part-Time", student: true, responsible: false },
        { code: "ET_NLS23", label: "Self-Employed", student: true, responsible: false },
        { code: "ET_NLS24", label: "Full-Time, Part-Time", student: true, responsible: false },
        { code: "ET_NLS25", label: "Full-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_NLS26", label: "Part-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_NLS27", label: "Full-Time, Part-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_NLS28", label: "Part-Time", student: false, responsible: false },
        { code: "ET_NLS29", label: "Full-Time", student: false, responsible: false },
        { code: "ET_NLS30", label: "Self-Employed", student: false, responsible: false },
        { code: "ET_NLS31", label: "Retired", student: false, responsible: false },
        { code: "ET_NLS32", label: "Unemployed", student: false, responsible: false },
        { code: "ET_NLS33", label: "Full-Time, Part-Time, Self-Employed", student: false, responsible: false },
        { code: "ET_NLS34", label: "Full-Time, Part-Time", student: false, responsible: false },
        { code: "ET_NLS35", label: "Full-Time, Self-Employed", student: false, responsible: false },
        { code: "ET_NLS36", label: "Part-Time, Self-Employed", student: false, responsible: false },

        // Responsible entries (ET_NLS73-90)
        { code: "ET_NLS73", label: "Retired", student: true, responsible: true },
        { code: "ET_NLS74", label: "Unemployed", student: true, responsible: true },
        { code: "ET_NLS75", label: "Full-Time", student: true, responsible: false }, // Special case
        { code: "ET_NLS76", label: "Part-Time", student: true, responsible: true },
        { code: "ET_NLS77", label: "Self-Employed", student: true, responsible: true },
        { code: "ET_NLS78", label: "Full-Time, Part-Time", student: true, responsible: true },
        { code: "ET_NLS79", label: "Full-Time, Self-Employed", student: true, responsible: true },
        { code: "ET_NLS80", label: "Part-Time, Self-Employed", student: true, responsible: true },
        { code: "ET_NLS81", label: "Full-Time, Part-Time, Self-Employed", student: true, responsible: true },
        { code: "ET_NLS82", label: "Part-Time", student: false, responsible: true },
        { code: "ET_NLS83", label: "Full-Time", student: false, responsible: true },
        { code: "ET_NLS84", label: "Self-Employed", student: false, responsible: true },
        { code: "ET_NLS85", label: "Retired", student: false, responsible: true },
        { code: "ET_NLS86", label: "Unemployed", student: false, responsible: true },
        { code: "ET_NLS87", label: "Full-Time, Part-Time, Self-Employed", student: false, responsible: true },
        { code: "ET_NLS88", label: "Full-Time, Part-Time", student: false, responsible: true },
        { code: "ET_NLS89", label: "Full-Time, Self-Employed", student: false, responsible: true },
        { code: "ET_NLS90", label: "Part-Time, Self-Employed", student: false, responsible: true },
      ]
    } else if (nlsCategory === "NLS3") {
      // NLS3 category - ET_NLS37-108 (expanded range)
      return [
        // Not responsible entries (ET_NLS37-54)
        { code: "ET_NLS37", label: "Retired", student: true, responsible: false },
        { code: "ET_NLS38", label: "Unemployed", student: true, responsible: false },
        { code: "ET_NLS39", label: "Full-Time", student: true, responsible: false },
        { code: "ET_NLS40", label: "Part-Time", student: true, responsible: false },
        { code: "ET_NLS41", label: "Self-Employed", student: true, responsible: false },
        { code: "ET_NLS42", label: "Full-Time, Part-Time", student: true, responsible: false },
        { code: "ET_NLS43", label: "Full-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_NLS44", label: "Part-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_NLS45", label: "Full-Time, Part-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_NLS46", label: "Part-Time", student: false, responsible: false },
        { code: "ET_NLS47", label: "Full-Time", student: false, responsible: false },
        { code: "ET_NLS48", label: "Self-Employed", student: false, responsible: false },
        { code: "ET_NLS49", label: "Retired", student: false, responsible: false },
        { code: "ET_NLS50", label: "Unemployed", student: false, responsible: false },
        { code: "ET_NLS51", label: "Full-Time, Part-Time, Self-Employed", student: false, responsible: false },
        { code: "ET_NLS52", label: "Full-Time, Part-Time", student: false, responsible: false },
        { code: "ET_NLS53", label: "Full-Time, Self-Employed", student: false, responsible: false },
        { code: "ET_NLS54", label: "Part-Time, Self-Employed", student: false, responsible: false },

        // Responsible entries (ET_NLS91-108)
        { code: "ET_NLS91", label: "Retired", student: true, responsible: true },
        { code: "ET_NLS92", label: "Unemployed", student: true, responsible: true },
        { code: "ET_NLS93", label: "Full-Time", student: true, responsible: true },
        { code: "ET_NLS94", label: "Part-Time", student: true, responsible: true },
        { code: "ET_NLS95", label: "Self-Employed", student: true, responsible: true },
        { code: "ET_NLS96", label: "Full-Time, Part-Time", student: true, responsible: true },
        { code: "ET_NLS97", label: "Full-Time, Self-Employed", student: true, responsible: true },
        { code: "ET_NLS98", label: "Part-Time, Self-Employed", student: true, responsible: true },
        { code: "ET_NLS99", label: "Full-Time, Part-Time, Self-Employed", student: true, responsible: true },
        { code: "ET_NLS100", label: "Part-Time", student: false, responsible: true },
        { code: "ET_NLS101", label: "Full-Time", student: false, responsible: true },
        { code: "ET_NLS102", label: "Self-Employed", student: false, responsible: true },
        { code: "ET_NLS103", label: "Retired", student: false, responsible: true },
        { code: "ET_NLS104", label: "Unemployed", student: false, responsible: true },
        { code: "ET_NLS105", label: "Full-Time, Part-Time, Self-Employed", student: false, responsible: true },
        { code: "ET_NLS106", label: "Full-Time, Part-Time", student: false, responsible: true },
        { code: "ET_NLS107", label: "Full-Time, Self-Employed", student: false, responsible: true },
        { code: "ET_NLS108", label: "Part-Time, Self-Employed", student: false, responsible: true },
      ]
    } else if (nlsCategory === "LS3") {
      // LS3 category - ET_LS91-108 (all not responsible for rent)
      return [
        { code: "ET_LS91", label: "Retired", student: true, responsible: false },
        { code: "ET_LS92", label: "Unemployed", student: true, responsible: false },
        { code: "ET_LS93", label: "Full-Time", student: true, responsible: false },
        { code: "ET_LS94", label: "Part-Time", student: true, responsible: false },
        { code: "ET_LS95", label: "Self-Employed", student: true, responsible: false },
        { code: "ET_LS96", label: "Full-Time, Part-Time", student: true, responsible: false },
        { code: "ET_LS97", label: "Full-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_LS98", label: "Part-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_LS99", label: "Full-Time, Part-Time, Self-Employed", student: true, responsible: false },
        { code: "ET_LS100", label: "Part-Time", student: false, responsible: false },
        { code: "ET_LS101", label: "Full-Time", student: false, responsible: false },
        { code: "ET_LS102", label: "Self-Employed", student: false, responsible: false },
        { code: "ET_LS103", label: "Retired", student: false, responsible: false },
        { code: "ET_LS104", label: "Unemployed", student: false, responsible: false },
        { code: "ET_LS105", label: "Full-Time, Part-Time, Self-Employed", student: false, responsible: false },
        { code: "ET_LS106", label: "Full-Time, Part-Time", student: false, responsible: false },
        { code: "ET_LS107", label: "Full-Time, Self-Employed", student: false, responsible: false },
        { code: "ET_LS108", label: "Part-Time, Self-Employed", student: false, responsible: false },
      ]
    }
    return []
  }

  const handleRentResponsibilityNext = () => {
    if (isRentResponsible !== null) {
      setStep(2)
    }
  }

  const handleEmploymentNext = () => {
    if (employmentType && isStudent !== null) {
      const options = getEmploymentOptions()
      const selectedOption = options.find((opt) => opt.label === employmentType && opt.student === isStudent)

      if (selectedOption) {
        const code = `${nlsCategory}:${selectedOption.code}:MI_${selectedOption.code.replace("ET_", "")} - CS_${selectedOption.code.replace("ET_", "")}`
        setWorkflowCode(code)

        // For NLS2, automatically set rent responsibility based on the employment code
        if (nlsCategory === "NLS2") {
          const etCode = selectedOption.code.replace("ET_NLS", "")
          const etNum = Number.parseInt(etCode)

          // ET_NLS19-36 and ET_NLS75 are not responsible for rent
          if ((etNum >= 19 && etNum <= 36) || etNum === 75) {
            setIsRentResponsible(false)
          } else {
            // ET_NLS73-74, 76-90 are responsible for rent
            setIsRentResponsible(true)
          }
        } else if (nlsCategory === "NLS3") {
          // NLS3 category - automatically set rent responsibility based on employment code
          const etCode = selectedOption.code.replace("ET_NLS", "")
          const etNum = Number.parseInt(etCode)

          // ET_NLS37-54 are not responsible for rent
          // ET_NLS91-108 are responsible for rent
          if (etNum >= 37 && etNum <= 54) {
            setIsRentResponsible(false)
          } else if (etNum >= 91 && etNum <= 108) {
            setIsRentResponsible(true)
          }
        } else if (nlsCategory === "LS3") {
          // LS3 category - all are not responsible for rent
          setIsRentResponsible(false)
        }

        setStep(3) // Updated step number
      }
    }
  }

  const handleCreditAssessmentComplete = (flags: Record<string, boolean>) => {
    onComplete({
      workflowCode,
      isRentResponsible: isRentResponsible!,
      flags,
    })
  }

  // Render rent responsibility question
  const renderRentResponsibility = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-black">Rent Responsibility</h2>
        <p className="text-gray-600 mt-2">Are you responsible for paying rent?</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          This determines which credit assessment workflow applies to you. Rent-responsible NLS members have additional
          deposit capability questions, while non-rent-responsible members have a simplified assessment.
        </p>
      </div>

      <RadioGroup
        value={isRentResponsible === null ? undefined : isRentResponsible.toString()}
        onValueChange={(value) => setIsRentResponsible(value === "true")}
      >
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="true" id="rent-yes" />
          <Label htmlFor="rent-yes" className="text-sm">
            Yes, I am responsible for paying rent
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="rent-no" />
          <Label htmlFor="rent-no" className="text-sm">
            No, I am not responsible for paying rent
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleRentResponsibilityNext}
          disabled={isRentResponsible === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render employment and student status
  const renderEmploymentDetails = () => {
    const employmentOptions = getEmploymentOptions()
    const uniqueEmploymentTypes = [...new Set(employmentOptions.map((opt) => opt.label))]

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Employment & Student Status</h2>
          <p className="text-gray-600 mt-2">Please select your employment type and student status</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Employment Type</Label>
            <RadioGroup value={employmentType} onValueChange={setEmploymentType}>
              {uniqueEmploymentTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={type} id={`emp-${type}`} />
                  <Label htmlFor={`emp-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Student Status</Label>
            <RadioGroup
              value={isStudent === null ? undefined : isStudent.toString()}
              onValueChange={(value) => setIsStudent(value === "true")}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="true" id="student-yes" />
                <Label htmlFor="student-yes" className="text-sm">
                  Yes, I am a student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="student-no" />
                <Label htmlFor="student-no" className="text-sm">
                  No, I am not a student
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button
            onClick={handleEmploymentNext}
            disabled={!employmentType || isStudent === null}
            className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
          >
            Start Credit Assessment
          </Button>
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return (
          <NLSCategorySelector
            onCategorySelected={(category) => {
              setNlsCategory(category)
              setStep(1)
            }}
            onBack={onBack}
          />
        )
      case 1:
        return renderRentResponsibility()
      case 2:
        return renderEmploymentDetails()
      case 3:
        return (
          <CreditScoreWizard
            workflowCode={workflowCode}
            isRentResponsible={isRentResponsible!}
            onComplete={handleCreditAssessmentComplete}
            onBack={() => setStep(2)}
          />
        )
      default:
        return (
          <NLSCategorySelector
            onCategorySelected={(category) => {
              setNlsCategory(category)
              setStep(1)
            }}
            onBack={onBack}
          />
        )
    }
  }

  if (step === 3) {
    return renderCurrentStep()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">NLS/LS3 Credit Assessment Setup</CardTitle>
                <p className="text-white/80 text-sm mt-1">
                  Non-Lease Signer & Lease Signer 3 Credit Evaluation Process
                </p>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                Step {step + 1} of 4
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">{renderCurrentStep()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
