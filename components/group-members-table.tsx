"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Types
type UserType = "Occupant" | "Non-Occupant" | ""
type UserSubType = "Applicant" | "Non-Applicant" | "Main Applicant/Co-Signer/Guarantor" | "Other" | ""
type Relationship = "Parent" | "Spouse/Partner" | "Child" | "Sibling" | "Grandparent" | "Friend" | "Other"

interface GroupMember {
  id: string
  firstName: string
  lastName: string
  type: UserType
  subType: UserSubType
  relationship?: string
  email: string
  phone?: string
  status: "active" | "pending" | "invited"
  isAdmin: boolean
  isRepresented?: boolean
}

interface GroupMembersTableProps {
  members: GroupMember[]
  userType: UserType
  userSubType: UserSubType
  onUpdateMember: (id: string, updates: Partial<GroupMember>) => void
  onRemoveMember: (id: string) => void
  onAddMember: (member: Omit<GroupMember, "id" | "status">) => void
  isAdmin: boolean
}

export function GroupMembersTable({
  members,
  userType,
  userSubType,
  onUpdateMember,
  onRemoveMember,
  onAddMember,
  isAdmin,
}: GroupMembersTableProps) {
  // State for new member form
  const [newMember, setNewMember] = useState<Partial<Omit<GroupMember, "id" | "status">>>({
    firstName: "",
    lastName: "",
    type: "Occupant",
    subType: "Applicant",
    relationship: "",
    email: "",
    phone: "",
    isAdmin: false,
  })

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newMember.firstName?.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!newMember.type) {
      newErrors.type = "Type is required"
    }

    if (!newMember.subType) {
      newErrors.subType = "Sub-type is required"
    }

    if (!newMember.relationship?.trim()) {
      newErrors.relationship = "Relationship is required"
    }

    if (!newMember.email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(newMember.email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddMember = () => {
    if (validateForm()) {
      onAddMember(newMember as Omit<GroupMember, "id" | "status">)
      // Reset form
      setNewMember({
        firstName: "",
        lastName: "",
        type: "Occupant",
        subType: "Applicant",
        relationship: "",
        email: "",
        phone: "",
        isAdmin: false,
      })
      setErrors({})
    }
  }

  const handleInputChange = (field: keyof Omit<GroupMember, "id" | "status">, value: any) => {
    setNewMember((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin</TableHead>
              {userType === "Non-Occupant" && userSubType === "Main Applicant/Co-Signer/Guarantor" && (
                <TableHead>I Represent</TableHead>
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  {member.firstName} {member.lastName}
                </TableCell>
                <TableCell>
                  {member.type} - {member.subType}
                </TableCell>
                <TableCell>{member.relationship || "-"}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      member.status === "active"
                        ? "bg-green-100 text-green-800"
                        : member.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={member.isAdmin}
                    disabled={
                      !isAdmin || // Only admins can change admin status
                      member.id === "1" || // Can't change inviter's admin status
                      (member.subType !== "Applicant" && member.subType !== "Main Applicant/Co-Signer/Guarantor")
                    }
                    onCheckedChange={(checked) => onUpdateMember(member.id, { isAdmin: checked as boolean })}
                  />
                </TableCell>
                {userType === "Non-Occupant" && userSubType === "Main Applicant/Co-Signer/Guarantor" && (
                  <TableCell>
                    {member.type === "Occupant" ? (
                      <Checkbox
                        checked={member.isRepresented || false}
                        onCheckedChange={(checked) => onUpdateMember(member.id, { isRepresented: checked as boolean })}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                )}
                <TableCell>
                  {member.id !== "1" &&
                    member.id !== "2" && // Can't remove inviter or self
                    isAdmin && ( // Only admins can remove members
                      <Button variant="ghost" size="icon" onClick={() => onRemoveMember(member.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="First name *"
              value={newMember.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <Input
            placeholder="Last name"
            value={newMember.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />

          <div>
            <Select
              value={newMember.type as string}
              onValueChange={(value) => handleInputChange("type", value as UserType)}
            >
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Type *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Occupant">Occupant</SelectItem>
                <SelectItem value="Non-Occupant">Non-Occupant</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          <div>
            <Select
              value={newMember.subType as string}
              onValueChange={(value) => handleInputChange("subType", value as UserSubType)}
            >
              <SelectTrigger className={errors.subType ? "border-red-500" : ""}>
                <SelectValue placeholder="Sub-type *" />
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
            {errors.subType && <p className="text-red-500 text-xs mt-1">{errors.subType}</p>}
          </div>

          <div>
            <Select
              value={newMember.relationship as string}
              onValueChange={(value) => handleInputChange("relationship", value)}
            >
              <SelectTrigger className={errors.relationship ? "border-red-500" : ""}>
                <SelectValue placeholder="Relationship *" />
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
            {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
          </div>

          <div>
            <Input
              placeholder="Email *"
              type="email"
              value={newMember.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <Input
            placeholder="Phone number"
            value={newMember.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="makeAdmin"
              checked={newMember.isAdmin}
              onCheckedChange={(checked) => handleInputChange("isAdmin", checked as boolean)}
              disabled={
                !isAdmin || // Only admins can make others admin
                (newMember.subType !== "Applicant" && newMember.subType !== "Main Applicant/Co-Signer/Guarantor")
              }
            />
            <label htmlFor="makeAdmin" className="text-sm font-medium">
              Make admin
            </label>
          </div>
        </div>
        <Button
          onClick={handleAddMember}
          className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
          disabled={!isAdmin} // Only admins can add members
        >
          <Plus className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </div>
    </div>
  )
}
