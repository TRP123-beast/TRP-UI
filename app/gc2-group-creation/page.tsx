"use client"

import { GC2GroupCreationWizard } from "@/components/gc2-group-creation-wizard"

export default function GC2GroupCreationPage() {
  // Mock current user data - in a real app, this would come from authentication
  const currentUser = {
    id: "current-user",
    firstName: "Brian",
    lastName: "Phan",
    type: "Occupant",
    subType: "Applicant",
    relationship: "Not Applicable",
    email: "brian@gmail.com",
    phone: "+1 (905) 626-2363",
    isAdmin: true,
    groupStatus: "Confirmed",
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Group Creation</h1>
      <GC2GroupCreationWizard
        currentUser={currentUser}
        onComplete={(data) => {
          console.log("Group creation completed with data:", data)
        }}
      />
    </div>
  )
}
