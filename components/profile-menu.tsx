"use client"

import { useRouter } from "next/navigation"
import { User, Settings, LogOut } from "lucide-react"

interface ProfileMenuProps {
  onClose: () => void
  onViewProfile: () => void
  onSettings: () => void
}

export function ProfileMenu({ onClose, onViewProfile, onSettings }: ProfileMenuProps) {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would implement logout logic here
    // For now, we'll just navigate to the login page
    router.push("/login")
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
          <span>View profile</span>
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
