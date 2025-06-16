"use client"

import type { ReactNode } from "react"
import { TopNav } from "@/components/top-nav"
import { MobileNav } from "@/components/mobile-nav"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: ReactNode
  hideTopBar?: boolean
  cartItems?: any[]
  onFilterClick?: () => void
  properties?: any[]
}

export function DashboardLayout({
  children,
  hideTopBar = false,
  cartItems = [],
  onFilterClick,
  properties,
}: DashboardLayoutProps) {
  const { isMobile } = useMobile()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show TopNav if hideTopBar is false */}
      {!hideTopBar && <TopNav onFilterClick={onFilterClick} properties={properties} />}

      <main className="pb-16 sm:pb-0">{children}</main>

      {isMobile && <MobileNav cartItems={cartItems} />}
    </div>
  )
}
