"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Home, Check } from "lucide-react"

export function PrequalificationCSG2Wizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [totalSteps] = useState(6) // Adjust based on workflow
  const [flags, setFlags] = useState({
    flag3: false,
    flag17: false,
    flag18: false,
    employmentType: "",
  })

  // Form state
  const [realtorQuestion, setRealtorQuestion] = useState<string>("")
  const [exclusivityQuestion, setExclusivityQuestion] = useState<string>("")
  const [responsibilityQuestion, setResponsibilityQuestion] = useState<string>("")
  const [employmentStatus, setEmploymentStatus] = useState<string[]>([])

  // Navigation functions
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const setFlag = (flag: keyof typeof flags, value: any) => {
    setFlags((prev) => ({ ...prev, [flag]: value }))
  }

  const handleRealtorSelection = (value: string) => {
    setRealtorQuestion(value)
    if (value === "no") {
      // Skip exclusivity question
      setStep(3)
    } else {
      nextStep()
    }
  }

  const handleExclusivitySelection = (value: string) => {
    setExclusivityQuestion(value)
    if (value === "yes") {
      setFlag("flag3", true)
    }
    nextStep()
  }

  const handleResponsibilitySelection = (value: string) => {
    setResponsibilityQuestion(value)
    if (value === "fully") {
      setFlag("flag17", true)
      // Logic: user tagged as 'Main Applicant/Co-Signer" role
    } else if (value === "partially") {
      setFlag("flag18", true)
      // Logic: user tagged as 'Co-Signer" role
    } else {
      // Logic: user tagged as 'Guarantor" role
    }
    nextStep()
  }

  const handleEmploymentSelection = (value: string, checked: boolean) => {
    if (checked) {
      setEmploymentStatus([...employmentStatus, value])
    } else {
      setEmploymentStatus(employmentStatus.filter((item) => item !== value))
    }

    // Set employment type flags based on selection combinations
    const types = [...employmentStatus]
    if (checked) types.push(value)
    else types.filter((item) => item !== value)

    // Determine employment type code based on the workflow
    let employmentTypeCode = ""

    if (flags.flag17 || flags.flag18) {
      // Main Applicant/Co-Signer or Co-Signer role
      if (types.includes("retired")) employmentTypeCode = "ET_CSG19"
      else if (types.includes("unemployed")) employmentTypeCode = "ET_CSG20"
      else if (types.includes("fullTime") && !types.includes("partTime") && !types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG21"
      else if (!types.includes("fullTime") && types.includes("partTime") && !types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG22"
      else if (!types.includes("fullTime") && !types.includes("partTime") && types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG23"
      else if (types.includes("fullTime") && types.includes("partTime") && !types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG24"
      else if (types.includes("fullTime") && !types.includes("partTime") && types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG25"
      else if (!types.includes("fullTime") && types.includes("partTime") && types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG26"
      else if (types.includes("fullTime") && types.includes("partTime") && types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG27"
    } else {
      // Guarantor role
      if (types.includes("retired")) employmentTypeCode = "ET_CSG28"
      else if (types.includes("unemployed")) employmentTypeCode = "ET_CSG29"
      else if (types.includes("fullTime") && !types.includes("partTime") && !types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG30"
      else if (!types.includes("fullTime") && types.includes("partTime") && !types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG31"
      else if (!types.includes("fullTime") && !types.includes("partTime") && types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG32"
      else if (types.includes("fullTime") && types.includes("partTime") && !types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG33"
      else if (types.includes("fullTime") && !types.includes("partTime") && types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG34"
      else if (!types.includes("fullTime") && types.includes("partTime") && types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG35"
      else if (types.includes("fullTime") && types.includes("partTime") && types.includes("selfEmployed"))
        employmentTypeCode = "ET_CSG36"
    }

    setFlag("employmentType", employmentTypeCode)
  }

  const handleComplete = () => {
    console.log("Qualification completed with flags:", flags)
    // In a real app, you would store these flags and progress to the next step
    router.push("/")
  }

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">Are you working with a licensed realtor?</h3>
            <RadioGroup onValueChange={handleRealtorSelection} value={realtorQuestion}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="realtor-yes" />
                <Label htmlFor="realtor-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="realtor-no" />
                <Label htmlFor="realtor-no">No</Label>
              </div>
            </RadioGroup>
          </CardContent>
        )

      case 2:
        return (
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">Have you signed an exclusivity agreement?</h3>
            <RadioGroup onValueChange={handleExclusivitySelection} value={exclusivityQuestion}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="exclusivity-yes" />
                <Label htmlFor="exclusivity-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="exclusivity-no" />
                <Label htmlFor="exclusivity-no">No</Label>
              </div>
            </RadioGroup>
          </CardContent>
        )

      case 3:
        return (
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">
              What is your level of responsibility in paying the rent every month?
            </h3>
            <RadioGroup onValueChange={handleResponsibilitySelection} value={responsibilityQuestion}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fully" id="responsibility-fully" />
                <Label htmlFor="responsibility-fully">I am fully responsible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partially" id="responsibility-partially" />
                <Label htmlFor="responsibility-partially">I am partially responsible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not" id="responsibility-not" />
                <Label htmlFor="responsibility-not">I am not responsible</Label>
              </div>
            </RadioGroup>
          </CardContent>
        )

      case 4:
        return (
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">Select your current employment status</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-retired"
                  checked={employmentStatus.includes("retired")}
                  onCheckedChange={(checked) => handleEmploymentSelection("retired", checked as boolean)}
                />
                <Label htmlFor="employment-retired">Retired</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-unemployed"
                  checked={employmentStatus.includes("unemployed")}
                  onCheckedChange={(checked) => handleEmploymentSelection("unemployed", checked as boolean)}
                />
                <Label htmlFor="employment-unemployed">Unemployed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-fullTime"
                  checked={employmentStatus.includes("fullTime")}
                  onCheckedChange={(checked) => handleEmploymentSelection("fullTime", checked as boolean)}
                />
                <Label htmlFor="employment-fullTime">Full-time employed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-partTime"
                  checked={employmentStatus.includes("partTime")}
                  onCheckedChange={(checked) => handleEmploymentSelection("partTime", checked as boolean)}
                />
                <Label htmlFor="employment-partTime">Part-time employed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-selfEmployed"
                  checked={employmentStatus.includes("selfEmployed")}
                  onCheckedChange={(checked) => handleEmploymentSelection("selfEmployed", checked as boolean)}
                />
                <Label htmlFor="employment-selfEmployed">Self-employed</Label>
              </div>
            </div>
            {flags.employmentType && (
              <div className="mt-4 p-2 bg-gray-50 rounded text-sm text-gray-500">
                Employment type: {flags.employmentType}
              </div>
            )}
          </CardContent>
        )

      case 5:
        return (
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-800 flex items-center">
                <Check className="mr-2 h-5 w-5" />
                Qualification Complete
              </h3>
              <p className="mt-2 text-green-700">
                Thank you for completing the qualification process. Your information has been saved.
              </p>

              <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
                <h4 className="font-medium">Your Role:</h4>
                <p className="text-sm">
                  {flags.flag17 && "Main Applicant/Co-Signer"}
                  {flags.flag18 && "Co-Signer"}
                  {!flags.flag17 && !flags.flag18 && "Guarantor"}
                </p>

                <h4 className="font-medium mt-3">Employment Type:</h4>
                <p className="text-sm">{flags.employmentType}</p>

                {flags.flag3 && (
                  <div className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                      Exclusivity Agreement Signed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )

      case 6:
        // Final confirmation
        return (
          <CardContent className="space-y-4">
            <div className="text-center p-6">
              <div className="mb-4 bg-green-100 rounded-full p-3 inline-flex">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium">Qualification Process Complete</h3>
              <p className="text-gray-600 mt-2">
                Your information has been saved and your rental journey can now continue.
              </p>
            </div>
          </CardContent>
        )

      default:
        return null
    }
  }

  // Render the footer with navigation buttons
  const renderFooter = () => {
    return (
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        )}

        {step === totalSteps && (
          <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
            Complete
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-black text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                CSG2 Qualification - Main Applicant/Co-Signer/Guarantor
              </CardTitle>
              <CardDescription className="text-gray-200 mt-1">
                Complete this qualification process to continue your rental journey.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="px-6 pt-4">
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-sm text-gray-500 mt-1">
            Step {step} of {totalSteps}
          </p>
        </div>

        {renderStep()}
        {renderFooter()}
      </Card>
    </div>
  )
}
