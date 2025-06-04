"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, isBefore } from "date-fns"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Flag {
  flag1: boolean // Lease expires within 60 days
  flag1A: boolean // No notice to vacate submitted/received
  flag2: boolean // Not willing to move within 60 days
  flag3: boolean // No exclusivity agreement
  flag10: boolean // Employed part-time
  flag10A: boolean // New flag for tracking
  flag10B: boolean // Willing to sign lease within 60 days
  flag11: boolean // Employed full-time
  flag12: boolean // Self-employed
  flag13: boolean // Retired
  flag14: boolean // Notice to vacate submitted/accepted within 60 days
  flag15: boolean // Willing to move within 60 days
  flag17: boolean // Fully responsible for rent
  flag18: boolean // Partially responsible for rent
  flag31: boolean // Signed exclusivity agreement
  // Employment Status + Student Flags
  ET_LS1: boolean // Retired, Student
  ET_LS2: boolean // E:UE, Student
  ET_LS3: boolean // E:F/T, Student
  ET_LS4: boolean // E:P/T, Student
  ET_LS5: boolean // E:SE, Student
  ET_LS6: boolean // E:F/T, E:P/T, Student
  ET_LS7: boolean // E:F/T, E:SE, Student
  ET_LS8: boolean // E:P/T, SE, Student
  ET_LS9: boolean // E:F/T, E:P/T, E:SE, Student
  ET_LS10: boolean // E:P/T
  ET_LS11: boolean // E:F/T
  ET_LS12: boolean // E:SE
  ET_LS13: boolean // Retired
  ET_LS14: boolean // E:UE
  ET_LS15: boolean // E:F/T, E:P/T, E:SE
  ET_LS16: boolean // E:F/T, E:P/T
  ET_LS17: boolean // E:F/T, E:SE
  ET_LS18: boolean // E:P/T, SE
  ET_LS19: boolean // Retired, Student (Not responsible)
  ET_LS20: boolean // E:UE, Student (Not responsible)
  ET_LS21: boolean // E:F/T, Student (Not responsible)
  ET_LS22: boolean // E:P/T, Student (Not responsible)
  ET_LS23: boolean // E:SE, Student (Not responsible)
  ET_LS24: boolean // E:F/T, E:P/T, Student (Not responsible)
  ET_LS25: boolean // E:F/T, E:SE, Student (Not responsible)
  ET_LS26: boolean // E:P/T, SE, Student (Not responsible)
  ET_LS27: boolean // E:F/T, E:P/T, E:SE, Student (Not responsible)
  ET_LS28: boolean // E:P/T (Not responsible)
  ET_LS29: boolean // E:F/T (Not responsible)
  ET_LS30: boolean // E:SE (Not responsible)
  ET_LS31: boolean // Retired (Not responsible)
  ET_LS32: boolean // E:UE (Not responsible)
  ET_LS33: boolean // E:F/T, E:P/T, E:SE (Not responsible)
  ET_LS34: boolean // E:F/T, E:P/T (Not responsible)
  ET_LS35: boolean // E:F/T, E:SE (Not responsible)
  ET_LS36: boolean // E:P/T, E:SE (Not responsible)
}

interface PrequalificationGC1WizardProps {
  isVisible?: boolean
}

