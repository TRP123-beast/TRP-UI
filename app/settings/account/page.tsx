"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Lock, Mail, Bell, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { Switch } from "@/components/ui/switch"
import { MobileNav } from "@/components/mobile-nav"

export default function AccountSettingsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Add state to manage the profile menu
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  // Mock user data
  const user = {
    email: "maureenw@gmail.com",
    name: "Maureen Wariara",
    phone: "+1 (555) 123-4567",
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? "block" : "hidden md:block"} activePage="settings" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} cartItems={[]} />

        {/* Mobile Header with X Button */}
        <div className="md:hidden flex items-center p-4 border-b">
          <button onClick={() => setProfileMenuOpen(true)} className="mr-4">
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Account Settings</h1>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="hidden md:flex items-center gap-2 mb-6">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6 text-teal-500" />
                Account
              </h1>
              <div className="ml-auto text-teal-500">{user.email}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Profile Section */}
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-teal-100 rounded-full p-3">
                    <User className="h-6 w-6 text-teal-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Profile</h2>
                    <p className="text-sm text-gray-500">Name, Email and Phone</p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full p-2 border rounded-md" value={user.name} onChange={() => {}} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded-md"
                      value={user.email}
                      onChange={() => {}}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" className="w-full p-2 border rounded-md" value={user.phone} onChange={() => {}} />
                  </div>

                  <Button className="bg-teal-500 hover:bg-teal-600 mt-2">Save Changes</Button>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-teal-100 rounded-full p-3">
                    <Lock className="h-6 w-6 text-teal-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Security</h2>
                    <p className="text-sm text-gray-500">Change Password</p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" className="w-full p-2 border rounded-md" placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" className="w-full p-2 border rounded-md" placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" className="w-full p-2 border rounded-md" placeholder="••••••••" />
                  </div>

                  <Button className="bg-teal-500 hover:bg-teal-600 mt-2">Update Password</Button>
                </div>
              </div>
            </div>

            {/* Email Preferences */}
            <div className="bg-white border rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-teal-100 rounded-full p-3">
                  <Mail className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Email Preferences</h2>
                  <p className="text-sm text-gray-500">Choose when to receive Emails</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Property Updates</h3>
                    <p className="text-sm text-gray-500">Receive updates about properties you've shown interest in</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Showing Confirmations</h3>
                    <p className="text-sm text-gray-500">Receive emails when a showing is confirmed</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-gray-500">Receive promotional emails and newsletters</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-teal-100 rounded-full p-3">
                  <Bell className="h-6 w-6 text-teal-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Alerts</h2>
                  <p className="text-sm text-gray-500">New listings based on your alert criteria</p>
                </div>
                <div className="ml-auto">
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input type="number" className="w-full p-2 border rounded-md" placeholder="Min Price" />
                    <span>to</span>
                    <input type="number" className="w-full p-2 border rounded-md" placeholder="Max Price" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter city, neighborhood, or ZIP code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Any</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>

                <Button className="bg-teal-500 hover:bg-teal-600 mt-2">Save Alert Preferences</Button>
              </div>
            </div>
          </div>
          {/* Mobile Navigation with profile menu open */}
          <MobileNav cartItems={[]} profileMenuOpen={profileMenuOpen} setProfileMenuOpen={setProfileMenuOpen} />
        </div>
      </div>
    </div>
  )
}
