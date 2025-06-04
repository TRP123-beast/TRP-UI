"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GC4GroupCreationWizard } from "@/components/gc4-group-creation-wizard"
import { useMobile } from "@/hooks/use-mobile"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserIcon } from "lucide-react"
import Link from "next/link"

export default function GC4GroupCreationPage() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [flags, setFlags] = useState<{ flag6?: boolean; flag7?: boolean; flag8?: boolean }>({})

  // Mock user data - in a real app, this would come from authentication
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  }

  const handleComplete = (flags: { flag6?: boolean; flag7?: boolean; flag8?: boolean }) => {
    console.log("Group creation completed with flags:", flags)
    setIsComplete(true)
    setFlags(flags)

    // In a real app, you would store these flags and redirect based on them
    // For now, just redirect to the dashboard
    // router.push("/") - Comment this out to prevent immediate redirect
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 max-w-3xl overflow-y-auto">
          <GC4GroupCreationWizard onComplete={handleComplete} userData={userData} />

          {isComplete && (
            <div className="mt-8 border-t pt-6 space-y-2">
              {/* Determine which qualification link to show based on flags */}
              {/* If flag6 is true (group created) and there are more than 1 occupants, show CSG2 */}
              {flags.flag6 && (
                <Link
                  href="/prequalification-csg2"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span className="ml-3">CSG2 Qualification - Main Applicant/Co-Signer/Guarantor</span>
                </Link>
              )}

              {/* Show CSG1 link when appropriate (keeping the existing link) */}
              {!flags.flag6 && (
                <Link
                  href="/prequalification-csg1"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span className="ml-3">CSG1 Qualification</span>
                </Link>
              )}

              {/* Workflow explanation */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">Workflow: PRE-QUALIFICATION 1:GC4 - CSG2</h3>
                <p className="mb-2">Main Applicant/Co-Signer/Guarantor</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li># of Occupants: &gt;1</li>
                  <li>User Creates Group</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom spacing for mobile */}
        {isMobile && <div className="h-20"></div>}
      </div>
    </TooltipProvider>
  )
}
