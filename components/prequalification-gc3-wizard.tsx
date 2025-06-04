"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { format, addDays, isBefore } from "date-fns"
import { CalendarIcon, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Flag {
  flag1: boolean // Not yet submitted notice to vacate
  flag2: boolean // Earliest move date not within 60 days
  flag3: boolean // Has signed exclusivity agreement with realtor
  flag10: boolean // Lease not expiring within 60 days
  flag12: boolean // Not responsible for rent
  flag14: boolean // Notice to vacate not yet accepted
  flag17: boolean // Fully responsible for rent
  flag18: boolean // Partially responsible for rent
}

type EmploymentType = "full-time" | "part-time" | "self-employed" | "unemployed" | "retired" | "student"

type WorkflowType = "NLS1" | "NLS2" // NLS1 for single occupant, NLS2 for multiple occupants

export function PrequalificationGC3Wizard() {
  // State for tracking the current step
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // State for workflow type
  const [workflowType, setWorkflowType] = useState<WorkflowType | null>(null)

  // State for user responses
  const [occupantCount, setOccupantCount] = useState<string | null>(null)
  const [isOnLease, setIsOnLease] = useState<boolean | null>(null)
  const [leaseType, setLeaseType] = useState<string | null>(null)
  const [leaseExpiryDate, setLeaseExpiryDate] = useState<Date | null>(null)
  const [paymentDay, setPaymentDay] = useState<string | null>(null)
  const [hasNoticeToVacate, setHasNoticeToVacate] = useState<string | null>(null)
  const [submittedNoticeInTime, setSubmittedNoticeInTime] = useState<boolean | null>(null)
  const [isNoticeAccepted, setIsNoticeAccepted] = useState<boolean | null>(null)
  const [earliestMoveDate, setEarliestMoveDate] = useState<Date | null>(null)
  const [workingWithRealtor, setWorkingWithRealtor] = useState<boolean | null>(null)
  const [hasExclusivity, setHasExclusivity] = useState<boolean | null>(null)
  const [rentResponsibility, setRentResponsibility] = useState<string | null>(null)
  const [isStudent, setIsStudent] = useState<boolean>(false)
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>([])
  const [employmentTypeCode, setEmploymentTypeCode] = useState<string | null>(null)

  // State for flags
  const [flags, setFlags] = useState<Flag>({
    flag1: false,
    flag2: false,
    flag3: false,
    flag10: false,
    flag12: false,
    flag14: false,
    flag17: false,
    flag18: false,
  })

  // State for workflow completion
  const [isComplete, setIsComplete] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  // Calculate total steps based on conditional logic
  const getTotalSteps = () => {
    let totalSteps = 2 // Start with occupant count and lease question

    if (isOnLease === true) {
      totalSteps += 1 // Lease type

      if (leaseType === "12-month") {
        totalSteps += 1 // Lease expiry

        // Check if lease expires within 60 days
        if (leaseExpiryDate && isWithin60Days(leaseExpiryDate)) {
          totalSteps += 1 // Notice to vacate

          if (hasNoticeToVacate === "submitted") {
            totalSteps += 2 // Submitted in time, notice accepted
          }
        } else if (leaseExpiryDate) {
          totalSteps += 1 // Notice to vacate
        }
      } else if (leaseType === "month-to-month") {
        totalSteps += 1 // Payment day
      }
    }

    // Add steps for realtor, exclusivity, rent responsibility, employment
    totalSteps += 3

    return totalSteps
  }

  // Update progress whenever step changes
  useEffect(() => {
    const totalSteps = getTotalSteps()
    const progressPercentage = Math.min(Math.round(((step + 1) / totalSteps) * 100), 100)
    setProgress(progressPercentage)
  }, [step, isOnLease, leaseType, leaseExpiryDate, hasNoticeToVacate])

  // Helper function to update flags
  const updateFlag = (flag: keyof Flag, value: boolean) => {
    setFlags((prev) => {
      const updatedFlags = { ...prev, [flag]: value }
      // Log the flag change to console
      console.log(`Flag ${flag} set to ${value}`, updatedFlags)
      return updatedFlags
    })
  }

  // Check if a date is within 60 days from today
  const isWithin60Days = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    const sixtyDaysFromNow = addDays(today, 60)
    return isBefore(date, sixtyDaysFromNow)
  }

  // Handle employment type selection
  const handleEmploymentTypeChange = (type: EmploymentType, checked: boolean) => {
    if (checked) {
      setSelectedEmploymentTypes((prev) => [...prev, type])
    } else {
      setSelectedEmploymentTypes((prev) => prev.filter((t) => t !== type))
    }
  }

  // Determine employment type code based on selected types and workflow
  const determineEmploymentTypeCode = () => {
    const hasFullTime = selectedEmploymentTypes.includes("full-time")
    const hasPartTime = selectedEmploymentTypes.includes("part-time")
    const hasSelfEmployed = selectedEmploymentTypes.includes("self-employed")
    const hasRetired = selectedEmploymentTypes.includes("retired")
    const hasUnemployed = selectedEmploymentTypes.includes("unemployed")
    const hasStudent = selectedEmploymentTypes.includes("student")

    // For NLS1 workflow (single occupant)
    if (workflowType === "NLS1") {
      // For non-responsible rent (FLAG12)
      if (flags.flag12) {
        if (hasStudent) {
          if (hasRetired) return "ET_NLS1"
          if (hasUnemployed) return "ET_NLS2"
          if (hasFullTime && !hasPartTime && !hasSelfEmployed) return "ET_NLS3"
          if (!hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_NLS4"
          if (!hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_NLS5"
          if (hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_NLS6"
          if (hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_NLS7"
          if (!hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS8"
          if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS9"
        } else {
          if (!hasFullTime && hasPartTime) return "ET_NLS10"
          if (hasFullTime && !hasPartTime) return "ET_NLS11"
          if (hasSelfEmployed) return "ET_NLS12"
          if (hasRetired) return "ET_NLS13"
          if (hasUnemployed) return "ET_NLS14"
          if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS15"
          if (hasFullTime && hasPartTime) return "ET_NLS16"
          if (hasFullTime && hasSelfEmployed) return "ET_NLS17"
          if (hasPartTime && hasSelfEmployed) return "ET_NLS18"
        }
      }

      // For fully responsible rent (FLAG17)
      if (flags.flag17) {
        if (hasStudent) {
          if (hasRetired) return "ET_NLS55"
          if (hasUnemployed) return "ET_NLS56"
          if (hasFullTime && !hasPartTime && !hasSelfEmployed) return "ET_NLS57"
          if (!hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_NLS58"
          if (!hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_NLS59"
          if (hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_NLS60"
          if (hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_NLS61"
          if (!hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS62"
          if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS63"
        } else {
          if (!hasFullTime && hasPartTime) return "ET_NLS64"
          if (hasFullTime && !hasPartTime) return "ET_NLS65"
          if (hasSelfEmployed) return "ET_NLS66"
          if (hasRetired) return "ET_NLS67"
          if (hasUnemployed) return "ET_NLS68"
          if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS69"
          if (hasFullTime && hasPartTime) return "ET_NLS70"
          if (hasFullTime && hasSelfEmployed) return "ET_NLS71"
          if (hasPartTime && hasSelfEmployed) return "ET_NLS72"
        }
      }
    }

    // For NLS2 workflow (multiple occupants)
    else if (workflowType === "NLS2") {
      // For non-responsible rent (FLAG12)
      if (flags.flag12) {
        if (hasStudent) {
          if (hasRetired) return "ET_NLS19"
          if (hasUnemployed) return "ET_NLS20"
          if (hasFullTime && !hasPartTime && !hasSelfEmployed) return "ET_NLS21"
          if (!hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_NLS22"
          if (!hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_NLS23"
          if (hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_NLS24"
          if (hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_NLS25"
          if (!hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS26"
          if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS27"
        } else {
          if (!hasFullTime && hasPartTime) return "ET_NLS28"
          if (hasFullTime && !hasPartTime) return "ET_NLS29"
          if (hasSelfEmployed) return "ET_NLS30"
          if (hasRetired) return "ET_NLS31"
          if (hasUnemployed) return "ET_NLS32"
          if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS33"
          if (hasFullTime && hasPartTime) return "ET_NLS34"
          if (hasFullTime && hasSelfEmployed) return "ET_NLS35"
          if (hasPartTime && hasSelfEmployed) return "ET_NLS36"
        }
      }

      // For fully responsible rent (FLAG17)
      if (flags.flag17) {
        if (hasStudent) {
          if (hasRetired) return "ET_NLS73"
          if (hasUnemployed) return "ET_NLS74"
          if (hasFullTime && !hasPartTime && !hasSelfEmployed) return "ET_NLS75"
          if (!hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_NLS76"
          if (!hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_NLS77"
          if (hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_NLS78"
          if (hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_NLS79"
          if (!hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS80"
          if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS81"
        } else {
          if (!hasFullTime && hasPartTime) return "ET_NLS82"
          if (hasFullTime && !hasPartTime) return "ET_NLS83"
          if (hasSelfEmployed) return "ET_NLS84"
          if (hasRetired) return "ET_NLS85"
          if (hasUnemployed) return "ET_NLS86"
          if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_NLS87"
          if (hasFullTime && hasPartTime) return "ET_NLS88"
          if (hasFullTime && hasSelfEmployed) return "ET_NLS89"
          if (hasPartTime && hasSelfEmployed) return "ET_NLS90"
        }
      }
    }

    return null
  }

  // Handle next step logic
  const handleNext = () => {
    // Special case handling based on current step
    if (step === 0) {
      // Set workflow type based on occupant count
      if (occupantCount === "single") {
        setWorkflowType("NLS1")
      } else if (occupantCount === "multiple") {
        setWorkflowType("NLS2")
      }
      setStep((prev) => prev + 1)
      return
    }

    if (step === 1 && isOnLease === false) {
      // End workflow for non-lease holders
      setIsComplete(true)
      return
    }

    // Check if we're at the employment status step (final step)
    if (step === getLastStepIndex()) {
      setShowSummary(true)
      return
    }

    // Otherwise, proceed to next step
    setStep((prev) => prev + 1)
  }

  // Get the index of the last step based on the current path
  const getLastStepIndex = () => {
    let lastStep = 1 // After occupant count

    if (isOnLease === true) {
      lastStep = 2 // Lease type

      if (leaseType === "12-month") {
        lastStep = 3 // Lease expiry

        if (leaseExpiryDate) {
          if (isWithin60Days(leaseExpiryDate)) {
            lastStep = 4 // Notice to vacate

            if (hasNoticeToVacate === "submitted") {
              lastStep = 6 // After notice accepted
            } else {
              lastStep = 7 // Earliest move date
            }
          } else {
            lastStep = 5 // Notice to vacate for non-expiring lease
          }
        }
      } else if (leaseType === "month-to-month") {
        lastStep = 7 // After payment day
      }
    }

    // Add steps for realtor, exclusivity, rent responsibility, employment
    return lastStep + 3
  }

  // Handle back button
  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1)
    }
  }

  // Handle restart
  const handleRestart = () => {
    // Reset all state
    setStep(0)
    setWorkflowType(null)
    setOccupantCount(null)
    setIsOnLease(null)
    setLeaseType(null)
    setLeaseExpiryDate(null)
    setPaymentDay(null)
    setHasNoticeToVacate(null)
    setSubmittedNoticeInTime(null)
    setIsNoticeAccepted(null)
    setEarliestMoveDate(null)
    setWorkingWithRealtor(null)
    setHasExclusivity(null)
    setRentResponsibility(null)
    setIsStudent(false)
    setSelectedEmploymentTypes([])
    setEmploymentTypeCode(null)
    setFlags({
      flag1: false,
      flag2: false,
      flag3: false,
      flag10: false,
      flag12: false,
      flag14: false,
      flag17: false,
      flag18: false,
    })
    setIsComplete(false)
    setShowSummary(false)
  }

  // Handle finish
  const handleFinish = () => {
    // In a real application, you would save the data to a database
    console.log("Workflow completed with the following data:", {
      workflowType,
      occupantCount,
      isOnLease,
      leaseType,
      leaseExpiryDate,
      paymentDay,
      hasNoticeToVacate,
      submittedNoticeInTime,
      isNoticeAccepted,
      earliestMoveDate,
      workingWithRealtor,
      hasExclusivity,
      rentResponsibility,
      isStudent,
      selectedEmploymentTypes,
      employmentTypeCode,
      flags,
    })

    // Set user role code in localStorage
    localStorage.setItem("userRoleCode", "GC3")

    // Navigate to dashboard or next step
    window.location.href = "/"
  }

  // Generate days of month for dropdown
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString())

  // Render occupant count step
  const renderOccupantCountStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Occupant Information</h2>
      <p className="text-gray-600">How many occupants will be living in the property?</p>

      <RadioGroup value={occupantCount || ""} onValueChange={setOccupantCount}>
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="single" id="occupant-single" />
          <Label htmlFor="occupant-single">Single Occupant (Just me)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="multiple" id="occupant-multiple" />
          <Label htmlFor="occupant-multiple">Multiple Occupants (Me and others)</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!occupantCount}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render lease question step
  const renderLeaseQuestion = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Property and Lease Information</h2>
      <p className="text-gray-600">Are you currently living in a rental property AND your name is on the lease?</p>

      <RadioGroup
        value={isOnLease === null ? undefined : isOnLease.toString()}
        onValueChange={(value) => setIsOnLease(value === "true")}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="lease-yes" />
          <Label htmlFor="lease-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="lease-no" />
          <Label htmlFor="lease-no">No</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isOnLease === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render lease type step
  const renderLeaseType = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Lease Type</h2>
      <p className="text-gray-600">What type of lease are you on?</p>

      <RadioGroup value={leaseType || ""} onValueChange={setLeaseType}>
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="12-month" id="lease-12month" />
          <Label htmlFor="lease-12month">12-month lease</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="month-to-month" id="lease-monthly" />
          <Label htmlFor="lease-monthly">Month-to-month</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!leaseType} className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black">
          Next
        </Button>
      </div>
    </div>
  )

  // Render lease expiry step
  const renderLeaseExpiry = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Lease Expiry</h2>
      <p className="text-gray-600">When does your current lease expire?</p>

      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!leaseExpiryDate ? "text-muted-foreground" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {leaseExpiryDate ? format(leaseExpiryDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={leaseExpiryDate || undefined}
              onSelect={(date) => {
                setLeaseExpiryDate(date)
                if (date) {
                  const within60Days = isWithin60Days(date)
                  if (!within60Days) {
                    updateFlag("flag10", true)
                  } else {
                    updateFlag("flag10", false)
                  }
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {leaseExpiryDate && !isWithin60Days(leaseExpiryDate) && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-800">Notice</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your lease expires beyond 60 days. This may affect your eligibility.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!leaseExpiryDate}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render notice to vacate step (within 60 days)
  const renderNoticeToVacate = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice to Vacate</h2>
      <p className="text-gray-600">Have you either received from OR submitted to your Landlord a Notice to Vacate?</p>

      <RadioGroup value={hasNoticeToVacate || ""} onValueChange={setHasNoticeToVacate}>
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="submitted" id="notice-submitted" />
          <Label htmlFor="notice-submitted">Submitted to Landlord</Label>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="received" id="notice-received" />
          <Label htmlFor="notice-received">Received from Landlord</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="not-yet" id="notice-not-yet" />
          <Label htmlFor="notice-not-yet">Not yet</Label>
        </div>
      </RadioGroup>

      {hasNoticeToVacate === "not-yet" && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            You need to submit a Notice to Vacate to your landlord.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={() => {
            if (hasNoticeToVacate === "not-yet") {
              updateFlag("flag1", true)
            } else {
              updateFlag("flag1", false)
            }
            handleNext()
          }}
          disabled={!hasNoticeToVacate}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render notice to vacate step (beyond 60 days)
  const renderNoticeToVacateBeyond60 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice to Vacate</h2>
      <p className="text-gray-600">Have you either received from OR submitted to your Landlord a Notice to Vacate?</p>

      <RadioGroup value={hasNoticeToVacate || ""} onValueChange={setHasNoticeToVacate}>
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="yes" id="notice-yes" />
          <Label htmlFor="notice-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="notice-no" />
          <Label htmlFor="notice-no">No</Label>
        </div>
      </RadioGroup>

      {hasNoticeToVacate === "no" && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            You need to submit a Notice to Vacate to your landlord.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={() => {
            if (hasNoticeToVacate === "no") {
              updateFlag("flag1", true)
            } else {
              updateFlag("flag1", false)
            }
            handleNext()
          }}
          disabled={!hasNoticeToVacate}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render notice submission timing step
  const renderNoticeSubmissionTiming = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice Submission Timing</h2>
      <p className="text-gray-600">
        Did you submit the Notice to Vacate to your Landlord at least 60 days prior to the expiry of your lease?
      </p>

      <RadioGroup
        value={submittedNoticeInTime === null ? undefined : submittedNoticeInTime.toString()}
        onValueChange={(value) => setSubmittedNoticeInTime(value === "true")}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="notice-timing-yes" />
          <Label htmlFor="notice-timing-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="notice-timing-no" />
          <Label htmlFor="notice-timing-no">No</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={submittedNoticeInTime === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render notice acceptance step
  const renderNoticeAcceptance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice Acceptance</h2>
      <p className="text-gray-600">Has your Notice to Vacate been accepted?</p>

      <RadioGroup
        value={isNoticeAccepted === null ? undefined : isNoticeAccepted.toString()}
        onValueChange={(value) => {
          const accepted = value === "true"
          setIsNoticeAccepted(accepted)
          if (!accepted) {
            updateFlag("flag14", true)
          } else {
            updateFlag("flag14", false)
          }
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="notice-accepted-yes" />
          <Label htmlFor="notice-accepted-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="notice-accepted-no" />
          <Label htmlFor="notice-accepted-no">Not yet</Label>
        </div>
      </RadioGroup>

      {isNoticeAccepted === false && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            Your Notice to Vacate has not been accepted yet. This may affect your eligibility.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isNoticeAccepted === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render earliest move date step
  const renderEarliestMoveDate = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Earliest Move Date</h2>
      <p className="text-gray-600">When is the earliest you are willing to move?</p>

      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!earliestMoveDate ? "text-muted-foreground" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {earliestMoveDate ? format(earliestMoveDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={earliestMoveDate || undefined}
              onSelect={(date) => {
                setEarliestMoveDate(date)
                if (date) {
                  const within60Days = isWithin60Days(date)
                  if (!within60Days) {
                    updateFlag("flag2", true)
                  } else {
                    updateFlag("flag2", false)
                    // For NLS2, remove flag10 if exists
                    if (workflowType === "NLS2" && flags.flag10) {
                      updateFlag("flag10", false)
                    }
                  }
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {earliestMoveDate && !isWithin60Days(earliestMoveDate) && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            Your earliest move date is beyond 60 days. This may affect your eligibility.
          </AlertDescription>
        </Alert>
      )}

      {earliestMoveDate && isWithin60Days(earliestMoveDate) && flags.flag10 && workflowType === "NLS2" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            You're willing to move within 60 days, which improves your eligibility.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!earliestMoveDate}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render payment day step (for month-to-month lease)
  const renderPaymentDay = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Payment Day</h2>
      <p className="text-gray-600">
        On what day of the month does this renew (i.e. your payment date)? For example, you make payment on the first of
        the month.
      </p>

      <Select value={paymentDay || ""} onValueChange={setPaymentDay}>
        <SelectTrigger>
          <SelectValue placeholder="Select day of month" />
        </SelectTrigger>
        <SelectContent>
          {daysOfMonth.map((day) => (
            <SelectItem key={day} value={day}>
              {day}
              {day === "1" ? "st" : day === "2" ? "nd" : day === "3" ? "rd" : "th"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!paymentDay} className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black">
          Next
        </Button>
      </div>
    </div>
  )

  // Render realtor question step
  const renderRealtorQuestion = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Real Estate Agent</h2>
      <p className="text-gray-600">Are you working with a licensed realtor?</p>

      <RadioGroup
        value={workingWithRealtor === null ? undefined : workingWithRealtor.toString()}
        onValueChange={(value) => setWorkingWithRealtor(value === "true")}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="realtor-yes" />
          <Label htmlFor="realtor-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="realtor-no" />
          <Label htmlFor="realtor-no">No</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={workingWithRealtor === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render exclusivity agreement step
  const renderExclusivityAgreement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Exclusivity Agreement</h2>
      <p className="text-gray-600">Have you signed an exclusivity agreement?</p>

      <RadioGroup
        value={hasExclusivity === null ? undefined : hasExclusivity.toString()}
        onValueChange={(value) => {
          const hasAgreement = value === "true"
          setHasExclusivity(hasAgreement)
          if (hasAgreement) {
            updateFlag("flag3", true)
          } else {
            updateFlag("flag3", false)
          }
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="exclusivity-yes" />
          <Label htmlFor="exclusivity-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="exclusivity-no" />
          <Label htmlFor="exclusivity-no">No</Label>
        </div>
      </RadioGroup>

      {hasExclusivity && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            Having an exclusivity agreement may affect your eligibility.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={hasExclusivity === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render rent responsibility step
  const renderRentResponsibility = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Responsibility for Rent</h2>
      <p className="text-gray-600">What is your level of responsibility in paying the rent every month?</p>

      <RadioGroup
        value={rentResponsibility || ""}
        onValueChange={(value) => {
          setRentResponsibility(value)
          if (value === "fully") {
            updateFlag("flag17", true)
            updateFlag("flag18", false)
            updateFlag("flag12", false)
          } else if (value === "partially") {
            updateFlag("flag17", false)
            updateFlag("flag18", true)
            updateFlag("flag12", false)
          } else if (value === "not") {
            updateFlag("flag17", false)
            updateFlag("flag18", false)
            updateFlag("flag12", true)
          }
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="fully" id="rent-fully" />
          <Label htmlFor="rent-fully">I am fully responsible</Label>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="partially" id="rent-partially" />
          <Label htmlFor="rent-partially">I am partially responsible</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="not" id="rent-not" />
          <Label htmlFor="rent-not">I am not responsible</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!rentResponsibility}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render employment status step
  const renderEmploymentStatus = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Employment Status</h2>
      <p className="text-gray-600">Select your current employment status (select all that apply):</p>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-student"
            checked={selectedEmploymentTypes.includes("student")}
            onCheckedChange={(checked) => {
              setIsStudent(checked as boolean)
              handleEmploymentTypeChange("student", checked as boolean)
            }}
          />
          <Label htmlFor="employment-student">Student</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-full-time"
            checked={selectedEmploymentTypes.includes("full-time")}
            onCheckedChange={(checked) => handleEmploymentTypeChange("full-time", checked as boolean)}
          />
          <Label htmlFor="employment-full-time">Full-Time Employment</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-part-time"
            checked={selectedEmploymentTypes.includes("part-time")}
            onCheckedChange={(checked) => handleEmploymentTypeChange("part-time", checked as boolean)}
          />
          <Label htmlFor="employment-part-time">Part-Time Employment</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-self-employed"
            checked={selectedEmploymentTypes.includes("self-employed")}
            onCheckedChange={(checked) => handleEmploymentTypeChange("self-employed", checked as boolean)}
          />
          <Label htmlFor="employment-self-employed">Self-Employed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-unemployed"
            checked={selectedEmploymentTypes.includes("unemployed")}
            onCheckedChange={(checked) => handleEmploymentTypeChange("unemployed", checked as boolean)}
          />
          <Label htmlFor="employment-unemployed">Unemployed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-retired"
            checked={selectedEmploymentTypes.includes("retired")}
            onCheckedChange={(checked) => handleEmploymentTypeChange("retired", checked as boolean)}
          />
          <Label htmlFor="employment-retired">Retired</Label>
        </div>
      </div>

      {selectedEmploymentTypes.length === 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            Please select at least one employment status to continue.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={() => {
            const code = determineEmploymentTypeCode()
            setEmploymentTypeCode(code)
            handleNext()
          }}
          disabled={selectedEmploymentTypes.length === 0}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render workflow completion message
  const renderCompletionMessage = () => {
    if (isOnLease === false) {
      return (
        <div className="space-y-6 text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-semibold text-black">Not Eligible</h2>
          <p className="text-gray-600">You must be on a lease to proceed with this workflow.</p>
          <Button onClick={handleRestart} className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black">
            Start Over
          </Button>
        </div>
      )
    }

    return null
  }

  // Render summary
  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-semibold text-black mt-4">Pre-Qualification Complete</h2>
        <p className="text-gray-600 mt-2">Thank you for completing the pre-qualification process.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">Workflow Type:</div>
            <div className="font-medium">
              {workflowType === "NLS1" ? "Single Occupant (NLS1)" : "Multiple Occupants (NLS2)"}
            </div>

            <div className="text-gray-600">On Lease:</div>
            <div className="font-medium">{isOnLease ? "Yes" : "No"}</div>

            {isOnLease && (
              <>
                <div className="text-gray-600">Lease Type:</div>
                <div className="font-medium">{leaseType}</div>

                {leaseType === "12-month" && (
                  <>
                    <div className="text-gray-600">Lease Expiry:</div>
                    <div className="font-medium">{leaseExpiryDate ? format(leaseExpiryDate, "PPP") : "N/A"}</div>

                    <div className="text-gray-600">Notice to Vacate:</div>
                    <div className="font-medium">
                      {hasNoticeToVacate === "submitted"
                        ? "Submitted to Landlord"
                        : hasNoticeToVacate === "received"
                          ? "Received from Landlord"
                          : hasNoticeToVacate === "not-yet" || hasNoticeToVacate === "no"
                            ? "Not yet"
                            : hasNoticeToVacate === "yes"
                              ? "Yes"
                              : "N/A"}
                    </div>

                    {hasNoticeToVacate === "submitted" && (
                      <>
                        <div className="text-gray-600">Submitted in Time:</div>
                        <div className="font-medium">{submittedNoticeInTime ? "Yes" : "No"}</div>

                        <div className="text-gray-600">Notice Accepted:</div>
                        <div className="font-medium">{isNoticeAccepted ? "Yes" : "Not yet"}</div>
                      </>
                    )}
                  </>
                )}

                {leaseType === "month-to-month" && (
                  <>
                    <div className="text-gray-600">Payment Day:</div>
                    <div className="font-medium">{paymentDay || "N/A"}</div>
                  </>
                )}
              </>
            )}

            <div className="text-gray-600">Earliest Move Date:</div>
            <div className="font-medium">{earliestMoveDate ? format(earliestMoveDate, "PPP") : "N/A"}</div>

            <div className="text-gray-600">Working with Realtor:</div>
            <div className="font-medium">{workingWithRealtor ? "Yes" : "No"}</div>

            {workingWithRealtor && (
              <>
                <div className="text-gray-600">Exclusivity Agreement:</div>
                <div className="font-medium">{hasExclusivity ? "Yes" : "No"}</div>
              </>
            )}

            <div className="text-gray-600">Rent Responsibility:</div>
            <div className="font-medium">
              {rentResponsibility === "fully"
                ? "Fully Responsible"
                : rentResponsibility === "partially"
                  ? "Partially Responsible"
                  : "Not Responsible"}
            </div>

            <div className="text-gray-600">Student Status:</div>
            <div className="font-medium">{isStudent ? "Student" : "Non-Student"}</div>

            <div className="text-gray-600">Employment Types:</div>
            <div className="font-medium">
              {selectedEmploymentTypes.length > 0
                ? selectedEmploymentTypes.map((type) => type.charAt(0).toUpperCase() + type.slice(1)).join(", ")
                : "None selected"}
            </div>

            {employmentTypeCode && (
              <>
                <div className="text-gray-600">Employment Type Code:</div>
                <div className="font-medium">{employmentTypeCode}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Flags Set</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(flags).map(([flag, value]) =>
            value ? (
              <div key={flag} className="col-span-1 flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium">{flag}</span>
              </div>
            ) : null,
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleRestart}>
          Start Over
        </Button>
        <Button onClick={handleFinish} className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black">
          Finish
        </Button>
      </div>
    </div>
  )

  // Determine which step to render
  const renderCurrentStep = () => {
    if (isComplete) {
      return renderCompletionMessage()
    }

    if (showSummary) {
      return renderSummary()
    }

    switch (step) {
      case 0:
        return renderOccupantCountStep()
      case 1:
        return renderLeaseQuestion()
      case 2:
        return renderLeaseType()
      case 3:
        if (leaseType === "12-month") {
          return renderLeaseExpiry()
        } else if (leaseType === "month-to-month") {
          return renderPaymentDay()
        }
        return null
      case 4:
        if (leaseExpiryDate && isWithin60Days(leaseExpiryDate)) {
          return renderNoticeToVacate()
        } else {
          return renderNoticeToVacateBeyond60()
        }
      case 5:
        if (hasNoticeToVacate === "submitted") {
          return renderNoticeSubmissionTiming()
        } else {
          return renderEarliestMoveDate()
        }
      case 6:
        if (hasNoticeToVacate === "submitted") {
          return renderNoticeAcceptance()
        } else {
          return renderRealtorQuestion()
        }
      case 7:
        if (hasNoticeToVacate === "submitted") {
          return renderEarliestMoveDate()
        } else if (workingWithRealtor) {
          return renderExclusivityAgreement()
        } else {
          return renderRentResponsibility()
        }
      case 8:
        if (workingWithRealtor) {
          return renderRentResponsibility()
        } else {
          return renderEmploymentStatus()
        }
      case 9:
        return renderEmploymentStatus()
      default:
        return renderOccupantCountStep()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Pre-Qualification (GC3-{workflowType === "NLS1" ? "NLS1" : "NLS2"} Non-Applicant)
          </span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-orange-500" />
      </div>

      {renderCurrentStep()}
    </div>
  )
}
