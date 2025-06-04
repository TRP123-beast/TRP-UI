"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
type Relationship =
  | "Parent"
  | "Spouse/Partner"
  | "Child"
  | "Sibling"
  | "Grandparent"
  | "Friend"
  | "Other"
  | "Not Applicable"
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

interface GC4GroupCreationWizardProps {
  onComplete: (flags: { flag6?: boolean; flag7?: boolean; flag8?: boolean }) => void
  userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export function GC4GroupCreationWizard({ onComplete, userData }: GC4GroupCreationWizardProps) {
  // State
  const [step, setStep] = useState(0)
  const [showInitialPrompt, setShowInitialPrompt] = useState(true)
  const [showGroupCreationDialog, setShowGroupCreationDialog] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [groupCreated, setGroupCreated] = useState(false)
  const [currentGroupMembers, setCurrentGroupMembers] = useState<GroupMember[]>([])
  const [addedGroupMembers, setAddedGroupMembers] = useState<GroupMember[]>([])
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [addingToCurrentGroup, setAddingToCurrentGroup] = useState(true)
  const [newMember, setNewMember] = useState<Partial<GroupMember>>({
    firstName: "",
    lastName: "",
    type: "Occupant",
    subType: "Applicant",
    relationship: "Other",
    email: "",
    phone: "",
    address: "",
    isAdmin: false,
    groupStatus: "Not Yet Invited",
    bonusUser: false,
    notApplicable: false,
  })

  // Flags
  const [flags, setFlags] = useState({
    flag6: false, // Group created flag
    flag7: false, // Other applicant roles
    flag8: false, // No group created
  })

  // Initialize current group with the current user when component mounts
  useEffect(() => {
    if (currentGroupMembers.length === 0 && userData) {
      setCurrentGroupMembers([
        {
          id: "1",
          firstName: userData.firstName || "Current",
          lastName: userData.lastName || "User",
          type: "Non-Occupant",
          subType: "Main Applicant/Co-Signer/Guarantor",
          relationship: "Not Applicable",
          email: userData.email || "user@example.com",
          phone: userData.phone || "",
          isAdmin: true,
          groupStatus: "Confirmed",
        },
      ])
    }
  }, [userData, currentGroupMembers.length])

  // Helper functions
  const updateFlag = (flag: keyof typeof flags, value: boolean) => {
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

  // Check if there are any applicant roles
  const hasApplicantRoles = () => {
    const hasApplicantInCurrent = currentGroupMembers.some(
      (member) =>
        (member.type === "Occupant" && member.subType === "Applicant") ||
        (member.type === "Non-Occupant" &&
          (member.subType === "Main Applicant/Co-Signer/Guarantor" || member.subType === "Co-Signer")),
    )

    const hasApplicantInAdded = addedGroupMembers.some(
      (member) =>
        (member.type === "Occupant" && member.subType === "Applicant") ||
        (member.type === "Non-Occupant" &&
          (member.subType === "Main Applicant/Co-Signer/Guarantor" || member.subType === "Co-Signer")),
    )

    return hasApplicantInCurrent || hasApplicantInAdded
  }

  // Workflow functions
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

  const runGP6 = () => {
    console.log("[WORKFLOW] Running GP6 workflow")
    // In a real implementation, this would trigger specific business logic
  }

  const runCSG1 = () => {
    console.log("[WORKFLOW] Running CSG1 workflow")
    // In a real implementation, this would trigger specific business logic

    // Complete the wizard and pass flags back to parent
    onComplete(flags)
  }

  const runCSG2 = () => {
    console.log("[WORKFLOW] Running CSG2 workflow")
    // In a real implementation, this would trigger specific business logic

    // Complete the wizard and pass flags back to parent
    onComplete(flags)
  }

  // Event handlers
  const handleNameYourGroup = () => {
    setShowInitialPrompt(false)
    setShowGroupCreationDialog(true)
  }

  const handleSkipGroupCreation = () => {
    // Set flag8 (no group created)
    updateFlag("flag8", true)
    console.log("User skipped group creation")

    // Determine which workflow to run based on occupant count
    const occupantCount = countOccupantsInGroup()

    if (occupantCount <= 1) {
      runCSG1()
    } else {
      runCSG2()
    }
  }

  const handleCreateGroup = () => {
    setIsCreatingGroup(true)

    // Simulate API call
    setTimeout(() => {
      console.log(`Group "${groupName}" created successfully`)
      updateFlag("flag6", true) // Set flag6 (group created)
      updateFlag("flag8", false) // Clear flag8 (no group created)
      setGroupCreated(true)
      setIsCreatingGroup(false)
      setShowGroupCreationDialog(false)
      setStep(1) // Move to member management step

      // Simulate database update
      console.log(`[DATABASE UPDATE] Group created: ${groupName}`)
      console.log(`[DATABASE UPDATE] User assigned as Admin`)
      console.log(`[DATABASE UPDATE] Flag6 set to true`)
    }, 1000)
  }

  const handleAddMemberClick = (isCurrentGroup: boolean) => {
    setAddingToCurrentGroup(isCurrentGroup)
    setShowAddMemberDialog(true)
    setNewMember({
      firstName: "",
      lastName: "",
      type: "Occupant",
      subType: "Applicant",
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
      type: (newMember.type as UserType) || "Occupant",
      subType: (newMember.subType as UserSubType) || "Applicant",
      relationship: (newMember.relationship as Relationship) || "Other",
      email: newMember.email || "",
      phone: newMember.phone || "",
      address: newMember.address || "",
      isAdmin: newMember.isAdmin || false,
      groupStatus: "Not Yet Invited",
      bonusUser: newMember.bonusUser || false,
      notApplicable: newMember.notApplicable || false,
      declineGroupInvites: Math.random() > 0.9, // Randomly set some members to decline invites (for demo)
    }

    if (addingToCurrentGroup) {
      setCurrentGroupMembers((prev) => [...prev, member])
    } else {
      setAddedGroupMembers((prev) => [...prev, member])
    }

    setShowAddMemberDialog(false)
  }

  const handleRemoveMember = (id: string, isCurrentGroup: boolean) => {
    if (isCurrentGroup) {
      // Don't allow removing the first member (admin)
      if (id === "1") return
      setCurrentGroupMembers((prev) => prev.filter((member) => member.id !== id))
    } else {
      setAddedGroupMembers((prev) => prev.filter((member) => member.id !== id))
    }
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

  const handleComplete = () => {
    // Run GI1 for all new users
    runGI1ForNewUsers()

    // Run GP6 workflow
    runGP6()

    // Determine which workflow to run based on occupant count
    const occupantCount = countOccupantsInGroup()

    if (occupantCount <= 1) {
      if (flags.flag6) {
        // Group created
        runCSG1()
      } else {
        // No group created
        updateFlag("flag8", true)
        runCSG1()
      }
    } else {
      if (flags.flag6) {
        // Group created
        // Check if there are any applicant roles
        if (hasApplicantRoles()) {
          updateFlag("flag7", true)
          console.log("[WORKFLOW] Flag7 set to true - Applicant roles detected")
        }
        runCSG2()
      } else {
        // No group created
        updateFlag("flag8", true)
        runCSG2()
      }
    }
  }

  // Render functions
  const renderInitialPrompt = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-center">Group Creation</h2>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-800 mb-4">
          As a Non-Occupant, you have indicated that you intend to be a Main Applicant/Co-Signer/Guarantor.
        </p>
        <p className="text-gray-800">
          Want to share your rental property search experience with others? Create a group and invite them to your
          journey.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNameYourGroup}>
          <Users className="mr-2 h-4 w-4" />
          Name Your Group
        </Button>

        <Button variant="outline" onClick={handleSkipGroupCreation}>
          I'll do this later
        </Button>
      </div>
    </div>
  )

  const renderGroupCreationDialog = () => (
    <Dialog open={showGroupCreationDialog} onOpenChange={setShowGroupCreationDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a Group</DialogTitle>
          <DialogDescription>
            Create a group and invite others to share your rental search experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="groupName" className="text-sm font-medium">
              Enter Group Name
            </label>
            <Input
              id="groupName"
              placeholder="Enter a name for your group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleSkipGroupCreation}>
            I'll do this later
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || isCreatingGroup}
          >
            {isCreatingGroup ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

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
                      <SelectItem value="Main Applicant/Co-Signer/Guarantor">
                        Main Applicant/Co-Signer/Guarantor
                      </SelectItem>
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
                <SelectItem value="Grandparent">Grandparent</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
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

  const renderGroupMembersTable = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Group Management</h2>
        {groupCreated && (
          <div className="bg-green-50 border-l-4 border-green-500 p-2 text-sm">
            <p className="text-green-700">Group "{groupName}" created successfully!</p>
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
                <TableHead className="w-[60px]">Bonus User</TableHead>
                <TableHead className="w-[60px]">Not Applicable</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentGroupMembers.map((member) => (
                <TableRow key={member.id} className="[&>td]:py-1.5 [&>td]:px-2">
                  <TableCell className="font-medium">
                    {member.id === "1" && <span className="mr-1">★</span>}
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
                      disabled={member.id === "1"}
                      onCheckedChange={() => handleMakeAdmin(member.id, true)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={member.bonusUser || false} disabled={member.id === "1"} className="h-4 w-4" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={member.notApplicable || false}
                      disabled={member.id === "1"}
                      className="h-4 w-4"
                    />
                  </TableCell>
                  <TableCell>
                    {member.id !== "1" && (
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
                <TableCell colSpan={9}>
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
        <h3 className="text-lg font-semibold mb-2">Added Members</h3>
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
                <TableHead className="w-[60px]">Bonus User</TableHead>
                <TableHead className="w-[60px]">Not Applicable</TableHead>
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
                  <TableCell className="text-center">
                    <Checkbox checked={member.bonusUser || false} className="h-4 w-4" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={member.notApplicable || false} className="h-4 w-4" />
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
                <TableCell colSpan={9}>
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

      <div className="flex justify-end mt-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleComplete}>
          Continue
        </Button>
      </div>
    </div>
  )

  // Main render
  return (
    <div className="space-y-6">
      {showInitialPrompt && renderInitialPrompt()}
      {showGroupCreationDialog && renderGroupCreationDialog()}
      {showAddMemberDialog && renderAddMemberDialog()}
      {step === 1 && renderGroupMembersTable()}
    </div>
  )
}
