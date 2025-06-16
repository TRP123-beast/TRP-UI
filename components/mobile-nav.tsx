"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Calendar, User, MapPin, ShoppingCart, Home } from "lucide-react"
import type { MainNavItem } from "@/types"

interface MobileNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
  cartItems?: any[]
  onRemoveFromCart?: (id: string) => void
}

export function MobileNav({ cartItems = [] }: MobileNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      path: "/calendar",
    },
    {
      id: "map",
      label: "Map",
      icon: MapPin,
      path: "/map",
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      path: "/cart",
      badge: cartItems.length > 0 ? cartItems.length : undefined,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ]

  // Function to check if the current path matches the item path
  const isActive = (itemPath: string) => {
    if (itemPath === "/") {
      // For home, only match exact path
      return pathname === "/"
    }
    return pathname.startsWith(itemPath)
  }

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                active ? "text-orange-500" : "text-gray-600 hover:text-black"
              }`}
            >
              <div className="relative">
                <item.icon className={`h-5 w-5 mb-1 ${active ? "text-orange-500" : ""}`} />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs ${active ? "text-orange-500 font-medium" : ""}`}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
