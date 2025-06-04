"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CreditScoreWizardProps {
  workflowCode: string
  isRentResponsible: boolean // Add this new prop
  onComplete: (flags: Record<string, boolean>) => void
  onBack: () => void
}

interface CreditFlags {
  [key: string]: boolean
}

export function CreditScoreWizard({ workflowCode, isRentResponsible, onComplete, onBack }: CreditScoreWizardProps) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // State for responses
  const [hasCreditReport, setHasCreditReport] = useState<boolean | null>(null)
  const [inCanadaFor12Months, setInCanadaFor12Months] = useState<boolean | null>(null)
  const [creditScoreRange, setCreditScoreRange] = useState<string | null>(null)
  const [canPayExtraDeposit, setCanPayExtraDeposit] = useState<boolean | null>(null)
  const [creditReportAction, setCreditReportAction] = useState<string | null>(null)

  // Flags state
  const [flags, setFlags] = useState<CreditFlags>({})

  // Get workflow details from workflowCode
  const getWorkflowDetails = () => {
    const etMatch = workflowCode.match(/ET_NLS(\d+)/)
    const etCode = etMatch ? etMatch[1] : "1"

    // Determine which NLS category this is
    const nlsCategory = workflowCode.includes("NLS1:")
      ? "NLS1"
      : workflowCode.includes("NLS2:")
        ? "NLS2"
        : workflowCode.includes("NLS3:")
          ? "NLS3"
          : workflowCode.includes("LS3:")
            ? "LS3"
            : "NLS3"

    if (nlsCategory === "NLS1") {
      if (isRentResponsible) {
        // Employment map for ET_NLS55-72 (existing)
        const employmentMap: Record<string, { employment: string; student: boolean; responsible: boolean }> = {
          "55": { employment: "Retired", student: true, responsible: true },
          "56": { employment: "Unemployed", student: true, responsible: true },
          "57": { employment: "Full-Time", student: true, responsible: true },
          "58": { employment: "Part-Time", student: true, responsible: true },
          "59": { employment: "Self-Employed", student: true, responsible: true },
          "60": { employment: "Full-Time, Part-Time", student: true, responsible: true },
          "61": { employment: "Full-Time, Self-Employed", student: true, responsible: true },
          "62": { employment: "Part-Time, Self-Employed", student: true, responsible: true },
          "63": { employment: "Full-Time, Part-Time, Self-Employed", student: true, responsible: true },
          "64": { employment: "Part-Time", student: false, responsible: true },
          "65": { employment: "Full-Time", student: false, responsible: true },
          "66": { employment: "Self-Employed", student: false, responsible: true },
          "67": { employment: "Retired", student: false, responsible: true },
          "68": { employment: "Unemployed", student: false, responsible: true },
          "69": { employment: "Full-Time, Part-Time, Self-Employed", student: false, responsible: true },
          "70": { employment: "Full-Time, Part-Time", student: false, responsible: true },
          "71": { employment: "Full-Time, Self-Employed", student: false, responsible: true },
          "72": { employment: "Part-Time, Self-Employed", student: false, responsible: true },
        }
        return employmentMap[etCode] || { employment: "Unknown", student: false, responsible: true }
      } else {
        // Employment map for ET_NLS1-18 (existing)
        const employmentMap: Record<string, { employment: string; student: boolean; responsible: boolean }> = {
          "1": { employment: "Retired", student: true, responsible: false },
          "2": { employment: "Unemployed", student: true, responsible: false },
          "3": { employment: "Full-Time", student: true, responsible: false },
          "4": { employment: "Part-Time", student: true, responsible: false },
          "5": { employment: "Self-Employed", student: true, responsible: false },
          "6": { employment: "Full-Time, Part-Time", student: true, responsible: false },
          "7": { employment: "Full-Time, Self-Employed", student: true, responsible: false },
          "8": { employment: "Part-Time, Self-Employed", student: true, responsible: false },
          "9": { employment: "Full-Time, Part-Time, Self-Employed", student: true, responsible: false },
          "10": { employment: "Part-Time", student: false, responsible: false },
          "11": { employment: "Full-Time", student: false, responsible: false },
          "12": { employment: "Self-Employed", student: false, responsible: false },
          "13": { employment: "Retired", student: false, responsible: false },
          "14": { employment: "Unemployed", student: false, responsible: false },
          "15": { employment: "Full-Time, Part-Time, Self-Employed", student: false, responsible: false },
          "16": { employment: "Full-Time, Part-Time", student: false, responsible: false },
          "17": { employment: "Full-Time, Self-Employed", student: false, responsible: false },
          "18": { employment: "Part-Time, Self-Employed", student: false, responsible: false },
        }
        return employmentMap[etCode] || { employment: "Unknown", student: false, responsible: false }
      }
    } else if (nlsCategory === "NLS2") {
      // NLS2 category - ET_NLS19-90 (expanded range)
      const employmentMap: Record<string, { employment: string; student: boolean; responsible: boolean }> = {
        // New NLS2 not responsible entries (ET_NLS19-36)
        "19": { employment: "Retired", student: true, responsible: false },
        "20": { employment: "Unemployed", student: true, responsible: false },
        "21": { employment: "Full-Time", student: true, responsible: false },
        "22": { employment: "Part-Time", student: true, responsible: false },
        "23": { employment: "Self-Employed", student: true, responsible: false },
        "24": { employment: "Full-Time, Part-Time", student: true, responsible: false },
        "25": { employment: "Full-Time, Self-Employed", student: true, responsible: false },
        "26": { employment: "Part-Time, Self-Employed", student: true, responsible: false },
        "27": { employment: "Full-Time, Part-Time, Self-Employed", student: true, responsible: false },
        "28": { employment: "Part-Time", student: false, responsible: false },
        "29": { employment: "Full-Time", student: false, responsible: false },
        "30": { employment: "Self-Employed", student: false, responsible: false },
        "31": { employment: "Retired", student: false, responsible: false },
        "32": { employment: "Unemployed", student: false, responsible: false },
        "33": { employment: "Full-Time, Part-Time, Self-Employed", student: false, responsible: false },
        "34": { employment: "Full-Time, Part-Time", student: false, responsible: false },
        "35": { employment: "Full-Time, Self-Employed", student: false, responsible: false },
        "36": { employment: "Part-Time, Self-Employed", student: false, responsible: false },

        // Existing NLS2 responsible entries (ET_NLS73-90)
        "73": { employment: "Retired", student: true, responsible: true },
        "74": { employment: "Unemployed", student: true, responsible: true },
        "75": { employment: "Full-Time", student: true, responsible: false }, // Special case
        "76": { employment: "Part-Time", student: true, responsible: true },
        "77": { employment: "Self-Employed", student: true, responsible: true },
        "78": { employment: "Full-Time, Part-Time", student: true, responsible: true },
        "79": { employment: "Full-Time, Self-Employed", student: true, responsible: true },
        "80": { employment: "Part-Time, Self-Employed", student: true, responsible: true },
        "81": { employment: "Full-Time, Part-Time, Self-Employed", student: true, responsible: true },
        "82": { employment: "Part-Time", student: false, responsible: true },
        "83": { employment: "Full-Time", student: false, responsible: true },
        "84": { employment: "Self-Employed", student: false, responsible: true },
        "85": { employment: "Retired", student: false, responsible: true },
        "86": { employment: "Unemployed", student: false, responsible: true },
        "87": { employment: "Full-Time, Part-Time, Self-Employed", student: false, responsible: true },
        "88": { employment: "Full-Time, Part-Time", student: false, responsible: true },
        "89": { employment: "Full-Time, Self-Employed", student: false, responsible: true },
        "90": { employment: "Part-Time, Self-Employed", student: false, responsible: true },
      }
      return employmentMap[etCode] || { employment: "Unknown", student: false, responsible: true }
    } else if (nlsCategory === "NLS3") {
      // NLS3 category - ET_NLS37-108 (expanded range)
      const employmentMap: Record<string, { employment: string; student: boolean; responsible: boolean }> = {
        // New NLS3 not responsible entries (ET_NLS37-54)
        "37": { employment: "Retired", student: true, responsible: false },
        "38": { employment: "Unemployed", student: true, responsible: false },
        "39": { employment: "Full-Time", student: true, responsible: false },
        "40": { employment: "Part-Time", student: true, responsible: false },
        "41": { employment: "Self-Employed", student: true, responsible: false },
        "42": { employment: "Full-Time, Part-Time", student: true, responsible: false },
        "43": { employment: "Full-Time, Self-Employed", student: true, responsible: false },
        "44": { employment: "Part-Time, Self-Employed", student: true, responsible: false },
        "45": { employment: "Full-Time, Part-Time, Self-Employed", student: true, responsible: false },
        "46": { employment: "Part-Time", student: false, responsible: false },
        "47": { employment: "Full-Time", student: false, responsible: false },
        "48": { employment: "Self-Employed", student: false, responsible: false },
        "49": { employment: "Retired", student: false, responsible: false },
        "50": { employment: "Unemployed", student: false, responsible: false },
        "51": { employment: "Full-Time, Part-Time, Self-Employed", student: false, responsible: false },
        "52": { employment: "Full-Time, Part-Time", student: false, responsible: false },
        "53": { employment: "Full-Time, Self-Employed", student: false, responsible: false },
        "54": { employment: "Part-Time, Self-Employed", student: false, responsible: false },

        // Existing NLS3 responsible entries (ET_NLS91-108)
        "91": { employment: "Retired", student: true, responsible: true },
        "92": { employment: "Unemployed", student: true, responsible: true },
        "93": { employment: "Full-Time", student: true, responsible: true },
        "94": { employment: "Part-Time", student: true, responsible: true },
        "95": { employment: "Self-Employed", student: true, responsible: true },
        "96": { employment: "Full-Time, Part-Time", student: true, responsible: true },
        "97": { employment: "Full-Time, Self-Employed", student: true, responsible: true },
        "98": { employment: "Part-Time, Self-Employed", student: true, responsible: true },
        "99": { employment: "Full-Time, Part-Time, Self-Employed", student: true, responsible: true },
        "100": { employment: "Part-Time", student: false, responsible: true },
        "101": { employment: "Full-Time", student: false, responsible: true },
        "102": { employment: "Self-Employed", student: false, responsible: true },
        "103": { employment: "Retired", student: false, responsible: true },
        "104": { employment: "Unemployed", student: false, responsible: true },
        "105": { employment: "Full-Time, Part-Time, Self-Employed", student: false, responsible: true },
        "106": { employment: "Full-Time, Part-Time", student: false, responsible: true },
        "107": { employment: "Full-Time, Self-Employed", student: false, responsible: true },
        "108": { employment: "Part-Time, Self-Employed", student: false, responsible: true },
      }
      return employmentMap[etCode] || { employment: "Unknown", student: false, responsible: true }
    } else if (nlsCategory === "LS3") {
      // LS3 category - ET_LS91-108 (all not responsible for rent)
      const employmentMap: Record<string, { employment: string; student: boolean; responsible: boolean }> = {
        "91": { employment: "Retired", student: true, responsible: false },
        "92": { employment: "Unemployed", student: true, responsible: false },
        "93": { employment: "Full-Time", student: true, responsible: false },
        "94": { employment: "Part-Time", student: true, responsible: false },
        "95": { employment: "Self-Employed", student: true, responsible: false },
        "96": { employment: "Full-Time, Part-Time", student: true, responsible: false },
        "97": { employment: "Full-Time, Self-Employed", student: true, responsible: false },
        "98": { employment: "Part-Time, Self-Employed", student: true, responsible: false },
        "99": { employment: "Full-Time, Part-Time, Self-Employed", student: true, responsible: false },
        "100": { employment: "Part-Time", student: false, responsible: false },
        "101": { employment: "Full-Time", student: false, responsible: false },
        "102": { employment: "Self-Employed", student: false, responsible: false },
        "103": { employment: "Retired", student: false, responsible: false },
        "104": { employment: "Unemployed", student: false, responsible: false },
        "105": { employment: "Full-Time, Part-Time, Self-Employed", student: false, responsible: false },
        "106": { employment: "Full-Time, Part-Time", student: false, responsible: false },
        "107": { employment: "Full-Time, Self-Employed", student: false, responsible: false },
        "108": { employment: "Part-Time, Self-Employed", student: false, responsible: false },
      }
      return employmentMap[etCode] || { employment: "Unknown", student: false, responsible: false }
    } else {
      return { employment: "Unknown", student: false, responsible: true }
    }
  }

  // Get flag codes based on ET code and rent responsibility
  const getFlagCodes = () => {
    const etMatch = workflowCode.match(/ET_NLS(\d+)/)
    const etCode = etMatch ? etMatch[1] : "1"

    // Determine which NLS category this is
    const nlsCategory = workflowCode.includes("NLS1:")
      ? "NLS1"
      : workflowCode.includes("NLS2:")
        ? "NLS2"
        : workflowCode.includes("NLS3:")
          ? "NLS3"
          : workflowCode.includes("LS3:")
            ? "LS3"
            : "NLS3"

    if (nlsCategory === "NLS1") {
      if (isRentResponsible) {
        // Existing NLS1 rent responsible logic (ET_NLS55-72)
        const flagMap: Record<string, { base: number }> = {
          "55": { base: 165 },
          "56": { base: 173 },
          "57": { base: 181 },
          "58": { base: 189 },
          "59": { base: 197 },
          "60": { base: 205 },
          "61": { base: 213 },
          "62": { base: 221 },
          "63": { base: 229 },
          "64": { base: 237 },
          "65": { base: 245 },
          "66": { base: 253 },
          "67": { base: 261 },
          "68": { base: 269 },
          "69": { base: 277 },
          "70": { base: 285 },
          "71": { base: 293 },
          "72": { base: 301 },
        }
        return flagMap[etCode] || { base: 165 }
      } else {
        // Existing NLS1 not rent responsible logic (ET_NLS1-18)
        const flagMap: Record<string, { base: number }> = {
          "1": { base: 3 },
          "2": { base: 6 },
          "3": { base: 9 },
          "4": { base: 12 },
          "5": { base: 15 },
          "6": { base: 18 },
          "7": { base: 21 },
          "8": { base: 24 },
          "9": { base: 27 },
          "10": { base: 30 },
          "11": { base: 33 },
          "12": { base: 36 },
          "13": { base: 39 },
          "14": { base: 42 },
          "15": { base: 45 },
          "16": { base: 48 },
          "17": { base: 51 },
          "18": { base: 54 },
        }
        return flagMap[etCode] || { base: 3 }
      }
    } else if (nlsCategory === "NLS2") {
      // NLS2 category - ET_NLS19-90 (expanded range)
      const flagMap: Record<string, { base: number }> = {
        // New NLS2 not responsible entries (ET_NLS19-36) - V_NLS57-110
        "19": { base: 57 }, // V_NLS57-59
        "20": { base: 60 }, // V_NLS60-62
        "21": { base: 63 }, // V_NLS63-65
        "22": { base: 66 }, // V_NLS66-68
        "23": { base: 69 }, // V_NLS69-71
        "24": { base: 72 }, // V_NLS72-74
        "25": { base: 75 }, // V_NLS75-77
        "26": { base: 78 }, // V_NLS78-80
        "27": { base: 81 }, // V_NLS81-83
        "28": { base: 84 }, // V_NLS84-86
        "29": { base: 87 }, // V_NLS87-89
        "30": { base: 90 }, // V_NLS90-92
        "31": { base: 93 }, // V_NLS93-95
        "32": { base: 96 }, // V_NLS96-98
        "33": { base: 99 }, // V_NLS99-101
        "34": { base: 102 }, // V_NLS102-104
        "35": { base: 105 }, // V_NLS105-107
        "36": { base: 108 }, // V_NLS108-110

        // Existing NLS2 responsible entries (ET_NLS73-90) - V_NLS309-452
        "73": { base: 309 }, // V_NLS309-316
        "74": { base: 317 }, // V_NLS317-324
        "75": { base: 325 }, // V_NLS325-332 (Not responsible)
        "76": { base: 333 }, // V_NLS333-340
        "77": { base: 341 }, // V_NLS341-348
        "78": { base: 349 }, // V_NLS349-356
        "79": { base: 357 }, // V_NLS357-364
        "80": { base: 365 }, // V_NLS365-372
        "81": { base: 373 }, // V_NLS373-380
        "82": { base: 381 }, // V_NLS381-388
        "83": { base: 389 }, // V_NLS389-396
        "84": { base: 397 }, // V_NLS397-404
        "85": { base: 405 }, // V_NLS405-412
        "86": { base: 413 }, // V_NLS413-420
        "87": { base: 421 }, // V_NLS421-428
        "88": { base: 429 }, // V_NLS429-436
        "89": { base: 437 }, // V_NLS437-444
        "90": { base: 445 }, // V_NLS445-452
      }
      return flagMap[etCode] || { base: 57 }
    } else if (nlsCategory === "NLS3") {
      // NLS3 category - ET_NLS37-108 (expanded range)
      const flagMap: Record<string, { base: number }> = {
        // New NLS3 not responsible entries (ET_NLS37-54) - V_NLS111-164
        "37": { base: 111 }, // V_NLS111-113
        "38": { base: 114 }, // V_NLS114-116
        "39": { base: 117 }, // V_NLS117-119
        "40": { base: 120 }, // V_NLS120-122
        "41": { base: 123 }, // V_NLS123-125
        "42": { base: 126 }, // V_NLS126-128
        "43": { base: 129 }, // V_NLS129-131
        "44": { base: 132 }, // V_NLS132-134
        "45": { base: 135 }, // V_NLS135-137
        "46": { base: 138 }, // V_NLS138-140
        "47": { base: 141 }, // V_NLS141-143
        "48": { base: 144 }, // V_NLS144-146
        "49": { base: 147 }, // V_NLS147-149
        "50": { base: 150 }, // V_NLS150-152
        "51": { base: 153 }, // V_NLS153-155
        "52": { base: 156 }, // V_NLS156-158
        "53": { base: 159 }, // V_NLS159-161
        "54": { base: 162 }, // V_NLS162-164

        // Existing NLS3 responsible entries (ET_NLS91-108) - V_NLS453-596
        "91": { base: 453 }, // V_NLS453-460
        "92": { base: 461 }, // V_NLS461-468
        "93": { base: 469 }, // V_NLS469-476
        "94": { base: 477 }, // V_NLS477-484
        "95": { base: 485 }, // V_NLS485-492
        "96": { base: 493 }, // V_NLS493-500
        "97": { base: 501 }, // V_NLS501-508
        "98": { base: 509 }, // V_NLS509-516
        "99": { base: 517 }, // V_NLS517-524
        "100": { base: 525 }, // V_NLS525-532
        "101": { base: 533 }, // V_NLS533-540
        "102": { base: 541 }, // V_NLS541-548
        "103": { base: 549 }, // V_NLS549-556
        "104": { base: 557 }, // V_NLS557-564
        "105": { base: 565 }, // V_NLS565-572
        "106": { base: 573 }, // V_NLS573-580
        "107": { base: 581 }, // V_NLS581-588
        "108": { base: 589 }, // V_NLS589-596
      }
      return flagMap[etCode] || { base: 111 }
    } else if (nlsCategory === "LS3") {
      // LS3 category - ET_LS91-108 - V_LS579-650
      const flagMap: Record<string, { base: number }> = {
        "91": { base: 579 }, // V_LS579-582
        "92": { base: 583 }, // V_LS583-586
        "93": { base: 587 }, // V_LS587-590
        "94": { base: 591 }, // V_LS591-594
        "95": { base: 595 }, // V_LS595-598
        "96": { base: 599 }, // V_LS599-602
        "97": { base: 603 }, // V_LS603-606
        "98": { base: 607 }, // V_LS607-610
        "99": { base: 611 }, // V_LS611-614
        "100": { base: 615 }, // V_LS615-618
        "101": { base: 619 }, // V_LS619-622
        "102": { base: 623 }, // V_LS623-626
        "103": { base: 627 }, // V_LS627-630
        "104": { base: 631 }, // V_LS631-634
        "105": { base: 635 }, // V_LS635-638
        "106": { base: 639 }, // V_LS639-642
        "107": { base: 643 }, // V_LS643-646
        "108": { base: 647 }, // V_LS647-650
      }
      return flagMap[etCode] || { base: 579 }
    } else {
      return { base: 453 }
    }
  }

  const workflowDetails = getWorkflowDetails()
  const flagCodes = getFlagCodes()

  // Update progress
  useEffect(() => {
    const totalSteps = isRentResponsible ? 4 : 3
    const currentProgress = Math.min(Math.round(((step + 1) / totalSteps) * 100), 100)
    setProgress(currentProgress)
  }, [step, isRentResponsible])

  // Set flags based on responses
  const setFlag = (flagName: string, value: boolean) => {
    setFlags((prev) => ({ ...prev, [flagName]: value }))
  }

  const handleNext = () => {
    if (step === 0) {
      if (hasCreditReport === true) {
        setStep(1) // Go to credit score range
      } else if (hasCreditReport === false && inCanadaFor12Months === true) {
        setStep(3) // Go to no credit report options
      } else if (inCanadaFor12Months === false) {
        // Set "not in Canada" flag and complete
        const base = flagCodes.base
        if (isRentResponsible) {
          setFlag(`V_NLS${base + 6}`, true) // Existing logic
        } else {
          setFlag(`V_NLS${base + 2}`, true) // Third flag for not in Canada
        }
        onComplete(flags)
      }
      return
    }

    if (step === 1) {
      if (isRentResponsible) {
        // Existing logic for rent responsible users
        if (creditScoreRange === "725-760" || creditScoreRange === "660-725") {
          onComplete(flags)
          return
        } else {
          setStep(2) // Go to deposit capability
          return
        }
      } else {
        // Not rent responsible - only set flags for specific ranges (NLS and LS3)
        const etMatch = workflowCode.match(/ET_NLS(\d+)/)
        const etCode = etMatch ? etMatch[1] : "1"

        // Determine which NLS category this is
        const nlsCategory = workflowCode.includes("NLS1:")
          ? "NLS1"
          : workflowCode.includes("NLS2:")
            ? "NLS2"
            : workflowCode.includes("NLS3:")
              ? "NLS3"
              : workflowCode.includes("LS3:")
                ? "LS3"
                : "NLS3"
        const base = flagCodes.base

        if (creditScoreRange === "760-900") {
          setFlag(`V_${nlsCategory === "LS3" ? "LS" : "NLS"}${base}`, true) // First flag for 760-900
        } else if (creditScoreRange === "550-660") {
          setFlag(`V_${nlsCategory === "LS3" ? "LS" : "NLS"}${base + 1}`, true) // Second flag for 550-660
        } else if (creditScoreRange === "300-560" || creditScoreRange === "dont-know") {
          setFlag(`V_${nlsCategory === "LS3" ? "LS" : "NLS"}${base + 2}`, true) // Third flag for 300-560/don't know
        }

        // For "Not in Canada" option
        if (inCanadaFor12Months === false) {
          setFlag(`V_${nlsCategory === "LS3" ? "LS" : "NLS"}${base + 3}`, true) // Fourth flag for not in Canada
        }

        // Complete workflow immediately - no deposit questions for not rent responsible
        onComplete(flags)
        return
      }
    }

    if (step === 2) {
      // Set appropriate flags based on responses
      const base = flagCodes.base

      if (inCanadaFor12Months === false) {
        // Not in Canada flags
        if (canPayExtraDeposit) {
          setFlag(`V_NLS${base + 6}`, true) // +6 for "not in Canada, yes deposit"
        } else {
          setFlag(`V_NLS${base + 7}`, true) // +7 for "not in Canada, no deposit"
        }
      } else if (creditScoreRange === "760-900") {
        if (canPayExtraDeposit) {
          setFlag(`V_NLS${base}`, true) // Base for "760-900, yes deposit"
        } else {
          setFlag(`V_NLS${base + 1}`, true) // +1 for "760-900, no deposit"
        }
      } else if (creditScoreRange === "550-660") {
        if (canPayExtraDeposit) {
          setFlag(`V_NLS${base + 2}`, true) // +2 for "550-660, yes deposit"
        } else {
          setFlag(`V_NLS${base + 3}`, true) // +3 for "550-660, no deposit"
        }
      } else if (creditScoreRange === "300-560" || creditScoreRange === "dont-know") {
        if (canPayExtraDeposit) {
          setFlag(`V_NLS${base + 4}`, true) // +4 for "300-560/don't know, yes deposit"
        } else {
          setFlag(`V_NLS${base + 5}`, true) // +5 for "300-560/don't know, no deposit"
        }
      }

      onComplete(flags)
      return
    }

    if (step === 3) {
      onComplete(flags)
      return
    }

    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1)
    } else {
      onBack()
    }
  }

  // Render credit report question
  const renderCreditReportQuestion = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-black">Credit Score Assessment</h2>
        <p className="text-gray-600 mt-2">Step 1: Credit Report Status</p>
      </div>

      {!isRentResponsible && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-800 text-sm font-medium mb-2">NLS - Not Responsible for Rent</p>
              <p className="text-green-700 text-sm">
                Since you are not contributing to rent payments, this assessment is simplified and focuses only on your
                credit history for reference purposes.
              </p>
            </div>
          </div>
        </div>
      )}

      {isRentResponsible && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 text-sm font-medium mb-2">Important Notice for NLS (Non-Lease Signers)</p>
              <p className="text-blue-700 text-sm">
                Because you are contributing to rent, you will likely need to qualify by completing your LSP (Lease
                Signer Process) which would lead to you becoming an LS (Lease Signer). We encourage you to complete an
                LSP. Otherwise, you can wait for the rest of your group to complete LSP first, to see if we can include
                you in the group as a NLS who is paying rent.
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-gray-600">
        If you have been living in Canada for 12+ months, have you pulled your most recent detailed "paid" credit score
        and report from Equifax or TransUnion within the past 60 days?
      </p>

      <RadioGroup
        value={
          hasCreditReport === null
            ? undefined
            : hasCreditReport === true
              ? "yes"
              : inCanadaFor12Months === false
                ? "not-in-canada"
                : "no"
        }
        onValueChange={(value) => {
          if (value === "yes") {
            setHasCreditReport(true)
            setInCanadaFor12Months(true)
          } else if (value === "no") {
            setHasCreditReport(false)
            setInCanadaFor12Months(true)
          } else if (value === "not-in-canada") {
            setHasCreditReport(false)
            setInCanadaFor12Months(false)
          }
        }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="yes" id="credit-yes" />
          <Label htmlFor="credit-yes" className="text-sm">
            Yes
          </Label>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="no" id="credit-no" />
          <Label htmlFor="credit-no" className="text-sm">
            No
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="not-in-canada" id="credit-not-canada" />
          <Label htmlFor="credit-not-canada" className="text-sm">
            Not in Canada for 12+ months
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={hasCreditReport === null && inCanadaFor12Months === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render credit score range question
  const renderCreditScoreRange = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-black">Credit Score Range</h2>
        <p className="text-gray-600 mt-2">Step 2: Select Your Range</p>
      </div>

      <p className="text-gray-600">What is your credit score range?</p>

      <RadioGroup value={creditScoreRange || ""} onValueChange={setCreditScoreRange}>
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="760-900" id="score-760-900" />
          <Label htmlFor="score-760-900" className="text-sm">
            760-900{" "}
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
              Excellent
            </Badge>
          </Label>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="725-760" id="score-725-760" />
          <Label htmlFor="score-725-760" className="text-sm">
            725-760{" "}
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
              Very Good
            </Badge>
          </Label>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="660-725" id="score-660-725" />
          <Label htmlFor="score-660-725" className="text-sm">
            660-725{" "}
            <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700">
              Good
            </Badge>
          </Label>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="550-660" id="score-550-660" />
          <Label htmlFor="score-550-660" className="text-sm">
            550-660{" "}
            <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700">
              Fair
            </Badge>
          </Label>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="300-560" id="score-300-560" />
          <Label htmlFor="score-300-560" className="text-sm">
            300-560{" "}
            <Badge variant="outline" className="ml-2 bg-red-50 text-red-700">
              Poor
            </Badge>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dont-know" id="score-dont-know" />
          <Label htmlFor="score-dont-know" className="text-sm">
            I don't know
          </Label>
        </div>
      </RadioGroup>

      {(creditScoreRange === "725-760" || creditScoreRange === "660-725") && isRentResponsible && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800">Great Credit Score!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your credit score range qualifies you without additional deposit requirements.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!creditScoreRange}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Render deposit capability question
  const renderDepositCapability = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-black">Deposit Capability</h2>
        <p className="text-gray-600 mt-2">Step 3: Additional Deposit Assessment</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-800 text-sm font-medium mb-2">Competitive Advantage Question</p>
            <p className="text-amber-700 text-sm">
              In the event that you have already viewed properties with our Rental Specialists and are ready to submit
              an offer, the mandatory deposit requirement amount is the first and last month's rent. In a multiple offer
              situation where there are competing tenants for the same property, would you be able to comfortably set
              aside more than the minimum required amount to give yourself a greater advantage in the offer
              presentation?
            </p>
          </div>
        </div>
      </div>

      <RadioGroup
        value={canPayExtraDeposit === null ? undefined : canPayExtraDeposit.toString()}
        onValueChange={(value) => setCanPayExtraDeposit(value === "true")}
      >
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="true" id="deposit-yes" />
          <Label htmlFor="deposit-yes" className="text-sm">
            Yes, I can comfortably pay more than the minimum required amount
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="deposit-no" />
          <Label htmlFor="deposit-no" className="text-sm">
            No, I can only pay the minimum required amount
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={canPayExtraDeposit === null}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          Complete Assessment
        </Button>
      </div>
    </div>
  )

  // Render no credit report options
  const renderNoCreditReportOptions = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-black">Credit Report Options</h2>
        <p className="text-gray-600 mt-2">Step 2: Next Steps</p>
      </div>

      <p className="text-gray-600">Would you like to get your full credit report now, or skip this step?</p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800 text-sm font-medium mb-1">Recommendation</p>
            <p className="text-blue-700 text-sm">
              Getting your credit report will help us better assess your qualification and may improve your chances of
              approval.
            </p>
          </div>
        </div>
      </div>

      <RadioGroup value={creditReportAction || ""} onValueChange={setCreditReportAction}>
        <div className="flex items-center space-x-2 mb-3">
          <RadioGroupItem value="get-report" id="get-report" />
          <Label htmlFor="get-report" className="text-sm">
            Get full credit report from Equifax or TransUnion
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="skip" id="skip-report" />
          <Label htmlFor="skip-report" className="text-sm">
            Skip this step for now
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={() => {
            if (creditReportAction === "get-report") {
              window.open("https://www.equifax.ca/personal/products/credit-score-report/", "_blank")
            }
            handleNext()
          }}
          disabled={!creditReportAction}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          {creditReportAction === "get-report" ? "Get Report & Continue" : "Continue"}
        </Button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return renderCreditReportQuestion()
      case 1:
        return renderCreditScoreRange()
      case 2:
        return isRentResponsible ? renderDepositCapability() : renderNoCreditReportOptions()
      case 3:
        return renderNoCreditReportOptions()
      default:
        return renderCreditReportQuestion()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">
                  Credit Score Assessment {isRentResponsible ? "(Rent Responsible)" : "(Not Rent Responsible)"}
                </CardTitle>
                <p className="text-white/80 text-sm mt-1">
                  {workflowCode} • {workflowDetails.employment} • Student: {workflowDetails.student ? "Yes" : "No"}
                </p>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {progress}%
              </Badge>
            </div>
          </CardHeader>

          <div className="px-6 pt-6">
            <Progress
              value={progress}
              className="h-2 bg-gray-100"
              indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>

          <CardContent className="p-6">{renderCurrentStep()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
