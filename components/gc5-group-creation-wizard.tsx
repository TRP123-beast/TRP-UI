"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Types
type UserType = "Occupant" | "Non-Occupant"
type UserSubType = "Applicant" | "Non-Applicant" | "Main Applicant/Co-Signer/Guarantor" | "Co-Signer" | "Other"
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
  isAdmin: boolean
  groupStatus: GroupStatus
  declineGroupInvites?: boolean
}

export function GC5GroupCreationWizard() {
  // State
  const [step, setStep] = useState(0)
  const [showGroupNameDialog, setShowGroupNameDialog] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [groupCreated, setGroupCreated] = useState(false)
  const [showNoLeaseholderDialog, setShowNoLeaseholderDialog] = useState(false)
  const [hasLeaseholderRole, setHasLeaseholderRole] = useState<boolean | null>(null)

  // Group member management states
  const [currentGroupMembers, setCurrentGroupMembers] = useState<GroupMember[]>([
    {
      id: "1",
      firstName: "Brian",
      lastName: "Phan",
      type: "Non-Occupant",
      subType: "Other",
      relationship: "Not Applicable",
      email: "brian@gmail.com",
      phone: "+1 (905) 626-2363",
      isAdmin: true,
      groupStatus: "Confirmed",
    },
  ])
  const [addedGroupMembers, setAddedGroupMembers] = useState<GroupMember[]>([])
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [addingToCurrentGroup, setAddingToCurrentGroup] = useState(true)
  const [newMember, setNewMember] = useState<Partial<GroupMember>>({
    firstName: "",
    lastName: "",
    type: "Occupant",
    subType: "Non-Applicant",
    relationship: "Other",
    email: "",
    phone: "",
    isAdmin: false,
    groupStatus: "Not Yet Invited",
  })

  // Effect to check for leaseholder roles when members change
  useEffect(() => {
    if (groupCreated) {
      checkForLeaseholderRoles()
    }
  }, [currentGroupMembers, addedGroupMembers, groupCreated])

  // Check if there are any leaseholder roles in the group
  const checkForLeaseholderRoles = () => {
    const hasLeaseholder = [...currentGroupMembers, ...addedGroupMembers].some(
      (member) =>
        (member.type === "Occupant" && member.subType === "Applicant") ||
        (member.type === "Non-Occupant" && member.subType === "Main Applicant/Co-Signer/Guarantor") ||
        (member.type === "Non-Occupant" && member.subType === "Co-Signer"),
    )

    setHasLeaseholderRole(hasLeaseholder)

    // If we previously had no leaseholder and now we do, close the dialog
    if (hasLeaseholder && showNoLeaseholderDialog) {
      setShowNoLeaseholderDialog(false)
    }

    return hasLeaseholder
  }

  // Count occupants in the group
  const countOccupantsInGroup = () => {
    const occupantsInCurrentGroup = currentGroupMembers.filter((member) => member.type === "Occupant").length
    const occupantsInAddedGroup = addedGroupMembers.filter((member) => member.type === "Occupant").length
    return occupantsInCurrentGroup + occupantsInAddedGroup
  }

  // Handle starting the group creation process
  const handleNameYourGroup = () => {
    setShowGroupNameDialog(true)
  }

  // Handle creating the group
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      return
    }

    setIsCreatingGroup(true)

    // Simulate API call
    setTimeout(() => {
      console.log(`Group "${groupName}" created successfully`)
      console.log(`[FLAG 6] Group created flag set to true`)
      setGroupCreated(true)
      setIsCreatingGroup(false)
      setShowGroupNameDialog(false)
      setStep(1)

      // Run GI1 for the current user
      console.log(
        `[WORKFLOW] Running GI1 for user: ${currentGroupMembers[0].firstName} ${currentGroupMembers[0].lastName}`,
      )
    }, 1000)
  }

  // Group member management handlers
  const handleAddMemberClick = (isCurrentGroup: boolean) => {
    setAddingToCurrentGroup(isCurrentGroup)
    setShowAddMemberDialog(true)
    setNewMember({
      firstName: "",
      lastName: "",
      type: "Occupant",
      subType: "Non-Applicant",
      relationship: "Other",
      email: "",
      phone: "",
      isAdmin: false,
      groupStatus: "Not Yet Invited",
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
      subType: (newMember.subType as UserSubType) || "Non-Applicant",
      relationship: (newMember.relationship as Relationship) || "Other",
      email: newMember.email || "",
      phone: newMember.phone || "",
      isAdmin: newMember.isAdmin || false,
      groupStatus: "Not Yet Invited",
      declineGroupInvites: Math.random() > 0.7, // Randomly set some members to decline invites (for demo)
    }

    if (addingToCurrentGroup) {
      setCurrentGroupMembers((prev) => [...prev, member])
    } else {
      setAddedGroupMembers((prev) => [...prev, member])
    }

    // Run GI1 workflow for new user
    console.log(`[WORKFLOW] Running GI1 for new user: ${member.firstName} ${member.lastName}`)

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

  // Handle next button click
  const handleNext = () => {
    // Check if there are any leaseholder roles
    const hasLeaseholder = checkForLeaseholderRoles()

    if (!hasLeaseholder) {
      // Show dialog if no leaseholder roles
      setShowNoLeaseholderDialog(true)
      return
    }

    // Determine which workflow to run based on occupant count
    const occupantCount = countOccupantsInGroup()

    if (occupantCount === 1) {
      console.log("[WORKFLOW] Running OTH1 workflow (occupant count = 1)")
      window.location.href = "/prequalification-oth1"
    } else {
      console.log("[WORKFLOW] Running OTH2 workflow (occupant count > 1)")
      window.location.href = "/prequalification-oth2"
    }
  }

  // Handle "I will add" button click
  const handleIWillAdd = () => {
    setShowNoLeaseholderDialog(false)
    // Focus on the add member button or open the add member dialog
    handleAddMemberClick(true)
  }

  // Handle "Someone else" button click
  const handleSomeoneElse = () => {
    setShowNoLeaseholderDialog(false)

    // Determine which workflow to run based on occupant count
    const occupantCount = countOccupantsInGroup()

    if (occupantCount === 1) {
      console.log("[WORKFLOW] Running OTH1 workflow (occupant count = 1)")
      window.location.href = "/prequalification-oth1"
    } else {
      console.log("[WORKFLOW] Running OTH2 workflow (occupant count > 1)")
      window.location.href = "/prequalification-oth2"
    }
  }

  // Render the initial prompt
  const renderInitialPrompt = () => (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Group Creation</h2>
        <p className="text-gray-700 mb-6">
          As a Non-Occupant, you have indicated that you do not intend to be a Leaseholder. Please create a group and
          invite your people to share your rental search experience/journey.
        </p>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
          onClick={handleNameYourGroup}
        >
          <Users className="mr-2 h-5 w-5" />
          Name Your Group
        </Button>
      </div>
    </div>
  )

  // Render the group members tables
  const renderGroupMembersTables = () => (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Group: {groupName}</h2>
        <p className="text-gray-700">
          Add members to your group and specify their roles. At least one member must be a Leaseholder (Applicant, Main
          Applicant, or Co-Signer).
        </p>
      </div>

      <div className="space-y-8">
        {/* Current Group Members Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Current Group</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Relationship</TableHead>
                  <TableHead className="w-[180px]">Email</TableHead>
                  <TableHead className="w-[120px]">Phone</TableHead>
                  <TableHead className="w-[80px]">Admin</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentGroupMembers.map((member) => (
                  <TableRow key={member.id} className="border-t border-gray-200">
                    <TableCell className="font-medium">
                      {member.id === "1" && <span className="mr-1">★</span>}
                      {member.firstName} {member.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{member.type}</div>
                        <div className="text-gray-500">{member.subType}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.relationship}</TableCell>
                    <TableCell className="text-sm">{member.email}</TableCell>
                    <TableCell className="text-sm">{member.phone}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={member.isAdmin}
                        disabled={member.id === "1"}
                        onCheckedChange={() => handleMakeAdmin(member.id, true)}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
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
                    <TableCell>
                      {member.id !== "1" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id, true)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={8}>
                    <Button
                      variant="ghost"
                      className="w-full text-left flex items-center text-gray-500 py-2"
                      onClick={() => handleAddMemberClick(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Member
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Added Group Members Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Added Members</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Relationship</TableHead>
                  <TableHead className="w-[180px]">Email</TableHead>
                  <TableHead className="w-[120px]">Phone</TableHead>
                  <TableHead className="w-[80px]">Admin</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addedGroupMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    className={`border-t border-gray-200 ${member.declineGroupInvites ? "bg-orange-50" : ""}`}
                  >
                    <TableCell className="font-medium">
                      {member.firstName} {member.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{member.type}</div>
                        <div className="text-gray-500">{member.subType}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.relationship}</TableCell>
                    <TableCell className="text-sm">{member.email}</TableCell>
                    <TableCell className="text-sm">{member.phone}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={member.isAdmin} onCheckedChange={() => handleMakeAdmin(member.id, false)} />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id, false)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={8}>
                    <Button
                      variant="ghost"
                      className="w-full text-left flex items-center text-gray-500 py-2"
                      onClick={() => handleAddMemberClick(false)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Member
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )

  // Render the group name dialog
  const renderGroupNameDialog = () => (
    <Dialog open={showGroupNameDialog} onOpenChange={setShowGroupNameDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Name Your Group</DialogTitle>
          <DialogDescription>
            Give your rental search group a name. This will help you and your members identify the group.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowGroupNameDialog(false)}>
            Cancel
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

  // Render the add member dialog
  const renderAddMemberDialog = () => (
    <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Group Member</DialogTitle>
          <DialogDescription>Add a new member to your rental group.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium mb-1 block">
                First Name*
              </label>
              <Input
                id="firstName"
                value={newMember.firstName}
                onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm font-medium mb-1 block">
                Last Name
              </label>
              <Input
                id="lastName"
                value={newMember.lastName}
                onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="text-sm font-medium mb-1 block">
                Type
              </label>
              <Select
                value={newMember.type}
                onValueChange={(value) => setNewMember({ ...newMember, type: value as UserType })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Occupant">Occupant</SelectItem>
                  <SelectItem value="Non-Occupant">Non-Occupant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="subType" className="text-sm font-medium mb-1 block">
                Sub-Type
              </label>
              <Select
                value={newMember.subType}
                onValueChange={(value) => setNewMember({ ...newMember, subType: value as UserSubType })}
              >
                <SelectTrigger id="subType">
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
            <label htmlFor="relationship" className="text-sm font-medium mb-1 block">
              Relationship
            </label>
            <Select
              value={newMember.relationship}
              onValueChange={(value) => setNewMember({ ...newMember, relationship: value as Relationship })}
            >
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spouse/Partner">Spouse/Partner</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium mb-1 block">
              Email*
            </label>
            <Input
              id="email"
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              placeholder="Email address"
            />
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-medium mb-1 block">
              Phone
            </label>
            <Input
              id="phone"
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="makeAdmin"
              checked={newMember.isAdmin}
              onCheckedChange={(checked) => setNewMember({ ...newMember, isAdmin: checked as boolean })}
            />
            <label htmlFor="makeAdmin" className="text-sm">
              Make admin
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
            Cancel
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleAddMember}
            disabled={!newMember.firstName || !newMember.email}
          >
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Render the no leaseholder dialog
  const renderNoLeaseholderDialog = () => (
    <Dialog open={showNoLeaseholderDialog} onOpenChange={setShowNoLeaseholderDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leaseholder Required</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <Alert variant="warning" className="mb-3">
            <AlertDescription className="text-sm">
              Group requires at least one person who will be signing the Lease (Applicant or Main Applicant/Co-Signer).
            </AlertDescription>
          </Alert>

          <div className="space-y-2 mt-3">
            <Button
              className="w-full text-sm bg-orange-500 hover:bg-orange-600 text-white py-1"
              onClick={handleIWillAdd}
            >
              I will add an Applicant/Co-Signer
            </Button>

            <Button className="w-full text-sm bg-black hover:bg-gray-800 text-white py-1" onClick={handleSomeoneElse}>
              Someone else will add an Applicant/Co-Signer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {step === 0 && renderInitialPrompt()}
      {step === 1 && renderGroupMembersTables()}

      {/* Dialogs */}
      {renderGroupNameDialog()}
      {renderAddMemberDialog()}
      {renderNoLeaseholderDialog()}
    </div>
  )
}
