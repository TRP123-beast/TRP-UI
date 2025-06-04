"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { Info } from "lucide-react"
import { DateInput } from "@/components/ui/date-input"

// Define employment status options
type EmploymentStatus =
  | "Student"
  | "Employed Full-Time"
  | "Employed Part-Time"
  | "Self-Employed"
  | "Unemployed"
  | "Retired"

interface Flag {
  name: string
  value: boolean
  description: string
}

export function PrequalificationLS3Wizard() {
  // Wizard state
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [flags, setFlags] = useState<Flag[]>([])

  // Step-specific state
  const [currentlyLeaseholder, setCurrentlyLeaseholder] = useState<boolean | null>(null)
  const [leaseType, setLeaseType] = useState<"12-month lease" | "Month-to-month" | null>(null)
  const [leaseExpiry, setLeaseExpiry] = useState<Date | null>(null)
  const [leaseRenewalDay, setLeaseRenewalDay] = useState<Date | null>(null)
  const [noticeToVacate, setNoticeToVacate] = useState<
    "Not yet" | "Submitted to Landlord" | "Received from Landlord" | null
  >(null)
  const [noticeSubmittedSixtyDaysPrior, setNoticeSubmittedSixtyDaysPrior] = useState<boolean | null>(null)
  const [noticeAccepted, setNoticeAccepted] = useState<boolean | null>(null)
  const [earliestMoveDate, setEarliestMoveDate] = useState<Date | null>(null)
  const [willingToSignEarlier, setWillingToSignEarlier] = useState<boolean | null>(null)
  const [earliestSignDate, setEarliestSignDate] = useState<Date | null>(null)
  const [workingWithRealtor, setWorkingWithRealtor] = useState<boolean | null>(null)
  const [exclusivityAgreement, setExclusivityAgreement] = useState<boolean | null>(null)
  const [rentResponsibility, setRentResponsibility] = useState<
    "I am fully responsible" | "I am partially responsible" | "I am not responsible" | null
  >(null)
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus[]>([])

  // Calculate if dates are within 60 days
  const isWithinSixtyDays = useCallback((date: Date | null) => {
    if (!date) return false
    const today = new Date()
    const sixtyDaysFromNow = new Date(today)
    sixtyDaysFromNow.setDate(today.getDate() + 60)
    return date <= sixtyDaysFromNow
  }, [])

  // Update flags
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
  }, [])

  // Update employment status flag based on selection
  const updateEmploymentFlag = useCallback(() => {
    const isStudent = employmentStatus.includes("Student")
    const isFullTime = employmentStatus.includes("Employed Full-Time")
    const isPartTime = employmentStatus.includes("Employed Part-Time")
    const isSelfEmployed = employmentStatus.includes("Self-Employed")
    const isUnemployed = employmentStatus.includes("Unemployed")
    const isRetired = employmentStatus.includes("Retired")

    let flagCode = ""

    if (isStudent) {
      if (isRetired) flagCode = "ET_LS73"
      else if (isUnemployed) flagCode = "ET_LS74"
      else if (isFullTime && !isPartTime && !isSelfEmployed) flagCode = "ET_LS75"
      else if (!isFullTime && isPartTime && !isSelfEmployed) flagCode = "ET_LS76"
      else if (!isFullTime && !isPartTime && isSelfEmployed) flagCode = "ET_LS77"
      else if (isFullTime && isPartTime && !isSelfEmployed) flagCode = "ET_LS78"
      else if (isFullTime && !isPartTime && isSelfEmployed) flagCode = "ET_LS79"
      else if (!isFullTime && isPartTime && isSelfEmployed) flagCode = "ET_LS80"
      else if (isFullTime && isPartTime && isSelfEmployed) flagCode = "ET_LS81"
    } else {
      if (isPartTime && !isFullTime && !isSelfEmployed) flagCode = "ET_LS82"
      else if (isFullTime && !isPartTime && !isSelfEmployed) flagCode = "ET_LS83"
      else if (isSelfEmployed && !isFullTime && !isPartTime) flagCode = "ET_LS84"
      else if (isRetired) flagCode = "ET_LS85"
      else if (isUnemployed) flagCode = "ET_LS86"
      else if (isFullTime && isPartTime && isSelfEmployed) flagCode = "ET_LS87"
      else if (isFullTime && isPartTime && !isSelfEmployed) flagCode = "ET_LS88"
      else if (isFullTime && !isPartTime && isSelfEmployed) flagCode = "ET_LS89"
      else if (!isFullTime && isPartTime && isSelfEmployed) flagCode = "ET_LS90"
    }

    if (flagCode) {
      updateFlag(flagCode, true, `Employment status: ${employmentStatus.join(", ")}`)
    }
  }, [employmentStatus, updateFlag])

  // Effect to update progress when step changes
  useEffect(() => {
    // Calculate total steps
    let totalSteps = 10 // Base number of steps

    // Adjust based on user path through the wizard
    if (leaseType === "Month-to-month") {
      totalSteps = 5 // Month-to-month path is shorter
    } else if (leaseType === "12-month lease") {
      if (leaseExpiry && !isWithinSixtyDays(leaseExpiry)) {
        totalSteps = 8 // Lease not expiring soon path
      }
    }

    const progressPercentage = Math.min(Math.round(((step + 1) / totalSteps) * 100), 100)
    setProgress(progressPercentage)
  }, [step, leaseType, leaseExpiry, isWithinSixtyDays])

  // Effect to set flags based on user selections
  useEffect(() => {
    // Flag 1 - Has not received or submitted notice to vacate
    if (noticeToVacate === "Not yet") {
      updateFlag("FLAG1", true, "Has not received or submitted notice to vacate")
    }

    // Flag 2 - Earliest move date is not within 60 days
    if (earliestMoveDate && !isWithinSixtyDays(earliestMoveDate)) {
      updateFlag("FLAG2", true, "Earliest move date is not within 60 days")
    }

    // Flag 3 - Working with realtor and has exclusivity agreement
    if (workingWithRealtor && exclusivityAgreement) {
      updateFlag("FLAG3", true, "Working with realtor with exclusivity agreement")
    }

    // Flag 10A - Lease expiry date is not within 60 days
    if (leaseExpiry && !isWithinSixtyDays(leaseExpiry)) {
      updateFlag("FLAG10A", true, "Lease expiry is not within 60 days")
    }

    // Flag 10B - Earliest move date is within 60 days and FLAG10A exists
    if (earliestMoveDate && isWithinSixtyDays(earliestMoveDate) && flags.some((f) => f.name === "FLAG10A" && f.value)) {
      updateFlag("FLAG10B", true, "Earliest move date is within 60 days while lease expiry is not")
    }

    // Flag 14 - Notice not yet accepted by landlord
    if (noticeAccepted === false) {
      updateFlag("FLAG14", true, "Notice to vacate not yet accepted by landlord")
    }

    // Flag 15 - Willing to sign lease earlier
    if (willingToSignEarlier) {
      updateFlag("FLAG15", true, "Willing to sign lease earlier to secure property")
    }

    // Flag 17 - Fully responsible for rent
    if (rentResponsibility === "I am fully responsible") {
      updateFlag("FLAG17", true, "Fully responsible for rent payments")
    }

    // Flag 18 - Partially responsible for rent
    if (rentResponsibility === "I am partially responsible") {
      updateFlag("FLAG18", true, "Partially responsible for rent payments")
    }
  }, [
    noticeToVacate,
    earliestMoveDate,
    workingWithRealtor,
    exclusivityAgreement,
    leaseExpiry,
    noticeAccepted,
    willingToSignEarlier,
    rentResponsibility,
    isWithinSixtyDays,
    updateFlag,
    flags,
  ])

  // Update employment flags when employment status changes
  useEffect(() => {
    if (employmentStatus.length > 0) {
      updateEmploymentFlag()
    }
  }, [employmentStatus, updateEmploymentFlag])

  const handleNext = () => {
    const nextStep = step + 1
    setStep(nextStep)
  }

  const handleBack = () => {
    const prevStep = Math.max(0, step - 1)
    setStep(prevStep)
  }

  const handleEmploymentStatusChange = (status: EmploymentStatus) => {
    setEmploymentStatus((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status)
      } else {
        return [...prev, status]
      }
    })
  }

  // Render functions for each step
  const renderCurrentlyLeaseholderStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Current Leasing Status</h2>
      <p className="text-gray-600">Are you currently living in a rental property AND your name is on the lease?</p>

      <div className="flex space-x-4">
        <Button
          variant={currentlyLeaseholder === true ? "default" : "outline"}
          className={currentlyLeaseholder === true ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setCurrentlyLeaseholder(true)}
        >
          Yes
        </Button>
        <Button
          variant={currentlyLeaseholder === false ? "default" : "outline"}
          className={currentlyLeaseholder === false ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setCurrentlyLeaseholder(false)}
        >
          No
        </Button>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={currentlyLeaseholder === null}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderLeaseTypeStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Lease Type</h2>
      <p className="text-gray-600">What type of lease are you on?</p>

      <RadioGroup
        value={leaseType || ""}
        onValueChange={(value) => setLeaseType(value as "12-month lease" | "Month-to-month")}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="12-month lease" id="twelve-month" />
          <Label htmlFor="twelve-month" className="text-base">
            12-month lease
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Month-to-month" id="month-to-month" />
          <Label htmlFor="month-to-month" className="text-base">
            Month-to-month
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext} disabled={!leaseType}>
          Next
        </Button>
      </div>
    </div>
  )

  const renderLeaseEndDateStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Lease End Date</h2>
      <p className="text-gray-600">When does your current lease expire?</p>

      <div className="grid gap-2">
        <label htmlFor="lease-expiry" className="text-sm font-medium">
          Select date:
        </label>
        <DateInput id="lease-expiry" value={leaseExpiry} onChange={setLeaseExpiry} className="w-full" />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext} disabled={!leaseExpiry}>
          Next
        </Button>
      </div>
    </div>
  )

  const renderMonthlyRenewalDateStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Monthly Renewal Date</h2>
      <p className="text-gray-600">
        On what day of the month does this renew (i.e. your payment date)? For example, you make payment on the first of
        the month.
      </p>

      <div className="grid gap-2">
        <label htmlFor="lease-renewal" className="text-sm font-medium">
          Select day:
        </label>
        <DateInput id="lease-renewal" value={leaseRenewalDay} onChange={setLeaseRenewalDay} className="w-full" />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={!leaseRenewalDay}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderNoticeToVacateStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice to Vacate</h2>
      <p className="text-gray-600">Have you either received from OR submitted to your Landlord a Notice to Vacate?</p>

      <RadioGroup
        value={noticeToVacate || ""}
        onValueChange={(value) =>
          setNoticeToVacate(value as "Not yet" | "Submitted to Landlord" | "Received from Landlord")
        }
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Not yet" id="not-yet" />
          <Label htmlFor="not-yet" className="text-base">
            Not yet
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Submitted to Landlord" id="submitted" />
          <Label htmlFor="submitted" className="text-base">
            Submitted to Landlord
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Received from Landlord" id="received" />
          <Label htmlFor="received" className="text-base">
            Received from Landlord
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={!noticeToVacate}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderNoticeSixtyDaysPriorStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice Timing</h2>
      <p className="text-gray-600">
        Did you submit the Notice to Vacate to your Landlord at least 60 days prior to the expiry of your Lease?
      </p>

      <div className="flex space-x-4">
        <Button
          variant={noticeSubmittedSixtyDaysPrior === true ? "default" : "outline"}
          className={noticeSubmittedSixtyDaysPrior === true ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setNoticeSubmittedSixtyDaysPrior(true)}
        >
          Yes
        </Button>
        <Button
          variant={noticeSubmittedSixtyDaysPrior === false ? "default" : "outline"}
          className={noticeSubmittedSixtyDaysPrior === false ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setNoticeSubmittedSixtyDaysPrior(false)}
        >
          No
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={noticeSubmittedSixtyDaysPrior === null}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderNoticeAcceptedStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice Acceptance</h2>
      <p className="text-gray-600">Has your Notice to Vacate been accepted?</p>

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
          Not yet
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={noticeAccepted === null}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderEarliestMoveDateStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Move Date</h2>
      <p className="text-gray-600">When is the earliest you are willing to move?</p>

      <div className="grid gap-2">
        <label htmlFor="earliest-move" className="text-sm font-medium">
          Select date:
        </label>
        <DateInput id="earliest-move" value={earliestMoveDate} onChange={setEarliestMoveDate} className="w-full" />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={!earliestMoveDate}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderWillingToSignEarlierStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Early Lease Signing</h2>
      <p className="text-gray-600">
        When you find a property that you like AND the occupancy date begins before{" "}
        {earliestMoveDate ? format(earliestMoveDate, "PPP") : "[your selected date]"}, are you open and willing to sign
        the Lease earlier to secure the property?
      </p>

      <div className="flex space-x-4">
        <Button
          variant={willingToSignEarlier === true ? "default" : "outline"}
          className={willingToSignEarlier === true ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setWillingToSignEarlier(true)}
        >
          Yes
        </Button>
        <Button
          variant={willingToSignEarlier === false ? "default" : "outline"}
          className={willingToSignEarlier === false ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setWillingToSignEarlier(false)}
        >
          No
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={willingToSignEarlier === null}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderEarliestSignDateStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Earliest Lease Signing Date</h2>
      <p className="text-gray-600">When is the earliest you are willing to sign the Lease?</p>

      <div className="grid gap-2">
        <label htmlFor="earliest-sign" className="text-sm font-medium">
          Select date:
        </label>
        <DateInput id="earliest-sign" value={earliestSignDate} onChange={setEarliestSignDate} className="w-full" />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={!earliestSignDate}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderWorkingWithRealtorStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Realtor Relationship</h2>
      <p className="text-gray-600">Are you working with a licensed realtor?</p>

      <div className="flex space-x-4">
        <Button
          variant={workingWithRealtor === true ? "default" : "outline"}
          className={workingWithRealtor === true ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setWorkingWithRealtor(true)}
        >
          Yes
        </Button>
        <Button
          variant={workingWithRealtor === false ? "default" : "outline"}
          className={workingWithRealtor === false ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setWorkingWithRealtor(false)}
        >
          No
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={workingWithRealtor === null}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderExclusivityAgreementStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Exclusivity Agreement</h2>
      <p className="text-gray-600">Have you signed an exclusivity agreement?</p>

      <div className="flex space-x-4">
        <Button
          variant={exclusivityAgreement === true ? "default" : "outline"}
          className={exclusivityAgreement === true ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setExclusivityAgreement(true)}
        >
          Yes
        </Button>
        <Button
          variant={exclusivityAgreement === false ? "default" : "outline"}
          className={exclusivityAgreement === false ? "bg-orange-500 hover:bg-orange-600" : ""}
          onClick={() => setExclusivityAgreement(false)}
        >
          No
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={exclusivityAgreement === null}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderRentResponsibilityStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Rent Responsibility</h2>
      <p className="text-gray-600">What is your level of responsibility in paying the rent every month?</p>

      <RadioGroup
        value={rentResponsibility || ""}
        onValueChange={(value) =>
          setRentResponsibility(
            value as "I am fully responsible" | "I am partially responsible" | "I am not responsible",
          )
        }
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="I am fully responsible" id="fully-responsible" />
          <Label htmlFor="fully-responsible" className="text-base">
            I am fully responsible
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="I am partially responsible" id="partially-responsible" />
          <Label htmlFor="partially-responsible" className="text-base">
            I am partially responsible
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="I am not responsible" id="not-responsible" />
          <Label htmlFor="not-responsible" className="text-base">
            I am not responsible
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={!rentResponsibility}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderEmploymentStatusStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Employment Status</h2>
      <p className="text-gray-600">Select your current employment status (select all that apply)</p>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="student"
            checked={employmentStatus.includes("Student")}
            onCheckedChange={(checked) =>
              checked ? handleEmploymentStatusChange("Student") : handleEmploymentStatusChange("Student")
            }
          />
          <label
            htmlFor="student"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Student
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="full-time"
            checked={employmentStatus.includes("Employed Full-Time")}
            onCheckedChange={(checked) =>
              checked
                ? handleEmploymentStatusChange("Employed Full-Time")
                : handleEmploymentStatusChange("Employed Full-Time")
            }
          />
          <label
            htmlFor="full-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Employed Full-Time
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="part-time"
            checked={employmentStatus.includes("Employed Part-Time")}
            onCheckedChange={(checked) =>
              checked
                ? handleEmploymentStatusChange("Employed Part-Time")
                : handleEmploymentStatusChange("Employed Part-Time")
            }
          />
          <label
            htmlFor="part-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Employed Part-Time
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="self-employed"
            checked={employmentStatus.includes("Self-Employed")}
            onCheckedChange={(checked) =>
              checked ? handleEmploymentStatusChange("Self-Employed") : handleEmploymentStatusChange("Self-Employed")
            }
          />
          <label
            htmlFor="self-employed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Self-Employed
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="unemployed"
            checked={employmentStatus.includes("Unemployed")}
            onCheckedChange={(checked) =>
              checked ? handleEmploymentStatusChange("Unemployed") : handleEmploymentStatusChange("Unemployed")
            }
          />
          <label
            htmlFor="unemployed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Unemployed
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="retired"
            checked={employmentStatus.includes("Retired")}
            onCheckedChange={(checked) =>
              checked ? handleEmploymentStatusChange("Retired") : handleEmploymentStatusChange("Retired")
            }
          />
          <label
            htmlFor="retired"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Retired
          </label>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 flex">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Select all employment statuses that apply to you. For example, if you're both a student and work part-time,
          check both options.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={employmentStatus.length === 0}
        >
          Complete
        </Button>
      </div>
    </div>
  )

  const renderSummaryStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Pre-Qualification Complete</h2>
      <p className="text-gray-600">
        Thank you for completing your pre-qualification. Based on your answers, we've identified the following
        information:
      </p>

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h3 className="text-xl font-medium">Your Leasing Information:</h3>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <span className="font-medium">Current status:</span>{" "}
            {currentlyLeaseholder ? "Currently a leaseholder" : "Not currently a leaseholder"}
          </li>
          {leaseType && (
            <li>
              <span className="font-medium">Lease type:</span> {leaseType}
            </li>
          )}
          {leaseExpiry && (
            <li>
              <span className="font-medium">Lease expires:</span> {format(leaseExpiry, "PPP")}
            </li>
          )}
          {leaseRenewalDay && (
            <li>
              <span className="font-medium">Monthly renewal day:</span> {format(leaseRenewalDay, "do")} of each month
            </li>
          )}
          {earliestMoveDate && (
            <li>
              <span className="font-medium">Earliest move date:</span> {format(earliestMoveDate, "PPP")}
            </li>
          )}
          {rentResponsibility && (
            <li>
              <span className="font-medium">Rent responsibility:</span> {rentResponsibility}
            </li>
          )}
          {employmentStatus.length > 0 && (
            <li>
              <span className="font-medium">Employment:</span> {employmentStatus.join(", ")}
            </li>
          )}
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => {
            // Reset all state to start again
            setStep(0)
            setCurrentlyLeaseholder(null)
            setLeaseType(null)
            setLeaseExpiry(null)
            setLeaseRenewalDay(null)
            setNoticeToVacate(null)
            setNoticeSubmittedSixtyDaysPrior(null)
            setNoticeAccepted(null)
            setEarliestMoveDate(null)
            setWillingToSignEarlier(null)
            setEarliestSignDate(null)
            setWorkingWithRealtor(null)
            setExclusivityAgreement(null)
            setRentResponsibility(null)
            setEmploymentStatus([])
            setFlags([])
          }}
        >
          Start Over
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white">Continue to Dashboard</Button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return renderCurrentlyLeaseholderStep()
      case 1:
        return renderLeaseTypeStep()
      case 2:
        // Different step 2 based on lease type
        return leaseType === "12-month lease" ? renderLeaseEndDateStep() : renderMonthlyRenewalDateStep()
      case 3:
        // Different step 3 based on lease type and expiry date
        if (leaseType === "Month-to-month") {
          return renderWorkingWithRealtorStep()
        } else if (leaseType === "12-month lease" && leaseExpiry) {
          // Check if lease expires within 60 days
          return isWithinSixtyDays(leaseExpiry) ? renderNoticeToVacateStep() : renderNoticeToVacateStep() // Both paths show notice step first
        }
        return renderNoticeToVacateStep()
      case 4:
        // Continuing with branching logic
        if (leaseType === "Month-to-month") {
          return workingWithRealtor ? renderExclusivityAgreementStep() : renderRentResponsibilityStep()
        } else if (noticeToVacate === "Submitted to Landlord") {
          return renderNoticeSixtyDaysPriorStep()
        } else if (noticeToVacate === "Not yet" || noticeToVacate === "Received from Landlord") {
          return renderEarliestMoveDateStep()
        }
        return renderEarliestMoveDateStep()
      case 5:
        // More branching
        if (leaseType === "Month-to-month") {
          if (workingWithRealtor) {
            return renderRentResponsibilityStep()
          } else {
            return renderEmploymentStatusStep()
          }
        } else if (noticeToVacate === "Submitted to Landlord") {
          if (noticeSubmittedSixtyDaysPrior === false) {
            return renderNoticeAcceptedStep()
          } else {
            return renderEarliestMoveDateStep()
          }
        } else {
          // For "Not yet" or "Received from Landlord"
          return isWithinSixtyDays(earliestMoveDate as Date)
            ? renderWillingToSignEarlierStep()
            : renderWorkingWithRealtorStep()
        }
      case 6:
        // Continue branching
        if (leaseType === "Month-to-month") {
          return renderEmploymentStatusStep()
        } else if (noticeToVacate === "Submitted to Landlord" && noticeSubmittedSixtyDaysPrior === false) {
          return renderEarliestMoveDateStep()
        } else if (willingToSignEarlier) {
          return renderEarliestSignDateStep()
        } else {
          return renderWorkingWithRealtorStep()
        }
      case 7:
        // More branching logic
        if (willingToSignEarlier) {
          return renderWorkingWithRealtorStep()
        } else if (workingWithRealtor) {
          return renderExclusivityAgreementStep()
        } else {
          return renderRentResponsibilityStep()
        }
      case 8:
        if (workingWithRealtor) {
          return renderExclusivityAgreementStep()
        } else {
          return renderRentResponsibilityStep()
        }
      case 9:
        if (workingWithRealtor) {
          return renderRentResponsibilityStep()
        } else {
          return renderEmploymentStatusStep()
        }
      case 10:
        return renderEmploymentStatusStep()
      case 11:
        return renderSummaryStep()
      default:
        return renderCurrentlyLeaseholderStep()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Pre-Qualification: Leaseholder</span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-orange-500" />
      </div>

      {/* Debug: Show active flags */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 bg-gray-100 p-2 rounded-md text-xs">
          <div>Debug - Active Flags:</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {flags
              .filter((f) => f.value)
              .map((flag) => (
                <span key={flag.name} className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                  {flag.name}
                </span>
              ))}
          </div>
        </div>
      )}

      {renderCurrentStep()}
    </div>
  )
}
