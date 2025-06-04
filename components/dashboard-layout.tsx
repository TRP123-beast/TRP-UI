"use client"

import type { ReactNode } from "react"
import { TopNav } from "@/components/top-nav"
import { MobileNav } from "@/components/mobile-nav"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: ReactNode
  hideTopBar?: boolean
}

export function DashboardLayout({ children, hideTopBar = false }: DashboardLayoutProps) {
  const { isMobile } = useMobile()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show TopNav if hideTopBar is false */}
      {!hideTopBar && <TopNav />}

      <main>{children}</main>

      {isMobile && <MobileNav />}
    </div>
  )
}
