"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  LogOut,
  ChevronRight,
  Calendar,
  MessageCircle,
  Heart,
  Users,
  ArrowLeft,
  FileText,
  ClipboardCheck,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { useMobile } from "@/hooks/use-mobile"

// Mock user data - in a real app, this would come from an API
const userData = {
  firstName: "Michael",
  lastName: "Johnson",
  email: "michael@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, USA",
  city: "Anytown",
  state: "CA",
  zip: "12345",
  avatar: "/diverse-professional-profiles.png",
}

export default function ProfilePage() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleSaveProfile = (updatedData: any) => {
    // In a real app, you would send this data to your API
    console.log("Saving profile data:", updatedData)
    // Update the userData (in a real app, this would be handled by state management)
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
              <h1 className="text-xl font-semibold">Profile</h1>
            </div>
          )}

          {/* Profile card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto">
            {/* User info section */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile picture */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                <Image src={userData.avatar || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
              </div>

              {/* User details */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">{`${userData.firstName} ${userData.lastName}`}</h2>
                <p className="text-gray-500 mt-1">{userData.email}</p>
                <p className="text-gray-500">{userData.phone}</p>
                <p className="text-gray-500">{userData.address}</p>

                {/* Action button - Settings button removed */}
                <div className="mt-6">
                  <Button
                    className="w-full bg-[#FFA500] hover:bg-[#FFA500]/90 text-white"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Menu options */}
            <div className="border-t border-gray-100">
              <nav className="divide-y divide-gray-100">
                <button
                  onClick={() => router.push("/qualification")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="h-5 w-5 text-gray-400" />
                    <span>Qualification</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>

                <button
                  onClick={() => router.push("/qualification-credentials")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-gray-400" />
                    <span>Qualification Credentials</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>

                <button
                  onClick={() => router.push("/showings")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>Showings</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>

                <button
                  onClick={() => router.push("/offers")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span>Offers</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>

                <button
                  onClick={() => router.push("/messaging")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                    <span>Message Center</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>

                <button
                  onClick={() => router.push("/wishlists")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-gray-400" />
                    <span>Wishlists</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>

                <button
                  onClick={() => router.push("/lease-success-package")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span>Lease Success Package</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5 text-red-500" />
                    <span className="text-red-500">Log out</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile bottom spacer to avoid content being hidden behind the mobile nav */}
          <div className="h-16 md:hidden"></div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />
    </DashboardLayout>
  )
}
