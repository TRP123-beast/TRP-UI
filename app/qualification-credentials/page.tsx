"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, X, FileText, Calculator, DollarSign, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Slider } from "@/components/ui/slider"

import {
  resolveNLSWorkflow,
  validateNLSWorkflowData,
  getNLSWorkflowDisplayName,
  type NLSWorkflowType,
  type NLSEmploymentType,
  type StudentStatus,
  type InternationalStatus,
  type CreditReportStatus,
  type CreditScoreRange,
} from "@/utils/nls-workflows"

export default function QualificationCredentialsPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    groupType: "LS", // Keep this for the base group type
    occupantCount: "", // New field: "1" or ">1"
    hasInvite: "", // New field: "yes" or "no"
    workflowCode: "", // New field to store the final workflow code (LS1, LS2, LS3, etc.)
    rentResponsible: "yes",
    employmentType: "Full-Time",
    isStudent: "no",
    isInternational: "no",
    monthlyBudget: [5000],
    monthlyIncome: [5000],
    creditReportStatus: "",
    creditReportAction: "",
    creditScoreRange: "",
    extraDeposit: "",
  })
  const [result, setResult] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    if (formData.groupType && formData.occupantCount && formData.hasInvite) {
      const workflowCode = getWorkflowCode()
      const userTypeData = {
        groupType: formData.groupType,
        occupantCount: formData.occupantCount,
        hasInvite: formData.hasInvite,
        workflowCode: workflowCode,
        timestamp: new Date().toISOString(),
      }

      if (formData.groupType === "NLS") {
        userTypeData.workflowDisplayName = getNLSWorkflowDisplayName(workflowCode as NLSWorkflowType)
      }

      console.log("🔍 User Type Data Determined:", userTypeData)
    }
  }, [formData.groupType, formData.occupantCount, formData.hasInvite])

  const updateSliderValue = (field: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateSelectValue = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getWorkflowCode = () => {
    const { groupType, occupantCount, hasInvite } = formData

    if (!groupType || !occupantCount || !hasInvite) return ""

    // If invited to a group, use workflow 3
    if (hasInvite === "yes") {
      return `${groupType}3`
    }

    // If not invited, use workflow based on occupant count
    if (occupantCount === "1") {
      return `${groupType}1`
    } else {
      return `${groupType}2`
    }
  }

  const calculateResult = () => {
    const {
      groupType,
      occupantCount,
      hasInvite,
      rentResponsible,
      employmentType,
      isStudent,
      isInternational,
      monthlyBudget,
      monthlyIncome,
      creditReportStatus,
      creditReportAction,
      creditScoreRange,
      extraDeposit,
    } = formData

    // Initialize workflow tracking
    const workflowData = {
      sessionId: `QC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      step: "LS3_NOT_RESPONSIBLE_WORKFLOW",
      flags: [] as string[],
      dataIdentifiers: {} as Record<string, any>,
      decisionPoints: [] as any[],
    }

    console.log("🚀 LS3 NOT RESPONSIBLE WORKFLOW STARTED", workflowData.sessionId)
    console.log("📊 Initial Form Data:", formData)

    // Enhanced Validation with logging
    const missingFields: string[] = []
    if (!groupType) missingFields.push("groupType")
    if (!occupantCount) missingFields.push("occupantCount")
    if (!hasInvite) missingFields.push("hasInvite")
    if (!rentResponsible) missingFields.push("rentResponsible")
    if (!employmentType) missingFields.push("employmentType")
    if (groupType !== "CSG" && !isStudent) missingFields.push("isStudent")
    if (groupType !== "CSG" && isStudent === "yes" && !isInternational) missingFields.push("isInternational")
    if (!creditReportStatus) missingFields.push("creditReportStatus")
    if (creditReportStatus === "yes" && !creditScoreRange) missingFields.push("creditScoreRange")
    if (creditReportStatus === "no" && !creditReportAction) missingFields.push("creditReportAction")
    if (groupType === "NLS" && creditScoreRange === "760-900" && rentResponsible === "yes" && !extraDeposit) {
      missingFields.push("extraDeposit")
    }

    if (missingFields.length > 0) {
      workflowData.flags.push("VALIDATION_ERROR_MISSING_FIELDS")
      console.error("❌ VALIDATION ERROR: Missing required fields", missingFields)
      setResult(`Error: Missing required fields - ${missingFields.join(", ")}.`)
      return
    }

    // LS3 "Not Responsible" Workflow Logic
    let finalCode = ""

    // Define comprehensive LS workflows for all scenarios
    const ls1Workflows: Record<string, Record<string, string>> = {
      // LS1 - Single occupant, no invite
      "Full-Time_Yes": {
        "760-900": "V_LS1",
        "550-660": "V_LS2",
        "300-560": "V_LS2",
        dontKnow: "V_LS3",
        notInCanada: "V_LS4",
      },
      "Part-Time_Yes": {
        "760-900": "V_LS5",
        "550-660": "V_LS6",
        "300-560": "V_LS6",
        dontKnow: "V_LS7",
        notInCanada: "V_LS8",
      },
      "Self-Employed_Yes": {
        "760-900": "V_LS9",
        "550-660": "V_LS10",
        "300-560": "V_LS10",
        dontKnow: "V_LS11",
        notInCanada: "V_LS12",
      },
      Retired_Yes: {
        "760-900": "V_LS13",
        "550-660": "V_LS14",
        "300-560": "V_LS14",
        dontKnow: "V_LS15",
        notInCanada: "V_LS16",
      },
      Unemployed_Yes: {
        "760-900": "V_LS17",
        "550-660": "V_LS18",
        "300-560": "V_LS18",
        dontKnow: "V_LS19",
        notInCanada: "V_LS20",
      },
      "Full-Time, Part-Time_Yes": {
        "760-900": "V_LS21",
        "550-660": "V_LS22",
        "300-560": "V_LS22",
        dontKnow: "V_LS23",
        notInCanada: "V_LS24",
      },
      "Full-Time, Self-Employed_Yes": {
        "760-900": "V_LS25",
        "550-660": "V_LS26",
        "300-560": "V_LS26",
        dontKnow: "V_LS27",
        notInCanada: "V_LS28",
      },
      "Part-Time, Self-Employed_Yes": {
        "760-900": "V_LS29",
        "550-660": "V_LS30",
        "300-560": "V_LS30",
        dontKnow: "V_LS31",
        notInCanada: "V_LS32",
      },
      "Full-Time, Part-Time, Self-Employed_Yes": {
        "760-900": "V_LS33",
        "550-660": "V_LS34",
        "300-560": "V_LS34",
        dontKnow: "V_LS35",
        notInCanada: "V_LS36",
      },
      // Non-student variants
      "Full-Time_No": {
        "760-900": "V_LS37",
        "550-660": "V_LS38",
        "300-560": "V_LS38",
        dontKnow: "V_LS39",
        notInCanada: "V_LS40",
      },
      "Part-Time_No": {
        "760-900": "V_LS41",
        "550-660": "V_LS42",
        "300-560": "V_LS42",
        dontKnow: "V_LS43",
        notInCanada: "V_LS44",
      },
      "Self-Employed_No": {
        "760-900": "V_LS45",
        "550-660": "V_LS46",
        "300-560": "V_LS46",
        dontKnow: "V_LS47",
        notInCanada: "V_LS48",
      },
      Retired_No: {
        "760-900": "V_LS49",
        "550-660": "V_LS50",
        "300-560": "V_LS50",
        dontKnow: "V_LS51",
        notInCanada: "V_LS52",
      },
      Unemployed_No: {
        "760-900": "V_LS53",
        "550-660": "V_LS54",
        "300-560": "V_LS54",
        dontKnow: "V_LS55",
        notInCanada: "V_LS56",
      },
      "Full-Time, Part-Time_No": {
        "760-900": "V_LS57",
        "550-660": "V_LS58",
        "300-560": "V_LS58",
        dontKnow: "V_LS59",
        notInCanada: "V_LS60",
      },
      "Full-Time, Self-Employed_No": {
        "760-900": "V_LS61",
        "550-660": "V_LS62",
        "300-560": "V_LS62",
        dontKnow: "V_LS63",
        notInCanada: "V_LS64",
      },
      "Part-Time, Self-Employed_No": {
        "760-900": "V_LS65",
        "550-660": "V_LS66",
        "300-560": "V_LS66",
        dontKnow: "V_LS67",
        notInCanada: "V_LS68",
      },
      "Full-Time, Part-Time, Self-Employed_No": {
        "760-900": "V_LS69",
        "550-660": "V_LS70",
        "300-560": "V_LS70",
        dontKnow: "V_LS71",
        notInCanada: "V_LS72",
      },
    }

    const ls2Workflows: Record<string, Record<string, string>> = {
      // LS2 - Multiple occupants, no invite
      "Full-Time_Yes": {
        "760-900": "V_LS289",
        "550-660": "V_LS290",
        "300-560": "V_LS290",
        dontKnow: "V_LS291",
        notInCanada: "V_LS292",
      },
      "Part-Time_Yes": {
        "760-900": "V_LS293",
        "550-660": "V_LS294",
        "300-560": "V_LS294",
        dontKnow: "V_LS295",
        notInCanada: "V_LS296",
      },
      "Self-Employed_Yes": {
        "760-900": "V_LS297",
        "550-660": "V_LS298",
        "300-560": "V_LS298",
        dontKnow: "V_LS299",
        notInCanada: "V_LS300",
      },
      Retired_Yes: {
        "760-900": "V_LS301",
        "550-660": "V_LS302",
        "300-560": "V_LS302",
        dontKnow: "V_LS303",
        notInCanada: "V_LS304",
      },
      Unemployed_Yes: {
        "760-900": "V_LS305",
        "550-660": "V_LS306",
        "300-560": "V_LS306",
        dontKnow: "V_LS307",
        notInCanada: "V_LS308",
      },
      "Full-Time, Part-Time_Yes": {
        "760-900": "V_LS309",
        "550-660": "V_LS310",
        "300-560": "V_LS310",
        dontKnow: "V_LS311",
        notInCanada: "V_LS312",
      },
      "Full-Time, Self-Employed_Yes": {
        "760-900": "V_LS313",
        "550-660": "V_LS314",
        "300-560": "V_LS314",
        dontKnow: "V_LS315",
        notInCanada: "V_LS316",
      },
      "Part-Time, Self-Employed_Yes": {
        "760-900": "V_LS317",
        "550-660": "V_LS318",
        "300-560": "V_LS318",
        dontKnow: "V_LS319",
        notInCanada: "V_LS320",
      },
      "Full-Time, Part-Time, Self-Employed_Yes": {
        "760-900": "V_LS321",
        "550-660": "V_LS322",
        "300-560": "V_LS322",
        dontKnow: "V_LS323",
        notInCanada: "V_LS324",
      },
      // Non-student variants
      "Full-Time_No": {
        "760-900": "V_LS325",
        "550-660": "V_LS326",
        "300-560": "V_LS326",
        dontKnow: "V_LS327",
        notInCanada: "V_LS328",
      },
      "Part-Time_No": {
        "760-900": "V_LS329",
        "550-660": "V_LS330",
        "300-560": "V_LS330",
        dontKnow: "V_LS331",
        notInCanada: "V_LS332",
      },
      "Self-Employed_No": {
        "760-900": "V_LS333",
        "550-660": "V_LS334",
        "300-560": "V_LS334",
        dontKnow: "V_LS335",
        notInCanada: "V_LS336",
      },
      Retired_No: {
        "760-900": "V_LS337",
        "550-660": "V_LS338",
        "300-560": "V_LS338",
        dontKnow: "V_LS339",
        notInCanada: "V_LS340",
      },
      Unemployed_No: {
        "760-900": "V_LS341",
        "550-660": "V_LS342",
        "300-560": "V_LS342",
        dontKnow: "V_LS343",
        notInCanada: "V_LS344",
      },
      "Full-Time, Part-Time_No": {
        "760-900": "V_LS345",
        "550-660": "V_LS346",
        "300-560": "V_LS346",
        dontKnow: "V_LS347",
        notInCanada: "V_LS348",
      },
      "Full-Time, Self-Employed_No": {
        "760-900": "V_LS349",
        "550-660": "V_LS350",
        "300-560": "V_LS350",
        dontKnow: "V_LS351",
        notInCanada: "V_LS352",
      },
      "Part-Time, Self-Employed_No": {
        "760-900": "V_LS353",
        "550-660": "V_LS354",
        "300-560": "V_LS354",
        dontKnow: "V_LS355",
        notInCanada: "V_LS356",
      },
      "Full-Time, Part-Time, Self-Employed_No": {
        "760-900": "V_LS357",
        "550-660": "V_LS358",
        "300-560": "V_LS358",
        dontKnow: "V_LS359",
        notInCanada: "V_LS360",
      },
    }

    // Only process LS workflow logic for LS groups
    if (groupType === "LS") {
      // Determine which LS workflow to use
      const workflowCode = getWorkflowCode()
      let currentLsWorkflow: Record<string, Record<string, string>>

      if (workflowCode === "LS1") {
        currentLsWorkflow = ls1Workflows
      } else if (workflowCode === "LS2") {
        currentLsWorkflow = ls2Workflows
      } else {
        setResult(`Error: Unknown LS workflow code: ${workflowCode}`)
        return
      }

      // Create workflow key
      const studentStatus = isStudent === "yes" ? "Yes" : "No"
      const workflowKey = `${employmentType}_${studentStatus}`

      console.log("🔍 LS Workflow Key:", workflowKey, `(${workflowCode})`)

      // Check if workflow exists
      if (!currentLsWorkflow[workflowKey]) {
        workflowData.flags.push("LS_WORKFLOW_NOT_FOUND")
        console.error("❌ LS WORKFLOW NOT FOUND:", workflowKey)
        setResult(`Error: LS workflow not found for ${workflowKey}`)
        return
      }

      const currentWorkflow = currentLsWorkflow[workflowKey]

      // Handle credit report status and score for LS workflows
      if (creditReportStatus === "not-in-canada") {
        finalCode = currentWorkflow["notInCanada"]
        console.log("🌍 LS Not in Canada for 12+ months:", finalCode)
      } else if (creditReportStatus === "yes" && creditScoreRange) {
        // Handle credit score ranges
        if (creditScoreRange === "760-900") {
          finalCode = currentWorkflow["760-900"]
        } else if (creditScoreRange === "725-760" || creditScoreRange === "660-725") {
          finalCode = "QUALIFIED" // Auto-qualify for these ranges
        } else if (creditScoreRange === "550-660") {
          finalCode = currentWorkflow["550-660"]
        } else if (creditScoreRange === "300-560") {
          finalCode = currentWorkflow["300-560"] || "MANUAL_REVIEW"
        } else if (creditScoreRange === "unknown") {
          finalCode = currentWorkflow["dontKnow"]
        }
        console.log("📊 LS Credit Score Range:", creditScoreRange, "→", finalCode)
      } else if (creditReportStatus === "no" && creditReportAction) {
        if (creditReportAction === "get-report") {
          finalCode = "GET_CREDIT_REPORT"
        } else if (creditReportAction === "skip") {
          finalCode = currentWorkflow["dontKnow"]
        }
        console.log("📋 LS Credit Report Action:", creditReportAction, "→", finalCode)
      } else {
        finalCode = "INCOMPLETE_ASSESSMENT"
      }

      workflowData.dataIdentifiers.finalQualificationCode = finalCode
      workflowData.dataIdentifiers.employmentType = employmentType
      workflowData.dataIdentifiers.isStudent = isStudent
      workflowData.dataIdentifiers.workflowKey = workflowKey
      workflowData.dataIdentifiers.lsWorkflowCode = workflowCode
      workflowData.step = `${workflowCode}_WORKFLOW`
    }

    // NLS Workflow Logic
    if (groupType === "NLS") {
      // Determine NLS workflow type
      const workflowCode = getWorkflowCode()
      const nlsWorkflowType = workflowCode as NLSWorkflowType

      console.log("🔍 NLS Workflow Type:", nlsWorkflowType)

      // Validate NLS workflow data
      const validation = validateNLSWorkflowData(
        nlsWorkflowType,
        employmentType as NLSEmploymentType,
        (isStudent === "yes" ? "Yes" : "No") as StudentStatus,
        (isInternational === "yes" ? "Yes" : "No") as InternationalStatus,
        creditReportStatus as CreditReportStatus,
        creditScoreRange as CreditScoreRange,
      )

      if (!validation.isValid) {
        workflowData.flags.push("NLS_VALIDATION_ERROR")
        console.error("❌ NLS VALIDATION ERROR:", validation.errors)
        setResult(`Error: ${validation.errors.join(", ")}`)
        return
      }

      // Handle credit report action for "no" status
      let effectiveCreditScoreRange = creditScoreRange as CreditScoreRange
      if (creditReportStatus === "no" && creditReportAction === "skip") {
        effectiveCreditScoreRange = "unknown"
      } else if (creditReportStatus === "no" && creditReportAction === "get-report") {
        finalCode = "GET_CREDIT_REPORT"
        workflowData.dataIdentifiers.finalQualificationCode = finalCode
        workflowData.dataIdentifiers.nlsWorkflowType = nlsWorkflowType
        workflowData.step = `${nlsWorkflowType}_WORKFLOW`
      } else {
        // Apply fallback logic for high credit scores before calling resolveNLSWorkflow
        if (
          effectiveCreditScoreRange === "760-900" ||
          effectiveCreditScoreRange === "725-760" ||
          effectiveCreditScoreRange === "660-725"
        ) {
          finalCode = "QUALIFIED"
          console.log(
            "🔄 Applied direct qualification for high credit score:",
            effectiveCreditScoreRange,
            "→",
            finalCode,
          )
        } else {
          // Try to resolve NLS workflow for other cases
          finalCode = resolveNLSWorkflow(
            nlsWorkflowType,
            employmentType as NLSEmploymentType,
            (isStudent === "yes" ? "Yes" : "No") as StudentStatus,
            (isInternational === "yes" ? "Yes" : "No") as InternationalStatus,
            creditReportStatus as CreditReportStatus,
            effectiveCreditScoreRange,
            extraDeposit, // This will be used for deposit capability question
          )

          // Handle unmapped credit score ranges
          if (finalCode === "ERROR_CREDIT_SCORE_NOT_MAPPED") {
            workflowData.flags.push("ERROR_CREDIT_SCORE_NOT_MAPPED")
            console.error("❌ CREDIT SCORE NOT MAPPED:", {
              creditScoreRange: effectiveCreditScoreRange,
              employmentType,
              studentStatus: isStudent,
            })

            // Provide fallback logic for unmapped cases
            if (effectiveCreditScoreRange === "550-660" || effectiveCreditScoreRange === "300-560") {
              finalCode = "MANUAL_REVIEW"
              console.log("🔄 Applied manual review for lower credit score:", effectiveCreditScoreRange, "→", finalCode)
            } else if (effectiveCreditScoreRange === "unknown") {
              finalCode = "GET_CREDIT_REPORT"
              console.log("🔄 Applied get credit report for unknown score:", effectiveCreditScoreRange, "→", finalCode)
            } else {
              setResult("Error: Credit score range not supported for this workflow. Please contact support.")
              return
            }
          }
        }

        console.log("📊 NLS Workflow Result:", finalCode)

        workflowData.dataIdentifiers.finalQualificationCode = finalCode
        workflowData.dataIdentifiers.nlsWorkflowType = nlsWorkflowType
        workflowData.dataIdentifiers.employmentType = employmentType
        workflowData.dataIdentifiers.isStudent = isStudent
        workflowData.dataIdentifiers.isInternational = isInternational
        workflowData.step = `${nlsWorkflowType}_WORKFLOW`
      }
    }

    // CSG Workflow Logic
    if (groupType === "CSG") {
      // Determine if this is CSG1, CSG2 or CSG3 based on workflow code
      const workflowCode = getWorkflowCode()
      const isCsg1 = workflowCode === "CSG1" // Single occupant
      const isCsg2 = workflowCode === "CSG2" // Multiple occupants, no invite
      const isCsg3 = workflowCode.endsWith("3") // CSG3 for invited to group

      // CSG1 Workflow Logic for "Not in Canada for 12+ months"
      if (isCsg1 && creditReportStatus === "not-in-canada") {
        // Define CSG1 employment type to V_CSG code mappings
        const csg1NotInCanadaCodes: Record<string, string | Record<string, string>> = {
          // Guarantor (Not Responsible) - Direct codes
          "Retired_Not Responsible": "V_CSG78", // ET_CSG10
          "Unemployed_Not Responsible": "V_CSG82", // ET_CSG11
          "Full-Time_Not Responsible": "V_CSG86", // ET_CSG12
          "Part-Time_Not Responsible": "V_CSG90", // ET_CSG13
          "Self-Employed_Not Responsible": "V_CSG94", // ET_CSG14
          "Full-Time, Part-Time_Not Responsible": "V_CSG98", // ET_CSG15
          "Full-Time, Self-Employed_Not Responsible": "V_CSG102", // ET_CSG16
          "Part-Time, Self-Employed_Not Responsible": "V_CSG106", // ET_CSG17
          "Full-Time, Part-Time, Self-Employed_Not Responsible": "V_CSG110", // ET_CSG18

          // Main Applicant/Co-Signer (Responsible) - Deposit question required
          Retired_Responsible: { yes: "V_CSG9", no: "V_CSG10" }, // ET_CSG1
          Unemployed_Responsible: { yes: "V_CSG17", no: "V_CSG18" }, // ET_CSG2
          "Full-Time_Responsible": { yes: "V_CSG25", no: "V_CSG26" }, // ET_CSG3
          "Part-Time_Responsible": { yes: "V_CSG33", no: "V_CSG34" }, // ET_CSG4
          "Self-Employed_Responsible": { yes: "V_CSG41", no: "V_CSG42" }, // ET_CSG5
          "Full-Time, Part-Time_Responsible": { yes: "V_CSG49", no: "V_CSG50" }, // ET_CSG6
          "Full-Time, Self-Employed_Responsible": { yes: "V_CSG57", no: "V_CSG58" }, // ET_CSG7
          "Part-Time, Self-Employed_Responsible": { yes: "V_CSG65", no: "V_CSG66" }, // ET_CSG8
          "Full-Time, Part-Time, Self-Employed_Responsible": { yes: "V_CSG73", no: "V_CSG74" }, // ET_CSG9
        }

        // Create CSG1 workflow key
        const rentStatus = rentResponsible === "yes" ? "Responsible" : "Not Responsible"
        const csg1WorkflowKey = `${employmentType}_${rentStatus}`

        console.log("🔍 CSG1 Workflow Key:", csg1WorkflowKey, "(Not in Canada for 12+ months)")

        // Check if CSG1 workflow exists
        if (!csg1NotInCanadaCodes[csg1WorkflowKey]) {
          workflowData.flags.push("CSG1_WORKFLOW_NOT_FOUND")
          console.error("❌ CSG1 WORKFLOW NOT FOUND:", csg1WorkflowKey)
          setResult(`Error: CSG1 workflow not found for ${csg1WorkflowKey}`)
          return
        }

        const csg1Result = csg1NotInCanadaCodes[csg1WorkflowKey]

        if (typeof csg1Result === "object") {
          // Responsible user - needs deposit question answer
          if (!extraDeposit) {
            setResult("DEPOSIT_QUESTION_REQUIRED")
            console.log("🔄 CSG1 Responsible user requires deposit question")
            return
          }
          finalCode = extraDeposit === "yes" ? csg1Result.yes : csg1Result.no
          console.log("💰 CSG1 Responsible deposit answer:", extraDeposit, "→", finalCode)
        } else {
          // Not responsible (Guarantor) - direct result
          finalCode = csg1Result as string
          console.log("👤 CSG1 Guarantor direct result:", finalCode)
        }

        workflowData.step = "CSG1_NOT_IN_CANADA_WORKFLOW"
        workflowData.dataIdentifiers.csg1WorkflowKey = csg1WorkflowKey
        workflowData.dataIdentifiers.isCsg1 = true
      } else {
        // Existing CSG2/CSG3 workflow logic for other credit report statuses
        // Define the CSG2 workflows mapping (for CSG1 and CSG2)
        const csg2Workflows: Record<string, Record<string, string | Record<string, string>>> = {
          // Rent Responsible workflows
          Retired_Responsible: {
            "760-900": { yes: "V_CSG111", no: "V_CSG112" },
            "550-660": { yes: "V_CSG113", no: "V_CSG114" },
            "300-560": { yes: "V_CSG113", no: "V_CSG114" },
            dontKnow: { yes: "V_CSG114", no: "V_CSG115" },
            notInCanada: { yes: "V_CSG116", no: "V_CSG117" },
          },
          Unemployed_Responsible: {
            "760-900": { yes: "V_CSG118", no: "V_CSG119" },
            "550-660": { yes: "V_CSG120", no: "V_CSG121" },
            "300-560": { yes: "V_CSG120", no: "V_CSG121" },
            dontKnow: { yes: "V_CSG122", no: "V_CSG123" },
            notInCanada: { yes: "V_CSG124", no: "V_CSG125" },
          },
          "Full-Time_Responsible": {
            "760-900": { yes: "V_CSG126", no: "V_CSG127" },
            "550-660": { yes: "V_CSG128", no: "V_CSG129" },
            "300-560": { yes: "V_CSG128", no: "V_CSG129" },
            dontKnow: { yes: "V_CSG130", no: "V_CSG131" },
            notInCanada: { yes: "V_CSG132", no: "V_CSG133" },
          },
          "Part-Time_Responsible": {
            "760-900": { yes: "V_CSG135", no: "V_CSG136" },
            "550-660": { yes: "V_CSG137", no: "V_CSG138" },
            "300-560": { yes: "V_CSG137", no: "V_CSG138" },
            dontKnow: { yes: "V_CSG139", no: "V_CSG140" },
            notInCanada: { yes: "V_CSG141", no: "V_CSG142" },
          },
          "Self-Employed_Responsible": {
            "760-900": { yes: "V_CSG143", no: "V_CSG144" },
            "550-660": { yes: "V_CSG145", no: "V_CSG146" },
            "300-560": { yes: "V_CSG145", no: "V_CSG146" },
            dontKnow: { yes: "V_CSG147", no: "V_CSG148" },
            notInCanada: { yes: "V_CSG149", no: "V_CSG150" },
          },
          "Full-Time, Part-Time_Responsible": {
            "760-900": { yes: "V_CSG151", no: "V_CSG152" },
            "550-660": { yes: "V_CSG153", no: "V_CSG154" },
            "300-560": { yes: "V_CSG153", no: "V_CSG154" },
            dontKnow: { yes: "V_CSG155", no: "V_CSG156" },
            notInCanada: { yes: "V_CSG157", no: "V_CSG158" },
          },
          "Full-Time, Self-Employed_Responsible": {
            "760-900": { yes: "V_CSG159", no: "V_CSG160" },
            "550-660": { yes: "V_CSG161", no: "V_CSG162" },
            "300-560": { yes: "V_CSG161", no: "V_CSG162" },
            dontKnow: { yes: "V_CSG163", no: "V_CSG164" },
            notInCanada: { yes: "V_CSG165", no: "V_CSG166" },
          },
          "Part-Time, Self-Employed_Responsible": {
            "760-900": { yes: "V_CSG167", no: "V_CSG168" },
            "550-660": { yes: "V_CSG169", no: "V_CSG170" },
            "300-560": { yes: "V_CSG169", no: "V_CSG170" },
            dontKnow: { yes: "V_CSG171", no: "V_CSG172" },
            notInCanada: { yes: "V_CSG173", no: "V_CSG174" },
          },
          "Full-Time, Part-Time, Self-Employed_Responsible": {
            "760-900": { yes: "V_CSG175", no: "V_CSG176" },
            "550-660": { yes: "V_CSG177", no: "V_CSG178" },
            "300-560": { yes: "V_CSG177", no: "V_CSG178" },
            dontKnow: { yes: "V_CSG179", no: "V_CSG180" },
            notInCanada: { yes: "V_CSG181", no: "V_CSG182" },
          },

          // Rent Not Responsible workflows
          "Retired_Not Responsible": {
            "760-900": "V_CSG183",
            "550-660": "V_CSG184",
            "300-560": "V_CSG184",
            dontKnow: "V_CSG185",
            notInCanada: "V_CSG186",
          },
          "Unemployed_Not Responsible": {
            "760-900": "V_CSG187",
            "550-660": "V_CSG188",
            "300-560": "V_CSG188",
            dontKnow: "V_CSG189",
            notInCanada: "V_CSG190",
          },
          "Full-Time_Not Responsible": {
            "760-900": "V_CSG191",
            "550-660": "V_CSG192",
            "300-560": "V_CSG192",
            dontKnow: "V_CSG193",
            notInCanada: "V_CSG194",
          },
          "Part-Time_Not Responsible": {
            "760-900": "V_CSG195",
            "550-660": "V_CSG196",
            "300-560": "V_CSG196",
            dontKnow: "V_CSG197",
            notInCanada: "V_CSG198",
          },
          "Self-Employed_Not Responsible": {
            "760-900": "V_CSG199",
            "550-660": "V_CSG200",
            "300-560": "V_CSG200",
            dontKnow: "V_CSG201",
            notInCanada: "V_CSG202",
          },
          "Full-Time, Part-Time_Not Responsible": {
            "760-900": "V_CSG203",
            "550-660": "V_CSG204",
            "300-560": "V_CSG204",
            dontKnow: "V_CSG205",
            notInCanada: "V_CSG206",
          },
          "Full-Time, Self-Employed_Not Responsible": {
            "760-900": "V_CSG207",
            "550-660": "V_CSG208",
            "300-560": "V_CSG208",
            dontKnow: "V_CSG209",
            notInCanada: "V_CSG210",
          },
          "Part-Time, Self-Employed_Not Responsible": {
            "760-900": "V_CSG211",
            "550-660": "V_CSG212",
            "300-560": "V_CSG212",
            dontKnow: "V_CSG213",
            notInCanada: "V_CSG214",
          },
          "Full-Time, Part-Time, Self-Employed_Not Responsible": {
            "760-900": "V_CSG215",
            "550-660": "V_CSG216",
            "300-560": "V_CSG216",
            dontKnow: "V_CSG217",
            notInCanada: "V_CSG218",
          },
        }

        // Define the CSG3 workflows mapping (for invited to group)
        const csg3Workflows: Record<string, Record<string, string | Record<string, string>>> = {
          // Rent Responsible workflows
          Retired_Responsible: {
            "760-900": { yes: "V_CSG219", no: "V_CSG220" },
            "550-660": { yes: "V_CSG221", no: "V_CSG222" },
            "300-560": { yes: "V_CSG221", no: "V_CSG222" },
            dontKnow: { yes: "V_CSG223", no: "V_CSG224" },
            notInCanada: { yes: "V_CSG225", no: "V_CSG226" },
          },
          Unemployed_Responsible: {
            "760-900": { yes: "V_CSG227", no: "V_CSG228" },
            "550-660": { yes: "V_CSG229", no: "V_CSG230" },
            "300-560": { yes: "V_CSG229", no: "V_CSG230" },
            dontKnow: { yes: "V_CSG231", no: "V_CSG232" },
            notInCanada: { yes: "V_CSG233", no: "V_CSG234" },
          },
          "Full-Time_Responsible": {
            "760-900": { yes: "V_CSG235", no: "V_CSG236" },
            "550-660": { yes: "V_CSG237", no: "V_CSG238" },
            "300-560": { yes: "V_CSG237", no: "V_CSG238" },
            dontKnow: { yes: "V_CSG239", no: "V_CSG240" },
            notInCanada: { yes: "V_CSG241", no: "V_CSG242" },
          },
          "Part-Time_Responsible": {
            "760-900": { yes: "V_CSG243", no: "V_CSG244" },
            "550-660": { yes: "V_CSG245", no: "V_CSG246" },
            "300-560": { yes: "V_CSG245", no: "V_CSG246" },
            dontKnow: { yes: "V_CSG247", no: "V_CSG248" },
            notInCanada: { yes: "V_CSG249", no: "V_CSG250" },
          },
          "Self-Employed_Responsible": {
            "760-900": { yes: "V_CSG251", no: "V_CSG252" },
            "550-660": { yes: "V_CSG253", no: "V_CSG254" },
            "300-560": { yes: "V_CSG253", no: "V_CSG254" },
            dontKnow: { yes: "V_CSG255", no: "V_CSG256" },
            notInCanada: { yes: "V_CSG257", no: "V_CSG258" },
          },
          "Full-Time, Part-Time_Responsible": {
            "760-900": { yes: "V_CSG259", no: "V_CSG260" },
            "550-660": { yes: "V_CSG261", no: "V_CSG262" },
            "300-560": { yes: "V_CSG261", no: "V_CSG262" },
            dontKnow: { yes: "V_CSG263", no: "V_CSG264" },
            notInCanada: { yes: "V_CSG265", no: "V_CSG266" },
          },
          "Full-Time, Self-Employed_Responsible": {
            "760-900": { yes: "V_CSG267", no: "V_CSG268" },
            "550-660": { yes: "V_CSG269", no: "V_CSG270" },
            "300-560": { yes: "V_CSG269", no: "V_CSG270" },
            dontKnow: { yes: "V_CSG271", no: "V_CSG272" },
            notInCanada: { yes: "V_CSG273", no: "V_CSG274" },
          },
          "Part-Time, Self-Employed_Responsible": {
            "760-900": { yes: "V_CSG275", no: "V_CSG276" },
            "550-660": { yes: "V_CSG277", no: "V_CSG278" },
            "300-560": { yes: "V_CSG277", no: "V_CSG278" },
            dontKnow: { yes: "V_CSG279", no: "V_CSG280" },
            notInCanada: { yes: "V_CSG281", no: "V_CSG282" },
          },
          "Full-Time, Part-Time, Self-Employed_Responsible": {
            "760-900": { yes: "V_CSG283", no: "V_CSG284" },
            "550-660": { yes: "V_CSG285", no: "V_CSG286" },
            "300-560": { yes: "V_CSG285", no: "V_CSG286" },
            dontKnow: { yes: "V_CSG287", no: "V_CSG288" },
            notInCanada: { yes: "V_CSG289", no: "V_CSG290" },
          },

          // Rent Not Responsible workflows
          "Retired_Not Responsible": {
            "760-900": "V_CSG291",
            "550-660": "V_CSG292",
            "300-560": "V_CSG292",
            dontKnow: "V_CSG293",
            notInCanada: "V_CSG294",
          },
          "Unemployed_Not Responsible": {
            "760-900": "V_CSG295",
            "550-660": "V_CSG296",
            "300-560": "V_CSG296",
            dontKnow: "V_CSG297",
            notInCanada: "V_CSG298",
          },
          "Full-Time_Not Responsible": {
            "760-900": "V_CSG299",
            "550-660": "V_CSG300",
            "300-560": "V_CSG300",
            dontKnow: "V_CSG301",
            notInCanada: "V_CSG302",
          },
          "Part-Time_Not Responsible": {
            "760-900": "V_CSG303",
            "550-660": "V_CSG304",
            "300-560": "V_CSG304",
            dontKnow: "V_CSG305",
            notInCanada: "V_CSG306",
          },
          "Self-Employed_Not Responsible": {
            "760-900": "V_CSG307",
            "550-660": "V_CSG308",
            "300-560": "V_CSG308",
            dontKnow: "V_CSG309",
            notInCanada: "V_CSG310",
          },
          "Full-Time, Part-Time_Not Responsible": {
            "760-900": "V_CSG311",
            "550-660": "V_CSG312",
            "300-560": "V_CSG312",
            dontKnow: "V_CSG313",
            notInCanada: "V_CSG314",
          },
          "Full-Time, Self-Employed_Not Responsible": {
            "760-900": "V_CSG315",
            "550-660": "V_CSG316",
            "300-560": "V_CSG316",
            dontKnow: "V_CSG317",
            notInCanada: "V_CSG318",
          },
          "Part-Time, Self-Employed_Not Responsible": {
            "760-900": "V_CSG319",
            "550-660": "V_CSG320",
            "300-560": "V_CSG320",
            dontKnow: "V_CSG321",
            notInCanada: "V_CSG322",
          },
          "Full-Time, Part-Time, Self-Employed_Not Responsible": {
            "760-900": "V_CSG323",
            "550-660": "V_CSG324",
            "300-560": "V_CSG324",
            dontKnow: "V_CSG325",
            notInCanada: "V_CSG326",
          },
        }

        // Select the appropriate workflow mapping
        const currentCsgWorkflows = isCsg3 ? csg3Workflows : csg2Workflows

        // Create CSG workflow key
        const rentStatus = rentResponsible === "yes" ? "Responsible" : "Not Responsible"
        const csgWorkflowKey = `${employmentType}_${rentStatus}`

        console.log("🔍 CSG Workflow Key:", csgWorkflowKey, isCsg3 ? "(CSG3)" : "(CSG2)")

        // Check if CSG workflow exists
        if (!currentCsgWorkflows[csgWorkflowKey]) {
          workflowData.flags.push("CSG_WORKFLOW_NOT_FOUND")
          console.error("❌ CSG WORKFLOW NOT FOUND:", csgWorkflowKey)
          setResult(`Error: CSG workflow not found for ${csgWorkflowKey}`)
          return
        }

        const currentCsgWorkflow = currentCsgWorkflows[csgWorkflowKey]

        // Handle CSG credit report status and score
        if (creditReportStatus === "not-in-canada") {
          const notInCanadaResult = currentCsgWorkflow["notInCanada"]
          if (typeof notInCanadaResult === "object") {
            // Rent responsible - default to "no" extra deposit since question is hidden
            finalCode = notInCanadaResult["no"]
          } else {
            // Rent not responsible - direct result
            finalCode = notInCanadaResult as string
          }
          console.log("🌍 CSG Not in Canada for 12+ months:", finalCode)
        } else if (creditReportStatus === "yes" && creditScoreRange) {
          let scoreKey = ""
          if (creditScoreRange === "760-900") {
            scoreKey = "760-900"
          } else if (creditScoreRange === "725-760" || creditScoreRange === "660-725") {
            finalCode = "QUALIFIED" // Auto-qualify for these ranges
          } else if (creditScoreRange === "550-660") {
            scoreKey = "550-660"
          } else if (creditScoreRange === "300-560") {
            scoreKey = "300-560"
          } else if (creditScoreRange === "unknown") {
            scoreKey = "dontKnow"
          }

          if (scoreKey && finalCode !== "QUALIFIED") {
            const scoreResult = currentCsgWorkflow[scoreKey]
            if (typeof scoreResult === "object") {
              // Rent responsible - default to "no" extra deposit since question is hidden
              finalCode = scoreResult["no"]
            } else {
              // Rent not responsible - direct result
              finalCode = scoreResult as string
            }
          }
          console.log("📊 CSG Credit Score Range:", creditScoreRange, "→", finalCode)
        } else if (creditReportStatus === "no" && creditReportAction) {
          if (creditReportAction === "get-report") {
            finalCode = "GET_CREDIT_REPORT"
          } else if (creditReportAction === "skip") {
            // For skip action, treat as "unknown" credit score
            const skipResult = currentCsgWorkflow["dontKnow"]
            if (typeof skipResult === "object") {
              // Rent responsible - default to "no" extra deposit since question is hidden
              finalCode = skipResult["no"]
            } else {
              // Rent not responsible - direct result
              finalCode = skipResult as string
            }
          }
          console.log("📋 CSG Credit Report Action:", creditReportAction, "→", finalCode)
        } else {
          finalCode = "INCOMPLETE_ASSESSMENT"
        }
      }

      workflowData.dataIdentifiers.finalQualificationCode = finalCode
    }

    setResult(finalCode)
  }

  const nextStep = () => {
    if (currentStep === 1) {
      // Set the workflow code when moving from step 1
      const workflowCode = getWorkflowCode()
      setFormData((prev) => ({ ...prev, workflowCode }))
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const creditQuestions = [
    {
      id: "creditReportStatus",
      label:
        'Q: If you have been living in Canada for 12+ months, have you pulled your most recent detailed "paid" credit score and report from Equifax or TransUnion within the past 60 days?',
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not-in-canada", label: "Not in Canada for 12+ months" },
      ],
    },
    {
      id: "creditReportAction",
      label: "What would you like to do?",
      options: [
        { value: "get-report", label: "Get full report" },
        { value: "skip", label: "Skip" },
      ],
      dependsOn: {
        field: "creditReportStatus",
        value: "no",
      },
    },
    {
      id: "creditScoreRange",
      label: "Q: What is your credit score range?",
      options: [
        { value: "760-900", label: "760-900" },
        { value: "725-760", label: "725-760" },
        { value: "660-725", label: "660-725" },
        { value: "550-660", label: "550-660" },
        { value: "300-560", label: "300-560" },
        { value: "unknown", label: "I don't know" },
      ],
      dependsOn: {
        field: "creditReportStatus",
        value: "yes",
      },
    },
    {
      id: "extraDeposit",
      label:
        "Q: In the event that you have already viewed properties with our Rental Specialists and are ready to submit an offer, the mandatory deposit requirement amount is the first and last month's rent. In a multiple offer situation where there are competing tenants for the same property, would you be able to comfortably set aside more than the minimum required amount to give yourself a greater advantage in the offer presentation?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      dependsOn: (formData: any) => {
        return (
          (formData.groupType === "NLS" &&
            formData.creditScoreRange === "760-900" &&
            formData.rentResponsible === "yes") ||
          (formData.groupType === "CSG" &&
            formData.creditReportStatus === "not-in-canada" &&
            formData.rentResponsible === "yes")
        )
      },
    },
  ]

  const isQuestionAnswered = (questionId: string) => {
    return formData[questionId] !== ""
  }

  const currentQuestion = creditQuestions[currentQuestionIndex]

  const canCalculateResult = () => {
    // Check if all questions are answered
    for (const question of creditQuestions) {
      if (typeof question.dependsOn === "function") {
        if (question.dependsOn(formData) && !isQuestionAnswered(question.id)) {
          return false
        }
      } else if (question.dependsOn) {
        if (formData[question.dependsOn.field] === question.dependsOn.value && !isQuestionAnswered(question.id)) {
          return false
        }
      } else if (!isQuestionAnswered(question.id)) {
        return false
      }
    }
    return true
  }

  const showContinueButton = currentQuestion && isQuestionAnswered(currentQuestion.id)

  const showCalculateButton =
    (creditQuestions.length === 0 && canCalculateResult()) || currentQuestionIndex === creditQuestions.length - 1

  const handleNextQuestion = () => {
    if (currentQuestionIndex < creditQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header with Logo */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-black">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-black">Qualification Credentials</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 ${
                    step <= currentStep ? "bg-orange-500 border-orange-500 text-white" : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Group Selection */}
          {currentStep === 1 && (
            <Card className="border-2 border-orange-500">
              <CardHeader className="bg-black text-white p-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  Step 1: Group Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Group Type:</label>
                  <select
                    value={formData.groupType}
                    onChange={(e) => updateSelectValue("groupType", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select group type</option>
                    <option value="LS">Leaseholder (LS)</option>
                    <option value="NLS">Non-Leaseholder (NLS)</option>
                    <option value="CSG">Cosigner/Guarantor (CSG)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Number of occupants:</label>
                  <select
                    value={formData.occupantCount}
                    onChange={(e) => updateSelectValue("occupantCount", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select occupant count</option>
                    <option value="1">1</option>
                    <option value=">1">&gt;1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Do you have an invite to join a group?
                  </label>
                  <select
                    value={formData.hasInvite}
                    onChange={(e) => updateSelectValue("hasInvite", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Display determined workflow */}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Employment Status */}
          {currentStep === 2 && (
            <Card className="border-2 border-orange-500">
              <CardHeader className="bg-black text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Step 2: Employment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Are you responsible for rent?</label>
                  <select
                    value={formData.rentResponsible}
                    onChange={(e) => updateSelectValue("rentResponsible", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Employment Type:</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => updateSelectValue("employmentType", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Retired">Retired</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Full-Time, Part-Time">Full-Time, Part-Time</option>
                    <option value="Full-Time, Self-Employed">Full-Time, Self-Employed</option>
                    <option value="Part-Time, Self-Employed">Part-Time, Self-Employed</option>
                    <option value="Full-Time, Part-Time, Self-Employed">Full-Time, Part-Time, Self-Employed</option>
                  </select>
                </div>

                {formData.groupType !== "CSG" && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Are you a student?</label>
                    <select
                      value={formData.isStudent}
                      onChange={(e) => updateSelectValue("isStudent", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}

                {formData.groupType !== "CSG" && formData.isStudent === "yes" && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Are you an international student?
                    </label>
                    <select
                      value={formData.isInternational}
                      onChange={(e) => updateSelectValue("isInternational", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Monthly Income */}
          {currentStep === 3 && (
            <Card className="border-2 border-orange-500">
              <CardHeader className="bg-black text-white">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Step 3: Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div>
                  <label className="block text-sm font-medium text-black mb-4">
                    Q: What is your personal monthly rental budget?
                  </label>
                  <Slider
                    value={formData.monthlyBudget}
                    onValueChange={(value) => updateSliderValue("monthlyBudget", value)}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="text-center mt-2 text-lg font-semibold text-orange-600">
                    ${formData.monthlyBudget[0].toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-4">Q: What is your monthly income?</label>
                  <Slider
                    value={formData.monthlyIncome}
                    onValueChange={(value) => updateSliderValue("monthlyIncome", value)}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="text-center mt-2 text-lg font-semibold text-orange-600">
                    ${formData.monthlyIncome[0].toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Credit Score */}
          {currentStep === 4 && (
            <Card className="border-2 border-orange-500">
              <CardHeader className="bg-black text-white">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Step 4: Credit Score
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {creditQuestions.length > 0 && currentQuestion ? (
                  <>
                    <label className="block text-sm font-medium text-black mb-4">
                      {typeof currentQuestion.label === "function"
                        ? currentQuestion.label(formData)
                        : currentQuestion.label}
                    </label>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option.value}
                            checked={formData[currentQuestion.id] === option.value}
                            onChange={(e) => updateSelectValue(currentQuestion.id, e.target.value)}
                            className="mr-3"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>No questions available.</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 mb-20 sm:mb-8">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button onClick={nextStep} className="bg-orange-500 hover:bg-orange-600 text-white">
                Next
              </Button>
            ) : (
              <div className="flex gap-2 sm:gap-4">
                {showContinueButton && !showCalculateButton && (
                  <Button onClick={handleNextQuestion} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Continue
                  </Button>
                )}

                {showCalculateButton ? (
                  <Button
                    onClick={calculateResult}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={!canCalculateResult()}
                  >
                    Calculate
                  </Button>
                ) : null}
              </div>
            )}
          </div>

          {/* Result Display - Full Screen */}
          {currentStep === 4 && result && (
            <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6">
              <Card className="w-full max-w-2xl border-2 border-black">
                <CardHeader className="bg-black text-white">
                  <CardTitle className="flex items-center justify-between">
                    Qualification Result
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setResult("")}
                      className="text-white hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-6 text-center">
                    <p className="text-black font-mono text-2xl font-bold">
                      {(() => {
                        // Log the actual qualification code to console
                        console.log("Qualification Result:", result)

                        // Display "Qualified" for most results, or the actual message for special cases
                        if (result.startsWith("V_") || result === "QUALIFIED") {
                          return "Qualified"
                        } else if (result === "GET_CREDIT_REPORT") {
                          return "Please get your credit report"
                        } else if (result === "MANUAL_REVIEW") {
                          return "Manual review required"
                        } else if (result === "INCOMPLETE_ASSESSMENT") {
                          return "Assessment incomplete"
                        } else if (result === "DEPOSIT_QUESTION_REQUIRED") {
                          return "Additional information required"
                        } else if (result.startsWith("Error:")) {
                          return result // Show error messages as-is
                        } else {
                          return "Qualified"
                        }
                      })()}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-3">
                    {/* Show Lease Success Package button only for qualified users */}
                    {(result.startsWith("V_") || result === "QUALIFIED") && (
                      <Button
                        onClick={() => router.push("/lease-success-package")}
                        className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white"
                      >
                        Proceed to complete Lease Success Package
                      </Button>
                    )}
                    <Button
                      onClick={() => router.push("/")}
                      className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Exit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
