"use client"

import { useRouter } from "next/navigation"
import {
  User,
  Settings,
  LogOut,
  ClipboardCheck,
  FileCheck,
  Calendar,
  MessageCircle,
  Heart,
  FileText,
  Edit,
} from "lucide-react"

interface ProfileMenuProps {
  onClose: () => void
  onViewProfile: () => void
  onSettings: () => void
  onEditProfile: () => void
}

export function ProfileMenu({ onClose, onViewProfile, onSettings, onEditProfile }: ProfileMenuProps) {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would implement logout logic here
    // For now, we'll just navigate to the login page
    router.push("/login")
    onClose()
  }

  const navigateTo = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border z-50 w-64 overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center text-white">
            <span className="text-base font-medium">MW</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">Maureen Wariara</p>
            <p className="text-sm text-gray-500">maureenw@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="py-1">
        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={onViewProfile}
        >
          <User className="h-4 w-4" />
          <span>View Profile</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={onEditProfile}
        >
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => navigateTo("/qualification")}
        >
          <ClipboardCheck className="h-4 w-4" />
          <span>Qualification</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => navigateTo("/qualification-credentials")}
        >
          <FileCheck className="h-4 w-4" />
          <span>Qualification Credentials</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => navigateTo("/showings")}
        >
          <Calendar className="h-4 w-4" />
          <span>Showings</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => navigateTo("/offers")}
        >
          <User className="h-4 w-4" />
          <span>Offers</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => navigateTo("/messaging")}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Message Center</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => navigateTo("/wishlists")}
        >
          <Heart className="h-4 w-4" />
          <span>Wishlists</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => navigateTo("/lease-success-package")}
        >
          <FileText className="h-4 w-4" />
          <span>Lease Success Package</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={onSettings}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      <div className="border-t py-1">
        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}
