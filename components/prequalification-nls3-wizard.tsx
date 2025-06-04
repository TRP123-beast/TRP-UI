"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { format, addDays, differenceInDays } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"
import { DateInput } from "@/components/ui/date-input"

interface Flag {
  name: string
  value: boolean
  description: string
}

export function PrequalificationNLS3Wizard() {
  // State for the current step
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // State for user responses
  const [isRentalWithNameOnLease, setIsRentalWithNameOnLease] = useState<boolean | null>(null)
  const [leaseType, setLeaseType] = useState<"12 month lease" | "Month-to-month" | null>(null)
  const [leaseExpiryDate, setLeaseExpiryDate] = useState<Date | null>(null)
  const [isExpiryWithin60Days, setIsExpiryWithin60Days] = useState<boolean | null>(null)
  const [paymentDate, setPaymentDate] = useState<string | null>(null)
  const [noticeToVacate, setNoticeToVacate] = useState<
    "Submitted to Landlord" | "Received from Landlord" | "No" | null
  >(null)
  const [noticeAccepted, setNoticeAccepted] = useState<boolean | null>(null)
  const [earliestMoveDate, setEarliestMoveDate] = useState<Date | null>(null)

  // State for flags
  const [flags, setFlags] = useState<Flag[]>([])

  // State for summary view
  const [showSummary, setShowSummary] = useState(false)

  // Calculate total steps
  const totalSteps = 6

  // Update progress whenever step changes
  useEffect(() => {
    const progressPercentage = Math.min(Math.round((step / totalSteps) * 100), 100)
    setProgress(progressPercentage)
  }, [step])

  // Check if lease expiry is within 60 days
  useEffect(() => {
    if (leaseExpiryDate) {
      const today = new Date()
      const daysDifference = differenceInDays(leaseExpiryDate, today)
      setIsExpiryWithin60Days(daysDifference <= 60)
    }
  }, [leaseExpiryDate])

  // Helper function to update flags
  const updateFlag = useCallback((flagName: string, value: boolean, description: string) => {
    console.log(`Setting flag ${flagName} to ${value}: ${description}`)
    setFlags((prev) => {
      const existingFlagIndex = prev.findIndex((f) => f.name === flagName)
      if (existingFlagIndex >= 0) {
        // Update existing flag
        const updatedFlags = [...prev]
        updatedFlags[existingFlagIndex] = { name: flagName, value, description }
        return updatedFlags
      } else {
        // Add new flag
        return [...prev, { name: flagName, value, description }]
      }
    })

    // Also store in localStorage for persistence between workflows
    try {
      localStorage.setItem(flagName, value.toString())
    } catch (error) {
      console.error("Error saving flag to localStorage:", error)
    }
  }, [])

  // Handle next button click
  const handleNext = () => {
    // Logic for specific steps
    if (step === 0 && isRentalWithNameOnLease === false) {
      // If not living in rental property with name on lease, end workflow
      setShowSummary(true)
      return
    }

    if (step === 3 && noticeToVacate === "No") {
      // Set NO_NOTICE flag
      updateFlag("NO_NOTICE", true, "No notice to vacate submitted or received")
    }

    if (step === 4 && noticeAccepted === true) {
      // Set NOTICE_ACCEPTED flag
      updateFlag("NOTICE_ACCEPTED", true, "Notice to vacate has been accepted")
    } else if (step === 4 && noticeAccepted === false) {
      // Set NO_NOTICE flag
      updateFlag("NO_NOTICE", true, "Notice to vacate has not been accepted")
    }

    // If this is the last step, show summary
    if (step === totalSteps - 1) {
      // Save earliest move date to localStorage
      try {
        if (earliestMoveDate) {
          localStorage.setItem("EARLIEST_MOVE_DATE", earliestMoveDate.toISOString())
        }
      } catch (error) {
        console.error("Error saving move date to localStorage:", error)
      }

      setShowSummary(true)
      return
    }

    // Move to next step
    setStep(step + 1)
  }

  // Handle back button click
  const handleBack = () => {
    if (step === 0) return
    setStep(step - 1)
  }

  // Handle finish button click
  const handleFinish = () => {
    // Save completion status to localStorage
    try {
      localStorage.setItem("NLS3_COMPLETED", "true")

      // Redirect to the next workflow or dashboard
      window.location.href = "/prequalification-landing"
    } catch (error) {
      console.error("Error saving completion status:", error)
    }
  }

  // Generate days of month options for the dropdown
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }))

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Current Living Situation</h2>
              <p className="mb-6">Are you currently living in a rental property AND your name is on the lease?</p>
              <div className="flex space-x-4">
                <Button
                  variant={isRentalWithNameOnLease === true ? "default" : "outline"}
                  className={isRentalWithNameOnLease === true ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setIsRentalWithNameOnLease(true)}
                >
                  Yes
                </Button>
                <Button
                  variant={isRentalWithNameOnLease === false ? "default" : "outline"}
                  className={isRentalWithNameOnLease === false ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setIsRentalWithNameOnLease(false)}
                >
                  No
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 1:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Lease Type</h2>
              <p className="mb-6">What type of lease are you on?</p>
              <div className="flex space-x-4">
                <Button
                  variant={leaseType === "12 month lease" ? "default" : "outline"}
                  className={leaseType === "12 month lease" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setLeaseType("12 month lease")}
                >
                  12 month lease
                </Button>
                <Button
                  variant={leaseType === "Month-to-month" ? "default" : "outline"}
                  className={leaseType === "Month-to-month" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setLeaseType("Month-to-month")}
                >
                  Month-to-month
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return leaseType === "12 month lease" ? (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Lease Expiry</h2>
              <p className="mb-6">When does your current lease expire?</p>
              <div className="grid gap-2">
                <label htmlFor="lease-expiry" className="text-sm font-medium">
                  Select date:
                </label>
                <DateInput id="lease-expiry" value={leaseExpiryDate} onChange={setLeaseExpiryDate} className="w-full" />
              </div>

              {leaseExpiryDate && isExpiryWithin60Days && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    Your lease expires within 60 days. You may need to provide notice soon if you plan to move.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Payment Date</h2>
              <p className="mb-6">On what day of the month does this renewal take place (e.g., payment date)?</p>
              <Select value={paymentDate || ""} onValueChange={setPaymentDate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day of month" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfMonth.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Notice to Vacate</h2>
              <p className="mb-6">
                Have you either received a Notice to Vacate from your Landlord OR submitted a Notice to Vacate to your
                Landlord at least 60 days prior to the expiry of your lease?
              </p>
              <div className="flex flex-col space-y-3">
                <Button
                  variant={noticeToVacate === "Submitted to Landlord" ? "default" : "outline"}
                  className={noticeToVacate === "Submitted to Landlord" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setNoticeToVacate("Submitted to Landlord")}
                >
                  Submitted to Landlord
                </Button>
                <Button
                  variant={noticeToVacate === "Received from Landlord" ? "default" : "outline"}
                  className={noticeToVacate === "Received from Landlord" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setNoticeToVacate("Received from Landlord")}
                >
                  Received from Landlord
                </Button>
                <Button
                  variant={noticeToVacate === "No" ? "default" : "outline"}
                  className={noticeToVacate === "No" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setNoticeToVacate("No")}
                >
                  No
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return noticeToVacate !== "No" ? (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Notice Acceptance</h2>
              <p className="mb-6">Has your Notice to Vacate been accepted?</p>
              <div className="flex space-x-4">
                <Button
                  variant={noticeAccepted === true ? "default" : "outline"}
                  className={noticeAccepted === true ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setNoticeAccepted(true)}
                >
                  Yes
                </Button>
                <Button
                  variant={noticeAccepted === false ? "default" : "outline"}
                  className={noticeAccepted === false ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setNoticeAccepted(false)}
                >
                  No
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Skip this step if no notice to vacate
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">No Notice to Vacate</h2>
              <p className="mb-6">
                You indicated that you have not submitted or received a Notice to Vacate. This may affect your move-in
                timeline.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Without a Notice to Vacate, you may be required to continue your current lease or provide proper
                  notice before moving.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Move Date</h2>
              <p className="mb-6">When is the earliest you are willing to move?</p>
              <div className="grid gap-2">
                <label htmlFor="earliest-move" className="text-sm font-medium">
                  Select date:
                </label>
                <DateInput
                  id="earliest-move"
                  value={earliestMoveDate}
                  onChange={setEarliestMoveDate}
                  className="w-full"
                />

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setEarliestMoveDate(addDays(new Date(), 30))}>
                    30 days
                  </Button>
                  <Button variant="outline" onClick={() => setEarliestMoveDate(addDays(new Date(), 60))}>
                    60 days
                  </Button>
                  <Button variant="outline" onClick={() => setEarliestMoveDate(addDays(new Date(), 90))}>
                    90 days
                  </Button>
                  <Button variant="outline" onClick={() => setEarliestMoveDate(addDays(new Date(), 120))}>
                    120 days
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  // Render the summary view
  const renderSummary = () => {
    // If user doesn't qualify, show disqualification message
    if (isRentalWithNameOnLease === false) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold">Not Qualified</h2>
            </div>
            <p className="mb-6 text-center">
              You do not qualify as a non-leaseholder for this process because you indicated that you are not currently
              living in a rental property with your name on the lease.
            </p>
            <div className="flex justify-center">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleFinish}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Non-Leaseholder Pre-Qualification Complete</h2>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-medium">Summary of Your Responses:</h3>

            <div className="bg-gray-50 p-4 rounded-md space-y-3">
              <div>
                <p className="text-sm text-gray-500">Current Living Situation</p>
                <p className="font-medium">Living in rental property with name on lease: Yes</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Lease Type</p>
                <p className="font-medium">{leaseType}</p>
              </div>

              {leaseType === "12 month lease" && leaseExpiryDate && (
                <div>
                  <p className="text-sm text-gray-500">Lease Expiry Date</p>
                  <p className="font-medium">{format(leaseExpiryDate, "PPP")}</p>
                  <p className="text-sm text-gray-500">
                    {isExpiryWithin60Days
                      ? "Your lease expires within 60 days"
                      : "Your lease expires more than 60 days from now"}
                  </p>
                </div>
              )}

              {leaseType === "Month-to-month" && paymentDate && (
                <div>
                  <p className="text-sm text-gray-500">Monthly Payment Date</p>
                  <p className="font-medium">Day {paymentDate} of each month</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Notice to Vacate</p>
                <p className="font-medium">{noticeToVacate}</p>
              </div>

              {noticeToVacate !== "No" && (
                <div>
                  <p className="text-sm text-gray-500">Notice Accepted</p>
                  <p className="font-medium">{noticeAccepted ? "Yes" : "No"}</p>
                </div>
              )}

              {earliestMoveDate && (
                <div>
                  <p className="text-sm text-gray-500">Earliest Move Date</p>
                  <p className="font-medium">{format(earliestMoveDate, "PPP")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleFinish}>
              Complete
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Determine if the next button should be disabled
  const isNextDisabled = () => {
    switch (step) {
      case 0:
        return isRentalWithNameOnLease === null
      case 1:
        return leaseType === null
      case 2:
        return leaseType === "12 month lease" ? leaseExpiryDate === null : paymentDate === null
      case 3:
        return noticeToVacate === null
      case 4:
        return noticeToVacate !== "No" && noticeAccepted === null
      case 5:
        return earliestMoveDate === null
      default:
        return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      {!showSummary && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-orange-500" />
        </div>
      )}

      {/* Current step or summary */}
      {showSummary ? renderSummary() : renderStep()}

      {/* Navigation buttons */}
      {!showSummary && (
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}>
            Back
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleNext}
            disabled={isNextDisabled()}
          >
            {step === totalSteps - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      )}
    </div>
  )
}
