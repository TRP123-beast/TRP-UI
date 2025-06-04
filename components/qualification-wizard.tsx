"use client"

import { useState, useEffect, useRef } from "react"
import { HelpCircle, User, Baby, SmilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OccupantCounter } from "@/components/occupant-counter"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types
type UserType = "Occupant" | "Non-Occupant" | ""
type UserSubType = "Applicant" | "Non-Applicant" | "Main Applicant/Co-Signer/Guarantor" | "Other" | ""
type OccupantType = "Adult" | "Child" | "Pet"
type Relationship = "Parent" | "Spouse/Partner" | "Child" | "Sibling" | "Other" | "Not Applicable"
type GroupStatus = "Confirmed" | "Pending" | "Not Yet Invited" | "Declined"

interface Occupant {
  id: number
  type: OccupantType
  relationship?: Relationship
  customRelationship?: string
  durationYears?: number
  durationMonths?: number
  represent?: boolean
}

interface GroupMember {
  id: string
  firstName: string
  lastName: string
  type: UserType
  subType: UserSubType
  relationship: Relationship
  email: string
  phone: string
  isAdmin: boolean
  groupStatus: GroupStatus
  declineGroupInvites?: boolean
}

interface Flag {
  flag5: boolean // Pets flag
  flag9: boolean // Non-Canadian resident
  flag19: boolean // Non-Canadian resident but in Canada
}

