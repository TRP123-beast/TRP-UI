"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useMobile } from "@/hooks/use-mobile"

// Mock data that would come from URL params or API
const mockInvitationData = {
  groupName: "Downtown Roommates",
  inviterName: "John Doe",
  memberDetails: {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    phone: "(416) 555-0456",
    type: "Occupant",
    subType: "Applicant",
    relationship: "Roommate",
    isAdmin: false,
  },
}

export default function GroupInvitationAcceptancePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMobile } = useMobile()
  const [showDetailsModal, setShowDetailsModal] = useState(true)
  const [memberDetails, setMemberDetails] = useState(mockInvitationData.memberDetails)

  // Get group name from URL params
  const groupName = searchParams.get("groupName") || mockInvitationData.groupName

  const handleAccept = () => {
    // Store acceptance data
    localStorage.setItem(
      "groupInvitationAccepted",
      JSON.stringify({
        groupName,
        memberDetails,
        acceptedAt: new Date().toISOString(),
        role: "GI1-LS4-Leaseholder",
        isOccupant: true,
        hasCompletedPrequalification: true,
      }),
    )

    // Navigate to lease success package
    router.push("/lease-success-package?invited=true&groupName=" + encodeURIComponent(groupName))
  }

  const handleDecline = () => {
    // Store decline data
    localStorage.setItem(
      "groupInvitationDeclined",
      JSON.stringify({
        groupName,
        declinedAt: new Date().toISOString(),
      }),
    )

    // Show confirmation and redirect
    // @ts-ignore - Using global toast function
    window.addToast?.(`You have declined the invitation to join ${groupName}.`, "info")
    router.push("/")
  }

  const updateMemberDetails = (field: string, value: any) => {
    setMemberDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <DashboardLayout hideTopBar={true}>
      <div className="min-h-screen pt-6 pb-20 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Mobile header with back button */}
          {isMobile && (
            <div className="flex items-center mb-6">
              <button
                className="p-2 rounded-full hover:bg-gray-100 mr-2"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">Group Invitation</h1>
            </div>
          )}

          {/* Invitation Details Modal */}
          {showDetailsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">You're invited to become a leaseholder in {groupName}!</h2>
                  <p className="text-gray-600 text-sm">
                    By accepting, you agree to be liable for the rental property requirements, including rent and
                    deposit obligations. Please confirm your details below. Click 'Accept' to join or 'Decline' to opt
                    out.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <Input
                        value={memberDetails.firstName}
                        onChange={(e) => updateMemberDetails("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <Input
                        value={memberDetails.lastName}
                        onChange={(e) => updateMemberDetails("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={memberDetails.email}
                        onChange={(e) => updateMemberDetails("email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone *</label>
                      <Input
                        type="tel"
                        value={memberDetails.phone}
                        onChange={(e) => updateMemberDetails("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={memberDetails.type}
                        onChange={(e) => updateMemberDetails("type", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="Occupant">Occupant</option>
                        <option value="Non-Occupant">Non-Occupant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Sub-type</label>
                      <select
                        value={memberDetails.subType}
                        onChange={(e) => updateMemberDetails("subType", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {memberDetails.type === "Occupant" ? (
                          <>
                            <option value="Applicant">Applicant</option>
                            <option value="Non-Applicant">Non-Applicant</option>
                          </>
                        ) : (
                          <>
                            <option value="Main Applicant/Co-Signer/Guarantor">
                              Main Applicant/Co-Signer/Guarantor
                            </option>
                            <option value="Other">Other</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Relationship</label>
                    <select
                      value={memberDetails.relationship}
                      onChange={(e) => updateMemberDetails("relationship", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="Roommate">Roommate</option>
                      <option value="Spouse/Partner">Spouse/Partner</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={memberDetails.isAdmin}
                      onChange={(e) => updateMemberDetails("isAdmin", e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="isAdmin" className="text-sm">
                      Admin privileges (can manage applications and invite others)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
                    onClick={handleDecline}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAccept}>
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
