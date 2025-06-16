"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Globe,
  Camera,
  User,
  Lock,
  MapPin,
  Share2,
  FileText,
  Settings,
  Link,
} from "lucide-react"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  userData?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
    declineGroupAddition?: boolean
  }
  onSave: (userData: any) => void
}

export function ProfileEditModal({
  isOpen,
  onClose,
  userData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    declineGroupAddition: false,
  },
  onSave,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState(userData)
  const [activeTab, setActiveTab] = useState("basic")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    facebook: "",
    twitter: "",
    website: "",
  })
  const [preferences, setPreferences] = useState({
    language: "English",
    theme: "Light",
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: "Public",
  })
  const [locationData, setLocationData] = useState({
    country: "United States",
    city: userData.city || "",
    zip: userData.zip || "",
    timezone: "UTC-5 (Eastern Time)",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, declineGroupAddition: checked }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialLinks((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLocationData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreferenceCheckboxChange = (name: string, checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Combine all data
    const combinedData = {
      ...formData,
      password: passwordData.new ? passwordData : undefined,
      socialLinks,
      preferences,
      location: locationData,
    }
    onSave(combinedData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic" className="flex flex-col items-center text-xs p-2">
              <User className="h-4 w-4 mb-1" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="picture" className="flex flex-col items-center text-xs p-2">
              <Camera className="h-4 w-4 mb-1" />
              <span>Picture</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col items-center text-xs p-2">
              <Lock className="h-4 w-4 mb-1" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="more" className="flex flex-col items-center text-xs p-2">
              <Settings className="h-4 w-4 mb-1" />
              <span>More</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username / Display Name</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.firstName + formData.lastName}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>
            </TabsContent>

            <TabsContent value="picture" className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <User className="h-16 w-16" />
                  </div>
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <Button type="button" variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload New Image</span>
                  </Button>

                  <Button type="button" variant="outline" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>Take Photo</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove Current Photo</span>
                  </Button>
                </div>

                <div className="text-sm text-gray-500 text-center">
                  <p>Supported formats: JPG, PNG</p>
                  <p>Maximum size: 5MB</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current"
                    name="current"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.current}
                    onChange={handlePasswordChange}
                    placeholder="Current Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <div className="relative">
                  <Input
                    id="new"
                    name="new"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.new}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    name="confirm"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm New Password"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPassword"
                  checked={showPassword}
                  onCheckedChange={(checked) => setShowPassword(!!checked)}
                />
                <Label htmlFor="showPassword">Show password</Label>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <Button type="button" variant="outline" className="w-full">
                  Set Up 2FA
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="more" className="space-y-0">
              <Tabs defaultValue="address" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="address" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1 inline" />
                    Address
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-xs">
                    <Share2 className="h-3 w-3 mr-1 inline" />
                    Social
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="text-xs">
                    <FileText className="h-3 w-3 mr-1 inline" />
                    Docs
                  </TabsTrigger>
                  <TabsTrigger value="prefs" className="text-xs">
                    <Settings className="h-3 w-3 mr-1 inline" />
                    Prefs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="address" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      name="country"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={locationData.country}
                      onChange={handleLocationChange}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={locationData.city}
                        onChange={handleLocationChange}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP/Postal Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={locationData.zip}
                        onChange={handleLocationChange}
                        placeholder="ZIP/Postal Code"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <select
                      id="timezone"
                      name="timezone"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={locationData.timezone}
                      onChange={handleLocationChange}
                    >
                      <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                      <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                      <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                      <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-1">
                      <Link className="h-4 w-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={socialLinks.linkedin}
                      onChange={handleSocialChange}
                      placeholder="LinkedIn URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="flex items-center gap-1">
                      <Link className="h-4 w-4" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      value={socialLinks.facebook}
                      onChange={handleSocialChange}
                      placeholder="Facebook URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-1">
                      <Link className="h-4 w-4" />
                      Twitter / X
                    </Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={socialLinks.twitter}
                      onChange={handleSocialChange}
                      placeholder="Twitter / X URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      Personal Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={socialLinks.website}
                      onChange={handleSocialChange}
                      placeholder="Website URL"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="docs" className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop files here or click to browse</p>
                    <Button type="button" variant="outline" size="sm">
                      Browse Files
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Uploaded Documents</h3>
                    <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                  </div>
                </TabsContent>

                <TabsContent value="prefs" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      name="language"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select
                      id="theme"
                      name="theme"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={preferences.theme}
                      onChange={handlePreferenceChange}
                    >
                      <option value="Light">Light</option>
                      <option value="Dark">Dark</option>
                      <option value="System">System Default</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium mb-2">Notification Settings</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Checkbox
                        id="emailNotifications"
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => handlePreferenceCheckboxChange("emailNotifications", !!checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <Checkbox
                        id="pushNotifications"
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => handlePreferenceCheckboxChange("pushNotifications", !!checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <select
                      id="profileVisibility"
                      name="profileVisibility"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={preferences.profileVisibility}
                      onChange={handlePreferenceChange}
                    >
                      <option value="Public">Public</option>
                      <option value="Friends Only">Friends Only</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t">
                    <Button type="button" variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <DialogFooter className="mt-6 flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#FFA500] hover:bg-[#FFA500]/90 text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