export function PrequalificationGC1Wizard({ isVisible = true }: PrequalificationGC1WizardProps) {
  // State for tracking the current step
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // State for user responses
  const [isStudent, setIsStudent] = useState<boolean>(false) // Set default to false to skip student check
  const [isOnLease, setIsOnLease] = useState<boolean | null>(null)
  const [leaseType, setLeaseType] = useState<string | null>(null)
  const [leaseExpiryDate, setLeaseExpiryDate] = useState<Date | null>(null)
  const [earliestMoveDate, setEarliestMoveDate] = useState<Date | null>(null)
  const [earliestSignDate, setEarliestSignDate] = useState<Date | null>(null)
  const [hasExclusivity, setHasExclusivity] = useState<boolean | null>(null)
  const [hasNoticeToVacate, setHasNoticeToVacate] = useState<boolean | null>(null)
  const [noticeSubmissionDate, setNoticeSubmissionDate] = useState<Date | null | boolean>(null)
  const [isNoticeAccepted, setIsNoticeAccepted] = useState<boolean | null>(null)
  const [rentResponsibility, setRentResponsibility] = useState<string | null>(null)
  const [employmentStatus, setEmploymentStatus] = useState<string[]>([])
  const [paymentDay, setPaymentDay] = useState<string | null>(null)
  const [hasRenewalOffer, setHasRenewalOffer] = useState<boolean | null>(null)
  const [workingWithRealtor, setWorkingWithRealtor] = useState<boolean | null>(null)
  const [showEarliestSignDatePicker, setShowEarliestSignDatePicker] = useState<boolean>(false)
  const [willingToSignEarly, setWillingToSignEarly] = useState<boolean | null>(null)

  // State for additional questions
  const [showAdditionalQuestions, setShowAdditionalQuestions] = useState(true)
  const [isInternationalStudent, setIsInternationalStudent] = useState<boolean | null>(null)
  const [monthlyRentalBudget, setMonthlyRentalBudget] = useState<number>(2500)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(3000)
  const [incomeAbove5000, setIncomeAbove5000] = useState<boolean | null>(null)
  const [currentAdditionalQuestion, setCurrentAdditionalQuestion] = useState<number>(0)

  // State for flags
  const [flags, setFlags] = useState<Flag>({
    flag1: false,
    flag1A: false,
    flag2: false,
    flag3: false,
    flag10: false,
    flag10A: false,
    flag10B: false,
    flag11: false,
    flag12: false,
    flag13: false,
    flag14: false,
    flag15: false,
    flag17: false,
    flag18: false,
    flag31: false,
    // Initialize all ET_LS flags to false
    ET_LS1: false,
    ET_LS2: false,
    ET_LS3: false,
    ET_LS4: false,
    ET_LS5: false,
    ET_LS6: false,
    ET_LS7: false,
    ET_LS8: false,
    ET_LS9: false,
    ET_LS10: false,
    ET_LS11: false,
    ET_LS12: false,
    ET_LS13: false,
    ET_LS14: false,
    ET_LS15: false,
    ET_LS16: false,
    ET_LS17: false,
    ET_LS18: false,
    ET_LS19: false,
    ET_LS20: false,
    ET_LS21: false,
    ET_LS22: false,
    ET_LS23: false,
    ET_LS24: false,
    ET_LS25: false,
    ET_LS26: false,
    ET_LS27: false,
    ET_LS28: false,
    ET_LS29: false,
    ET_LS30: false,
    ET_LS31: false,
    ET_LS32: false,
    ET_LS33: false,
    ET_LS34: false,
    ET_LS35: false,
    ET_LS36: false,
  })

  // State for workflow completion
  const [isComplete, setIsComplete] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  // Calculate total steps based on conditional logic
  const getTotalSteps = () => {
    let totalSteps = 1 // Start with lease question (removed student check)

    if (isOnLease === true) {
      totalSteps += 1 // Lease type

      if (leaseType === "12-month") {
        totalSteps += 8 // All remaining steps for 12-month lease holders
      } else if (leaseType === "month-to-month") {
        totalSteps += 7 // Steps for month-to-month lease holders
      }
    } else if (isOnLease === false) {
      totalSteps += 6 // Steps for non-lease holders
    }

    return totalSteps
  }

  // Update progress whenever step changes
  useEffect(() => {
    const totalSteps = getTotalSteps()
    const currentStepNumber = step + 1
    const progressPercentage = Math.min(Math.round((currentStepNumber / totalSteps) * 100), 100)
    setProgress(progressPercentage)
  }, [step, isOnLease, leaseType])

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

  // Handle next step logic
  const handleNext = () => {
    // Special case handling based on current step
    if (step === 0) {
      if (isOnLease === false) {
        // If not on lease, go directly to move date question
        setStep(6) // Move to the move willingness step
        return
      }
      setStep(1) // Otherwise proceed to lease type
      return
    }

    // For lease type step
    if (step === 1) {
      if (leaseType === "12-month") {
        setStep(2) // Go to lease expiry for 12-month lease
        return
      } else if (leaseType === "month-to-month") {
        setStep(12) // Go to payment day question for month-to-month lease
        return
      }
    }

    // For notice to vacate step
    if (step === 3 && hasNoticeToVacate === false) {
      // Set flag1A and end workflow
      updateFlag("flag1A", true)
      setProgress(100)
      setIsComplete(true)
      return
    }

    // For notice submission step
    if (step === 4) {
      if (noticeSubmissionDate === null) {
        // If they didn't submit notice at least 60 days prior
        updateFlag("flag14", false)
        // Skip notice acceptance and go directly to move willingness
        setStep(6)
        return
      }
      // If they did submit notice, proceed to notice acceptance
      setStep(5)
      return
    }

    // For month-to-month payment day step
    if (step === 12 && paymentDay) {
      setStep(6) // Go to move date question
      return
    }

    // For move willingness step
    if (step === 6 && earliestMoveDate) {
      if (!isWithin60Days(earliestMoveDate)) {
        updateFlag("flag2", true)
      }
      setStep(7) // Go to lease signing question
      return
    }

    // For lease signing step
    if (step === 7) {
      if (willingToSignEarly === true) {
        updateFlag("flag15", true)
        setShowEarliestSignDatePicker(true)
        // Don't advance step yet, wait for date selection
        return
      } else if (willingToSignEarly === false) {
        setStep(8) // Go to realtor question
        return
      }
    }

    // For realtor question step
    if (step === 8) {
      if (workingWithRealtor === true) {
        setStep(9) // Go to exclusivity agreement
        return
      } else if (workingWithRealtor === false) {
        setStep(10) // Skip exclusivity, go to rent responsibility
        return
      }
    }

    // For exclusivity agreement step
    if (step === 9) {
      if (hasExclusivity === false) {
        updateFlag("flag3", true)
      } else {
        updateFlag("flag3", false)
      }
      setStep(10) // Go to rent responsibility
      return
    }

    // Check if we're at the employment status step (final step)
    if (step === 11) {
      // Get the active ET_LS flag
      const activeETLS = Object.entries(flags)
        .filter(([key, value]) => key.startsWith("ET_LS") && value === true)
        .map(([key]) => key)[0]

      if (activeETLS) {
        // For student users (ET_LS1 through ET_LS9), redirect to international student question page
        if (Number.parseInt(activeETLS.replace("ET_LS", "")) <= 9) {
          window.location.href = `/prequalification-gc1/international-student?flag=${activeETLS}`
        } else {
          // For non-student users, redirect directly to the corresponding MI_LS page
          const miLsCode = activeETLS.replace("ET_", "MI_")
          window.location.href = `/prequalification-gc1/${miLsCode}`
        }
      } else {
        // If no employment status is selected (allowed for non-students)
        setProgress(100)
        setShowSummary(true)
      }
      return
    }

    // Otherwise, proceed to next step
    setStep((prev) => prev + 1)
  }

  // Handle back button
  const handleBack = () => {
    if (step > 0) {
      // Special case for month-to-month lease
      if (step === 6 && leaseType === "month-to-month") {
        setStep(12) // Go back to payment day question
        return
      }

      // Special case for non-lease holders
      if (step === 6 && isOnLease === false) {
        setStep(0) // Go back to lease question
        return
      }

      setStep((prev) => prev - 1)
    }
  }

  const handleRestart = () => {
    // Reset all state
    setStep(0)
    setIsStudent(false) // Always false now
    setIsOnLease(null)
    setLeaseType(null)
    setLeaseExpiryDate(null)
    setEarliestMoveDate(null)
    setEarliestSignDate(null)
    setHasExclusivity(null)
    setHasNoticeToVacate(null)
    setNoticeSubmissionDate(null)
    setIsNoticeAccepted(null)
    setRentResponsibility(null)
    setEmploymentStatus([])
    setPaymentDay(null)
    setHasRenewalOffer(null)
    setWorkingWithRealtor(null)
    setShowEarliestSignDatePicker(false)
    setWillingToSignEarly(null)
    setFlags({
      flag1: false,
      flag1A: false,
      flag2: false,
      flag3: false,
      flag10: false,
      flag10A: false,
      flag10B: false,
      flag11: false,
      flag12: false,
      flag13: false,
      flag14: false,
      flag15: false,
      flag17: false,
      flag18: false,
      flag31: false,
      // Reset all ET_LS flags
      ET_LS1: false,
      ET_LS2: false,
      ET_LS3: false,
      ET_LS4: false,
      ET_LS5: false,
      ET_LS6: false,
      ET_LS7: false,
      ET_LS8: false,
      ET_LS9: false,
      ET_LS10: false,
      ET_LS11: false,
      ET_LS12: false,
      ET_LS13: false,
      ET_LS14: false,
      ET_LS15: false,
      ET_LS16: false,
      ET_LS17: false,
      ET_LS18: false,
      ET_LS19: false,
      ET_LS20: false,
      ET_LS21: false,
      ET_LS22: false,
      ET_LS23: false,
      ET_LS24: false,
      ET_LS25: false,
      ET_LS26: false,
      ET_LS27: false,
      ET_LS28: false,
      ET_LS29: false,
      ET_LS30: false,
      ET_LS31: false,
      ET_LS32: false,
      ET_LS33: false,
      ET_LS34: false,
      ET_LS35: false,
      ET_LS36: false,
    })
    setIsComplete(false)
    setShowSummary(false)
  }

  // Handle finish
  const handleFinish = () => {
    // In a real application, you would save the data to a database
    console.log("Workflow completed with the following data:", {
      isStudent,
      isOnLease,
      leaseType,
      leaseExpiryDate,
      earliestMoveDate,
      earliestSignDate,
      hasExclusivity,
      hasNoticeToVacate,
      noticeSubmissionDate,
      isNoticeAccepted,
      rentResponsibility,
      employmentStatus,
      paymentDay,
      hasRenewalOffer,
      flags,
    })

    // Navigate to dashboard or next step
    window.location.href = "/"
  }

  // Generate days of month for dropdown
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString())

  const handleEmploymentStatusChange = (status: string) => {
    // Toggle selection: if status is already selected, remove it; otherwise, add it
    setEmploymentStatus((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status)
      } else {
        return [...prev, status]
      }
    })

    // Update flags after state update
    setTimeout(() => {
      updateEmploymentStatusFlags()
    }, 0)
  }

  // Function to update employment status flags based on selected status
  const updateEmploymentStatusFlags = () => {
    // Reset all employment-related ET_LS flags
    const resetFlags: Partial<Flag> = {}
    for (let i = 1; i <= 36; i++) {
      resetFlags[`ET_LS${i}` as keyof Flag] = false
    }

    // Set flags based on current selection and rent responsibility
    const isFullyResponsible = rentResponsibility === "fully"
    const isPartiallyResponsible = rentResponsibility === "partially"
    const isNotResponsible = rentResponsibility === "not"
    const isResponsible = isFullyResponsible || isPartiallyResponsible

    const hasFT = employmentStatus.includes("full-time")
    const hasPT = employmentStatus.includes("part-time")
    const hasSE = employmentStatus.includes("self-employed")
    const hasRetired = employmentStatus.includes("retired")
    const hasUE = employmentStatus.includes("unemployed")

    // If student, and fully responsible or partially responsible
    if (isStudent && isResponsible) {
      if (hasRetired && !hasFT && !hasPT && !hasSE && !hasUE) {
        resetFlags.ET_LS1 = true
      } else if (hasUE && !hasFT && !hasPT && !hasSE && !hasRetired) {
        resetFlags.ET_LS2 = true
      } else if (hasFT && !hasPT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS3 = true
      } else if (hasPT && !hasFT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS4 = true
      } else if (hasSE && !hasFT && !hasPT && !hasRetired && !hasUE) {
        resetFlags.ET_LS5 = true
      } else if (hasFT && hasPT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS6 = true
      } else if (hasFT && hasSE && !hasPT && !hasRetired && !hasUE) {
        resetFlags.ET_LS7 = true
      } else if (hasPT && hasSE && !hasFT && !hasRetired && !hasUE) {
        resetFlags.ET_LS8 = true
      } else if (hasFT && hasPT && hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS9 = true
      }
    }
    // If not student, and fully responsible or partially responsible
    else if (!isStudent && isResponsible) {
      if (hasPT && !hasFT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS10 = true
      } else if (hasFT && !hasPT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS11 = true
      } else if (hasSE && !hasFT && !hasPT && !hasRetired && !hasUE) {
        resetFlags.ET_LS12 = true
      } else if (hasRetired && !hasFT && !hasPT && !hasSE && !hasUE) {
        resetFlags.ET_LS13 = true
      } else if (hasUE && !hasFT && !hasPT && !hasSE && !hasRetired) {
        resetFlags.ET_LS14 = true
      } else if (hasFT && hasPT && hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS15 = true
      } else if (hasFT && hasPT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS16 = true
      } else if (hasFT && hasSE && !hasPT && !hasRetired && !hasUE) {
        resetFlags.ET_LS17 = true
      } else if (hasPT && hasSE && !hasFT && !hasRetired && !hasUE) {
        resetFlags.ET_LS18 = true
      }
    }
    // If student and not responsible
    else if (isStudent && isNotResponsible) {
      if (hasRetired && !hasFT && !hasPT && !hasSE && !hasUE) {
        resetFlags.ET_LS19 = true
      } else if (hasUE && !hasFT && !hasPT && !hasSE && !hasRetired) {
        resetFlags.ET_LS20 = true
      } else if (hasFT && !hasPT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS21 = true
      } else if (hasPT && !hasFT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS22 = true
      } else if (hasSE && !hasFT && !hasPT && !hasRetired && !hasUE) {
        resetFlags.ET_LS23 = true
      } else if (hasFT && hasPT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS24 = true
      } else if (hasFT && hasSE && !hasPT && !hasRetired && !hasUE) {
        resetFlags.ET_LS25 = true
      } else if (hasPT && hasSE && !hasFT && !hasRetired && !hasUE) {
        resetFlags.ET_LS26 = true
      } else if (hasFT && hasPT && hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS27 = true
      }
    }
    // If not student and not responsible
    else if (!isStudent && isNotResponsible) {
      if (hasPT && !hasFT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS28 = true
      } else if (hasFT && !hasPT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS29 = true
      } else if (hasSE && !hasFT && !hasPT && !hasRetired && !hasUE) {
        resetFlags.ET_LS30 = true
      } else if (hasRetired && !hasFT && !hasPT && !hasSE && !hasUE) {
        resetFlags.ET_LS31 = true
      } else if (hasUE && !hasFT && !hasPT && !hasSE && !hasRetired) {
        resetFlags.ET_LS32 = true
      } else if (hasFT && hasPT && hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS33 = true
      } else if (hasFT && hasPT && !hasSE && !hasRetired && !hasUE) {
        resetFlags.ET_LS34 = true
      } else if (hasFT && hasSE && !hasPT && !hasRetired && !hasUE) {
        resetFlags.ET_LS35 = true
      } else if (hasPT && hasSE && !hasFT && !hasRetired && !hasUE) {
        resetFlags.ET_LS36 = true
      }
    }

    // Update the flags
    setFlags((prev) => ({
      ...prev,
      ...resetFlags,
    }))

    // Also update individual employment type flags
    if (hasPT) {
      updateFlag("flag10", true)
      updateFlag("flag10A", true)
    } else {
      updateFlag("flag10", false)
      updateFlag("flag10A", false)
    }

    if (hasFT) {
      updateFlag("flag11", true)
    } else {
      updateFlag("flag11", false)
    }

    if (hasSE) {
      updateFlag("flag12", true)
    } else {
      updateFlag("flag12", false)
    }

    if (hasRetired) {
      updateFlag("flag13", true)
    } else {
      updateFlag("flag13", false)
    }
  }

  // Slider Question Component
  // const SliderQuestion = ({
  //   title,
  //   description,
  //   min,
  //   max,
  //   step,
  //   value,
  //   onChange,
  //   formatValue = (val) => `$${val}`,
  //   alerts = [],
  // }: {
  //   title: string
  //   description: string
  //   min: number
  //   max: number
  //   step: number
  //   value: number
  //   onChange: (value: number) => void
  //   formatValue?: (value: number) => string
  //   alerts?: Array<{
  //     condition: boolean
  //     type: "success" | "warning"
  //     title: string
  //     description: string
  //   }>
  // }) => {
  //   return (
  //     <div className="space-y-6">
  //       <h2 className="text-2xl font-semibold text-black">{title}</h2>
  //       <p className="text-gray-600">{description}</p>

  //       <div className="space-y-4">
  //         <div className="flex justify-between text-sm">
  //           <span>{formatValue(min)}</span>
  //           <span>{formatValue(max)}</span>
  //         </div>
  //         <input
  //           type="range"
  //           min={min}
  //           max={max}
  //           step={step}
  //           value={value}
  //           onChange={(e) => onChange(Number(e.target.value))}
  //           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFA500]"
  //         />
  //         <div className="text-center font-medium">{formatValue(value)}</div>
  //       </div>

  //       {alerts.map(
  //         (alert, index) =>
  //           alert.condition && (
  //             <Alert
  //               key={index}
  //               className={`${alert.type === "success" ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"} mt-4`}
  //             >
  //               {alert.type === "success" ? (
  //                 <CheckCircle2 className="h-4 w-4 text-green-500" />
  //               ) : (
  //                 <AlertCircle className="h-4 w-4 text-amber-500" />
  //               )}
  //               <AlertTitle className={alert.type === "success" ? "text-green-800" : "text-amber-800"}>
  //                 {alert.title}
  //               </AlertTitle>
  //               <AlertDescription className={alert.type === "success" ? "text-green-700" : "text-amber-700"}>
  //                 {alert.description}
  //               </AlertDescription>
  //             </Alert>
  //           ),
  //       )}
  //     </div>
  //   )
  // }

  // Add a useEffect to update employment flags when student status or rent responsibility changes
  useEffect(() => {
    if (employmentStatus) {
      updateEmploymentStatusFlags()
    }
  }, [isStudent, rentResponsibility, employmentStatus])

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
          <RadioGroupItem value="month-to-month" id="lease-month" />
          <Label htmlFor="lease-month">Month-to-month</Label>
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

  // Render month-to-month payment day step
  const renderMonthToMonthPaymentDay = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Payment Date</h2>
      <p className="text-gray-600">
        On what day of the month does this renew (i.e. your payment date)? For example, you make payment on the first of
        the month.
      </p>

      <Select value={paymentDay || ""} onValueChange={setPaymentDay}>
        <SelectTrigger className="w-full">
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

  // Render lease expiry step
  const renderLeaseExpiry = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Lease Expiry</h2>
      <p className="text-gray-600">When does your current lease expire?</p>

      <div className="grid gap-2">
        <div className="border rounded-md p-3 bg-white">
          <Calendar
            mode="single"
            selected={leaseExpiryDate || undefined}
            onSelect={(date) => {
              setLeaseExpiryDate(date)
              if (date && isWithin60Days(date)) {
                updateFlag("flag1", true)
              } else {
                updateFlag("flag1", false)
              }
            }}
            className="mx-auto"
            initialFocus
          />
        </div>

        {leaseExpiryDate && (
          <p className="text-sm text-gray-600 mt-2">
            Selected date: {leaseExpiryDate ? format(leaseExpiryDate, "PPP") : "None"}
          </p>
        )}
      </div>

      {leaseExpiryDate && isWithin60Days(leaseExpiryDate) && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-800">Notice</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your lease expires within 60 days. This may affect your eligibility.
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

  // Render exclusivity agreement step
  const renderExclusivityAgreement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Exclusivity Agreement</h2>
      <p className="text-gray-600">Have you signed an exclusivity agreement?</p>

      <RadioGroup
        value={hasExclusivity === null ? "" : hasExclusivity.toString()}
        onValueChange={(value) => {
          const boolValue = value === "true"
          setHasExclusivity(boolValue)
          if (!boolValue) {
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

  // Render notice to vacate step
  const renderNoticeToVacate = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice to Vacate</h2>
      <p className="text-gray-600">Have you either received from OR submitted to your Landlord a Notice to Vacate?</p>

      <RadioGroup
        value={hasNoticeToVacate === null ? undefined : hasNoticeToVacate.toString()}
        onValueChange={(value) => {
          const boolValue = value === "true"
          setHasNoticeToVacate(boolValue)
          if (!boolValue) {
            updateFlag("flag1A", true)
          } else {
            updateFlag("flag1A", false)
          }
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="notice-yes" />
          <Label htmlFor="notice-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="notice-no" />
          <Label htmlFor="notice-no">No</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={hasNoticeToVacate === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render notice submission date step
  const renderNoticeSubmissionDate = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Notice to Vacate</h2>
      <p className="text-gray-600">
        Did you submit the Notice to Vacate to your Landlord at least 60 days prior to the expiry of your Lease?
      </p>

      <RadioGroup
        value={noticeSubmissionDate === true ? "true" : noticeSubmissionDate === false ? "false" : ""}
        onValueChange={(value) => {
          const boolValue = value === "true"
          if (boolValue) {
            // If yes, set a dummy date that's within 60 days
            const dummyDate = new Date()
            setNoticeSubmissionDate(dummyDate)
            updateFlag("flag14", true)
          } else {
            setNoticeSubmissionDate(false)
            updateFlag("flag14", false)
          }
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="submission-yes" />
          <Label htmlFor="submission-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="submission-no" />
          <Label htmlFor="submission-no">No</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={noticeSubmissionDate === null}
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
        value={isNoticeAccepted === null ? "" : isNoticeAccepted.toString()}
        onValueChange={(value) => {
          const boolValue = value === "true"
          setIsNoticeAccepted(boolValue)
          if (boolValue) {
            updateFlag("flag14", true)
          }
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="acceptance-yes" />
          <Label htmlFor="acceptance-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="acceptance-no" />
          <Label htmlFor="acceptance-no">No</Label>
        </div>
      </RadioGroup>

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

  // Render move willingness step
  const renderMoveWillingness = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Move Date</h2>
      <p className="text-gray-600">When is the earliest you are willing to move?</p>

      <div className="grid gap-2">
        <div className="border rounded-md p-3 bg-white">
          <Calendar
            mode="single"
            selected={earliestMoveDate || undefined}
            onSelect={(date) => {
              setEarliestMoveDate(date)
              if (date && isWithin60Days(date)) {
                updateFlag("flag15", true)
                // If flag10A exists, create flag10B
                if (flags.flag10A) {
                  updateFlag("flag10B", true)
                }
              } else {
                updateFlag("flag15", false)
                updateFlag("flag10B", false)
                updateFlag("flag2", true) // Not within 60 days
              }
            }}
            className="mx-auto"
            initialFocus
          />
        </div>

        {earliestMoveDate && (
          <p className="text-sm text-gray-600 mt-2">
            Selected date: {earliestMoveDate ? format(earliestMoveDate, "PPP") : "None"}
          </p>
        )}
      </div>

      {earliestMoveDate && isWithin60Days(earliestMoveDate) && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800">Good News</AlertTitle>
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

  // Render lease signing step
  const renderLeaseSigning = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Lease Signing</h2>
      <p className="text-gray-600">
        When you find a property that you like AND the occupancy date begins before{" "}
        {earliestMoveDate ? format(earliestMoveDate, "PPP") : "your move date"}, are you open and willing to sign the
        Lease earlier to secure the property?
      </p>

      <RadioGroup
        value={willingToSignEarly === null ? undefined : willingToSignEarly.toString()}
        onValueChange={(value) => {
          const boolValue = value === "true"
          setWillingToSignEarly(boolValue)
          if (boolValue) {
            updateFlag("flag15", true)
            // Show date picker for earliest sign date
            setShowEarliestSignDatePicker(true)
          } else {
            setEarliestSignDate(null)
            updateFlag("flag15", false)
            setShowEarliestSignDatePicker(false)
            // Move to next question
            handleNext()
          }
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="true" id="sign-yes" />
          <Label htmlFor="sign-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="sign-no" />
          <Label htmlFor="sign-no">No</Label>
        </div>
      </RadioGroup>

      {showEarliestSignDatePicker && (
        <div className="mt-4">
          <p className="text-gray-600 mb-2">When is the earliest you are willing to sign the Lease?</p>
          <div className="border rounded-md p-3 bg-white">
            <Calendar
              mode="single"
              selected={earliestSignDate || undefined}
              onSelect={(date) => {
                setEarliestSignDate(date)
              }}
              disabled={(date) => {
                // Disable dates before earliest move date
                return earliestMoveDate ? date < earliestMoveDate : false
              }}
              className="mx-auto"
              initialFocus
            />
          </div>

          {earliestSignDate && (
            <p className="text-sm text-gray-600 mt-2">
              Selected date: {earliestSignDate ? format(earliestSignDate, "PPP") : "None"}
            </p>
          )}

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setStep(8)} // Explicitly set to step 8 (realtor question)
              disabled={!earliestSignDate}
              className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {!showEarliestSignDatePicker && willingToSignEarly === null && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={willingToSignEarly === null}
            className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
          >
            Next
          </Button>
        </div>
      )}
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
            updateFlag("flag17", false) // Setting to false per specification
            updateFlag("flag18", false)
          } else if (value === "partially") {
            updateFlag("flag17", false)
            updateFlag("flag18", true)
          } else {
            updateFlag("flag17", false)
            updateFlag("flag18", false)
          }

          // Update employment status flags after responsibility changes
          if (employmentStatus) {
            setTimeout(updateEmploymentStatusFlags, 0)
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
      <p className="text-gray-600">Select your current employment status.</p>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-part-time"
            checked={employmentStatus.includes("part-time")}
            onCheckedChange={(checked) => {
              if (checked) {
                handleEmploymentStatusChange("part-time")
              } else {
                handleEmploymentStatusChange("part-time")
              }
            }}
          />
          <Label htmlFor="employment-part-time">Employed Part-Time</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-full-time"
            checked={employmentStatus.includes("full-time")}
            onCheckedChange={(checked) => {
              if (checked) {
                handleEmploymentStatusChange("full-time")
              } else {
                handleEmploymentStatusChange("full-time")
              }
            }}
          />
          <Label htmlFor="employment-full-time">Employed Full-Time</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-self-employed"
            checked={employmentStatus.includes("self-employed")}
            onCheckedChange={(checked) => {
              if (checked) {
                handleEmploymentStatusChange("self-employed")
              } else {
                handleEmploymentStatusChange("self-employed")
              }
            }}
          />
          <Label htmlFor="employment-self-employed">Self-Employed</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-retired"
            checked={employmentStatus.includes("retired")}
            onCheckedChange={(checked) => {
              if (checked) {
                handleEmploymentStatusChange("retired")
              } else {
                handleEmploymentStatusChange("retired")
              }
            }}
          />
          <Label htmlFor="employment-retired">Retired</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-unemployed"
            checked={employmentStatus.includes("unemployed")}
            onCheckedChange={(checked) => {
              if (checked) {
                handleEmploymentStatusChange("unemployed")
              } else {
                handleEmploymentStatusChange("unemployed")
              }
            }}
          />
          <Label htmlFor="employment-unemployed">Unemployed (E:UE)</Label>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="employment-student"
            checked={isStudent}
            onCheckedChange={(checked) => {
              setIsStudent(checked as boolean)
              // Update employment flags when student status changes
              setTimeout(updateEmploymentStatusFlags, 0)
            }}
          />
          <label
            htmlFor="employment-student"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Student
          </label>
        </div>
      </div>

      {/* Qualification path box hidden as requested */}
      {false && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium mb-2">Qualification Path:</h3>
          <div className="text-xs text-gray-700">
            {Object.entries(flags)
              .filter(([key, value]) => key.startsWith("ET_LS") && value === true)
              .map(([key]) => {
                // Map the flag to a human-readable description
                const descriptions = {
                  ET_LS1: "Student: Yes, Rent: Responsible, Employment: Retired",
                  ET_LS2: "Student: Yes, Rent: Responsible, Employment: Unemployed",
                  ET_LS3: "Student: Yes, Rent: Responsible, Employment: Full-Time",
                  ET_LS4: "Student: Yes, Rent: Responsible, Employment: Part-Time",
                  ET_LS5: "Student: Yes, Rent: Responsible, Employment: Self-Employed",
                  ET_LS6: "Student: Yes, Rent: Responsible, Employment: Full-Time, Part-Time",
                  ET_LS7: "Student: Yes, Rent: Responsible, Employment: Full-Time, Self-Employed",
                  ET_LS8: "Student: Yes, Rent: Responsible, Employment: Part-Time, Self-Employed",
                  ET_LS9: "Student: Yes, Rent: Responsible, Employment: Full-Time, Part-Time, Self-Employed",
                  ET_LS10: "Student: No, Rent: Responsible, Employment: Part-Time → MI_LS10",
                  ET_LS11: "Student: No, Rent: Responsible, Employment: Full-Time → MI_LS11",
                  ET_LS12: "Student: No, Rent: Responsible, Employment: Self-Employed → MI_LS12",
                  ET_LS13: "Student: No, Rent: Responsible, Employment: Retired → MI_LS13",
                  ET_LS14: "Student: No, Rent: Responsible, Employment: Unemployed → MI_LS14",
                  ET_LS15: "Student: No, Rent: Responsible, Employment: Full-Time, Part-Time, Self-Employed → MI_LS15",
                  ET_LS16: "Student: No, Rent: Responsible, Employment: Full-Time, Part-Time → MI_LS16",
                  ET_LS17: "Student: No, Rent: Responsible, Employment: Full-Time, Self-Employed → MI_LS17",
                  ET_LS18: "Student: No, Rent: Responsible, Employment: Part-Time, Self-Employed → MI_LS18",
                  ET_LS19: "Student: Yes, Rent: Not Responsible, Employment: Retired",
                  ET_LS20: "Student: Yes, Rent: Not Responsible, Employment: Unemployed",
                  ET_LS21: "Student: Yes, Rent: Not Responsible, Employment: Full-Time",
                  ET_LS22: "Student: Yes, Rent: Not Responsible, Employment: Part-Time",
                  ET_LS23: "Student: Yes, Rent: Not Responsible, Employment: Self-Employed",
                  ET_LS24: "Student: Yes, Rent: Not Responsible, Employment: Full-Time, Part-Time",
                  ET_LS25: "Student: Yes, Rent: Not Responsible, Employment: Full-Time, Self-Employed",
                  ET_LS26: "Student: Yes, Rent: Not Responsible, Employment: Part-Time, Self-Employed",
                  ET_LS27: "Student: Yes, Rent: Not Responsible, Employment: Full-Time, Part-Time, Self-Employed",
                  ET_LS28: "Student: No, Rent: Not Responsible, Employment: Part-Time",
                  ET_LS29: "Student: No, Rent: Not Responsible, Employment: Full-Time",
                  ET_LS30: "Student: No, Rent: Not Responsible, Employment: Self-Employed",
                  ET_LS31: "Student: No, Rent: Not Responsible, Employment: Retired",
                  ET_LS32: "Student: No, Rent: Not Responsible, Employment: Unemployed",
                  ET_LS33: "Student: No, Rent: Not Responsible, Employment: Full-Time, Part-Time, Self-Employed",
                  ET_LS34: "Student: No, Rent: Not Responsible, Employment: Full-Time, Part-Time",
                  ET_LS35: "Student: No, Rent: Not Responsible, Employment: Full-Time, Self-Employed",
                  ET_LS36: "Student: No, Rent: Not Responsible, Employment: Part-Time, Self-Employed",
                }

                // Get the corresponding MI_LS code
                const miLsCode = key.replace("ET_", "MI_")

                // Get the corresponding CS_LS code
                const csLsCode = key.replace("ET_", "CS_")

                return (
                  <div key={key} className="mb-4 p-3 border border-purple-100 rounded-md bg-white">
                    <div className="font-medium text-sm text-purple-800 mb-1">{key}</div>
                    <div className="mb-2">{descriptions[key as keyof typeof descriptions] || key}</div>

                    <div className="mt-3 border-t border-gray-200 pt-2">
                      <div className="font-medium text-xs text-gray-600 mb-1">Next Questions:</div>
                      <button
                        onClick={() => {
                          // Get the active ET_LS flag
                          const activeETLS = Object.entries(flags)
                            .filter(([key, value]) => key.startsWith("ET_LS") && value === true)
                            .map(([key]) => key)[0]

                          if (!activeETLS) return

                          // For student users (ET_LS1 through ET_LS9), redirect to international student question page
                          if (Number.parseInt(activeETLS.replace("ET_LS", "")) <= 9) {
                            // Redirect to the international student question page with the ET_LS flag as a query parameter
                            window.location.href = `/prequalification-gc1/international-student?flag=${activeETLS}`
                          } else {
                            // For non-student users, redirect directly to the corresponding MI_LS page
                            const miLsCode = activeETLS.replace("ET_", "MI_")
                            window.location.href = `/prequalification-gc1/${miLsCode}`
                          }
                        }}
                        className="mt-2 w-full py-2 px-4 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md text-sm font-medium transition-colors"
                      >
                        Continue to Next Step
                      </button>
                    </div>
                  </div>
                )
              })}
            {!Object.entries(flags).some(([key, value]) => key.startsWith("ET_LS") && value === true) && (
              <div className="italic">No qualification path selected yet</div>
            )}
          </div>
        </div>
      )}

      {!isStudent && (
        <p className="text-sm text-gray-500 mt-2">
          Employment status is optional for non-students. You can proceed without selecting one.
        </p>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!employmentStatus && isStudent}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          {!isStudent && !employmentStatus ? "Skip Employment Status" : "Next"}
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
          <p className="text-gray-600">You must be on a lease to proceed.</p>
          <Button onClick={handleRestart} className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black">
            Start Over
          </Button>
        </div>
      )
    }

    if (hasNoticeToVacate === false && flags.flag1A) {
      return (
        <div className="space-y-6 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-amber-500" />
          <h2 className="text-2xl font-semibold text-black">Notice Required</h2>
          <p className="text-gray-600">
            You need to submit a Notice to Vacate to your landlord to proceed with the rental process.
          </p>
          <Button onClick={handleRestart} className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black">
            Start Over
          </Button>
        </div>
      )
    }

    return null
  }

  // Render summary
  const renderSummary = () => {
    return (
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
              <div className="text-gray-600">Student Status:</div>
              <div className="font-medium">{isStudent ? "Student" : "Non-Student"}</div>

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
                      <div className="font-medium">{hasNoticeToVacate ? "Yes" : "No"}</div>

                      {hasNoticeToVacate && (
                        <>
                          <div className="text-gray-600">Notice Submission Date:</div>
                          <div className="font-medium">
                            {noticeSubmissionDate ? format(noticeSubmissionDate, "PPP") : "N/A"}
                          </div>

                          <div className="text-gray-600">Notice Accepted:</div>
                          <div className="font-medium">{isNoticeAccepted ? "Yes" : "No"}</div>
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

                  <div className="text-gray-600">Earliest Move Date:</div>
                  <div className="font-medium">{earliestMoveDate ? format(earliestMoveDate, "PPP") : "N/A"}</div>

                  <div className="text-gray-600">Willing to Sign Early:</div>
                  <div className="font-medium">{willingToSignEarly ? "Yes" : "No"}</div>

                  {willingToSignEarly && (
                    <>
                      <div className="text-gray-600">Earliest Sign Date:</div>
                      <div className="font-medium">{earliestSignDate ? format(earliestSignDate, "PPP") : "N/A"}</div>
                    </>
                  )}

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

                  <div className="text-gray-600">Employment Status:</div>
                  <div className="font-medium">
                    {employmentStatus || "None selected"}
                    {isStudent && (employmentStatus ? ", Student" : "Student")}
                  </div>
                </>
              )}

              {!isOnLease && (
                <>
                  <div className="text-gray-600">Earliest Move Date:</div>
                  <div className="font-medium">{earliestMoveDate ? format(earliestMoveDate, "PPP") : "N/A"}</div>

                  <div className="text-gray-600">Willing to Sign Early:</div>
                  <div className="font-medium">{willingToSignEarly ? "Yes" : "No"}</div>

                  {willingToSignEarly && (
                    <>
                      <div className="text-gray-600">Earliest Sign Date:</div>
                      <div className="font-medium">{earliestSignDate ? format(earliestSignDate, "PPP") : "N/A"}</div>
                    </>
                  )}

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

                  <div className="text-gray-600">Employment Status:</div>
                  <div className="font-medium">
                    {employmentStatus || "None selected"}
                    {isStudent && (employmentStatus ? ", Student" : "Student")}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-gray-600 font-medium mb-2">Employment Type Flags Set:</div>
          <div className="pl-4">
            {Object.entries(flags)
              .filter(([key, value]) => key.startsWith("ET_LS") && value === true)
              .map(([key]) => (
                <div key={key} className="text-sm">
                  {key}
                </div>
              ))}
            {!Object.entries(flags).some(([key, value]) => key.startsWith("ET_LS") && value === true) && (
              <div className="text-sm italic">No ET_LS flags set</div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleRestart}>
            Start Over
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
          >
            Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Render realtor question step
  const renderRealtorQuestion = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Realtor Information</h2>
      <p className="text-gray-600">Are you working with a licensed realtor?</p>

      <RadioGroup
        value={workingWithRealtor === null ? "" : workingWithRealtor.toString()}
        onValueChange={(value) => {
          const boolValue = value === "true"
          setWorkingWithRealtor(boolValue)
        }}
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

  // Determine which step to render
  const renderCurrentStep = () => {
    if (isComplete) {
      return renderCompletionMessage()
    }

    if (showSummary) {
      return renderSummary()
    }

    // Special step for month-to-month lease
    if (step === 12) {
      return renderMonthToMonthPaymentDay()
    }

    // If not on lease, follow the new flow
    if (isOnLease === false) {
      switch (step) {
        case 0:
          return renderLeaseQuestion()
        case 6:
          return renderMoveWillingness()
        case 7:
          return renderLeaseSigning()
        case 8:
          return renderRealtorQuestion()
        case 9:
          return workingWithRealtor ? renderExclusivityAgreement() : renderRentResponsibility()
        case 10:
          return renderRentResponsibility()
        case 11:
          return renderEmploymentStatus()
        default:
          return renderLeaseQuestion()
      }
    }

    // Original flow for users on a 12-month lease
    switch (step) {
      case 0:
        return renderLeaseQuestion()
      case 1:
        return renderLeaseType()
      case 2:
        return renderLeaseExpiry()
      case 3:
        return renderNoticeToVacate()
      case 4:
        return renderNoticeSubmissionDate()
      case 5:
        return renderNoticeAcceptance()
      case 6:
        return renderMoveWillingness()
      case 7:
        return renderLeaseSigning()
      case 8:
        return renderRealtorQuestion()
      case 9:
        return workingWithRealtor ? renderExclusivityAgreement() : renderRentResponsibility()
      case 10:
        return renderRentResponsibility()
      case 11:
        return renderEmploymentStatus()
      default:
        return renderLeaseQuestion()
    }
  }

  return (
    <>
      {isVisible && (
        <div className="bg-white rounded-lg shadow-sm border p-6 w-full max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Pre-Qualification</span>
              <span className="text-sm font-medium">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-orange-500" />
          </div>

          {renderCurrentStep()}
        </div>
      )}
    </>
  )
}
