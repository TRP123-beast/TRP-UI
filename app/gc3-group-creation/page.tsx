"use client"

import { GC3GroupCreationWizard } from "@/components/gc3-group-creation-wizard"

export default function GC3GroupCreationPage() {
  // Mock current user data - in a real app, this would come from authentication
  const currentUser = {
    id: "current-user",
    firstName: "Brian",
    lastName: "Phan",
    type: "Occupant",
    subType: "Non-Applicant",
    relationship: "Not Applicable",
    email: "brian@gmail.com",
    phone: "+1 (905) 626-2363",
    isAdmin: true,
    groupStatus: "Confirmed",
  }

  // Get occupant count from localStorage or URL params if available
  // For demo purposes, we'll use a default value
  const occupantCount = 1

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Group Creation</h1>
      <GC3GroupCreationWizard
        currentUser={currentUser}
        occupantCount={occupantCount}
        onComplete={(data) => {
          console.log("Group creation completed with data:", data)
        }}
      />
    </div>
  )
}
