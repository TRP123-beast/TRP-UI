"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

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

interface GroupMemberManagementProps {
  currentUser: GroupMember
  onAddMember: (member: Omit<GroupMember, "id">) => void
  onRemoveMember: (id: string) => void
  onMakeAdmin: (id: string) => void
  groupMembers: GroupMember[]
}

export function GroupMemberManagement({
  currentUser,
  onAddMember,
  onRemoveMember,
  onMakeAdmin,
  groupMembers,
}: GroupMemberManagementProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState<Omit<GroupMember, "id">>({
    firstName: "",
    lastName: "",
    type: "Non-Occupant",
    subType: "Other",
    relationship: "Other",
    email: "",
    phone: "",
    admin: false,
    makeAdmin: false,
    groupStatus: "Not Yet Invited",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewMember((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewMember((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMember = () => {
    onAddMember(newMember)
    setIsAddMemberOpen(false)
    setNewMember({
      firstName: "",
      lastName: "",
      type: "Non-Occupant",
      subType: "Other",
      relationship: "Other",
      email: "",
      phone: "",
      admin: false,
      makeAdmin: false,
      groupStatus: "Not Yet Invited",
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <div className="bg-gray-50 p-2 font-semibold">Current Group</div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">First Name</th>
              <th className="p-2 text-left">Last Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Sub-Type</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Admin</th>
              <th className="p-2 text-left">Group Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">
                <span className="flex items-center">
                  <span className="mr-2">★</span>
                  {currentUser.firstName}
                </span>
              </td>
              <td className="p-2">{currentUser.lastName}</td>
              <td className="p-2">
                <span className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-black"></span>
                  {currentUser.type}
                </span>
              </td>
              <td className="p-2">
                <span className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-black"></span>
                  {currentUser.subType}
                </span>
              </td>
              <td className="p-2">{currentUser.email}</td>
              <td className="p-2">{currentUser.phone}</td>
              <td className="p-2">
                {currentUser.admin && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300">
                    ✓
                  </span>
                )}
              </td>
              <td className="p-2">{currentUser.groupStatus}</td>
            </tr>
            <tr>
              <td colSpan={8} className="p-2">
                <Button
                  variant="ghost"
                  className="text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => setIsAddMemberOpen(true)}
                >
                  + Add Member
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {groupMembers.length > 0 && (
        <div className="rounded-md border">
          <div className="bg-gray-50 p-2 font-semibold">Added Group Members</div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">First Name</th>
                <th className="p-2 text-left">Last Name</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Sub-Type</th>
                <th className="p-2 text-left">Relationship</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Admin</th>
                <th className="p-2 text-left">Group Status</th>
                <th className="p-2 text-left">Remove User</th>
              </tr>
            </thead>
            <tbody>
              {groupMembers.map((member) => (
                <tr key={member.id} className={member.groupStatus === "Declined" ? "bg-orange-100" : ""}>
                  <td className="p-2">{member.firstName}</td>
                  <td className="p-2">{member.lastName}</td>
                  <td className="p-2">
                    <span className="flex items-center">
                      <span className="mr-2 h-2 w-2 rounded-full bg-black"></span>
                      {member.type}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className="flex items-center">
                      <span className="mr-2 h-2 w-2 rounded-full bg-black"></span>
                      {member.subType}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className="flex items-center">
                      <span className="mr-2 h-2 w-2 rounded-full bg-black"></span>
                      {member.relationship}
                    </span>
                  </td>
                  <td className="p-2">{member.email}</td>
                  <td className="p-2">{member.phone}</td>
                  <td className="p-2">
                    {member.admin ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300">
                        ✓
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMakeAdmin(member.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Make Admin
                      </Button>
                    )}
                  </td>
                  <td className="p-2">{member.groupStatus}</td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMember(member.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={10} className="p-2">
                  <Button
                    variant="ghost"
                    className="text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                    onClick={() => setIsAddMemberOpen(true)}
                  >
                    + Add Member
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center">
        <Button className="bg-orange-500 hover:bg-orange-600">Next</Button>
      </div>

      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Group Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={newMember.firstName} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={newMember.lastName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newMember.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Occupant">Occupant</SelectItem>
                    <SelectItem value="Non-Occupant">Non-Occupant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subType">Sub-Type</Label>
                <Select value={newMember.subType} onValueChange={(value) => handleSelectChange("subType", value)}>
                  <SelectTrigger>
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
              <Label htmlFor="relationship">Relationship</Label>
              <Select
                value={newMember.relationship}
                onValueChange={(value) => handleSelectChange("relationship", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse/Partner">Spouse/Partner</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={newMember.email} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={newMember.phone} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="makeAdmin"
                checked={newMember.makeAdmin}
                onChange={(e) => handleSelectChange("makeAdmin", e.target.checked.toString())}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="makeAdmin">Make Admin</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} className="bg-orange-500 hover:bg-orange-600">
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
