"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Menu } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { useMobile } from "@/hooks/use-mobile"
import { FilterModal } from "@/components/filter-modal"
import { SidebarPopup } from "@/components/sidebar-popup"

interface TopNavProps {
  cartItems?: any[]
  properties?: any[]
  onSearch?: (locations: string[]) => void
  onFilterClick?: () => void
}

export function TopNav({ cartItems = [], properties = [], onSearch, onFilterClick }: TopNavProps) {
  const { isMobile } = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarRef, toggleRef])

  const handleFilterButtonClick = () => {
    if (onFilterClick) {
      onFilterClick()
    } else {
      setFilterModalOpen(true)
    }
  }

  const handleApplyFilters = (filters: any) => {
    console.log("Applied filters:", filters)
    // In a real app, you would update the parent component with these filters
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSearchSubmit = (locations: string[]) => {
    console.log("TopNav received search locations:", locations)
    if (onSearch) {
      onSearch(locations)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <div
        className={`sticky top-0 z-40 w-full ${
          isScrolled ? "bg-transparent backdrop-blur-sm shadow-md" : "bg-transparent"
        } transition-all duration-200 ${isScrolled ? "border-b border-gray-200/50" : ""}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-auto py-3">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/images/TRP-Logo.png"
                  alt="The Rental Project Logo"
                  width={isMobile ? 100 : 130}
                  height={isMobile ? 30 : 40}
                  className="h-auto"
                  priority
                />
              </div>
            </Link>

            {/* Search Bar for Desktop */}
            {!isMobile && (
              <div className="flex-1 max-w-md mx-4">
                <SearchBar
                  onSearch={handleSearchSubmit}
                  onFilterClick={handleFilterButtonClick}
                  properties={properties}
                />
              </div>
            )}

            {/* Mobile: Search Bar and Filter Button */}
            {isMobile && (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex-1 max-w-xs mx-2">
                  <SearchBar
                    onSearch={handleSearchSubmit}
                    onFilterClick={handleFilterButtonClick}
                    properties={properties}
                  />
                </div>
              </div>
            )}

            {/* Right Side Items (Profile, Cart) - Only show on desktop */}
            {!isMobile && (
              <div className="flex items-center gap-4">
                {/* Cart */}
                <Link href="/cart">
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6 text-gray-800" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#FFA500] text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Sidebar Toggle with Profile */}
                <div
                  ref={toggleRef}
                  className="flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1 cursor-pointer"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-5 w-5 text-gray-700 mr-2" />
                  <div className="relative h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    <span className="text-white font-medium">M</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup Sidebar - Only show on desktop */}
      {!isMobile && sidebarOpen && (
        <div
          ref={sidebarRef}
          className="fixed right-4 top-16 z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-64 overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="py-2">
            <SidebarPopup onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        properties={properties}
      />
    </>
  )
}
