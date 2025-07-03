"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileMenu } from "@/components/profile-menu"
import { NotificationsMenu } from "@/components/notifications-menu"
import { CartPreview } from "@/components/cart-preview"
import { SearchModal } from "@/components/search-modal"
import { RecentlyViewedModal } from "@/components/recently-viewed-modal"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"

export function TopNav() {
  const router = useRouter()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [shouldShakeNotification, setShouldShakeNotification] = useState(false)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)

  // Load properties from localStorage or default to empty array
  useEffect(() => {
    const storedProperties = localStorage.getItem("properties")
    if (storedProperties) {
      setProperties(JSON.parse(storedProperties))
    }
  }, [])

  // Update notification count when system notifications change
  useEffect(() => {
    const updateNotificationCount = () => {
      const systemNotifications = JSON.parse(localStorage.getItem("systemNotifications") || "[]")
      const defaultUnreadCount = 2 // Default unread notifications
      const systemUnreadCount = systemNotifications.filter((n: any) => !n.read).length
      setUnreadNotificationCount(defaultUnreadCount + systemUnreadCount)
    }

    updateNotificationCount()

    // Listen for notification system updates
    const handleNotificationUpdate = () => {
      updateNotificationCount()
    }

    window.addEventListener("notificationSystemUpdated", handleNotificationUpdate)

    return () => {
      window.removeEventListener("notificationSystemUpdated", handleNotificationUpdate)
    }
  }, [])

  // Add shake animation when notifications are added
  useEffect(() => {
    const handleNotificationAdded = () => {
      setShouldShakeNotification(true)
      setTimeout(() => setShouldShakeNotification(false), 1000) // Stop shaking after 1 second
    }

    // Listen for custom notification events
    window.addEventListener("notificationAdded", handleNotificationAdded)

    return () => {
      window.removeEventListener("notificationAdded", handleNotificationAdded)
    }
  }, [])

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
    if (isNotificationsOpen) setIsNotificationsOpen(false)
    if (isCartOpen) setIsCartOpen(false)
  }

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    if (isProfileMenuOpen) setIsProfileMenuOpen(false)
    if (isCartOpen) setIsCartOpen(false)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
    if (isProfileMenuOpen) setIsProfileMenuOpen(false)
    if (isNotificationsOpen) setIsNotificationsOpen(false)
  }

  const openSearch = () => {
    setIsSearchOpen(true)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
  }

  const openRecentlyViewed = () => {
    setIsRecentlyViewedOpen(true)
  }

  const closeRecentlyViewed = () => {
    setIsRecentlyViewedOpen(false)
  }

  const handleViewProfile = () => {
    router.push("/profile")
    setIsProfileMenuOpen(false)
  }

  const handleSettings = () => {
    router.push("/settings")
    setIsProfileMenuOpen(false)
  }

  const handleEditProfile = () => {
    setIsEditProfileOpen(true)
    setIsProfileMenuOpen(false)
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-2">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            {/* Logo */}
            <button onClick={() => router.push("/")} className="flex items-center" aria-label="Go to homepage">
              <div className="relative w-8 h-8">
                <Image src="/images/TRP-Logo.png" alt="TRP Logo" fill className="object-contain" />
              </div>
            </button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotifications}
                className={`relative ${shouldShakeNotification ? "animate-shake" : ""}`}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </Button>
              {isNotificationsOpen && <NotificationsMenu onClose={() => setIsNotificationsOpen(false)} />}
            </div>
          </div>

          {/* Centered Search Bar */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[90%]">
              <SearchBar
                onSearch={(locations) => {
                  console.log("Search locations:", locations)
                  closeSearch()
                }}
                properties={properties || []}
                onFilterClick={openSearch}
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => router.push("/")} className="flex items-center gap-2" aria-label="Go to homepage">
              <div className="relative w-8 h-8">
                <Image src="/images/TRP-Logo.png" alt="TRP Logo" fill className="object-contain" />
              </div>
              <span className="font-semibold text-lg"></span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <button
              onClick={openSearch}
              className="flex items-center w-full px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-500 text-sm">Search properties, neighborhoods...</span>
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotifications}
                className={`relative ${shouldShakeNotification ? "animate-shake" : ""}`}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </Button>
              {isNotificationsOpen && <NotificationsMenu onClose={() => setIsNotificationsOpen(false)} />}
            </div>

            {/* Cart */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={toggleCart} className="relative" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
              </Button>
              {isCartOpen && <CartPreview onClose={() => setIsCartOpen(false)} />}
            </div>

            {/* Profile */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleProfileMenu}
                className="relative"
                aria-label="User profile"
              >
                <div className="bg-teal-500 rounded-full w-7 h-7 flex items-center justify-center text-white">
                  <span className="text-xs font-medium">MW</span>
                </div>
              </Button>
              {isProfileMenuOpen && (
                <ProfileMenu
                  onClose={() => setIsProfileMenuOpen(false)}
                  onViewProfile={handleViewProfile}
                  onSettings={handleSettings}
                  onEditProfile={handleEditProfile}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={closeSearch} onRecentlyViewed={openRecentlyViewed} />}

      {/* Recently Viewed Modal */}
      {isRecentlyViewedOpen && <RecentlyViewedModal onClose={closeRecentlyViewed} />}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <ProfileEditModal
          onClose={() => setIsEditProfileOpen(false)}
          initialData={{
            name: "Maureen Wariara",
            email: "maureenw@gmail.com",
            phone: "+1 (555) 123-4567",
            address: "123 Main St, Anytown, USA",
            avatar: "/diverse-professional-profiles.png",
          }}
          onSave={(data) => {
            console.log("Saving profile data:", data)
            setIsEditProfileOpen(false)
          }}
        />
      )}
    </div>
  )
}
