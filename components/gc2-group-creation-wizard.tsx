"use client"

import { useState, useEffect } from "react"
import { Plus, CheckCircle, AlertCircle, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Types
type UserType = "Occupant" | "Non-Occupant" | ""
type UserSubType = "Applicant" | "Non-Applicant" | "Main Applicant/Co-Signer/Guarantor" | "Co-Signer" | "Other" | ""
type Relationship = "Parent" | "Spouse/Partner" | "Child" | "Sibling" | "Other" | "Not Applicable"
type GroupStatus = "Confirmed" | "Pending" | "Not Yet Invited" | "Declined"

interface GroupMember {
  id: string
  firstName: string
  lastName: string
  type: UserType
  subType: UserSubType
  relationship: Relationship
  email: string
  phone: string
  address?: string
  isAdmin: boolean
  groupStatus: GroupStatus
  bonusUser?: boolean
  notApplicable?: boolean
  declineGroupInvites?: boolean
}

interface Flag {
  flag4: boolean // Group name provided
  flag5: boolean // At least one new user added
  flag6: boolean // User created group
  flag7: boolean // User is applicant or co-signer
}

interface GC2GroupCreationWizardProps {
  onComplete?: (data: any) => void
  currentUser: GroupMember
}

export function GC2GroupCreationWizard({ onComplete, currentUser }: GC2GroupCreationWizardProps) {
  // State
  const [step, setStep] = useState(0)
  const [showTellUsLaterDialog, setShowTellUsLaterDialog] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupNameError, setGroupNameError] = useState("")
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [groupCreated, setGroupCreated] = useState(false)
  const [currentGroupMembers, setCurrentGroupMembers] = useState<GroupMember[]>([])
  const [addedGroupMembers, setAddedGroupMembers] = useState<GroupMember[]>([])
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [addingToCurrentGroup, setAddingToCurrentGroup] = useState(true)
  const [isApplicantOrCoSigner, setIsApplicantOrCoSigner] = useState<boolean | null>(null)
  const [flags, setFlags] = useState<Flag>({
    flag4: false, // Group name provided
    flag5: false, // At least one new user added
    flag6: false, // User created group
    flag7: false, // User is applicant or co-signer
  })
  const [newMember, setNewMember] = useState<Partial<GroupMember>>({
    firstName: "",
    lastName: "",
    type: "Non-Occupant",
    subType: "Other",
    relationship: "Other",
    email: "",
    phone: "",
    address: "",
    isAdmin: false,
    groupStatus: "Not Yet Invited",
    bonusUser: false,
    notApplicable: false,
  })
  const [progress, setProgress] = useState(0)
  const [showMemberError, setShowMemberError] = useState(false)

  // Initialize current group with the current user
  useEffect(() => {
    if (currentGroupMembers.length === 0 && currentUser) {
      setCurrentGroupMembers([
        {
          ...currentUser,
          isAdmin: true,
          groupStatus: "Confirmed",
        },
      ])
    }
  }, [currentUser, currentGroupMembers.length])

  // Update progress whenever step changes
  useEffect(() => {
    // Calculate progress based on current step
    // Total steps: Initial prompt (0), Group naming (1), Add members (2), Verification (3), Applicant/Co-Signer check (4)
    const totalSteps = 5
    const progressPercentage = Math.min(Math.round(((step + 1) / totalSteps) * 100), 100)
    setProgress(progressPercentage)
  }, [step])

  // Update flags and check for valid data at each step
  const updateFlag = (flag: keyof Flag, value: boolean) => {
    setFlags((prev) => {
      const updatedFlags = { ...prev, [flag]: value }
      // Log the flag change to console
      console.log(`Flag ${flag} set to ${value}`, updatedFlags)
      return updatedFlags
    })
  }

  // Handle navigation between steps
  const goToNextStep = () => {
    setStep((prev) => prev + 1)
  }

  const goToPreviousStep = () => {
    setStep((prev) => Math.max(0, prev - 1))
  }

  // Step 0: Initial prompt handlers
  const handleNameGroup = () => {
    goToNextStep()
  }

  const handleTellUsLater = () => {
    setShowTellUsLaterDialog(true)
  }

  const closeTellUsLaterDialog = () => {
    setShowTellUsLaterDialog(false)
  }

  // Step 1: Group naming handlers
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      setGroupNameError("Please enter a group name to proceed.")
      return
    }

    setGroupNameError("")
    setIsCreatingGroup(true)

    // Simulate API call
    setTimeout(() => {
      console.log(`Group "${groupName}" created successfully`)
      updateFlag("flag4", true) // Set flag4 (group name provided)
      updateFlag("flag6", true) // Set flag6 (user created group)
      setGroupCreated(true)
      setIsCreatingGroup(false)
      goToNextStep() // Move to add members step

      // Simulate database update
      console.log(`[DATABASE UPDATE] Group created: ${groupName}`)
      console.log(`[DATABASE UPDATE] User assigned as Admin`)
      console.log(`[DATABASE UPDATE] Flag4 set to true`)
      console.log(`[DATABASE UPDATE] Flag6 set to true`)
    }, 1000)
  }

  // Step 2: Add members handlers
  const handleAddMemberClick = (isCurrentGroup: boolean) => {
    setAddingToCurrentGroup(isCurrentGroup)
    setShowAddMemberDialog(true)
    setNewMember({
      firstName: "",
      lastName: "",
      type: "Non-Occupant",
      subType: "Other",
      relationship: "Other",
      email: "",
      phone: "",
      address: "",
      isAdmin: false,
      groupStatus: "Not Yet Invited",
      bonusUser: false,
      notApplicable: false,
    })
  }

  const handleAddMember = () => {
    if (!newMember.firstName || !newMember.email) {
      alert("First name and email are required")
      return
    }

    const member: GroupMember = {
      id: Date.now().toString(),
      firstName: newMember.firstName || "",
      lastName: newMember.lastName || "",
      type: (newMember.type as UserType) || "Non-Occupant",
      subType: (newMember.subType as UserSubType) || "Other",
      relationship: (newMember.relationship as Relationship) || "Other",
      email: newMember.email || "",
      phone: newMember.phone || "",
      address: newMember.address || "",
      isAdmin: newMember.isAdmin || false,
      groupStatus: "Not Yet Invited",
      bonusUser: newMember.bonusUser || false,
      notApplicable: newMember.notApplicable || false,
      declineGroupInvites: Math.random() > 0.7, // Randomly set some members to decline invites (for demo)
    }

    if (addingToCurrentGroup) {
      setCurrentGroupMembers((prev) => [...prev, member])
    } else {
      setAddedGroupMembers((prev) => [...prev, member])
    }

    setShowAddMemberDialog(false)

    // If at least one new member was added, set flag5
    if (!flags.flag5 && (addedGroupMembers.length > 0 || currentGroupMembers.length > 1)) {
      updateFlag("flag5", true)
      console.log("[FLAG5] At least one new user added to the group")
    }
  }

  const handleRemoveMember = (id: string, isCurrentGroup: boolean) => {
    if (isCurrentGroup) {
      // Don't allow removing the first member (admin)
      if (id === currentGroupMembers[0]?.id) return
      setCurrentGroupMembers((prev) => prev.filter((member) => member.id !== id))
    } else {
      setAddedGroupMembers((prev) => prev.filter((member) => member.id !== id))
    }

    // Check if there are still members after removal
    setTimeout(() => {
      const hasAddedMembers = addedGroupMembers.length > 0 || currentGroupMembers.length > 1

      updateFlag("flag5", hasAddedMembers)
      console.log(
        `[FLAG5] ${hasAddedMembers ? "At least one new user added to the group" : "No new users in the group"}`,
      )
    }, 0)
  }

  const handleMakeAdmin = (id: string, isCurrentGroup: boolean) => {
    if (isCurrentGroup) {
      setCurrentGroupMembers((prev) =>
        prev.map((member) => ({
          ...member,
          isAdmin: member.id === id ? !member.isAdmin : member.isAdmin,
        })),
      )
    } else {
      setAddedGroupMembers((prev) =>
        prev.map((member) => ({
          ...member,
          isAdmin: member.id === id ? !member.isAdmin : member.isAdmin,
        })),
      )
    }
  }

  // Step 3: Verify members and proceed
  const handleVerifyMembers = () => {
    // Check if at least one new user has been added
    const hasNewUser = addedGroupMembers.length > 0 || currentGroupMembers.length > 1

    if (!hasNewUser) {
      setShowMemberError(true)
      return
    }

    setShowMemberError(false)

    // Run GI1 for every new user who has been added to the group
    console.log("[WORKFLOW] Running GI1 for all new users in the group")

    // Process current group members (excluding the admin)
    currentGroupMembers.forEach((member, index) => {
      if (index !== 0 && member.groupStatus === "Not Yet Invited") {
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

    // Check if flag6 is set (user created group)
    if (flags.flag6) {
      console.log("[WORKFLOW] Running GP6 workflow")
      // In a real implementation, you would run the GP6 workflow here
    }

    // Move to applicant/co-signer check
    goToNextStep()
  }

  // Step 4: Applicant/Co-Signer check
  const handleApplicantCoSignerCheck = (value: boolean) => {
    setIsApplicantOrCoSigner(value)

    if (value) {
      updateFlag("flag7", true)
      console.log("[FLAG7] User is applicant or co-signer")
    } else {
      updateFlag("flag7", false)
      console.log("[FLAG7] User is NOT applicant or co-signer")
    }
  }

  const handleComplete = () => {
    // Always run LS2 workflow regardless of applicant/co-signer status
    console.log("[WORKFLOW] Running LS2 workflow")

    // Set localStorage values for prequalification2 page
    try {
      localStorage.setItem("startLS2", "true")
      localStorage.setItem("userRoleCode", "GC2")
      console.log("[DEBUG] localStorage set: startLS2=true, userRoleCode=GC2")

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete({
          groupName,
          groupMembers: [...currentGroupMembers, ...addedGroupMembers],
          isApplicantOrCoSigner,
          flags,
        })
      }

      // Navigate to prequalification2 page
      window.location.href = "/prequalification2"
    } catch (error) {
      console.error("[ERROR] Failed to set localStorage for LS2:", error)
    }
  }

  // Render Step 0: Initial prompt
  const renderInitialPrompt = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 max-w-md w-full mx-4 relative">
        <button
          onClick={handleTellUsLater}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-center">Create a Group</h2>

        <p className="text-gray-700 text-center">
          Moving in with someone? Create a group and invite them to share your rental search experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1" onClick={handleNameGroup}>
            Name Your Group
          </Button>

          <Button variant="outline" className="border-black hover:bg-gray-100 flex-1" onClick={handleTellUsLater}>
            Tell us later
          </Button>
        </div>
      </div>
    </div>
  )

  // Render Step 1: Group naming
  const renderGroupNaming = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Name Your Group</h2>

      <div className="space-y-2">
        <Label htmlFor="groupName">Enter Group Name</Label>
        <Input
          id="groupName"
          placeholder="e.g., The Roomies, Smith Family"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className={groupNameError ? "border-red-500" : ""}
        />
        {groupNameError && <p className="text-red-500 text-sm">{groupNameError}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>

        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleCreateGroup}
          disabled={isCreatingGroup}
        >
          {isCreatingGroup ? "Creating..." : "Create Group"}
        </Button>
      </div>
    </div>
  )

  // Render Step 2: Add members
  const renderAddMembers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add Group Members</h2>

        {groupCreated && (
          <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Group "{groupName}" created
          </div>
        )}
      </div>

      {/* Current Group Members Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Current Group</h3>
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse text-sm">
            <TableHeader>
              <TableRow className="[&>th]:py-2 [&>th]:px-2">
                <TableHead className="w-[120px]">Name</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[100px]">Relationship</TableHead>
                <TableHead className="w-[180px]">Email</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[60px]">Admin</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentGroupMembers.map((member, index) => (
                <TableRow key={member.id} className="[&>td]:py-1.5 [&>td]:px-2">
                  <TableCell className="font-medium">
                    {index === 0 && <span className="mr-1">★</span>}
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs">
                      <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                      {member.type}/{member.subType.split("/")[0]}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{member.relationship}</TableCell>
                  <TableCell className="text-xs">{member.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs ${
                        member.groupStatus === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : member.groupStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {member.groupStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={member.isAdmin}
                      disabled={index === 0} // Can't change first member's admin status
                      onCheckedChange={() => handleMakeAdmin(member.id, true)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                  <TableCell>
                    {index !== 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id, true)}
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7}>
                  <Button
                    variant="ghost"
                    className="w-full text-left flex items-center text-gray-500 text-xs py-1"
                    onClick={() => handleAddMemberClick(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Member
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Added Group Members Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Added Group Members</h3>
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse text-sm">
            <TableHeader>
              <TableRow className="[&>th]:py-2 [&>th]:px-2">
                <TableHead className="w-[120px]">Name</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[100px]">Relationship</TableHead>
                <TableHead className="w-[180px]">Email</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[60px]">Admin</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addedGroupMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className={`[&>td]:py-1.5 [&>td]:px-2 ${member.declineGroupInvites ? "bg-orange-50" : ""}`}
                >
                  <TableCell className="font-medium">
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs">
                      <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                      {member.type}/{member.subType.split("/")[0]}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{member.relationship}</TableCell>
                  <TableCell className="text-xs">{member.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs ${
                        member.declineGroupInvites
                          ? "bg-red-100 text-red-800"
                          : member.groupStatus === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : member.groupStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {member.declineGroupInvites ? "Declined" : member.groupStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={member.isAdmin}
                      onCheckedChange={() => handleMakeAdmin(member.id, false)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.id, false)}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7}>
                  <Button
                    variant="ghost"
                    className="w-full text-left flex items-center text-gray-500 text-xs py-1"
                    onClick={() => handleAddMemberClick(false)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Member
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {showMemberError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            At least one new user must be added to the group.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleVerifyMembers}>
          Next
        </Button>
      </div>
    </div>
  )

  // Render Step 3: Verify members
  const renderVerifyMembers = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <h2 className="text-xl font-semibold">Group Members Verified</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-800">
            Your group has been created successfully! We've sent invitations to the new members you added.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">Group Summary</h3>
          <ul className="space-y-1 text-blue-700">
            <li>Total members: {currentGroupMembers.length + addedGroupMembers.length}</li>
            <li>
              Occupants: {[...currentGroupMembers, ...addedGroupMembers].filter((m) => m.type === "Occupant").length}
            </li>
            <li>
              Non-Occupants:{" "}
              {[...currentGroupMembers, ...addedGroupMembers].filter((m) => m.type === "Non-Occupant").length}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={goToNextStep}>
          Next
        </Button>
      </div>
    </div>
  )

  // Render Step 4: Applicant/Co-Signer check
  const renderApplicantCoSignerCheck = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Applicant or Co-Signer Check</h2>

      <div className="space-y-4">
        <p>Are you an Applicant or a Co-Signer?</p>

        <RadioGroup
          value={isApplicantOrCoSigner === null ? "" : isApplicantOrCoSigner ? "yes" : "no"}
          onValueChange={(value) => handleApplicantCoSignerCheck(value === "yes")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="applicant-yes" />
            <Label htmlFor="applicant-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="applicant-no" />
            <Label htmlFor="applicant-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>

        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleComplete}
          disabled={isApplicantOrCoSigner === null}
        >
          Complete
        </Button>
      </div>
    </div>
  )

  // Render the "Tell us later" dialog
  const renderTellUsLaterDialog = () => (
    <Dialog open={showTellUsLaterDialog} onOpenChange={setShowTellUsLaterDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Group Creation Required</DialogTitle>
          <DialogDescription>Group creation is mandatory. Please proceed with naming your group.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={closeTellUsLaterDialog} className="bg-orange-500 hover:bg-orange-600 text-white">
            Continue to Group Creation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Render add member dialog
  const renderAddMemberDialog = () => (
    <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Group Member</DialogTitle>
          <DialogDescription>Add a new member to your rental group.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="text-xs font-medium">
                First Name*
              </label>
              <Input
                id="firstName"
                value={newMember.firstName}
                onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                placeholder="First name"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-xs font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                value={newMember.lastName}
                onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                placeholder="Last name"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="type" className="text-xs font-medium">
                Type
              </label>
              <Select
                value={newMember.type as string}
                onValueChange={(value) => setNewMember({ ...newMember, type: value as UserType })}
              >
                <SelectTrigger id="type" className="h-8 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Occupant">Occupant</SelectItem>
                  <SelectItem value="Non-Occupant">Non-Occupant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="subType" className="text-xs font-medium">
                Sub-Type
              </label>
              <Select
                value={newMember.subType as string}
                onValueChange={(value) => setNewMember({ ...newMember, subType: value as UserSubType })}
              >
                <SelectTrigger id="subType" className="h-8 text-sm">
                  <SelectValue placeholder="Select sub-type" />
                </SelectTrigger>
                <SelectContent>
                  {newMember.type === "Occupant" ? (
                    <>
                      <SelectItem value="Applicant">Applicant</SelectItem>
                      <SelectItem value="Non-Applicant">Non-Applicant</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Co-Signer">Co-Signer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="relationship" className="text-xs font-medium">
              Relationship
            </label>
            <Select
              value={newMember.relationship as string}
              onValueChange={(value) => setNewMember({ ...newMember, relationship: value as Relationship })}
            >
              <SelectTrigger id="relationship" className="h-8 text-sm">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spouse/Partner">Spouse/Partner</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-medium">
              Email*
            </label>
            <Input
              id="email"
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              placeholder="Email address"
              className="h-8 text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="text-xs font-medium">
              Phone
            </label>
            <Input
              id="phone"
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              placeholder="Phone number"
              className="h-8 text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="text-xs font-medium">
              Address
            </label>
            <Input
              id="address"
              value={newMember.address}
              onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
              placeholder="Address"
              className="h-8 text-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="makeAdmin"
              checked={newMember.isAdmin}
              onCheckedChange={(checked) => setNewMember({ ...newMember, isAdmin: checked as boolean })}
              className="h-4 w-4"
            />
            <label htmlFor="makeAdmin" className="text-xs font-medium">
              Make admin
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="bonusUser"
              checked={newMember.bonusUser}
              onCheckedChange={(checked) => setNewMember({ ...newMember, bonusUser: checked as boolean })}
              className="h-4 w-4"
            />
            <label htmlFor="bonusUser" className="text-xs font-medium">
              Bonus User
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notApplicable"
              checked={newMember.notApplicable}
              onCheckedChange={(checked) => setNewMember({ ...newMember, notApplicable: checked as boolean })}
              className="h-4 w-4"
            />
            <label htmlFor="notApplicable" className="text-xs font-medium">
              Not Applicable
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddMemberDialog(false)} size="sm">
            Cancel
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleAddMember}
            disabled={!newMember.firstName || !newMember.email}
            size="sm"
          >
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Main render function
  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return renderInitialPrompt()
      case 1:
        return renderGroupNaming()
      case 2:
        return renderAddMembers()
      case 3:
        return renderVerifyMembers()
      case 4:
        return renderApplicantCoSignerCheck()
      default:
        return renderInitialPrompt()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Group Creation</span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" />
      </div>

      {renderCurrentStep()}
      {renderTellUsLaterDialog()}
      {renderAddMemberDialog()}
    </div>
  )
}
