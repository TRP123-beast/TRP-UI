import type React from "react"
import { Home, ClipboardList, User, BookOpenCheck, Fingerprint, Settings, HelpCircle, LogOut } from "lucide-react"

import type { MainNavItem } from "@/types"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
}

export function MobileNav({ items }: MobileNavProps) {
  const navigationItems: MainNavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      id: "applications",
      label: "Applications",
      icon: ClipboardList,
      path: "/applications",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      id: "qualification",
      label: "Qualifications",
      icon: BookOpenCheck,
      path: "/qualifications",
    },
    {
      id: "qualification-credentials",
      label: "Qualification Credentials",
      icon: Fingerprint,
      path: "/qualification-credentials",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      path: "/help",
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      path: "/logout",
    },
  ]

  return (
    <div className="sm:hidden">
      <nav className="flex flex-col space-y-2">
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={item.path}
            className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
