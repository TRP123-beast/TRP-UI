"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import "@/app/qualification/qualification.css"
import { getWorkflowData, saveWorkflowData } from "@/utils/workflow-storage"

interface GroupMember {
  id: string
  firstName: string
  lastName: string
  type: "Occupant" | "Non-Occupant"
  subType: "Applicant" | "Non-Applicant" | "Co-Signer" | "Other"
  relationship: "Spouse/Partner" | "Child" | "Other" | "Not Applicable"
  email: string
  phone: string
  admin: boolean
  makeAdmin: boolean
  groupStatus: "Confirmed" | "Pending" | "Not Yet Invited" | "Declined"
  declineGroupAddition?: boolean
}

// Employment types
type EmploymentType = "full-time" | "part-time" | "self-employed" | "unemployed" | "retired" | "student"

// Types for LS1 workflow
type LeaseType = "12-month" | "month-to-month" | ""
type NoticeToVacateStatus = "submitted" | "received" | "none" | ""
type RealEstateAgentStatus = "yes" | "no" | ""
type ExclusivityAgreementStatus = "yes" | "no" | ""
type ResponsibilityLevel = "full" | "partial" | "none" | ""
type EmploymentStatus = "student" | "retired" | "employed" | "self-employed" | "unemployed" | "other"
type EmploymentDetails = {
  status: EmploymentStatus
  isSelected: boolean
}

// Student specific types
type StudentType =
  | "retired"
  | "e-ue"
  | "e-ft"
  | "e-pt"
  | "e-se"
  | "e-ft-e-pt"
  | "e-ft-e-se"
  | "e-pt-e-se"
  | "e-ft-e-pt-e-se"
  | ""

// Non-student specific types
type NonStudentType =
  | "e-pt"
  | "e-ft"
  | "e-se"
  | "retired"
  | "e-ue"
  | "e-ft-e-pt-e-se"
  | "e-ft-e-pt"
  | "e-ft-e-se"
  | "e-pt-e-se"
  | ""

// NLS workflow flags
interface NLSFlags {
  flag1: boolean // Not yet submitted notice to vacate
  flag2: boolean // Earliest move date not within 60 days
  flag3: boolean // Has signed exclusivity agreement with realtor
  flag5: boolean // Has signed an ALC
  flag9: boolean // Not a citizen/PR
  flag10: boolean // Lease not expiring within 60 days
  flag10A: boolean // Lease not expiring within 60 days (NLS1)
  flag10B: boolean // Move date within 60 days when flag10A exists
  flag11: boolean // Prefers electronic signing method
  flag12: boolean // Not responsible for rent
  flag14: boolean // Notice to vacate not yet accepted
  flag17: boolean // Fully responsible for rent
  flag18: boolean // Partially responsible for rent
  flag23?: boolean // User type changed from OTH to CSG
}

interface PrequalificationWizardProps {
  onComplete?: (data: any) => void
}

