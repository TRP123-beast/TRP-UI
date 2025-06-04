"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PrequalificationCSG1Wizard() {
  const [step, setStep] = useState(1)
  const [realtorStatus, setRealtorStatus] = useState<string | null>(null)
  const [exclusivityStatus, setExclusivityStatus] = useState<string | null>(null)
  const [responsibilityLevel, setResponsibilityLevel] = useState<string | null>(null)
  const [employmentStatus, setEmploymentStatus] = useState<string[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [flags, setFlags] = useState<number[]>([])
  const [employmentTypeCode, setEmploymentTypeCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [depositAdvantage, setDepositAdvantage] = useState<string | null>(null)
  const [showDepositQuestion, setShowDepositQuestion] = useState(false)

  const totalSteps = 5
  const progress = Math.round((step / totalSteps) * 100)

  const handleNext = () => {
    setError(null)

    if (step === 1 && !realtorStatus) {
      setError("Please select if you are working with a licensed realtor")
      return
    }

    if (step === 2 && realtorStatus === "Yes" && !exclusivityStatus) {
      setError("Please select if you have signed an exclusivity agreement")
      return
    }

    if (step === 3 && !responsibilityLevel) {
      setError("Please select your level of responsibility")
      return
    }

    if (step === 4 && employmentStatus.length === 0) {
      setError("Please select at least one employment status")
      return
    }

    setStep(step + 1)
  }

  const handleBack = () => {
    setError(null)
    setStep(step - 1)
  }

  const handleRealtorChange = (value: string) => {
    setRealtorStatus(value)
    if (value === "No") {
      setExclusivityStatus(null)
    }
  }

  const handleExclusivityChange = (value: string) => {
    setExclusivityStatus(value)
    if (value === "Yes") {
      const newFlags = [...flags]
      if (!newFlags.includes(3)) {
        newFlags.push(3)
      }
      setFlags(newFlags)
    } else {
      setFlags(flags.filter((flag) => flag !== 3))
    }
  }

  const handleResponsibilityChange = (value: string) => {
    setResponsibilityLevel(value)

    if (value === "I am fully responsible") {
      setUserRole("Main Applicant/Co-Signer")
      const newFlags = [...flags]
      if (!newFlags.includes(17)) {
        newFlags.push(17)
      }
      setFlags(newFlags.filter((flag) => flag !== 18))
    } else if (value === "I am partially responsible") {
      setUserRole("Co-Signer")
      const newFlags = [...flags]
      if (!newFlags.includes(18)) {
        newFlags.push(18)
      }
      setFlags(newFlags.filter((flag) => flag !== 17))
    } else if (value === "I am not responsible") {
      setUserRole("Guarantor")
      setFlags(flags.filter((flag) => flag !== 17 && flag !== 18))
    }
  }

  const handleEmploymentStatusChange = (value: string) => {
    setEmploymentStatus((prev) => {
      if (prev.includes(value)) {
        return prev.filter((status) => status !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const determineEmploymentTypeCode = () => {
    if (responsibilityLevel === "I am not responsible") {
      // Guarantor employment codes
      if (employmentStatus.includes("Retired") && employmentStatus.length === 1) {
        return "ET_CSG10"
      } else if (employmentStatus.includes("Unemployed") && employmentStatus.length === 1) {
        return "ET_CSG11"
      } else if (employmentStatus.includes("Full-time") && employmentStatus.length === 1) {
        return "ET_CSG12"
      } else if (employmentStatus.includes("Part-time") && employmentStatus.length === 1) {
        return "ET_CSG13"
      } else if (employmentStatus.includes("Self-employed") && employmentStatus.length === 1) {
        return "ET_CSG14"
      } else if (
        employmentStatus.includes("Full-time") &&
        employmentStatus.includes("Part-time") &&
        employmentStatus.length === 2
      ) {
        return "ET_CSG15"
      } else if (
        employmentStatus.includes("Full-time") &&
        employmentStatus.includes("Self-employed") &&
        employmentStatus.length === 2
      ) {
        return "ET_CSG16"
      } else if (
        employmentStatus.includes("Part-time") &&
        employmentStatus.includes("Self-employed") &&
        employmentStatus.length === 2
      ) {
        return "ET_CSG17"
      } else if (
        employmentStatus.includes("Full-time") &&
        employmentStatus.includes("Part-time") &&
        employmentStatus.includes("Self-employed") &&
        employmentStatus.length === 3
      ) {
        return "ET_CSG18"
      }
    } else {
      // Main Applicant/Co-Signer employment codes
      if (employmentStatus.includes("Retired") && employmentStatus.length === 1) {
        return "ET_CSG1"
      } else if (employmentStatus.includes("Unemployed") && employmentStatus.length === 1) {
        return "ET_CSG2"
      } else if (employmentStatus.includes("Full-time") && employmentStatus.length === 1) {
        return "ET_CSG3"
      } else if (employmentStatus.includes("Part-time") && employmentStatus.length === 1) {
        return "ET_CSG4"
      } else if (employmentStatus.includes("Self-employed") && employmentStatus.length === 1) {
        return "ET_CSG5"
      } else if (
        employmentStatus.includes("Full-time") &&
        employmentStatus.includes("Part-time") &&
        employmentStatus.length === 2
      ) {
        return "ET_CSG6"
      } else if (
        employmentStatus.includes("Full-time") &&
        employmentStatus.includes("Self-employed") &&
        employmentStatus.length === 2
      ) {
        return "ET_CSG7"
      } else if (
        employmentStatus.includes("Part-time") &&
        employmentStatus.includes("Self-employed") &&
        employmentStatus.length === 2
      ) {
        return "ET_CSG8"
      } else if (
        employmentStatus.includes("Full-time") &&
        employmentStatus.includes("Part-time") &&
        employmentStatus.includes("Self-employed") &&
        employmentStatus.length === 3
      ) {
        return "ET_CSG9"
      }
    }
    return null
  }

  const getDirectVCSGCode = (employmentCode: string | null) => {
    // Direct V_CSG codes for Guarantors (Not Responsible)
    const guarantorCodes: { [key: string]: string } = {
      ET_CSG10: "V_CSG78", // Retired
      ET_CSG11: "V_CSG82", // Unemployed
      ET_CSG12: "V_CSG86", // Full-time
      ET_CSG13: "V_CSG90", // Part-time
      ET_CSG14: "V_CSG94", // Self-employed
      ET_CSG15: "V_CSG98", // Full-time, Part-time
      ET_CSG16: "V_CSG102", // Full-time, Self-employed
      ET_CSG17: "V_CSG106", // Part-time, Self-employed
      ET_CSG18: "V_CSG110", // Full-time, Part-time, Self-employed
    }
    return guarantorCodes[employmentCode || ""] || "Unknown"
  }

  const getResponsibleVCSGCode = (employmentCode: string | null, depositAnswer: string) => {
    // V_CSG codes for Main Applicants/Co-Signers (Responsible)
    const responsibleCodes: { [key: string]: { yes: string; no: string } } = {
      ET_CSG1: { yes: "V_CSG9", no: "V_CSG10" }, // Retired
      ET_CSG2: { yes: "V_CSG17", no: "V_CSG18" }, // Unemployed
      ET_CSG3: { yes: "V_CSG25", no: "V_CSG26" }, // Full-time
      ET_CSG4: { yes: "V_CSG33", no: "V_CSG34" }, // Part-time
      ET_CSG5: { yes: "V_CSG41", no: "V_CSG42" }, // Self-employed
      ET_CSG6: { yes: "V_CSG49", no: "V_CSG50" }, // Full-time, Part-time
      ET_CSG7: { yes: "V_CSG57", no: "V_CSG58" }, // Full-time, Self-employed
      ET_CSG8: { yes: "V_CSG65", no: "V_CSG66" }, // Part-time, Self-employed
      ET_CSG9: { yes: "V_CSG73", no: "V_CSG74" }, // Full-time, Part-time, Self-employed
    }

    const codes = responsibleCodes[employmentCode || ""]
    if (!codes) return "Unknown"

    return depositAnswer === "Yes" ? codes.yes : codes.no
  }

  const handleSubmit = () => {
    const employmentCode = determineEmploymentTypeCode()
    setEmploymentTypeCode(employmentCode)

    // Check if user selected "Not in Canada for 12+ months" and is responsible for rent
    if (responsibilityLevel !== "I am not responsible") {
      // User is responsible for rent, show deposit question
      setShowDepositQuestion(true)
      setStep(step + 1) // Go to deposit question step
    } else {
      // User is not responsible (Guarantor), get direct V_CSG code
      const vCode = getDirectVCSGCode(employmentCode)
      console.log("Direct V_CSG code for Guarantor:", vCode)
      setStep(step + 1) // Go to completion step
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-black text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Pre-Qualification: Main Applicant/Co-Signer/Guarantor
              </CardTitle>
              <CardDescription className="text-white/80 mt-1">GC4 - CSG1 - Single Occupant Group</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 px-3 py-1">
              Step {step} of {totalSteps}
            </Badge>
          </div>
        </CardHeader>

        <div className="px-6 pt-6">
          <Progress value={progress} className="h-2 bg-gray-100" indicatorClassName="bg-orange-500" />
          <p className="text-right text-sm text-gray-500 mt-1">{progress}% Complete</p>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Are you working with a licensed realtor?</h2>
                <p className="text-gray-500 text-sm">Please select one of the options below.</p>
              </div>

              <RadioGroup value={realtorStatus || ""} onValueChange={handleRealtorChange} className="space-y-3">
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="Yes" id="realtor-yes" />
                  <Label htmlFor="realtor-yes" className="flex-1 cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="No" id="realtor-no" />
                  <Label htmlFor="realtor-no" className="flex-1 cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 2 && realtorStatus === "Yes" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Have you signed an exclusivity agreement?</h2>
                <p className="text-gray-500 text-sm">Please select one of the options below.</p>
              </div>

              <RadioGroup value={exclusivityStatus || ""} onValueChange={handleExclusivityChange} className="space-y-3">
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="Yes" id="exclusivity-yes" />
                  <Label htmlFor="exclusivity-yes" className="flex-1 cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="No" id="exclusivity-no" />
                  <Label htmlFor="exclusivity-no" className="flex-1 cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  What is your level of responsibility in paying the rent every month?
                </h2>
                <p className="text-gray-500 text-sm">This will determine your role in the rental process.</p>
              </div>

              <RadioGroup
                value={responsibilityLevel || ""}
                onValueChange={handleResponsibilityChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="I am fully responsible" id="responsibility-full" />
                  <Label htmlFor="responsibility-full" className="flex-1 cursor-pointer">
                    <div className="font-medium">I am fully responsible</div>
                    <div className="text-sm text-gray-500">You will be tagged as "Main Applicant/Co-Signer"</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="I am partially responsible" id="responsibility-partial" />
                  <Label htmlFor="responsibility-partial" className="flex-1 cursor-pointer">
                    <div className="font-medium">I am partially responsible</div>
                    <div className="text-sm text-gray-500">You will be tagged as "Co-Signer"</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="I am not responsible" id="responsibility-none" />
                  <Label htmlFor="responsibility-none" className="flex-1 cursor-pointer">
                    <div className="font-medium">I am not responsible</div>
                    <div className="text-sm text-gray-500">You will be tagged as "Guarantor"</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Select your current employment status</h2>
                <p className="text-gray-500 text-sm">You can select multiple options if applicable.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id="employment-retired"
                    checked={employmentStatus.includes("Retired")}
                    onCheckedChange={() => handleEmploymentStatusChange("Retired")}
                  />
                  <label htmlFor="employment-retired" className="text-sm font-medium leading-none cursor-pointer">
                    Retired
                  </label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id="employment-unemployed"
                    checked={employmentStatus.includes("Unemployed")}
                    onCheckedChange={() => handleEmploymentStatusChange("Unemployed")}
                  />
                  <label htmlFor="employment-unemployed" className="text-sm font-medium leading-none cursor-pointer">
                    Unemployed
                  </label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id="employment-fulltime"
                    checked={employmentStatus.includes("Full-time")}
                    onCheckedChange={() => handleEmploymentStatusChange("Full-time")}
                  />
                  <label htmlFor="employment-fulltime" className="text-sm font-medium leading-none cursor-pointer">
                    Full-time employed
                  </label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id="employment-parttime"
                    checked={employmentStatus.includes("Part-time")}
                    onCheckedChange={() => handleEmploymentStatusChange("Part-time")}
                  />
                  <label htmlFor="employment-parttime" className="text-sm font-medium leading-none cursor-pointer">
                    Part-time employed
                  </label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id="employment-selfemployed"
                    checked={employmentStatus.includes("Self-employed")}
                    onCheckedChange={() => handleEmploymentStatusChange("Self-employed")}
                  />
                  <label htmlFor="employment-selfemployed" className="text-sm font-medium leading-none cursor-pointer">
                    Self-employed
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 5 && showDepositQuestion && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Deposit Advantage Question</h2>
                <p className="text-gray-500 text-sm">
                  In the event that you have already viewed properties with our Rental Specialists and are ready to
                  submit an offer, the mandatory deposit requirement amount is the first and last month's rent. In a
                  multiple offer situation where there are competing tenants for the same property, would you be able to
                  comfortably set aside more than the minimum required amount to give yourself a greater advantage in
                  the offer presentation?
                </p>
              </div>

              <RadioGroup value={depositAdvantage || ""} onValueChange={setDepositAdvantage} className="space-y-3">
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="Yes" id="deposit-yes" />
                  <Label htmlFor="deposit-yes" className="flex-1 cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="No" id="deposit-no" />
                  <Label htmlFor="deposit-no" className="flex-1 cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {(step === 5 && !showDepositQuestion) ||
            (step === 6 && showDepositQuestion && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Qualification Complete</h2>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Thank you for completing the pre-qualification process. Your information has been submitted
                    successfully.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-gray-700">Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Your Role</p>
                      <p className="font-medium">{userRole}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Employment Type</p>
                      <p className="font-medium">{employmentTypeCode}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">V_CSG Code</p>
                      <p className="font-medium text-orange-600">
                        {showDepositQuestion && depositAdvantage
                          ? getResponsibleVCSGCode(employmentTypeCode, depositAdvantage)
                          : getDirectVCSGCode(employmentTypeCode)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Flags</p>
                      <div className="flex flex-wrap gap-2">
                        {flags.map((flag) => (
                          <Badge
                            key={flag}
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            FLAG {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>

        <CardFooter className="p-6 border-t bg-gray-50 flex justify-between">
          {step > 1 && step < (showDepositQuestion ? 6 : 5) && (
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          )}
          {step === 1 && <div></div>}
          {step < 4 && (
            <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 4 && (
            <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600">
              Submit
            </Button>
          )}
          {step === 5 && showDepositQuestion && depositAdvantage && (
            <Button onClick={() => setStep(6)} className="bg-orange-500 hover:bg-orange-600">
              Complete
            </Button>
          )}
          {((step === 5 && !showDepositQuestion) || step === 6) && (
            <Button className="bg-orange-500 hover:bg-orange-600">Continue to Dashboard</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
