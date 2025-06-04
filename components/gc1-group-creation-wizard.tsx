"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Users, X } from "lucide-react"
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
type UserSubType = "Applicant" | "Non-Applicant" | "Co-Signer" | "Other" | ""
type Relationship = "Parent" | "Spouse/Partner" | "Child" | "Sibling" | "Grandparent" | "Friend" | "Other"
type GroupStatus = "CONFIRMED" | "PENDING" | "NOT YET INVITED" | "DECLINED"

interface GroupMember {
  id: string
  firstName: string
  lastName: string
  type: UserType
  subType: UserSubType
  relationship?: Relationship
  email: string
  phone: string
  isAdmin: boolean
  groupStatus: GroupStatus
  lastInvite?: string
}

interface GC1GroupCreationWizardProps {
  onComplete: (flags: { flag7?: boolean }) => void
  userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export function GC1GroupCreationWizard({ onComplete, userData }: GC1GroupCreationWizardProps) {
  // State
  const [showInitialPrompt, setShowInitialPrompt] = useState(true)
  const [showGroupCreationDialog, setShowGroupCreationDialog] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [groupCreated, setGroupCreated] = useState(false)
  const [currentGroupMembers, setCurrentGroupMembers] = useState<GroupMember[]>([])
  const [addedGroupMembers, setAddedGroupMembers] = useState<GroupMember[]>([])
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [newMember, setNewMember] = useState<Partial<GroupMember>>({
    firstName: "",
    lastName: "",
    type: "Occupant",
    subType: "Applicant",
    relationship: "Other",
    email: "",
    phone: "",
    isAdmin: false,
    groupStatus: "NOT YET INVITED",
  })

  // Flags
  const [flags, setFlags] = useState({
    flag7: false, // Other applicant roles (Co-Signer)
  })

  // Initialize current group with the current user when component mounts
  useEffect(() => {
    if (currentGroupMembers.length === 0 && userData) {
      setCurrentGroupMembers([
        {
          id: "1",
          firstName: userData.firstName || "Brian",
          lastName: userData.lastName || "Plus",
          type: "Occupant",
          subType: "Applicant",
          email: userData.email || "brianp@gmail.com",
          phone: userData.phone || "+1991 424-1242",
          isAdmin: true,
          groupStatus: "CONFIRMED",
        },
      ])
    }
  }, [userData, currentGroupMembers.length])

  // Helper functions
  const updateFlag = (flag: keyof typeof flags, value: boolean) => {
    setFlags((prev) => {
      const updatedFlags = { ...prev, [flag]: value }
      console.log(`Flag ${flag} set to ${value}`, updatedFlags)
      return updatedFlags
    })
  }

  // Check if there are any Co-Signer roles
  const hasCoSignerRoles = () => {
    const hasCoSignerInCurrent = currentGroupMembers.some((member) => member.subType === "Co-Signer")
    const hasCoSignerInAdded = addedGroupMembers.some((member) => member.subType === "Co-Signer")
    return hasCoSignerInCurrent || hasCoSignerInAdded
  }

  // Workflow functions
  const runGI1ForNewUsers = () => {
    console.log("[WORKFLOW] Running GI1 for all new users in the group")

    addedGroupMembers.forEach((member) => {
      if (member.groupStatus === "NOT YET INVITED") {
        console.log(`[WORKFLOW] Running GI1 for user: ${member.firstName} ${member.lastName}`)
      }
    })
  }

  const runGP6 = () => {
    console.log("[WORKFLOW] Running GP6 workflow")
  }

  const runLS1 = () => {
    console.log("[WORKFLOW] Running LS1 workflow - Single occupant, no other applicant roles")
    onComplete(flags)
  }

  const runLS2 = () => {
    console.log("[WORKFLOW] Running LS2 workflow - Multiple applicant roles detected")
    onComplete(flags)
  }

  // Event handlers
  const handleCreateGroupClick = () => {
    setShowInitialPrompt(false)
    setShowGroupCreationDialog(true)
  }

  const handleSkipGroupCreation = () => {
    console.log("User skipped group creation")
    // Since no group created and single occupant, run LS1
    runLS1()
  }

  const handleCreateGroup = () => {
    setIsCreatingGroup(true)

    setTimeout(() => {
      console.log(`Group "${groupName}" created successfully`)
      setGroupCreated(true)
      setIsCreatingGroup(false)
      setShowGroupCreationDialog(false)
      setShowInitialPrompt(false)

      console.log(`[DATABASE UPDATE] Group created: ${groupName}`)
      console.log(`[DATABASE UPDATE] User assigned as Admin`)
    }, 1000)
  }

  const handleAddMemberClick = () => {
    setShowAddMemberDialog(true)
    setNewMember({
      firstName: "",
      lastName: "",
      type: "Occupant",
      subType: "Applicant",
      relationship: "Other",
      email: "",
      phone: "",
      isAdmin: false,
      groupStatus: "NOT YET INVITED",
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
      relationship: newMember.relationship,
      email: newMember.email || "",
      phone: newMember.phone || "",
      isAdmin: newMember.isAdmin || false,
      groupStatus: "NOT YET INVITED",
      lastInvite: new Date().toLocaleDateString(),
    }

    setAddedGroupMembers((prev) => [...prev, member])
    setShowAddMemberDialog(false)
  }

  const handleRemoveMember = (id: string) => {
    setAddedGroupMembers((prev) => prev.filter((member) => member.id !== id))
  }

  const handleMakeAdmin = (id: string) => {
    setAddedGroupMembers((prev) =>
      prev.map((member) => ({
        ...member,
        isAdmin: member.id === id ? !member.isAdmin : member.isAdmin,
      })),
    )
  }

  const handleNext = () => {
    // Run GI1 for all new users
    runGI1ForNewUsers()

    // Run GP6 workflow
    runGP6()

    // Check if there are any Co-Signer roles
    if (hasCoSignerRoles()) {
      updateFlag("flag7", true)
      console.log("[WORKFLOW] Flag7 set to true - Co-Signer roles detected")
      runLS2()
    } else {
      console.log("[WORKFLOW] No Co-Signer roles detected")
      runLS1()
    }
  }

  // Render functions
  const renderInitialPrompt = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 max-w-md w-full mx-4 relative">
        <button
          onClick={handleSkipGroupCreation}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-center">Group Creation</h2>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-800 text-center">
            Moving in with someone? Create a group and invite them to share your rental search experience journey
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCreateGroupClick}>
            <Users className="mr-2 h-4 w-4" />
            Name Your Group
          </Button>

          <Button variant="outline" onClick={handleSkipGroupCreation}>
            Skip
          </Button>
        </div>
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
              Name Your Group
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
            Skip
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
                  <SelectItem value="Applicant">Applicant</SelectItem>
                  <SelectItem value="Non-Applicant">Non-Applicant</SelectItem>
                  <SelectItem value="Co-Signer">Co-Signer</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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

  const renderGroupManagement = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Group Management</h2>
        {groupCreated && (
          <div className="bg-green-50 border-l-4 border-green-500 p-2 text-sm">
            <p className="text-green-700">Group "{groupName}" created successfully!</p>
          </div>
        )}
      </div>

      {/* Current Group Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Current Group</h3>
        <div className="flex justify-center">
          <div className="w-full max-w-3xl overflow-x-auto border rounded-lg">
            <Table className="w-full border-collapse text-sm min-w-[800px]">
              <TableHeader>
                <TableRow className="[&>th]:py-2 [&>th]:px-2">
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sub-Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Group Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentGroupMembers.map((member) => (
                  <TableRow key={member.id} className="[&>td]:py-1.5 [&>td]:px-2">
                    <TableCell className="font-medium">
                      {member.id === "1" && <span className="mr-1">*</span>}
                      {member.firstName}
                    </TableCell>
                    <TableCell>{member.lastName}</TableCell>
                    <TableCell>{member.type}</TableCell>
                    <TableCell>{member.subType}</TableCell>
                    <TableCell className="text-xs">{member.email}</TableCell>
                    <TableCell className="text-xs">{member.phone}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={member.isAdmin} disabled className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <span className="px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        {member.groupStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Added Group Members Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Added Group Members</h3>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl overflow-x-auto border rounded-lg">
            <Table className="w-full border-collapse text-sm min-w-[1000px]">
              <TableHeader>
                <TableRow className="[&>th]:py-2 [&>th]:px-2">
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sub-Type</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Group Status</TableHead>
                  <TableHead>Last Invite</TableHead>
                  <TableHead>Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addedGroupMembers.map((member) => (
                  <TableRow key={member.id} className="[&>td]:py-1.5 [&>td]:px-2">
                    <TableCell className="font-medium">{member.firstName}</TableCell>
                    <TableCell>{member.lastName}</TableCell>
                    <TableCell>{member.type}</TableCell>
                    <TableCell>{member.subType}</TableCell>
                    <TableCell className="text-xs">{member.relationship}</TableCell>
                    <TableCell className="text-xs">{member.email}</TableCell>
                    <TableCell className="text-xs">{member.phone}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={member.isAdmin}
                        onCheckedChange={() => handleMakeAdmin(member.id)}
                        className="h-4 w-4"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                        {member.groupStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{member.lastInvite}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={11}>
                    <Button
                      variant="ghost"
                      className="w-full text-left flex items-center text-gray-500 text-xs py-1"
                      onClick={handleAddMemberClick}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Member
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleNext}>
          Next
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
      {(groupCreated || (!showInitialPrompt && !showGroupCreationDialog)) && renderGroupManagement()}
    </div>
  )
}
