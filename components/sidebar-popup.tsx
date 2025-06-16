"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Calendar, Settings, LogOut, Bell, User, Fingerprint } from "lucide-react"

interface SidebarPopupProps {
  onClose: () => void
}

export function SidebarPopup({ onClose }: SidebarPopupProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Use pathname to determine active page
  const currentPage = pathname.split("/")[1] || "dashboard"

  const menuItems = [
    { id: "qualification", label: "Qualification", icon: Fingerprint, path: "/qualification", count: null },
    {
      id: "qualification-credentials",
      label: "Qualification Credentials",
      icon: Fingerprint,
      path: "/qualification-credentials",
      count: null,
    },
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/", count: null },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar", count: null },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications", count: 1 },
    { id: "profile", label: "Profile", icon: User, path: "/profile", count: null },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings", count: null },
  ]

  const navigateTo = (path: string) => {
    // Ensure we close the sidebar popup before navigation
    onClose()

    // Use setTimeout to ensure the popup is closed before navigation
    setTimeout(() => {
      router.push(path)
    }, 10)
  }

  return (
    <div className="py-2">
      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-white font-medium">M</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Michael Johnson</p>
            <p className="text-sm text-gray-500">michael@example.com</p>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="mt-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  currentPage === item.id ? "bg-gray-100 text-black font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => navigateTo(item.path)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${currentPage === item.id ? "text-[#FFA500]" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className="bg-gray-100 text-gray-800 text-xs rounded-full px-2 py-0.5">{item.count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <button
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => navigateTo("/login")}
        >
          <LogOut className="h-5 w-5 text-gray-500" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}