export function QualificationWizard() {
  // State
  const [step, setStep] = useState(-1) // Start at -1 for the intro step
  const [userType, setUserType] = useState<UserType>("")
  const [userSubType, setUserSubType] = useState<UserSubType>("")
  const [isCitizen, setIsCitizen] = useState<boolean | null>(null)
  const [residesInCanada, setResidesInCanada] = useState<boolean | null>(null)
  const [acknowledgement, setAcknowledgement] = useState(false)
  const [occupants, setOccupants] = useState<Occupant[]>([])
  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [petCount, setPetCount] = useState(0)
  const [flags, setFlags] = useState<Flag>({
    flag5: false, // Pets flag
    flag9: false, // Non-Canadian resident
    flag19: false, // Non-Canadian resident but in Canada
  })
  const [showNonQualifiedDialog, setShowNonQualifiedDialog] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  // Add group creation related states
  const [showGroupCreationDialog, setShowGroupCreationDialog] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [groupCreated, setGroupCreated] = useState(false)

  // Add group member management states
  const [showGroupMembersTable, setShowGroupMembersTable] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [addingToCurrentGroup, setAddingToCurrentGroup] = useState(true)
  const [currentGroupMembers, setCurrentGroupMembers] = useState<GroupMember[]>([])
  const [addedGroupMembers, setAddedGroupMembers] = useState<GroupMember[]>([])
  const [newMember, setNewMember] = useState<Partial<GroupMember>>({
    firstName: "",
    lastName: "",
    type: "Non-Occupant",
    subType: "Other",
    relationship: "Other",
    email: "",
    phone: "",
    isAdmin: false,
    groupStatus: "Not Yet Invited",
  })

  // GP6 workflow states
  const [showOccupantCountDialog, setShowOccupantCountDialog] = useState(false)
  const [occupantCountMessage, setOccupantCountMessage] = useState("")
  const [newOccupantCount, setNewOccupantCount] = useState(0)
  const [originalOccupantCount, setOriginalOccupantCount] = useState(0)
  const [previousGroupMembers, setPreviousGroupMembers] = useState<GroupMember[]>([])
  const [previousAddedGroupMembers, setPreviousAddedGroupMembers] = useState<GroupMember[]>([])
  const [isMoreOccupants, setIsMoreOccupants] = useState(false)

  // Tooltip visibility states
  const [showOccupantTip, setShowOccupantTip] = useState(false)
  const [showApplicantTip, setShowApplicantTip] = useState(false)
  const [showNonOccupantSubTypeTip, setShowNonOccupantSubTypeTip] = useState(false)

  // Current tooltip content
  const [currentTooltip, setCurrentTooltip] = useState<string>("")

  // Refs to track changes
  const isFirstRender = useRef(true)
  const hasRunGP6 = useRef(false)

  // Calculate total steps
  const totalSteps = 5

  // Update progress whenever step changes
  useEffect(() => {
    // Calculate progress based on current step
    const currentStep = step + 1 // Adjust for negative starting step
    const progressPercentage = Math.min(Math.round((currentStep / totalSteps) * 100), 100)
    setProgress(progressPercentage)
  }, [step])

  // Effect to handle navigation when dialog is closed
  useEffect(() => {
    if (
      !showNonQualifiedDialog &&
      isCitizen === false &&
      residesInCanada === true &&
      userSubType === "Main Applicant/Co-Signer/Guarantor"
    ) {
      // Only navigate if the dialog was shown and then closed
      navigateToDashboard()
    }
  }, [showNonQualifiedDialog, isCitizen, residesInCanada, userSubType])

  // Helper functions
  const updateFlag = (flag: keyof Flag, value: boolean) => {
    setFlags((prev) => {
      const updatedFlags = { ...prev, [flag]: value }
      // Log the flag change to console
      console.log(`Flag ${flag} set to ${value}`, updatedFlags)
      return updatedFlags
    })
  }

  // Count occupants in the group
  const countOccupantsInGroup = () => {
    const occupantsInCurrentGroup = currentGroupMembers.filter((member) => member.type === "Occupant").length
    const occupantsInAddedGroup = addedGroupMembers.filter((member) => member.type === "Occupant").length
    return occupantsInCurrentGroup + occupantsInAddedGroup
  }

  // Add these new workflow functions
  const runGI1ForNewUsers = () => {
    // Run GI1 for every new user who has been added to the group
    console.log("[WORKFLOW] Running GI1 for all new users in the group")

    // Process current group members (excluding the admin)
    currentGroupMembers.forEach((member) => {
      if (member.id !== "1" && member.groupStatus === "Not Yet Invited") {
        console.log(`[WORKFLOW] Running GI1 for user: ${member.firstName} ${member.lastName}`)
        // In a real implementation, this would trigger an API call or database operation
      }
    })

    // Process added group members
    addedGroupMembers.forEach((member) => {
      if (member.groupStatus === "Not Yet Invited") {
        console.log(`[WORKFLOW] Running GI1 for user: ${member.firstName} ${member.lastName}`)
        // In a real implementation, this would trigger an API call or database operation
      }
    })
  }

  // Update the runLS2 function to properly set localStorage values before navigation
  const runLS2 = () => {
    console.log("[WORKFLOW] Running LS2 workflow")

    // Set localStorage values for prequalification2 page
    try {
      localStorage.setItem("startLS2", "true")
      localStorage.setItem("userRoleCode", "GC2")
      console.log("[DEBUG] localStorage set: startLS2=true, userRoleCode=GC2")

      // Verify values were set correctly
      console.log(
        "[DEBUG] localStorage verification: startLS2=",
        localStorage.getItem("startLS2"),
        "userRoleCode=",
        localStorage.getItem("userRoleCode"),
      )

      // Navigate to prequalification2 page
      window.location.href = "/prequalification2"
    } catch (error) {
      console.error("[ERROR] Failed to set localStorage for LS2:", error)
    }
  }

  // Update the runLS1 function to navigate to our new prequalification-gc1 page
  const runLS1GC1 = () => {
    console.log("[WORKFLOW] Running LS1 workflow")
    // Navigate to the new prequalification-gc1 page
    window.location.href = "/prequalification-gc1"
  }

  // Update the handleGroupNextButton function to navigate to our new page when appropriate
  const handleGroupNextButton = () => {
    // Get user role code
    const roleCode = getUserRoleCode()
    console.log("[DEBUG] User role code:", roleCode)

    // Check if user is GC2 (Occupant-Applicant with multiple occupants)
    if (roleCode === "GC2") {
      console.log("[WORKFLOW] User is GC2 (Occupant-Applicant with multiple occupants)")

      // Run GI1 for every new user
      runGI1ForNewUsers()

      // Navigate to GC2 group creation page
      console.log("[WORKFLOW] Navigating to GC2 group creation workflow")
      window.location.href = "/gc2-group-creation"
    } else if (roleCode === "GC3") {
      // For GC3 users, navigate to the GC3 group creation page
      console.log("[WORKFLOW] User is GC3 (Occupant-Non-Applicant), proceeding to GC3 workflow")
      localStorage.setItem("userRoleCode", roleCode)
      console.log("[DEBUG] localStorage set: userRoleCode=", roleCode)
      window.location.href = "/gc3-group-creation"
    } else if (roleCode === "GC1") {
      // For GC1 users, navigate to the prequalification-gc1 page
      console.log("[WORKFLOW] User is GC1, proceeding to GC1 workflow")
      localStorage.setItem("startLS2", "false")
      localStorage.setItem("userRoleCode", roleCode)
      console.log("[DEBUG] localStorage set: startLS2=false, userRoleCode=", roleCode)
      window.location.href = "/prequalification-gc1"
    } else {
      // For other users, just navigate to the next step
      console.log("[WORKFLOW] User is not GC1, GC2, or GC3, proceeding to next step")
      localStorage.setItem("startLS2", "false")
      localStorage.setItem("userRoleCode", roleCode || "")
      console.log("[DEBUG] localStorage set: startLS2=false, userRoleCode=", roleCode)
      window.location.href = "/prequalification2"
    }
  }

  const runLS1 = () => {
    console.log("[WORKFLOW] Running LS1 workflow")
    // Placeholder for LS1 workflow implementation
    // In a real implementation, this would trigger specific business logic

    // Navigate to the next step or page
    window.location.href = "/prequalification2"
  }

  const handleUpdateOccupantCount = () => {
    // Update the occupant count
    const adultOccupants = currentGroupMembers
      .concat(addedGroupMembers)
      .filter((member) => member.type === "Occupant" && member.subType !== "Child").length

    const childOccupants = currentGroupMembers
      .concat(addedGroupMembers)
      .filter((member) => member.type === "Occupant" && member.subType === "Child").length

    setAdultCount(Math.max(1, adultOccupants))
    setChildCount(childOccupants)
    setOriginalOccupantCount(newOccupantCount)

    console.log(
      `[GP6] Updated occupant count to ${newOccupantCount} (Adults: ${adultOccupants}, Children: ${childOccupants})`,
    )
    setShowOccupantCountDialog(false)

    // Continue with the workflow
    setTimeout(() => {
      // Check if there are other applicant roles (Flag 7)
      if (flags.flag7) {
        console.log("[WORKFLOW] Flag 7 is set (Co-Signer detected), running LS2")
        runLS2()
      } else {
        console.log("[WORKFLOW] No Co-Signer detected, running LS1")
        runLS1()
      }
    }, 100)
  }

  const handleUndoEdits = () => {
    // Restore previous state
    setCurrentGroupMembers(previousGroupMembers)
    setAddedGroupMembers(previousAddedGroupMembers)
    console.log(`[GP6] Undid edits, restored original occupant count of ${originalOccupantCount}`)
    setShowOccupantCountDialog(false)

    // Continue with the workflow
    setTimeout(() => {
      // Check if there are other applicant roles (Flag 7)
      if (flags.flag7) {
        console.log("[WORKFLOW] Flag 7 is set (Co-Signer detected), running LS2")
        runLS2()
      } else {
        console.log("[WORKFLOW] No Co-Signer detected, running LS1")
        runLS1()
      }
    }, 100)
  }

  const handleNext = () => {
    // Special case for non-occupant who is not a Canadian citizen but resides in Canada
    if (
      step === 1 &&
      userType === "Non-Occupant" &&
      userSubType === "Main Applicant/Co-Signer/Guarantor" &&
      isCitizen === false &&
      residesInCanada === true
    ) {
      setShowNonQualifiedDialog(true)
      return
    }

    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleStart = () => {
    // Go directly to first question
    setStep(0)
  }

  const navigateToDashboard = () => {
    window.location.href = "/"
  }

  const handleUserTypeChange = (value: UserType) => {
    setUserType(value)
    setUserSubType("")

    // Log user type selection
    console.log(`User selected type: ${value}`)
  }

  const handleUserSubTypeChange = (value: UserSubType) => {
    setUserSubType(value)

    // Log user subtype selection
    console.log(`User selected subtype: ${value}`)
  }

  const handleCitizenChange = (value: boolean) => {
    setIsCitizen(value)
    if (!value) {
      // Reset subsequent questions
      setResidesInCanada(null)

      // Log citizenship status
      console.log(`User citizenship status: ${value ? "Canadian Citizen/PR" : "Not Canadian Citizen/PR"}`)
    }
  }

  const handleResidesInCanadaChange = (value: boolean) => {
    setResidesInCanada(value)

    // Log residency status
    console.log(`User resides in Canada: ${value}`)

    if (!value) {
      updateFlag("flag9", true)
      console.log("Non-Canadian resident flag triggered")
    } else if (!isCitizen) {
      updateFlag("flag19", true)
      console.log("Non-Canadian resident but in Canada flag triggered")
    }
  }

  const handleOccupantCountChange = (type: OccupantType, increment: boolean) => {
    if (type === "Adult") {
      setAdultCount((prev) => {
        const newCount = increment ? prev + 1 : Math.max(1, prev - 1)
        // Log the change
        console.log(`Adult count updated from ${prev} to ${newCount}`)
        return newCount
      })
    } else if (type === "Child") {
      setChildCount((prev) => {
        const newCount = increment ? prev + 1 : Math.max(0, prev - 1)
        // Log the change
        console.log(`Child count updated from ${prev} to ${newCount}`)
        return newCount
      })
    } else if (type === "Pet") {
      const newCount = increment ? petCount + 1 : Math.max(0, petCount - 1)
      setPetCount(newCount)
      if (newCount > 0) {
        updateFlag("flag5", true)
        console.log("Pet flag triggered: User has pets")
      } else {
        updateFlag("flag5", false)
        console.log("Pet flag cleared: User has no pets")
      }
      // Log the change
      console.log(`Pet count updated from ${petCount} to ${newCount}`)
    }

    // Update occupants array based on new counts - will be called after state updates
    setTimeout(() => updateOccupantsArray(), 0)
  }

  const updateOccupantsArray = () => {
    const newOccupants: Occupant[] = []

    // Add adults with proper sequential numbering
    for (let i = 0; i < adultCount; i++) {
      const existingAdult = occupants.find((o) => o.type === "Adult" && o.id === i)
      newOccupants.push(
        existingAdult || {
          id: i,
          type: "Adult",
          relationship: undefined,
          customRelationship: undefined,
          durationYears: undefined,
          durationMonths: undefined,
          represent: false,
        },
      )
    }

    // Add children with proper sequential numbering
    for (let i = 0; i < childCount; i++) {
      const existingChild = occupants.find((o) => o.type === "Child" && o.id === i)
      newOccupants.push(existingChild || { id: i, type: "Child" })
    }

    // Add pets with proper sequential numbering
    for (let i = 0; i < petCount; i++) {
      const existingPet = occupants.find((o) => o.type === "Pet" && o.id === i)
      newOccupants.push(existingPet || { id: i, type: "Pet" })
    }

    setOccupants(newOccupants)
  }

  // Function to determine user role code based on user type and other factors
  const getUserRoleCode = () => {
    // GC1: User is an Occupant-Applicant-Logic: # of occupants = 1
    if (userType === "Occupant" && userSubType === "Applicant" && adultCount + childCount === 1) {
      return "GC1"
    }
    // GC2: User is an Occupant-Applicant-Logic: # of occupants > 1
    else if (userType === "Occupant" && userSubType === "Applicant" && adultCount + childCount > 1) {
      return "GC2"
    }
    // GC3: User is an Occupant-Non-Applicant
    else if (userType === "Occupant" && userSubType === "Non-Applicant") {
      return "GC3"
    }
    // GC4: User is a Non-Occupant-Option: Main Applicant/Co-Signer/Guarantor
    else if (userType === "Non-Occupant" && userSubType === "Main Applicant/Co-Signer/Guarantor") {
      return "GC4"
    }
    // GC5: User is a Non-Occupant-Option: Other
    else if (userType === "Non-Occupant" && userSubType === "Other") {
      return "GC5"
    }

    return null
  }

  const handleRelationshipChange = (occupantId: number, relationship: Relationship) => {
    setOccupants((prev) =>
      prev.map((occ) => (occ.id === occupantId && occ.type === "Adult" ? { ...occ, relationship } : occ)),
    )
  }

  const handleCustomRelationshipChange = (occupantId: number, value: string) => {
    setOccupants((prev) =>
      prev.map((occ) => (occ.id === occupantId && occ.type === "Adult" ? { ...occ, customRelationship: value } : occ)),
    )
  }

  const handleDurationChange = (occupantId: number, field: "durationYears" | "durationMonths", value: number) => {
    setOccupants((prev) =>
      prev.map((occ) => (occ.id === occupantId && occ.type === "Adult" ? { ...occ, [field]: value } : occ)),
    )
  }

  const handleRepresentChange = (occupantId: number, value: boolean) => {
    setOccupants((prev) =>
      prev.map((occ) => (occ.id === occupantId && occ.type === "Adult" ? { ...occ, represent: value } : occ)),
    )
  }

  const handleComplete = () => {
    // Get user role code
    const roleCode = getUserRoleCode()
    console.log("User role code:", roleCode)

    // Navigate based on role code
    if (roleCode === "GC1") {
      window.location.href = "/prequalification-gc1"
    } else if (roleCode === "GC2") {
      window.location.href = "/gc2-group-creation"
    } else if (roleCode === "GC3") {
      window.location.href = "/gc3-group-creation"
    } else if (roleCode === "GC4") {
      window.location.href = "/gc4-group-creation"
    } else if (roleCode === "GC5") {
      window.location.href = "/gc5-group-creation"
    } else {
      window.location.href = "/prequalification-landing"
    }
  }

  // Tooltip content
  const userTypeTooltipContent = `
    <strong>Occupant:</strong> An Occupant is an individual who physically resides in the rental property.
    They live in the property on a regular basis, whether or not they are the leaseholder or have signed the
    lease. Occupants can include family members, roommates, or anyone else who has established the rental
    property as their place of residence with the leaseholder's consent.
    
    <strong>Non-Occupant:</strong> A Non-Occupant, in contrast, is someone who has a relationship or
    connection to the property or lease agreement but does not live there. This could include individuals
    who are helping with the property search or those who may have financial or legal responsibilities
    related to the property, such as Main Applicants, Co-Signers and Guarantors. The defining feature of a
    non-occupant is their absence from the property as a place of residence.
  `

  // Render functions
  const renderIntro = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      <div className="max-h-60 overflow-y-auto pr-2 mb-4">
        <p className="text-lg">
          In order for landlords to feel secure in renting their property there are certain requirements that need to be
          met. To provide you with the best possible experience in your search, we have put together a pre-qualification
          process to help us understand your needs and whether you would be an ideal applicant for our service.
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md" onClick={handleStart}>
          Start
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md"
          onClick={() => {
            window.location.href = "/group-invitation"
          }}
        >
          Skip to Group Invitation
        </Button>
      </div>

      {/* New informative container */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Start Button</h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>
                  Begin the pre-qualification process to determine your eligibility as a tenant. This will guide you
                  through a series of questions about your status, occupancy needs, and other relevant information.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Skip to Group Invitation</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  If you've been invited to join an existing rental group, use this option to bypass the
                  pre-qualification process and go directly to the group invitation page. This is only for users who
                  have received an invitation code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUserTypeQuestion = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">What best describes you?</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="link" className="ml-2 p-0 h-auto" onClick={() => setShowTooltip(!showTooltip)}>
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                  <span className="sr-only">What is this?</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md p-4">
                <div dangerouslySetInnerHTML={{ __html: userTypeTooltipContent }}></div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Select value={userType} onValueChange={(value) => handleUserTypeChange(value as UserType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Occupant">Occupant</SelectItem>
            <SelectItem value="Non-Occupant">Non-Occupant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {userType && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Please specify:</h3>
          <Select value={userSubType} onValueChange={(value) => handleUserSubTypeChange(value as UserSubType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your specific role" />
            </SelectTrigger>
            <SelectContent>
              {userType === "Occupant" ? (
                <>
                  <SelectItem value="Applicant">Applicant</SelectItem>
                  <SelectItem value="Non-Applicant">Non-Applicant</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Main Applicant/Co-Signer/Guarantor">Main Applicant/Co-Signer/Guarantor</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {userType && userSubType && (
        <div className="flex justify-end">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext}>
            Next
          </Button>
        </div>
      )}
    </div>
  )

  const renderCitizenshipQuestion = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      {userSubType === "Main Applicant/Co-Signer/Guarantor" && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Main Applicant/Co-Signer/Guarantor Disclosure</h3>
          <p className="text-sm mb-4">
            As a Main Applicant, Co-Signer, or Guarantor, you are taking financial responsibility for the rental
            property. This may include being liable for rent payments, damages, and other obligations specified in the
            lease agreement.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acknowledgement"
              checked={acknowledgement}
              onCheckedChange={(checked) => setAcknowledgement(checked as boolean)}
            />
            <label htmlFor="acknowledgement" className="text-sm font-medium">
              I acknowledge and understand my responsibilities
            </label>
          </div>
        </div>
      )}

      {(userSubType !== "Main Applicant/Co-Signer/Guarantor" || acknowledgement) && (
        <>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Are you a Canadian Citizen or have Permanent Residency Status in Canada?
            </h2>
            <div className="flex space-x-4">
              <Button
                variant={isCitizen === true ? "default" : "outline"}
                className={isCitizen === true ? "bg-orange-500 hover:bg-orange-600" : ""}
                onClick={() => handleCitizenChange(true)}
              >
                Yes
              </Button>
              <Button
                variant={isCitizen === false ? "default" : "outline"}
                className={isCitizen === false ? "bg-orange-500 hover:bg-orange-600" : ""}
                onClick={() => handleCitizenChange(false)}
              >
                No
              </Button>
            </div>
          </div>

          {isCitizen !== null && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Do you currently reside in Canada?</h2>
              <div className="flex space-x-4">
                <Button
                  variant={residesInCanada === true ? "default" : "outline"}
                  className={residesInCanada === true ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => handleResidesInCanadaChange(true)}
                >
                  Yes
                </Button>
                <Button
                  variant={residesInCanada === false ? "default" : "outline"}
                  className={residesInCanada === false ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => handleResidesInCanadaChange(false)}
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {residesInCanada !== null && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )

  const renderOccupantCountQuestion = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      <h2 className="text-xl font-semibold">How many occupants?</h2>

      <div className="space-y-4">
        <OccupantCounter
          label="Adults"
          count={adultCount}
          minCount={1}
          onChange={(newCount) => handleOccupantCountChange("Adult", newCount > adultCount)}
        />

        <OccupantCounter
          label="Children"
          count={childCount}
          minCount={0}
          onChange={(newCount) => handleOccupantCountChange("Child", newCount > childCount)}
        />

        <OccupantCounter
          label="Pets"
          count={petCount}
          minCount={0}
          onChange={(newCount) => handleOccupantCountChange("Pet", newCount > petCount)}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  )

  const renderOccupantDetailsTable = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      <h2 className="text-xl font-semibold">Occupant Details</h2>

      {occupants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-2">No occupants added yet.</div>
          <div className="text-sm">Please add occupants in the previous step.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary cards for each occupant type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Adults Summary Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-gray-500">Occupants</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-800">{adultCount}</div>
              </div>
            </div>

            {/* Children Summary Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <Baby className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-gray-500">Occupants</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-800">{childCount}</div>
              </div>
            </div>

            {/* Pets Summary Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <SmilePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Pets</div>
                    <div className="text-sm text-gray-500">Occupants</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-800">{petCount}</div>
              </div>
            </div>
          </div>

          {/* Occupant Details Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Occupant #</TableHead>
                  <TableHead>Occupant Type</TableHead>
                  {userType === "Non-Occupant" && userSubType === "Main Applicant/Co-Signer/Guarantor" && (
                    <>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>I Represent</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {occupants
                  .filter((occ) => occ.type === "Adult" || occ.type === "Child")
                  .map((occupant, index) => (
                    <TableRow key={`${occupant.type}-${occupant.id}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{occupant.type}</TableCell>
                      {userType === "Non-Occupant" && userSubType === "Main Applicant/Co-Signer/Guarantor" && (
                        <>
                          <TableCell>
                            {occupant.type === "Adult" && (
                              <Select
                                value={occupant.relationship || ""}
                                onValueChange={(value) => handleRelationshipChange(occupant.id, value as Relationship)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Parent">Parent</SelectItem>
                                  <SelectItem value="Spouse/Partner">Spouse/Partner</SelectItem>
                                  <SelectItem value="Child">Child</SelectItem>
                                  <SelectItem value="Sibling">Sibling</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {occupant.relationship === "Other" && (
                              <Input
                                className="mt-2"
                                placeholder="Specify relationship"
                                value={occupant.customRelationship || ""}
                                onChange={(e) => handleCustomRelationshipChange(occupant.id, e.target.value)}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {occupant.type === "Adult" &&
                              (occupant.relationship === "Friend" || occupant.relationship === "Other") && (
                                <div className="flex space-x-2">
                                  <div>
                                    <label className="text-xs">Years</label>
                                    <Input
                                      type="number"
                                      min="0"
                                      className="w-16"
                                      value={occupant.durationYears || 0}
                                      onChange={(e) =>
                                        handleDurationChange(
                                          occupant.id,
                                          "durationYears",
                                          Number.parseInt(e.target.value),
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs">Months</label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="11"
                                      className="w-16"
                                      value={occupant.durationMonths || 0}
                                      onChange={(e) =>
                                        handleDurationChange(
                                          occupant.id,
                                          "durationMonths",
                                          Number.parseInt(e.target.value),
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                          </TableCell>
                          <TableCell>
                            {occupant.type === "Adult" && (
                              <Checkbox
                                checked={occupant.represent || false}
                                onCheckedChange={(checked) => handleRepresentChange(occupant.id, checked as boolean)}
                              />
                            )}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Total Occupants Summary */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mt-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-orange-800">Total Occupants</div>
              <div className="text-2xl font-bold text-orange-800">{adultCount + childCount}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleComplete}>
          Complete
        </Button>
      </div>
    </div>
  )

  const renderNonQualifiedDialog = () => (
    <Dialog open={showNonQualifiedDialog} onOpenChange={setShowNonQualifiedDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Qualification Notice</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            Thank you for your responses. Unfortunately, you do not qualify to be a Main Applicant/Co-signer/Guarantor
            at this time. The minimum requirement for a Co-Signer/Guarantor who resides in Canada is to have Canadian
            Citizenship or Permanent Residency Status. Click here to learn more.
          </p>
        </div>
        <DialogFooter>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              setShowNonQualifiedDialog(false)
              navigateToDashboard()
            }}
          >
            Return to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Main render function
  const renderCurrentStep = () => {
    // Always show intro first
    if (step === -1) {
      return renderIntro()
    }

    switch (step) {
      case 0:
        return renderUserTypeQuestion()
      case 1:
        return renderCitizenshipQuestion()
      case 2:
        return renderOccupantCountQuestion()
      case 3:
        return renderOccupantDetailsTable()
      default:
        return renderIntro()
    }
  }

  // Add this effect after the other useEffect hooks
  useEffect(() => {
    // Update occupants array when counts change
    updateOccupantsArray()
  }, [adultCount, childCount, petCount])

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Pre-Qualification</span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" />
      </div>

      {renderCurrentStep()}
      {showNonQualifiedDialog && renderNonQualifiedDialog()}
    </div>
  )
}
