"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Pencil, Plus, UserPlus, Save, AlertCircle } from "lucide-react"
import { ToastContainer } from "./toast-notification-manager"
import { OccupantCounter } from "./occupant-counter"

type UserType = "Occupant" | "Non-Occupant" | ""
type UserSubType = "Applicant" | "Non-Applicant" | "Main Applicant/Co-Signer/Guarantor" | "Other" | ""
type Relationship = "Parent" | "Spouse/Partner" | "Child" | "Sibling" | "Grandparent" | "Friend" | "Other" | ""

interface GroupMember {
  id: number
  firstName: string
  lastName: string
  type: UserType
  subType: UserSubType
  relationship: Relationship
  email: string
  phone: string
  status: "Active" | "Pending" | "Invited"
  isAdmin: boolean
  represent: boolean
}

interface Flag {
  name: string
  value: boolean
  description: string
}

export function GroupInvitationWizard() {
  // Add this variable for the inviter name
  const Group_Inviter_Name = "Jane Smith" // This should be replaced with actual data from your application

  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [userInfo, setUserInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    relationship: "Friend" as Relationship,
  })
  const [userType, setUserType] = useState<UserType>("Occupant")
  const [originalUserType, setOriginalUserType] = useState<UserType>("Occupant")
  const [userSubType, setUserSubType] = useState<UserSubType>("Applicant")
  const [originalUserSubType, setOriginalUserSubType] = useState<UserSubType>("Applicant")
  const [isCitizen, setIsCitizen] = useState<boolean | null>(null)
  const [residesInCanada, setResidesInCanada] = useState<boolean | null>(null)
  const [acknowledgement, setAcknowledgement] = useState(false)
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [originalOccupantCount, setOriginalOccupantCount] = useState(1)
  const [newMember, setNewMember] = useState<Partial<GroupMember>>({
    firstName: "",
    lastName: "",
    type: "Occupant",
    subType: "Applicant",
    relationship: "",
    email: "",
    phone: "",
    isAdmin: false,
    represent: false,
  })
  const [editingField, setEditingField] = useState<string | null>(null)
  const [flags, setFlags] = useState<Flag[]>([])
  const [showOccupantUpdatePrompt, setShowOccupantUpdatePrompt] = useState(false)
  const [occupantUpdateType, setOccupantUpdateType] = useState<"increase" | "decrease" | null>(null)
  const [tempGroupMembers, setTempGroupMembers] = useState<GroupMember[]>([])
  const [nextWorkflow, setNextWorkflow] = useState<"LS3" | "NLS3" | "CSG3" | "OTH3" | null>(null)
  const [disqualified, setDisqualified] = useState(false)

  // Add state to track if current user has been added to group members
  const [currentUserAdded, setCurrentUserAdded] = useState(false)

  // Add state for database operation feedback
  const [dbFeedback, setDbFeedback] = useState<{
    show: boolean
    message: string
    type: "success" | "error"
  }>({
    show: false,
    message: "",
    type: "success",
  })

  // Add state for loading indicators
  const [loading, setLoading] = useState<{
    addMember: boolean
    updateMember: boolean
    savingField: string | null
  }>({
    addMember: false,
    updateMember: false,
    savingField: null,
  })

  // Calculate total steps based on user type and subtype
  const totalSteps = 5

  // Update progress whenever step changes
  const updateProgress = (currentStep: number) => {
    const progressPercentage = Math.min(Math.round((currentStep / totalSteps) * 100), 100)
    setProgress(progressPercentage)
  }

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
  }, [])

  // Calculate current occupant count
  const getCurrentOccupantCount = useCallback(() => {
    return groupMembers.filter((member) => member.type === "Occupant").length
  }, [groupMembers])

  // Simulate database operation
  const simulateDbOperation = (operation: string, data: any) => {
    // Log the operation to console
    console.log(`[DATABASE ${operation}]`, data)

    // Create toast notification message based on operation type
    if (operation === "INSERT" && data.table === "group_members") {
      // Show toast notification
      // @ts-ignore - Using global function
      window.addToast && window.addToast(`${data.data.firstName} ${data.data.lastName} added to group`, "success")
    } else if (operation === "UPDATE" && data.table === "group_members") {
      // Show toast notification
      // @ts-ignore - Using global function
      window.addToast && window.addToast(`Member information updated`, "info")
    } else if (operation === "UPDATE" && data.table === "users") {
      // Show toast notification
      // @ts-ignore - Using global function
      window.addToast && window.addToast(`Profile information updated`, "info")
    } else if (operation === "UPDATE" && data.table === "flags") {
      // Log flag updates
      console.log(`Flag updated: ${data.name} = ${data.value}`)
    }

    // Don't show the database feedback alert anymore
    return true // Simulate successful operation
  }

  // Initialize original occupant count
  useEffect(() => {
    setOriginalOccupantCount(getCurrentOccupantCount())
  }, [getCurrentOccupantCount])

  // Store original user type and subtype when first loaded
  useEffect(() => {
    if (step === 0) {
      setOriginalUserType(userType)
      setOriginalUserSubType(userSubType)
    }
  }, [step, userType, userSubType])

  // Add current user to group members when role is confirmed
  useEffect(() => {
    if (step === 3 && !currentUserAdded) {
      // User has confirmed their role, add them to group members
      const currentUser: GroupMember = {
        id: Math.max(0, ...groupMembers.map((m) => m.id)) + 1,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        type: userType,
        subType: userSubType,
        relationship: userInfo.relationship,
        email: userInfo.email,
        phone: userInfo.phone,
        status: "Active", // Current user is active
        isAdmin: false, // Default to non-admin
        represent: false,
      }

      // Add to group members
      setGroupMembers((prev) => [...prev, currentUser])
      setCurrentUserAdded(true)

      // Simulate database save
      simulateDbOperation("INSERT", {
        table: "group_members",
        data: currentUser,
      })
    }
  }, [step, currentUserAdded, userInfo, userType, userSubType, groupMembers])

  // Check if user has changed their subtype
  const hasChangedSubtype = () => {
    return originalUserType !== userType || originalUserSubType !== userSubType
  }

  const handleNext = () => {
    // If user has changed their subtype, log it but allow them to continue
    if (step === 2 && hasChangedSubtype()) {
      console.log("User changed subtype, updating workflow")
      // Update the workflow based on the new role
      if (userType === "Occupant") {
        if (userSubType === "Applicant") {
          setNextWorkflow("LS3")
        } else if (userSubType === "Non-Applicant") {
          setNextWorkflow("NLS3")
        }
      } else if (userType === "Non-Occupant") {
        if (userSubType === "Main Applicant/Co-Signer/Guarantor") {
          setNextWorkflow("CSG3")
        } else if (userSubType === "Other") {
          setNextWorkflow("OTH3")
        }
      }

      // Notify the user that their role has been updated
      window.addToast && window.addToast(`Role updated to ${userType} - ${userSubType}`, "info")
    }

    // Handle citizenship and residency flags
    if (step === 3) {
      if (!isCitizen && !residesInCanada) {
        updateFlag("FLAG9", true, "Non-citizen not residing in Canada")
      } else if (!isCitizen && residesInCanada) {
        updateFlag("FLAG19", true, "Non-citizen residing in Canada")
      } else if (isCitizen && !residesInCanada) {
        updateFlag("FLAG19", true, "Citizen not residing in Canada")
      }

      // Check if user is disqualified (Non-citizen Main Applicant/Co-Signer/Guarantor residing in Canada)
      if (userSubType === "Main Applicant/Co-Signer/Guarantor" && !isCitizen && residesInCanada) {
        setDisqualified(true)
        return // Stop progression if disqualified
      }
    }

    // Determine next workflow based on user type and subtype
    if (step === 4) {
      if (userType === "Occupant") {
        if (userSubType === "Applicant") {
          setNextWorkflow("LS3")
        } else if (userSubType === "Non-Applicant") {
          setNextWorkflow("NLS3")
        }
      } else if (userType === "Non-Occupant") {
        if (userSubType === "Main Applicant/Co-Signer/Guarantor") {
          setNextWorkflow("CSG3")
        } else if (userSubType === "Other") {
          setNextWorkflow("OTH3")
        }
      }

      // Check if occupant count has changed
      const currentOccupantCount = getCurrentOccupantCount()
      if (currentOccupantCount > originalOccupantCount) {
        setTempGroupMembers([...groupMembers])
        setOccupantUpdateType("increase")
        setShowOccupantUpdatePrompt(true)
        return // Don't proceed to next step yet
      } else if (currentOccupantCount < originalOccupantCount) {
        setTempGroupMembers([...groupMembers])
        setOccupantUpdateType("decrease")
        setShowOccupantUpdatePrompt(true)
        return // Don't proceed to next step yet
      }
    }

    // If moving from step 1 (user info) to step 2 (role confirmation)
    if (step === 1) {
      // Simulate saving user info to database
      simulateDbOperation("UPDATE", {
        table: "users",
        data: userInfo,
      })
    }

    // If moving from step 2 (role confirmation) to step 3 (citizenship)
    if (step === 2) {
      // Simulate saving user role to database
      simulateDbOperation("UPDATE", {
        table: "users",
        data: {
          id: userInfo.email, // Using email as identifier
          type: userType,
          subType: userSubType,
        },
      })
    }

    const nextStep = step + 1
    setStep(nextStep)
    updateProgress(nextStep)
  }

  const handleBack = () => {
    const prevStep = Math.max(0, step - 1)
    setStep(prevStep)
    updateProgress(prevStep)
  }

  const handleUserTypeChange = (value: UserType) => {
    setUserType(value)
    // Reset subtype when type changes
    setUserSubType("")
  }

  const handleUserSubTypeChange = (value: UserSubType) => {
    setUserSubType(value)
  }

  const handleCitizenChange = (value: boolean) => {
    setIsCitizen(value)
    if (!value) {
      // Reset subsequent questions
      setResidesInCanada(null)
    }
  }

  const handleResidesInCanadaChange = (value: boolean) => {
    setResidesInCanada(value)
  }

  const handleEditField = (field: string) => {
    setEditingField(field)
  }

  const handleSaveField = async () => {
    // Set loading state
    setLoading((prev) => ({ ...prev, savingField: editingField }))

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Simulate saving the edited field to database
    simulateDbOperation("UPDATE", {
      table: "users",
      field: editingField,
      data: userInfo,
    })

    // Update current user in group members list if already added
    if (currentUserAdded) {
      setGroupMembers((prev) =>
        prev.map((member) =>
          member.email === userInfo.email
            ? {
                ...member,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                phone: userInfo.phone,
                relationship: userInfo.relationship,
              }
            : member,
        ),
      )
    }

    // Clear loading state
    setLoading((prev) => ({ ...prev, savingField: null }))
    setEditingField(null)
  }

  const handleAddMember = async () => {
    if (newMember.firstName && newMember.email && newMember.type && newMember.subType) {
      // Set loading state
      setLoading((prev) => ({ ...prev, addMember: true }))

      // Auto-set admin status for Applicants
      if (newMember.subType === "Applicant") {
        newMember.isAdmin = true
      }

      const newId = Math.max(0, ...groupMembers.map((m) => m.id)) + 1
      const newMemberData = {
        id: newId,
        firstName: newMember.firstName || "",
        lastName: newMember.lastName || "",
        type: newMember.type as UserType,
        subType: newMember.subType as UserSubType,
        relationship: newMember.relationship as Relationship,
        email: newMember.email || "",
        phone: newMember.phone || "",
        status: "Invited",
        isAdmin: newMember.isAdmin || false,
        represent: newMember.represent || false,
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Add to group members with animation class
      setGroupMembers((prev) => [
        ...prev,
        { ...newMemberData, isNew: true } as any, // Add isNew flag for animation
      ])

      // Remove isNew flag after animation
      setTimeout(() => {
        setGroupMembers((prev) =>
          prev.map((member) => (member.id === newId ? ({ ...member, isNew: false } as any) : member)),
        )
      }, 2000)

      // Check if there are other applicant roles
      const hasOtherApplicants = groupMembers.some(
        (member) =>
          (member.subType === "Applicant" || member.subType === "Main Applicant/Co-Signer/Guarantor") &&
          member.email !== userInfo.email,
      )

      if (hasOtherApplicants) {
        updateFlag("FLAG7", true, "Group has multiple applicants")
      }

      // Simulate database save
      simulateDbOperation("INSERT", {
        table: "group_members",
        data: newMemberData,
      })

      // Reset new member form
      setNewMember({
        firstName: "",
        lastName: "",
        type: "Occupant",
        subType: "Applicant",
        relationship: "",
        email: "",
        phone: "",
        isAdmin: false,
        represent: false,
      })

      // Clear loading state
      setLoading((prev) => ({ ...prev, addMember: false }))
    }
  }

  const handleRepresentChange = async (memberId: number, value: boolean) => {
    // Set loading state
    setLoading((prev) => ({ ...prev, updateMember: true }))

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update the group member
    setGroupMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? ({ ...m, represent: value, isUpdated: true } as any) // Add isUpdated flag for animation
          : m,
      ),
    )

    // Remove isUpdated flag after animation
    setTimeout(() => {
      setGroupMembers((prev) =>
        prev.map((member) => (member.id === memberId ? ({ ...member, isUpdated: false } as any) : member)),
      )
    }, 2000)

    // Simulate database update
    simulateDbOperation("UPDATE", {
      table: "group_members",
      id: memberId,
      field: "represent",
      value,
    })

    // Clear loading state
    setLoading((prev) => ({ ...prev, updateMember: false }))
  }

  const handleOccupantUpdateResponse = (accept: boolean) => {
    if (accept) {
      // User accepted the occupant count update
      setOriginalOccupantCount(getCurrentOccupantCount())
      simulateDbOperation("UPDATE", {
        table: "group",
        field: "occupantCount",
        value: getCurrentOccupantCount(),
      })
    } else {
      // User rejected, revert to previous state
      setGroupMembers(tempGroupMembers)
    }

    setShowOccupantUpdatePrompt(false)
    // Now proceed to next step
    const nextStep = step + 1
    setStep(nextStep)
    updateProgress(nextStep)
  }

  const renderWelcomeStep = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      <p className="text-lg">
        Congratulations on accepting {Group_Inviter_Name}'s invitation. We look forward to giving you the best rental
        search experience.
      </p>
      <p className="text-lg">Please verify and confirm your information to proceed.</p>
      <div className="flex justify-center">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext}>
          Start Pre-Qualification
        </Button>
      </div>
    </div>
  )

  const renderUserInfoStep = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      {/* Invitation header */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-4">
        <p className="text-blue-800 font-medium text-center">
          {Group_Inviter_Name} has invited you to join their rental group
        </p>
      </div>

      <h2 className="text-xl font-semibold">Verify Your Information</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Full Name</label>
            {editingField !== "name" ? (
              <Button variant="ghost" size="sm" onClick={() => handleEditField("name")}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveField}
                disabled={loading.savingField === editingField}
              >
                {loading.savingField === editingField ? (
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {editingField === "name" ? (
            <div className="flex space-x-2">
              <Input
                value={userInfo.firstName}
                onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                placeholder="First Name"
                className="min-h-[42px]"
              />
              <Input
                value={userInfo.lastName}
                onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                placeholder="Last Name"
                className="min-h-[42px]"
              />
            </div>
          ) : (
            <div className="p-2 border rounded-md bg-gray-50 min-h-[42px] flex items-center">
              {userInfo.firstName} {userInfo.lastName}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Email</label>
            {editingField !== "email" ? (
              <Button variant="ghost" size="sm" onClick={() => handleEditField("email")}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveField}
                disabled={loading.savingField === editingField}
              >
                {loading.savingField === editingField ? (
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {editingField === "email" ? (
            <Input
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              placeholder="Email"
              className="min-h-[42px]"
            />
          ) : (
            <div className="p-2 border rounded-md bg-gray-50 min-h-[42px] flex items-center">{userInfo.email}</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Phone Number</label>
            {editingField !== "phone" ? (
              <Button variant="ghost" size="sm" onClick={() => handleEditField("phone")}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveField}
                disabled={loading.savingField === editingField}
              >
                {loading.savingField === editingField ? (
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {editingField === "phone" ? (
            <Input
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              placeholder="Phone Number"
              className="min-h-[42px]"
            />
          ) : (
            <div className="p-2 border rounded-md bg-gray-50 min-h-[42px] flex items-center">{userInfo.phone}</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Relationship to Inviter</label>
            {editingField !== "relationship" ? (
              <Button variant="ghost" size="sm" onClick={() => handleEditField("relationship")}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveField}
                disabled={loading.savingField === editingField}
              >
                {loading.savingField === editingField ? (
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {editingField === "relationship" ? (
            <Select
              value={userInfo.relationship}
              onValueChange={(value) => setUserInfo({ ...userInfo, relationship: value as Relationship })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Spouse/Partner">Spouse/Partner</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Grandparent">Grandparent</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 border rounded-md bg-gray-50 min-h-[42px] flex items-center">
              {userInfo.relationship}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext}>
          Confirm
        </Button>
      </div>
    </div>
  )

  const renderRoleConfirmationStep = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      <h2 className="text-xl font-semibold">Confirm Your Role</h2>
      <p>
        You've been added to the group as a{userType === "Occupant" ? "n" : ""} {userType} - {userSubType}. Please
        confirm your role.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Role</label>
          <Select value={userType} onValueChange={(value) => handleUserTypeChange(value as UserType)}>
            <SelectTrigger>
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
            <label className="text-sm font-medium">Specific Role</label>
            <Select value={userSubType} onValueChange={(value) => handleUserSubTypeChange(value as UserSubType)}>
              <SelectTrigger>
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
                    <SelectItem value="Main Applicant/Co-Signer/Guarantor">
                      Main Applicant/Co-Signer/Guarantor
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={!userType || !userSubType}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderCitizenshipStep = () => {
    // If user is disqualified, show disqualification message
    if (disqualified) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
          <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
            <h3 className="font-semibold text-red-700 flex items-center mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              Qualification Notice
            </h3>
            <p className="text-red-700 mb-4">
              Thank you for your responses. Unfortunately, you do not qualify to be a Main Applicant/Co-Signer/Guarantor
              at this time. The minimum requirement for a Main Applicant/Co-Signer/Guarantor who resides in Canada is to
              have Canadian Citizenship or Permanent Residency Status.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white">Learn More</Button>
          </div>
        </div>
      )
    }

    // For Main Applicant/Co-Signer/Guarantor, show disclosure first
    if (userSubType === "Main Applicant/Co-Signer/Guarantor" && !acknowledgement) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
          <div className="bg-gray-100 p-4 rounded-md mb-4">
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

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setAcknowledgement(true)}
              disabled={!acknowledgement}
            >
              Next
            </Button>
          </div>
        </div>
      )
    }

    // For "Other" subtype, skip citizenship questions and go directly to group members
    if (userSubType === "Other") {
      // Automatically move to next step on render
      setTimeout(() => {
        handleNext()
      }, 0)

      return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
        <h2 className="text-xl font-semibold">Citizenship Status</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Are you a Canadian Citizen or have Permanent Residency Status in Canada?</p>
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
              <p className="font-medium">Do you currently reside in Canada?</p>
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
        </div>

        {residesInCanada !== null && (
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext}>
              Next
            </Button>
          </div>
        )}
      </div>
    )
  }

  const renderGroupMembersStep = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      {/* Invitation header */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-4">
        <p className="text-blue-800 font-medium text-center">
          {Group_Inviter_Name} has invited you to join their rental group
        </p>
      </div>

      <h2 className="text-xl font-semibold">Group Members</h2>

      {userSubType === "Main Applicant/Co-Signer/Guarantor" && (
        <div className="bg-blue-50 p-4 rounded-md mb-4 border border-blue-200">
          <p className="text-blue-800 font-medium mb-2">Please select the Occupants whom you represent</p>
          <p className="text-sm text-blue-700">
            As a Main Applicant/Co-Signer/Guarantor, you can represent one or more Occupants in this group.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              {userSubType === "Main Applicant/Co-Signer/Guarantor" && <TableHead>I Represent</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...groupMembers]
              .sort((a, b) => (a.email === userInfo.email ? -1 : b.email === userInfo.email ? 1 : 0))
              .map((member) => (
                <TableRow
                  key={member.id}
                  className={`
                  ${member.email === userInfo.email ? "bg-blue-50" : ""}
                  ${(member as any).isNew ? "animate-highlight-green" : ""}
                  ${(member as any).isUpdated ? "animate-highlight-yellow" : ""}
                  transition-colors duration-300
                `}
                >
                  <TableCell>
                    {member.firstName} {member.lastName}
                    {member.email === userInfo.email && <span className="ml-2 text-xs text-blue-600">(You)</span>}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                      {member.type} - {member.subType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : member.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  {userSubType === "Main Applicant/Co-Signer/Guarantor" && (
                    <TableCell>
                      <div className="relative">
                        <Checkbox
                          checked={member.represent}
                          onCheckedChange={(checked) => handleRepresentChange(member.id, checked as boolean)}
                          disabled={
                            member.type !== "Occupant" || member.email === userInfo.email || loading.updateMember
                          }
                        />
                        {loading.updateMember && member.id === groupMembers.find((m) => (m as any).isUpdated)?.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <UserPlus className="mr-2 h-5 w-5" />
          Add Member
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">First Name*</label>
            <Input
              value={newMember.firstName}
              onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
              placeholder="First Name"
              required
              disabled={loading.addMember}
              className="min-h-[42px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <Input
              value={newMember.lastName}
              onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
              placeholder="Last Name"
              disabled={loading.addMember}
              className="min-h-[42px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role*</label>
            <Select
              value={newMember.type as string}
              onValueChange={(value) => setNewMember({ ...newMember, type: value as UserType })}
              disabled={loading.addMember}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Occupant">Occupant</SelectItem>
                <SelectItem value="Non-Occupant">Non-Occupant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Specific Role*</label>
            <Select
              value={newMember.subType as string}
              onValueChange={(value) => setNewMember({ ...newMember, subType: value as UserSubType })}
              disabled={loading.addMember}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specific role" />
              </SelectTrigger>
              <SelectContent>
                {newMember.type === "Occupant" ? (
                  <>
                    <SelectItem value="Applicant">Applicant</SelectItem>
                    <SelectItem value="Non-Applicant">Non-Applicant</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Main Applicant/Co-Signer/Guarantor">
                      Main Applicant/Co-Signer/Guarantor
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Relationship*</label>
            <Select
              value={newMember.relationship as string}
              onValueChange={(value) => setNewMember({ ...newMember, relationship: value as Relationship })}
              disabled={loading.addMember}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Spouse/Partner">Spouse/Partner</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Grandparent">Grandparent</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Email*</label>
            <Input
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              placeholder="Email"
              type="email"
              required
              disabled={loading.addMember}
              className="min-h-[42px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              placeholder="Phone Number"
              disabled={loading.addMember}
              className="min-h-[42px]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="makeAdmin"
            checked={newMember.isAdmin}
            onCheckedChange={(checked) => {
              // Logic: if sub-type = "Applicant," admin is pre-selected and cannot be unselected
              if (newMember.subType === "Applicant" && !checked) {
                return // Prevent unchecking for Applicant
              }
              setNewMember({ ...newMember, isAdmin: checked as boolean })
            }}
            disabled={
              loading.addMember ||
              // Logic: if user currently doesn't have admin status, they cannot choose to give admin status to a non-applicant/main applicant/cosigner/guarantor/other
              (!groupMembers.find((m) => m.email === userInfo.email)?.isAdmin &&
                newMember.subType !== "Applicant" &&
                newMember.subType !== "Main Applicant/Co-Signer/Guarantor") ||
              // Always disable if subtype is Applicant (since it's auto-selected)
              newMember.subType === "Applicant"
            }
          />
          <label htmlFor="makeAdmin" className="text-sm font-medium">
            Make admin
          </label>
        </div>

        <Button
          className="bg-black hover:bg-gray-800 text-white relative"
          onClick={handleAddMember}
          disabled={
            !newMember.firstName || !newMember.email || !newMember.type || !newMember.subType || loading.addMember
          }
        >
          {loading.addMember ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Invite
            </>
          )}
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack} disabled={loading.addMember || loading.updateMember}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleNext}
          disabled={
            loading.addMember ||
            loading.updateMember ||
            (userSubType === "Main Applicant/Co-Signer/Guarantor" && !groupMembers.some((m) => m.represent))
          }
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderNextWorkflowRedirect = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      <h2 className="text-xl font-semibold">Proceeding to Next Step</h2>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
        <p className="text-blue-800 mb-4">
          Thank you for completing this part of the process. You will now be redirected to the next step.
        </p>

        <div className="bg-white p-4 rounded-md border mb-4">
          <h3 className="text-lg font-medium mb-2">Next Workflow: {nextWorkflow}</h3>
          <p className="text-gray-600">
            {nextWorkflow === "LS3" && "You will now proceed to the Lease Signing workflow for Applicants."}
            {nextWorkflow === "NLS3" &&
              "You will now proceed to the Non-Leaseholder workflow for Non-Applicant Occupants."}
            {nextWorkflow === "CSG3" &&
              "You will now proceed to the Co-Signer/Guarantor workflow for financial responsibility."}
            {nextWorkflow === "OTH3" && "You will now proceed to the Other workflow for Non-Occupant participants."}
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => {
            // Save workflow state to localStorage for persistence
            try {
              localStorage.setItem("userRole", userType)
              localStorage.setItem("userSubRole", userSubType)
              localStorage.setItem("nextWorkflow", nextWorkflow || "")

              // Additional data to persist
              localStorage.setItem("userInfo", JSON.stringify(userInfo))
              localStorage.setItem("isCitizen", isCitizen ? "true" : "false")
              localStorage.setItem("residesInCanada", residesInCanada ? "true" : "false")

              // Store flags
              localStorage.setItem("userFlags", JSON.stringify(flags))
            } catch (e) {
              console.error("Error saving to localStorage:", e)
            }

            // Redirect to the appropriate workflow based on nextWorkflow
            if (nextWorkflow === "LS3") {
              // Redirect to LS3 workflow
              window.location.href = "/prequalification-ls3"
              // For demo purposes, you can also show a toast notification
              window.addToast && window.addToast("Redirecting to Leaseholder workflow (LS3)", "info")
            } else if (nextWorkflow === "NLS3") {
              // Redirect to NLS3 workflow
              window.location.href = "/prequalification-nls3"
              window.addToast && window.addToast("Redirecting to Non-Leaseholder workflow (NLS3)", "info")
            } else if (nextWorkflow === "CSG3") {
              // Redirect to CSG3 workflow
              window.location.href = "/prequalification-csg3"
              window.addToast && window.addToast("Redirecting to Co-Signer/Guarantor workflow (CSG3)", "info")
            } else if (nextWorkflow === "OTH3") {
              // Redirect to OTH3 workflow
              window.location.href = "/prequalification-oth3"
              window.addToast && window.addToast("Redirecting to Other workflow (OTH3)", "info")
            }
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  )

  const renderOccupantUpdatePrompt = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6">
      <h2 className="text-xl font-semibold">Update Occupant Count</h2>

      <div
        className={`bg-${occupantUpdateType === "increase" ? "blue" : "amber"}-50 p-4 rounded-md border border-${occupantUpdateType === "increase" ? "blue" : "amber"}-200 mb-4`}
      >
        <p className={`text-${occupantUpdateType === "increase" ? "blue" : "amber"}-800 mb-4`}>
          The number of people added to the group as "Occupant" is {occupantUpdateType === "increase" ? "more" : "less"}{" "}
          than what was disclosed in your previous entry. Would you like to update your Occupant count?
        </p>

        <div className="bg-white p-4 rounded-md border mb-4">
          <h3 className="text-lg font-medium mb-2">Current Occupant Count</h3>
          <OccupantCounter count={getCurrentOccupantCount()} onChange={() => {}} disabled={true} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => handleOccupantUpdateResponse(false)}
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          No, undo my edits
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => handleOccupantUpdateResponse(true)}
        >
          Yes, update count
        </Button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    // If showing occupant update prompt, show that instead of the current step
    if (showOccupantUpdatePrompt) {
      return renderOccupantUpdatePrompt()
    }

    // If we have a next workflow to redirect to, show that
    if (step === 5) {
      return renderNextWorkflowRedirect()
    }

    switch (step) {
      case 0:
        return renderWelcomeStep()
      case 1:
        return renderUserInfoStep()
      case 2:
        return renderRoleConfirmationStep()
      case 3:
        return renderCitizenshipStep()
      case 4:
        return renderGroupMembersStep()
      default:
        return renderWelcomeStep()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Toast container for notifications */}
      <ToastContainer />

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Group Invitation Process</span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-orange-500" />
      </div>

      {renderCurrentStep()}
    </div>
  )
}
