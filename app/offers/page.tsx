"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { MobileNav } from "@/components/mobile-nav"

export default function OffersPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? "block" : "hidden md:block"} activePage="offers" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} cartItems={[]} />

        {/* Mobile Header with X Button */}
        <div className="md:hidden flex items-center p-4 border-b">
          <button onClick={() => router.push("/profile")} className="mr-4">
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Offers</h1>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white p-6">
          <h1 className="text-2xl font-bold mb-6 hidden md:block">Offers</h1>
          <p className="text-gray-600">This page is under construction.</p>
        </div>
        {/* Mobile Navigation with profile menu open */}
        <MobileNav cartItems={[]} profileMenuOpen={profileMenuOpen} setProfileMenuOpen={setProfileMenuOpen} />
      </div>
    </div>
  )
}