// Fix the Prequalification2Wizard component to properly initialize based on localStorage values
export function Prequalification2Wizard() {
  const [activeWorkflow, setActiveWorkflow] = useState<
    "NLS1" | "NLS2" | "CSG1" | "CSG2" | "CSG3" | "LS3" | "LS2" | "OTH3" | "DEFAULT" | null
  >(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunningLS2, setIsRunningLS2] = useState(false)
  const [isRunningCSG3, setIsRunningCSG3] = useState(false)
  const [isRunningOTH3, setIsRunningOTH3] = useState(false)
  const [nlsFlags, setNLSFlags] = useState<NLSFlags>({
    flag1: false,
    flag2: false,
    flag3: false,
    flag5: false,
    flag9: false,
    flag10: false,
    flag10A: false,
    flag10B: false,
    flag11: false,
    flag12: false,
    flag14: false,
    flag17: false,
    flag18: false,
  })
  const [currentNLSStep, setCurrentNLSStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to start LS2 workflow
  const startLS2Workflow = () => {
    console.log("[WORKFLOW] Starting LS2 workflow")
    try {
      setActiveWorkflow("LS2")
      setCurrentNLSStep(1)
      setNLSFlags({
        flag1: false,
        flag2: false,
        flag3: false,
        flag5: false,
        flag9: false,
        flag10: false,
        flag10A: false,
        flag10B: false,
        flag11: false,
        flag12: false,
        flag14: false,
        flag17: false,
        flag18: false,
      })
      setIsRunningLS2(true)
      console.log("[DEBUG] LS2 workflow initialized: activeWorkflow=LS2, isRunningLS2=true")
      setCurrentStep(0) // Trigger re-render

      // Save workflow state to localStorage using the utility
      saveWorkflowData({
        userRoleCode: "LS2",
        flags: {
          isRunningLS2: true,
        },
      })
    } catch (error) {
      console.error("[ERROR] Failed to initialize LS2 workflow:", error)
      setError("Failed to initialize LS2 workflow. Please try again.")
    }
  }

  // Function to start CSG3 workflow
  const startCSG3Workflow = () => {
    console.log("[WORKFLOW] Starting CSG3 workflow")
    try {
      setActiveWorkflow("CSG3")
      setCurrentNLSStep(1)
      setNLSFlags({
        flag1: false,
        flag2: false,
        flag3: false,
        flag5: false,
        flag9: false,
        flag10: false,
        flag10A: false,
        flag10B: false,
        flag11: false,
        flag12: false,
        flag14: false,
        flag17: false,
        flag18: false,
      })
      setIsRunningCSG3(true)
      console.log("[DEBUG] CSG3 workflow initialized: activeWorkflow=CSG3, isRunningCSG3=true")
      setCurrentStep(0) // Trigger re-render

      // Save workflow state to localStorage using the utility
      saveWorkflowData({
        userRoleCode: "CSG3",
        flags: {
          isRunningCSG3: true,
        },
      })
    } catch (error) {
      console.error("[ERROR] Failed to initialize CSG3 workflow:", error)
      setError("Failed to initialize CSG3 workflow. Please try again.")
    }
  }

  // Function to start OTH3 workflow
  const startOTH3Workflow = () => {
    console.log("[WORKFLOW] Starting OTH3 workflow")
    try {
      setActiveWorkflow("OTH3")
      setCurrentNLSStep(1)
      setNLSFlags({
        flag1: false,
        flag2: false,
        flag3: false,
        flag5: false,
        flag9: false,
        flag10: false,
        flag10A: false,
        flag10B: false,
        flag11: false,
        flag12: false,
        flag14: false,
        flag17: false,
        flag18: false,
      })
      setIsRunningOTH3(true)
      console.log("[DEBUG] OTH3 workflow initialized: activeWorkflow=OTH3, isRunningOTH3=true")
      setCurrentStep(0) // Trigger re-render

      // Save workflow state to localStorage using the utility
      saveWorkflowData({
        userRoleCode: "OTH3",
        flags: {
          isRunningOTH3: true,
        },
      })
    } catch (error) {
      console.error("[ERROR] Failed to initialize OTH3 workflow:", error)
      setError("Failed to initialize OTH3 workflow. Please try again.")
    }
  }

  // Initialize the component based on localStorage values
  useEffect(() => {
    console.log("[DEBUG] useEffect running in prequalification2-wizard.tsx")
    setIsLoading(true)

    try {
      // Get workflow data from localStorage using the utility
      const workflowData = getWorkflowData()

      // Check for startLS2 flag (legacy approach)
      const shouldStartLS2 = localStorage.getItem("startLS2") === "true"
      // Get startCSG3 flag from new utility
      const shouldStartCSG3 = workflowData.flags["startCSG3"] === true
      // Get startOTH3 flag from new utility
      const shouldStartOTH3 = workflowData.flags["startOTH3"] === true

      const userRoleCode = workflowData.userRoleCode || localStorage.getItem("userRoleCode")

      console.log("[DEBUG] Workflow data:", {
        shouldStartLS2,
        shouldStartCSG3,
        shouldStartOTH3,
        userRoleCode,
      })

      if (shouldStartLS2 && userRoleCode === "GC2") {
        console.log("[WORKFLOW] Detected startLS2=true and userRoleCode=GC2, initializing LS2")
        try {
          // Clear localStorage values to prevent re-triggering
          localStorage.removeItem("startLS2")
          startLS2Workflow()
        } catch (error) {
          console.error("[ERROR] Failed to process LS2 initialization:", error)
          setError("Failed to initialize LS2 workflow. Please try again.")
          setActiveWorkflow("DEFAULT")
        }
      } else if (shouldStartCSG3 && (userRoleCode === "GC3" || userRoleCode === "GC4" || userRoleCode === "GC5")) {
        console.log("[WORKFLOW] Detected startCSG3=true, initializing CSG3")
        try {
          // Clear flag to prevent re-triggering
          saveWorkflowData({ flags: { startCSG3: false } })
          startCSG3Workflow()
        } catch (error) {
          console.error("[ERROR] Failed to process CSG3 initialization:", error)
          setError("Failed to initialize CSG3 workflow. Please try again.")
          setActiveWorkflow("DEFAULT")
        }
      } else if (shouldStartOTH3 && (userRoleCode === "GC3" || userRoleCode === "GC4" || userRoleCode === "GC5")) {
        console.log("[WORKFLOW] Detected startOTH3=true, initializing OTH3")
        try {
          // Clear flag to prevent re-triggering
          saveWorkflowData({ flags: { startOTH3: false } })
          startOTH3Workflow()
        } catch (error) {
          console.error("[ERROR] Failed to process OTH3 initialization:", error)
          setError("Failed to initialize OTH3 workflow. Please try again.")
          setActiveWorkflow("DEFAULT")
        }
      } else if (userRoleCode) {
        console.log(`[WORKFLOW] Detected userRoleCode=${userRoleCode}, initializing default workflow`)
        // Initialize default workflow based on userRoleCode
        setActiveWorkflow("DEFAULT")
      } else {
        console.log("[WORKFLOW] No workflow parameters detected, initializing default workflow")
        setActiveWorkflow("DEFAULT")
      }
    } catch (error) {
      console.error("[ERROR] Error in initialization:", error)
      setError("An error occurred during initialization. Please try again.")
      setActiveWorkflow("DEFAULT")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prequalification wizard...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto my-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => (window.location.href = "/qualification")}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Return to Qualification
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render the appropriate workflow
  if (activeWorkflow === "LS2") {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Pre-Qualification (LS2 Workflow)</span>
            <span className="text-sm font-medium">{currentNLSStep * 10}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${currentNLSStep * 10}%` }}></div>
          </div>
        </div>

        {renderNLSWorkflow()}
      </div>
    )
  } else if (activeWorkflow === "CSG3") {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Pre-Qualification (CSG3 Workflow)</span>
            <span className="text-sm font-medium">{currentNLSStep * 10}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${currentNLSStep * 10}%` }}></div>
          </div>
        </div>

        <div className="space-y-6">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700">
              The CSG3 workflow is now being handled in its own dedicated page. Redirecting...
            </AlertDescription>
          </Alert>

          <div className="pt-4 flex space-x-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/prequalification-csg3")}
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
            >
              Go to CSG3 Workflow
            </Button>
          </div>
        </div>
      </div>
    )
  } else if (activeWorkflow === "OTH3") {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Pre-Qualification (OTH3 Workflow)</span>
            <span className="text-sm font-medium">{currentNLSStep * 10}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${currentNLSStep * 10}%` }}></div>
          </div>
        </div>

        <div className="space-y-6">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700">
              The OTH3 workflow is now being handled in its own dedicated page. Redirecting...
            </AlertDescription>
          </Alert>

          <div className="pt-4 flex space-x-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/prequalification-oth3")}
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
            >
              Go to OTH3 Workflow
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default workflow (fallback)
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Pre-Qualification (Default Workflow)</span>
          <span className="text-sm font-medium">{currentStep * 10}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${currentStep * 10}%` }}></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">Default Prequalification Workflow</h2>
        </div>

        <div className="space-y-4">
          <p>This is the default prequalification workflow. Please complete the following steps to continue.</p>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-blue-800">
              User Role Code: <span className="font-bold">{getWorkflowData().userRoleCode || "Not set"}</span>
            </p>
          </div>

          <div className="pt-4 flex space-x-4">
            <Button
              onClick={() => (window.location.href = "/qualification")}
              variant="outline"
              className="flex items-center gap-2"
            >
              Return to Qualification
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Placeholder for NLS workflow rendering
function renderNLSWorkflow() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            This workflow is being redirected to a dedicated page. Please wait...
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button
            onClick={() => (window.location.href = "/prequalification-landing")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Go to Prequalification Landing
          </Button>
        </div>
      </div>
    </div>
  )
}
