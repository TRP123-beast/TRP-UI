"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Download, Check, Plus, Minus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useMobile } from "@/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ToastContainer } from "@/components/toast-notification-manager"

// Mock user data - in a real app, this would come from an API
const mockUserData = {
  isInternationalStudent: false, // FLAG_21
  hasPassedPrequalification: true,
  qualificationDate: new Date("2024-01-15"),
  moveOutDate: new Date("2024-03-01"),
}

// Mock profile data - in a real app, this would come from user's profile
const mockProfileData = {
  firstName: "John",
  middleName: "Michael",
  lastName: "",
  dateOfBirth: "",
  phone: "(416) 555-0123",
  email: "john.doe@email.com",
  currentAddress: "",
  ssn: "",
  driversLicense: "",
}

export default function LeaseSuccessPackagePage() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const [activeTab, setActiveTab] = useState("qualification")
  const [currentStep, setCurrentStep] = useState("personal-info")
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formData, setFormData] = useState({
    // International student data
    yearInSchool: "",
    guarantorRelationship: "",

    // Personal information - prefilled with profile data
    firstName: mockProfileData.firstName,
    middleName: mockProfileData.middleName,
    lastName: mockProfileData.lastName,
    dateOfBirth: mockProfileData.dateOfBirth,
    phone: mockProfileData.phone,
    email: mockProfileData.email,
    currentAddress: mockProfileData.currentAddress,
    ssn: mockProfileData.ssn,
    driversLicense: mockProfileData.driversLicense,

    // Address history
    currentAddressDetails: {
      address: "",
      unit: "",
      residentialStatus: "",
      startDate: "",
      endDate: "",
      landlordName: "",
      landlordPhone: "",
      landlordEmail: "",
      reasonForLeaving: "",
      noCurrentLandlord: false,
    },
    previousAddress: {
      address: "",
      unit: "",
      residentialStatus: "",
      startDate: "",
      endDate: "",
    },

    // Financial history
    employmentStatus: "",
    position: "",
    companyName: "",
    companyWebsite: "",
    employmentLength: "",
    supervisorName: "",
    supervisorPhone: "",
    supervisorEmail: "",
    additionalEmploymentInfo: "",
    additionalIncomeSources: [] as Array<{
      employmentStatus: string
      position: string
      companyName: string
      companyWebsite: string
      employmentLength: string
      supervisorName: string
      supervisorPhone: string
      supervisorEmail: string
    }>,
    annualIncome: "",
    verificationChecked: false,

    // Additional information
    ownsCar: false,
    vehicleDescription: "",
    hasPets: false,
    petDetails: "",
    bankruptcy: false,
    smokes: false,
    evicted: false,
    refusedRent: false,
    felonyConviction: false,
    additionalInfo: "",
    budget: "",
    additionalDeposit: false,
    additionalMonths: 2,

    // Documents
    incomeProof: null as File | null,
    identification: null as File | null,
    petWeight: null as File | null,
    referenceLetter: null as File | null,
    noticeToVacate: null as File | null,
    creditReport: null as File | null,
    hasCreditReport: false,
    creditReportTiming: "",

    // Credit check
    cardNumber: "",
    expirationDate: "",
    cvc: "",
    postalCode: "",
    termsAccepted: false,
  })

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showInviteNonLeaseModal, setShowInviteNonLeaseModal] = useState(false)
  const [showInviteGuarantorModal, setShowInviteGuarantorModal] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupMembers, setGroupMembers] = useState([
    {
      name: "",
      email: "",
      type: "Occupant",
      subType: "Applicant",
      relationship: "",
      isAdmin: false,
      isRepresented: false,
    },
  ])
  const [nonLeaseHolders, setNonLeaseHolders] = useState([{ name: "", email: "" }])
  const [guarantor, setGuarantor] = useState({ name: "", email: "" })
  const [highlightAdditionalIncome, setHighlightAdditionalIncome] = useState(false)
  const [showCoverLetterUploadModal, setShowCoverLetterUploadModal] = useState(false)
  const [uploadedCoverLetter, setUploadedCoverLetter] = useState<File | null>(null)
  const [isPackageCollapsed, setIsPackageCollapsed] = useState(false)

  const mockAddressSuggestions = [
    "509 Emerald Ave, Oshawa, ON, Canada, L1J 1K5",
    "510 Emerald Ave, Oshawa, ON, Canada, L1J 1K5",
    "511 Emerald Ave, Oshawa, ON, Canada, L1J 1K5",
    "123 Main St, Toronto, ON M5V 3A8",
    "124 Main St, Toronto, ON M5V 3A8",
    "125 Main St, Toronto, ON M5V 3A8",
    "456 Queen St W, Toronto, ON M5V 2A9",
    "789 King St E, Toronto, ON M5A 1M2",
    "321 Bloor St W, Toronto, ON M5S 1W7",
    "654 Yonge St, Toronto, ON M4Y 2A6",
  ]

  const [showAdditionalIncomeForm, setShowAdditionalIncomeForm] = useState(false)
  const [currentAdditionalIncome, setCurrentAdditionalIncome] = useState({
    employmentStatus: "",
    position: "",
    companyName: "",
    companyWebsite: "",
    employmentLength: "",
    supervisorName: "",
    supervisorPhone: "",
    supervisorEmail: "",
  })

  const handleAddressSearch = (query: string) => {
    if (query.length > 2) {
      const filtered = mockAddressSuggestions
        .filter((addr) => addr.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5) // Limit to 5 suggestions
      setAddressSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleFileUpload = (field: string, file: File | null) => {
    updateFormData(field, file)
  }

  const addAdditionalIncomeSource = () => {
    setFormData((prev) => ({
      ...prev,
      additionalIncomeSources: [...prev.additionalIncomeSources, currentAdditionalIncome],
    }))
    setCurrentAdditionalIncome({
      employmentStatus: "",
      position: "",
      companyName: "",
      companyWebsite: "",
      employmentLength: "",
      supervisorName: "",
      supervisorPhone: "",
      supervisorEmail: "",
    })
    setShowAdditionalIncomeForm(false)
  }

  const updateCurrentAdditionalIncome = (field: string, value: string) => {
    setCurrentAdditionalIncome((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const removeAdditionalIncomeSource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalIncomeSources: prev.additionalIncomeSources.filter((_, i) => i !== index),
    }))
  }

  const calculateDepositAmount = () => {
    const budget = Number.parseFloat(formData.budget) || 0
    return budget * formData.additionalMonths
  }

  const addGroupMember = () => {
    setGroupMembers([
      ...groupMembers,
      {
        name: "",
        email: "",
        type: "Occupant",
        subType: "Applicant",
        relationship: "",
        isAdmin: false,
        isRepresented: false,
      },
    ])
  }

  const removeGroupMember = (index: number) => {
    setGroupMembers(groupMembers.filter((_, i) => i !== index))
  }

  const updateGroupMember = (index: number, field: string, value: string | boolean) => {
    const updated = [...groupMembers]
    updated[index] = { ...updated[index], [field]: value }

    // Auto-update sub-type options when type changes
    if (field === "type") {
      updated[index].subType = value === "Occupant" ? "Applicant" : "Main Applicant/Co-Signer/Guarantor"
    }

    setGroupMembers(updated)
  }

  const addNonLeaseHolder = () => {
    setNonLeaseHolders([...nonLeaseHolders, { name: "", email: "" }])
  }

  const removeNonLeaseHolder = (index: number) => {
    setNonLeaseHolders(nonLeaseHolders.filter((_, i) => i !== index))
  }

  const updateNonLeaseHolder = (index: number, field: string, value: string) => {
    const updated = [...nonLeaseHolders]
    updated[index] = { ...updated[index], [field]: value }
    setNonLeaseHolders(updated)
  }

  const handleCreateGroup = () => {
    // @ts-ignore - Using global toast function
    window.addToast?.(
      `Group "${groupName}" created successfully! Invitations sent to ${groupMembers.length} members.`,
      "success",
    )
    setShowCreateGroupModal(false)
    setGroupName("")
    setGroupMembers([
      {
        name: "",
        email: "",
        type: "Occupant",
        subType: "Applicant",
        relationship: "",
        isAdmin: false,
        isRepresented: false,
      },
    ])
  }

  const handleInviteNonLeaseHolders = () => {
    // @ts-ignore - Using global toast function
    window.addToast?.(`Invitations sent to ${nonLeaseHolders.length} non-lease holders.`, "success")
    setShowInviteNonLeaseModal(false)
    setNonLeaseHolders([{ name: "", email: "" }])
  }

  const handleInviteGuarantor = () => {
    // @ts-ignore - Using global toast function
    window.addToast?.(`Invitation sent to guarantor: ${guarantor.name}`, "success")
    setShowInviteGuarantorModal(false)
    setGuarantor({ name: "", email: "" })
  }

  const handleStartAdditionalIncome = () => {
    setCurrentStep("financial-history")
    setActiveTab("lease-success-package")
    setHighlightAdditionalIncome(true)
    // @ts-ignore - Using global toast function
    window.addToast?.("Redirecting to add additional income sources...", "info")
  }

  const isQualificationExpired = () => {
    const daysDiff = Math.floor(
      (mockUserData.moveOutDate.getTime() - mockUserData.qualificationDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysDiff > 60
  }

  const handleCoverLetterUpload = (file: File | null) => {
    setUploadedCoverLetter(file)
  }

  const handleCoverLetterConfirm = () => {
    // @ts-ignore - Using global toast function
    window.addToast?.("Cover letter uploaded successfully!", "success")
    setShowCoverLetterUploadModal(false)
    setActiveTab("complete")
  }

  const renderInternationalStudentForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">What year are you in?</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="yearInSchool"
              value="year1"
              checked={formData.yearInSchool === "year1"}
              onChange={(e) => updateFormData("yearInSchool", e.target.value)}
              className="text-orange-500"
            />
            <span>Year 1</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="yearInSchool"
              value="year2+"
              checked={formData.yearInSchool === "year2+"}
              onChange={(e) => updateFormData("yearInSchool", e.target.value)}
              className="text-orange-500"
            />
            <span>Year 2 and above</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">What is your relationship with the guarantor?</label>
        <Input
          value={formData.guarantorRelationship}
          onChange={(e) => updateFormData("guarantorRelationship", e.target.value)}
          placeholder="e.g., Parent, Relative, Friend"
        />
      </div>

      <Button
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        onClick={() => {
          // System update: store info for AI generated letter
          console.log("Submitting international student data:", {
            year: formData.yearInSchool,
            guarantorRelationship: formData.guarantorRelationship,
          })
          setActiveTab("complete")
        }}
      >
        Submit
      </Button>
    </div>
  )

  const renderPersonalInfoStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Name *</label>
          <Input value={formData.firstName} onChange={(e) => updateFormData("firstName", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Middle Name</label>
          <Input value={formData.middleName} onChange={(e) => updateFormData("middleName", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Last Name *</label>
          <Input value={formData.lastName} onChange={(e) => updateFormData("lastName", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth *</label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tenant Phone *</label>
          <Input type="tel" value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email Address *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="john.doe@email.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Current Address *</label>
          <Input
            value={formData.currentAddress}
            onChange={(e) => updateFormData("currentAddress", e.target.value)}
            placeholder="Start typing your address..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">For best results use the address shown on your driver's license</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">SSN/SIN</label>
          <Input value={formData.ssn} onChange={(e) => updateFormData("ssn", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Driver's License Number</label>
          <Input value={formData.driversLicense} onChange={(e) => updateFormData("driversLicense", e.target.value)} />
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Optional, but entering SSN/SIN or Driver's License improves report accuracy
      </p>

      <div className="flex justify-end">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setCurrentStep("address-history")}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderAddressHistoryStep = () => (
    <div className="space-y-6">
      {/* Current Address */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Current Address</h3>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Tenant Current Address * (Autocomplete)</label>
            <Input
              value={formData.currentAddressDetails.address || formData.currentAddress}
              onChange={(e) => {
                updateNestedFormData("currentAddressDetails", "address", e.target.value)
                handleAddressSearch(e.target.value)
              }}
              onFocus={() => {
                if (!formData.currentAddressDetails.address && formData.currentAddress) {
                  updateNestedFormData("currentAddressDetails", "address", formData.currentAddress)
                }
              }}
              placeholder="509 Emerald Ave, Oshawa, ON, Canada, L1J 1K5"
              required
            />
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                {addressSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      updateNestedFormData("currentAddressDetails", "address", suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              For best results use the address shown on your driver's license
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Unit *</label>
              <Input
                value={formData.currentAddressDetails.unit}
                onChange={(e) => updateNestedFormData("currentAddressDetails", "unit", e.target.value)}
                placeholder="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Residential Status *</label>
              <select
                value={formData.currentAddressDetails.residentialStatus}
                onChange={(e) => updateNestedFormData("currentAddressDetails", "residentialStatus", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Choose</option>
                <option value="own">Own</option>
                <option value="rent">Rent</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <Input
                type="date"
                value={formData.currentAddressDetails.startDate}
                onChange={(e) => updateNestedFormData("currentAddressDetails", "startDate", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Landlord Reference */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Landlord Reference</h3>
        <p className="text-sm text-gray-600 mb-4">
          Including landlord references will guarantee a higher success rate.
        </p>

        {!formData.currentAddressDetails.noCurrentLandlord && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Landlord Name *</label>
                <Input
                  value={formData.currentAddressDetails.landlordName}
                  onChange={(e) => updateNestedFormData("currentAddressDetails", "landlordName", e.target.value)}
                  placeholder="Brian"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Landlord Contact Number *</label>
                <Input
                  type="tel"
                  value={formData.currentAddressDetails.landlordPhone}
                  onChange={(e) => updateNestedFormData("currentAddressDetails", "landlordPhone", e.target.value)}
                  placeholder="(903)453-2345"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Landlord Email</label>
                <Input
                  type="email"
                  value={formData.currentAddressDetails.landlordEmail}
                  onChange={(e) => updateNestedFormData("currentAddressDetails", "landlordEmail", e.target.value)}
                  placeholder="209283490@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason for Leaving</label>
                <Input
                  value={formData.currentAddressDetails.reasonForLeaving}
                  onChange={(e) => updateNestedFormData("currentAddressDetails", "reasonForLeaving", e.target.value)}
                  placeholder="Needed more space"
                />
              </div>
            </div>

            <p className="text-sm text-gray-600">
              We require one of either your landlord's email or phone number. If you don't currently have a landlord,
              click below
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="noLandlord"
            checked={formData.currentAddressDetails.noCurrentLandlord}
            onCheckedChange={(checked) => updateNestedFormData("currentAddressDetails", "noCurrentLandlord", checked)}
          />
          <label htmlFor="noLandlord" className="text-sm">
            I do not have a current landlord
          </label>
        </div>
      </div>

      {/* Previous Address */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Previous Address</h3>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Previous Address * (Autocomplete)</label>
            <Input
              value={formData.previousAddress.address}
              onChange={(e) => {
                updateNestedFormData("previousAddress", "address", e.target.value)
                handleAddressSearch(e.target.value)
              }}
              onFocus={() => handleAddressSearch(formData.previousAddress.address)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="509 Emerald Ave, Oshawa, ON, Canada, L1J 1K5"
            />
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                {addressSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      updateNestedFormData("previousAddress", "address", suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Unit</label>
              <Input
                value={formData.previousAddress.unit}
                onChange={(e) => updateNestedFormData("previousAddress", "unit", e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Residential Status</label>
              <select
                value={formData.previousAddress.residentialStatus}
                onChange={(e) => updateNestedFormData("previousAddress", "residentialStatus", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose</option>
                <option value="own">Own</option>
                <option value="rent">Rent</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={formData.previousAddress.startDate}
                onChange={(e) => updateNestedFormData("previousAddress", "startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={formData.previousAddress.endDate}
                onChange={(e) => updateNestedFormData("previousAddress", "endDate", e.target.value)}
              />
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={() => {
                    updateNestedFormData("previousAddress", "address", "")
                    updateNestedFormData("previousAddress", "unit", "")
                    updateNestedFormData("previousAddress", "residentialStatus", "")
                    updateNestedFormData("previousAddress", "startDate", "")
                    updateNestedFormData("previousAddress", "endDate", "")
                  }}
                >
                  Remove Previous Address
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to delete this previous address entry from your application.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep("personal-info")}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setCurrentStep("financial-history")}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderFinancialHistoryStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Employment Status *</label>
        <select
          value={formData.employmentStatus}
          onChange={(e) => updateFormData("employmentStatus", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Choose</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="self-employed">Self-Employed</option>
          <option value="retired">Retired</option>
          <option value="unemployed">Unemployed</option>
          <option value="full-time-part-time">Full-Time, Part-Time</option>
          <option value="full-time-self-employed">Full-Time, Self-Employed</option>
          <option value="part-time-self-employed">Part-Time, Self-Employed</option>
          <option value="full-time-part-time-self-employed">Full-Time, Part-Time, Self-Employed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Position Held</label>
          <Input value={formData.position} onChange={(e) => updateFormData("position", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company Name *</label>
          <Input
            value={formData.companyName}
            onChange={(e) => updateFormData("companyName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company Website</label>
          <Input
            type="url"
            value={formData.companyWebsite}
            onChange={(e) => updateFormData("companyWebsite", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Length of Employment *</label>
          <Input
            value={formData.employmentLength}
            onChange={(e) => updateFormData("employmentLength", e.target.value)}
            placeholder="e.g., 2 years"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Supervisor Name *</label>
          <Input
            value={formData.supervisorName}
            onChange={(e) => updateFormData("supervisorName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Supervisor Phone *</label>
          <Input
            type="tel"
            value={formData.supervisorPhone}
            onChange={(e) => updateFormData("supervisorPhone", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Supervisor Email *</label>
        <Input
          type="email"
          value={formData.supervisorEmail}
          onChange={(e) => updateFormData("supervisorEmail", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Please provide any additional information about your current employment situation
        </label>
        <Textarea
          value={formData.additionalEmploymentInfo}
          onChange={(e) => updateFormData("additionalEmploymentInfo", e.target.value)}
          rows={3}
        />
      </div>

      {/* Additional Income Sources Section */}
      <div className="border-t pt-4">
        <Button
          type="button"
          variant="outline"
          className={`w-full border-orange-500 text-orange-500 hover:bg-orange-50 ${
            highlightAdditionalIncome ? "ring-4 ring-orange-300 animate-pulse" : ""
          }`}
          onClick={() => {
            setShowAdditionalIncomeForm(!showAdditionalIncomeForm)
            setHighlightAdditionalIncome(false)
          }}
        >
          Add Additional Source of Income
        </Button>

        {/* Show existing additional income sources */}
        {formData.additionalIncomeSources.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-sm">Additional Income Sources:</h4>
            {formData.additionalIncomeSources.map((source, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{source.companyName}</p>
                    <p className="text-xs text-gray-600">
                      {source.position} - {source.employmentStatus}
                    </p>
                    <p className="text-xs text-gray-600">
                      {source.supervisorName} - {source.supervisorPhone}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-500 hover:bg-red-50"
                    onClick={() => removeAdditionalIncomeSource(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Income Form */}
        {showAdditionalIncomeForm && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-4">Additional Income Source</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Employment Status *</label>
                <select
                  value={currentAdditionalIncome.employmentStatus}
                  onChange={(e) => updateCurrentAdditionalIncome("employmentStatus", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Choose</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="retired">Retired</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="full-time-part-time">Full-Time, Part-Time</option>
                  <option value="full-time-self-employed">Full-Time, Self-Employed</option>
                  <option value="part-time-self-employed">Part-Time, Self-Employed</option>
                  <option value="full-time-part-time-self-employed">Full-Time, Part-Time, Self-Employed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Position Held</label>
                  <Input
                    value={currentAdditionalIncome.position}
                    onChange={(e) => updateCurrentAdditionalIncome("position", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <Input
                    value={currentAdditionalIncome.companyName}
                    onChange={(e) => updateCurrentAdditionalIncome("companyName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Website</label>
                  <Input
                    type="url"
                    value={currentAdditionalIncome.companyWebsite}
                    onChange={(e) => updateCurrentAdditionalIncome("companyWebsite", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Length of Employment *</label>
                  <Input
                    value={currentAdditionalIncome.employmentLength}
                    onChange={(e) => updateCurrentAdditionalIncome("employmentLength", e.target.value)}
                    placeholder="e.g., 2 years"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Supervisor Name *</label>
                  <Input
                    value={currentAdditionalIncome.supervisorName}
                    onChange={(e) => updateCurrentAdditionalIncome("supervisorName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Supervisor Phone *</label>
                  <Input
                    type="tel"
                    value={currentAdditionalIncome.supervisorPhone}
                    onChange={(e) => updateCurrentAdditionalIncome("supervisorPhone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Supervisor Email *</label>
                <Input
                  type="email"
                  value={currentAdditionalIncome.supervisorEmail}
                  onChange={(e) => updateCurrentAdditionalIncome("supervisorEmail", e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAdditionalIncomeForm(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={addAdditionalIncomeSource}
                  disabled={
                    !currentAdditionalIncome.employmentStatus ||
                    !currentAdditionalIncome.companyName ||
                    !currentAdditionalIncome.employmentLength ||
                    !currentAdditionalIncome.supervisorName ||
                    !currentAdditionalIncome.supervisorPhone ||
                    !currentAdditionalIncome.supervisorEmail
                  }
                >
                  Add Income Source
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Applicant Annual Income (all sources) *</label>
        <Input
          type="number"
          value={formData.annualIncome}
          onChange={(e) => updateFormData("annualIncome", e.target.value)}
          placeholder="Enter number only, no spaces, $ or commas"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Enter number only. no spaces, $ or commas</p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="verification"
          checked={formData.verificationChecked}
          onCheckedChange={(checked) => updateFormData("verificationChecked", checked)}
        />
        <label htmlFor="verification" className="text-sm">
          I verify that this information is correct
        </label>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep("address-history")}>
          Back
        </Button>
        <Button
          className={`${
            formData.verificationChecked && !isQualificationExpired()
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white`}
          onClick={() => {
            if (highlightAdditionalIncome) {
              setActiveTab("in-review")
              setHighlightAdditionalIncome(false)
              // @ts-ignore - Using global toast function
              window.addToast?.("Returning to review with updated income information.", "success")
            } else {
              setCurrentStep("additional-info")
            }
          }}
          disabled={!formData.verificationChecked || isQualificationExpired()}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderAdditionalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Do you own a car?</span>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="ownsCar"
                  checked={formData.ownsCar === true}
                  onChange={() => updateFormData("ownsCar", true)}
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="ownsCar"
                  checked={formData.ownsCar === false}
                  onChange={() => updateFormData("ownsCar", false)}
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {formData.ownsCar && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Please describe vehicle or vehicles and make & model
              </label>
              <Input
                value={formData.vehicleDescription}
                onChange={(e) => updateFormData("vehicleDescription", e.target.value)}
                placeholder="Black Honda Civic"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Do you have a pet/pets?</span>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="hasPets"
                  checked={formData.hasPets === true}
                  onChange={() => updateFormData("hasPets", true)}
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="hasPets"
                  checked={formData.hasPets === false}
                  onChange={() => updateFormData("hasPets", false)}
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {formData.hasPets && (
            <div>
              <label className="block text-sm font-medium mb-2">
                How many pets and what type of pets do you have? Size, breed, etc
              </label>
              <Textarea
                value={formData.petDetails}
                onChange={(e) => updateFormData("petDetails", e.target.value)}
                placeholder="1 dog, Golden Retriever, 65 lbs"
                rows={2}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {[
            { key: "bankruptcy", label: "Have you ever declared bankruptcy?" },
            { key: "smokes", label: "Do you smoke?" },
            { key: "evicted", label: "Have you ever been evicted?" },
            { key: "refusedRent", label: "Have you ever refused to pay rent?" },
            { key: "felonyConviction", label: "Have you ever been convicted of a felony?" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium">{label}</span>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={key}
                    checked={formData[key as keyof typeof formData] === true}
                    onChange={() => updateFormData(key, true)}
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={key}
                    checked={formData[key as keyof typeof formData] === false}
                    onChange={() => updateFormData(key, false)}
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Is there any other information you would like to share about your application?
        </label>
        <Textarea
          value={formData.additionalInfo}
          onChange={(e) => updateFormData("additionalInfo", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">What is your budget?</label>
        <Input
          type="number"
          value={formData.budget}
          onChange={(e) => updateFormData("budget", e.target.value)}
          placeholder="2500"
        />
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">
            In order to present the strongest possible offer, are you able to comfortably set aside more than the
            required first and last month's rent as a deposit?
          </span>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="additionalDeposit"
                checked={formData.additionalDeposit === true}
                onChange={() => updateFormData("additionalDeposit", true)}
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="additionalDeposit"
                checked={formData.additionalDeposit === false}
                onChange={() => updateFormData("additionalDeposit", false)}
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>

        {formData.additionalDeposit && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                How many additional months are you willing to set aside?
              </label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFormData("additionalMonths", Math.max(1, formData.additionalMonths - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold">{formData.additionalMonths}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFormData("additionalMonths", formData.additionalMonths + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-orange-800">
                Total Deposit Amount: ${calculateDepositAmount().toLocaleString()}
              </p>
              <p className="text-xs text-orange-600">
                Budget × {formData.additionalMonths} months = ${formData.budget} × {formData.additionalMonths}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep("financial-history")}>
          Back
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setCurrentStep("documents")}>
          Next
        </Button>
      </div>
    </div>
  )

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
        <p className="text-sm text-gray-600 mb-4">
          Applications that include proof of income have much higher success rate
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type of income proof * (required)</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => document.getElementById("incomeProof")?.click()}
            >
              {formData.incomeProof ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-600">{formData.incomeProof.name}</p>
                  <p className="text-xs text-gray-500">{(formData.incomeProof.size / 1024).toFixed(1)} KB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileUpload("incomeProof", null)
                    }}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </>
              )}
              <input
                id="incomeProof"
                type="file"
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                onChange={(e) => handleFileUpload("incomeProof", e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type of ID * (required)</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => document.getElementById("identification")?.click()}
            >
              {formData.identification ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-600">{formData.identification.name}</p>
                  <p className="text-xs text-gray-500">{(formData.identification.size / 1024).toFixed(1)} KB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileUpload("identification", null)
                    }}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </>
              )}
              <input
                id="identification"
                type="file"
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                onChange={(e) => handleFileUpload("identification", e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pet weight (optional)</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => document.getElementById("petWeight")?.click()}
            >
              {formData.petWeight ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-600">{formData.petWeight.name}</p>
                  <p className="text-xs text-gray-500">{(formData.petWeight.size / 1024).toFixed(1)} KB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileUpload("petWeight", null)
                    }}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </>
              )}
              <input
                id="petWeight"
                type="file"
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                onChange={(e) => handleFileUpload("petWeight", e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Reference Letter from Current or Past Landlord</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => document.getElementById("referenceLetter")?.click()}
            >
              {formData.referenceLetter ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-600">{formData.referenceLetter.name}</p>
                  <p className="text-xs text-gray-500">{(formData.referenceLetter.size / 1024).toFixed(1)} KB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileUpload("referenceLetter", null)
                    }}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </>
              )}
              <input
                id="referenceLetter"
                type="file"
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                onChange={(e) => handleFileUpload("referenceLetter", e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-800 mb-2">NOTE</p>
            <p className="text-xs text-yellow-700">
              UPLOAD PROOF NOTICE TO VACATE IF WE TRP DID NOT INITIATE THE CREATION AND UPLOADING OF NOTICE TO VACATE
            </p>
            <div className="mt-2">
              <div
                className="border-2 border-dashed border-yellow-300 rounded-lg p-3 text-center cursor-pointer hover:border-yellow-400 transition-colors"
                onClick={() => document.getElementById("noticeToVacate")?.click()}
              >
                {formData.noticeToVacate ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xs font-medium text-green-600">{formData.noticeToVacate.name}</p>
                    <p className="text-xs text-gray-500">{(formData.noticeToVacate.size / 1024).toFixed(1)} KB</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileUpload("noticeToVacate", null)
                      }}
                      className="text-red-500 border-red-500 hover:bg-red-50 text-xs px-2 py-1"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
                    <p className="text-xs text-yellow-700">Upload Notice to Vacate</p>
                  </>
                )}
                <input
                  id="noticeToVacate"
                  type="file"
                  className="hidden"
                  accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                  onChange={(e) => handleFileUpload("noticeToVacate", e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Check Section */}
      <div className="border-t pt-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Have you pulled your most recent "paid" credit score and report?
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hasCreditReport"
                  value="yes"
                  checked={formData.hasCreditReport === true}
                  onChange={() => updateFormData("hasCreditReport", true)}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hasCreditReport"
                  value="no"
                  checked={formData.hasCreditReport === false}
                  onChange={(e) => updateFormData("hasCreditReport", false)}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {formData.hasCreditReport && (
            <div>
              <label className="block text-sm font-medium mb-2">When was it pulled?</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="creditReportTiming"
                    value="within60"
                    checked={formData.creditReportTiming === "within60"}
                    onChange={(e) => updateFormData("creditReportTiming", e.target.value)}
                  />
                  <span>Within the past 60 days</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="creditReportTiming"
                    value="over60"
                    checked={formData.creditReportTiming === "over60"}
                    onChange={(e) => updateFormData("creditReportTiming", e.target.value)}
                  />
                  <span>More than 60 days</span>
                </label>
              </div>
            </div>
          )}

          {!formData.hasCreditReport && (
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Start Credit Check</Button>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              TRP is a licensed brokerage that is regulated by OREA, RECO, and CREA.
            </p>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">OREA</div>
              <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">RECO</div>
              <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">CREA</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Credit Report</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => document.getElementById("creditReport")?.click()}
            >
              {formData.creditReport ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-600">{formData.creditReport.name}</p>
                  <p className="text-xs text-gray-500">{(formData.creditReport.size / 1024).toFixed(1)} KB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileUpload("creditReport", null)
                    }}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </>
              )}
              <input
                id="creditReport"
                type="file"
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                onChange={(e) => handleFileUpload("creditReport", e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep("additional-info")}>
          Back
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setCurrentStep("credit-check")}>
          Next
        </Button>
      </div>
    </div>
  )

  const renderCreditCheckStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Credit Check Payment</h3>
        <p className="text-sm text-gray-600 mb-6">Viewing as: Group Name</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Card Number</label>
          <Input
            value={formData.cardNumber}
            onChange={(e) => updateFormData("cardNumber", e.target.value)}
            placeholder="1234 5678 9012 3456"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Expiration Date</label>
            <Input
              value={formData.expirationDate}
              onChange={(e) => updateFormData("expirationDate", e.target.value)}
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CVC</label>
            <Input value={formData.cvc} onChange={(e) => updateFormData("cvc", e.target.value)} placeholder="123" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Postal/Zip</label>
          <Input
            value={formData.postalCode}
            onChange={(e) => updateFormData("postalCode", e.target.value)}
            placeholder="M5V 3A8"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
          />
          <label htmlFor="terms" className="text-sm">
            By clicking here, you accept our terms and conditions for use *
          </label>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4">
          <div className="flex items-center justify-center space-x-2">
            <span>Pay with</span>
            <span className="font-bold">PayPal</span>
          </div>
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep("documents")}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setActiveTab("in-review")}
          disabled={!formData.termsAccepted}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderInReviewTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Thank you for your submission</h2>
        <p className="text-gray-600 mb-6">
          Our concierge is working as quickly as possible to review your application to get you out to showings.
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Maximum Recommended Rent Amount & Rentability Score for Individual</h3>
        <div className="text-3xl font-bold text-orange-600 mb-4">$2,500</div>
        <p className="text-sm text-gray-700">
          Based on your credit score and combined household income, you have been approved to book showings for
          properties up to $2,500.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Optional Methods to Access Additional Properties</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm">Create a group and add additional leaseholders</span>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setShowCreateGroupModal(true)}
            >
              Create Group
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm">Add Non-Lease Holders to Lease</span>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setShowInviteNonLeaseModal(true)}
            >
              Invite
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm">Add a Guarantor to the lease</span>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setShowInviteGuarantorModal(true)}
            >
              Invite
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm">Disclose additional sources of income</span>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleStartAdditionalIncome}
            >
              Start
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline">Skip</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setActiveTab("cover-letter")}>
          Submit
        </Button>
      </div>
    </div>
  )

  const renderCoverLetterTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Tenant Cover Letter</h2>
        <p className="text-sm text-gray-600 mb-6">
          Based on the information you have provided thus far, we have taken the liberty to create a cover letter that
          helps reflect your positive character to potential landlords.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold">John Doe</p>
            <p>12 Sesame St., Toronto, ON M5T 2C2</p>
            <p>416-000-1111, johndoe@gmail.com</p>
          </div>

          <p>[Date]</p>

          <p>Dear [Landlord Name],</p>

          <p className="font-semibold">RE: The rental property at [Property Address]</p>

          <p>
            I am writing today about your apartment advertised for rent at [Property Address]. This apartment would be
            perfect for my needs as I am looking for a place that is close to amenities and includes parking and laundry
            services. This apartment is great for us because it is close to our daughter's school and I have family in
            the area.
          </p>

          <p>
            I am 27 years old and my partner Juan Rodriguez is 28. We would like to rent this apartment for ourselves
            and our 5-year-old daughter. I am a former athlete and an active member of my community. Juan loves reading
            and is a great cook.
          </p>

          <p className="font-semibold">Rental History</p>
          <p>
            Most recently, I lived at 12 Sesame Street, Toronto. My landlord is Patty Smith (416-000-1111) and he would
            be willing to provide you with a reference. Prior to that I was living with my parents. Please see my rental
            history and references, attached.
          </p>

          <p className="font-semibold">Financial Information</p>
          <p>
            I have attached a recent credit check to this application. As you can see, my credit score is 700, which is
            considered to be good by Equifax. We have not included my partner's credit report as he has not been in
            Canada for a long time, and it would not reflect his credit worthiness. However, we have included a letter
            from his employer stating that he is a valuable and trusted employee.
          </p>

          <p>
            Our household income is approximately $3000 per month. Our normal expenses, other than rent, are about
            $1200. I am on Ontario Disability Support Program, which is a secure and guaranteed income. My partner has
            worked with his employer for 5 years and is expecting a raise this year. We also receive the Canada Child
            Benefit. I can provide a guarantor if requested. We would be able to setup a pre-authorized payment with you
            if required.
          </p>

          <p className="font-semibold">Other Information</p>
          <p>
            I have no criminal record and we do not use drugs. I do have a service dog who is quiet and very well
            trained.
          </p>

          <p>
            Thank you very much for the opportunity to apply for this apartment. If I am not your preferred candidate, I
            would appreciate knowing why so I can make my application better for future renting opportunities.
          </p>

          <p>
            Sincerely,
            <br />
            John Doe
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This cover letter will be automatically customized with the specific property address
          and landlord information when you submit an offer. If you are part of a group, a group cover letter will also
          be generated that includes all group members' information.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => setShowCoverLetterUploadModal(true)}
        >
          Decline
        </Button>
        <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setActiveTab("complete")}>
          Approve
        </Button>
      </div>
    </div>
  )

  const renderCompleteTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">You are approved for showings</h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold mb-2">Maximum Recommended Rent Amount & Rentability Score for Individual</h3>
        <div className="text-3xl font-bold text-green-600 mb-4">$2,500</div>
        <p className="text-sm text-gray-700 mb-4">
          Your request has been received and is under review. In the meantime, your approved budget is $2,500. While you
          wait, would you still proceed in booking showings for your current approved budget:
        </p>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
            Increase My Budget
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => router.push("/cart")}>
            Booking Showings
          </Button>
        </div>
      </div>

      <div>
        <div
          className="flex items-center justify-between cursor-pointer mb-4"
          onClick={() => setIsPackageCollapsed(!isPackageCollapsed)}
        >
          <h3 className="font-semibold">Your Lease Success Package</h3>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${isPackageCollapsed ? "rotate-180" : ""}`}
          />
        </div>

        {!isPackageCollapsed && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Your Lease Success Package can be downloaded below. Please note that it is only valid for 60 days starting
              from the day your credit score was requested.
            </p>

            <div className="space-y-3">
              {[
                "Rental Application",
                "Proof of Employment/Income",
                "Proof of Identification",
                "Credit report & score",
                "Cover Letter",
                "Reference Letter",
              ].map((document) => (
                <div key={document} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">{document}</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download Lease Success Package
            </Button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <DashboardLayout hideTopBar={true}>
      <div className="min-h-screen pt-6 pb-20 bg-gray-50">
        <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
          {/* Mobile header with back button */}
          {isMobile && (
            <div className="flex items-center mb-6">
              <button
                className="p-2 rounded-full hover:bg-gray-100 mr-2"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">Lease Success Package</h1>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex w-full bg-gray-100 overflow-x-auto scrollbar-hide min-h-12">
                <TabsTrigger
                  value="qualification"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                >
                  Qualification
                </TabsTrigger>
                <TabsTrigger
                  value="lease-success-package"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                >
                  Lease Success Package
                </TabsTrigger>
                <TabsTrigger
                  value="in-review"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                >
                  In Review
                </TabsTrigger>
                <TabsTrigger
                  value="cover-letter"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                >
                  Cover Letter
                </TabsTrigger>
                <TabsTrigger
                  value="complete"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                >
                  Complete
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qualification" className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Qualification Complete</h2>
                  <p className="text-gray-600">You have successfully passed the pre-qualification process.</p>
                </div>
              </TabsContent>

              <TabsContent value="lease-success-package" className="p-6">
                {mockUserData.isInternationalStudent ? (
                  renderInternationalStudentForm()
                ) : (
                  <>
                    {activeTab === "lease-success-package" && <></>}

                    {currentStep !== "" && (
                      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
                        <TabsList className="flex w-full bg-gray-100 mb-6 overflow-x-auto scrollbar-hide min-h-12">
                          <TabsTrigger
                            value="personal-info"
                            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Personal Info
                          </TabsTrigger>
                          <TabsTrigger
                            value="address-history"
                            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Address
                          </TabsTrigger>
                          <TabsTrigger
                            value="financial-history"
                            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Financial History
                          </TabsTrigger>
                          <TabsTrigger
                            value="additional-info"
                            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Additional Info
                          </TabsTrigger>
                          <TabsTrigger
                            value="documents"
                            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Documents
                          </TabsTrigger>
                          <TabsTrigger
                            value="credit-check"
                            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Credit Check
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal-info">{renderPersonalInfoStep()}</TabsContent>

                        <TabsContent value="address-history">{renderAddressHistoryStep()}</TabsContent>

                        <TabsContent value="financial-history">{renderFinancialHistoryStep()}</TabsContent>

                        <TabsContent value="additional-info">{renderAdditionalInfoStep()}</TabsContent>

                        <TabsContent value="documents">{renderDocumentsStep()}</TabsContent>

                        <TabsContent value="credit-check">{renderCreditCheckStep()}</TabsContent>
                      </Tabs>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="in-review" className="p-6">
                {renderInReviewTab()}
              </TabsContent>

              <TabsContent value="cover-letter" className="p-6">
                {renderCoverLetterTab()}
              </TabsContent>

              <TabsContent value="complete" className="p-6">
                {renderCompleteTab()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Group</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Group Name *</label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div>
                <h4 className="font-medium mb-4">Group Members</h4>

                {/* Current User (Auto-added as admin) */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">John Doe (You)</p>
                      <p className="text-sm text-gray-600">john.doe@email.com</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Occupant</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Applicant</span>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Admin</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add New Members */}
                {groupMembers.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name *</label>
                        <Input
                          placeholder="Full Name"
                          value={member.name}
                          onChange={(e) => updateGroupMember(index, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <Input
                          placeholder="Email"
                          type="email"
                          value={member.email}
                          onChange={(e) => updateGroupMember(index, "email", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Type *</label>
                        <select
                          value={member.type || "Occupant"}
                          onChange={(e) => updateGroupMember(index, "type", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="Occupant">Occupant</option>
                          <option value="Non-Occupant">Non-Occupant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Sub-type *</label>
                        <select
                          value={member.subType || "Applicant"}
                          onChange={(e) => updateGroupMember(index, "subType", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          {(member.type || "Occupant") === "Occupant" ? (
                            <>
                              <option value="Applicant">Applicant</option>
                              <option value="Non-Applicant">Non-Applicant</option>
                            </>
                          ) : (
                            <>
                              <option value="Main Applicant/Co-Signer/Guarantor">
                                Main Applicant/Co-Signer/Guarantor
                              </option>
                              <option value="Other">Other</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Relationship *</label>
                        <select
                          value={member.relationship || ""}
                          onChange={(e) => updateGroupMember(index, "relationship", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Select relationship</option>
                          <option value="Parent">Parent</option>
                          <option value="Spouse/Partner">Spouse/Partner</option>
                          <option value="Child">Child</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Grandparent">Grandparent</option>
                          <option value="Friend">Friend</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={member.isAdmin || false}
                            onCheckedChange={(checked) => updateGroupMember(index, "isAdmin", checked)}
                            disabled={
                              member.subType !== "Applicant" && member.subType !== "Main Applicant/Co-Signer/Guarantor"
                            }
                          />
                          <span className="text-sm">Make admin</span>
                        </label>

                        {member.type === "Occupant" && (
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              checked={member.isRepresented || false}
                              onCheckedChange={(checked) => updateGroupMember(index, "isRepresented", checked)}
                            />
                            <span className="text-sm">I represent this person</span>
                          </label>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeGroupMember(index)}
                        className="text-red-500 border-red-500 hover:bg-red-50"
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addGroupMember}
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group Member
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-medium text-yellow-800 mb-2">Group Cover Letter</h5>
                <p className="text-sm text-yellow-700">
                  When you submit an offer as a group, we will automatically generate a comprehensive group cover letter
                  that includes information about all group members, their roles, and combined financial strength. This
                  will be in addition to individual cover letters for each applicant.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowCreateGroupModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleCreateGroup}
                disabled={!groupName || groupMembers.some((m) => !m.name || !m.email || !m.relationship)}
              >
                Create Group & Send Invites
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Non-Lease Holders Modal */}
      {showInviteNonLeaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Invite Non-Lease Holders</h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add non-lease holders who will live in the property but won't be on the lease.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Non-Lease Holders</label>
                {nonLeaseHolders.map((holder, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Name"
                      value={holder.name}
                      onChange={(e) => updateNonLeaseHolder(index, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={holder.email}
                      onChange={(e) => updateNonLeaseHolder(index, "email", e.target.value)}
                    />
                    {nonLeaseHolders.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeNonLeaseHolder(index)}
                        className="text-red-500 border-red-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addNonLeaseHolder} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Non-Lease Holder
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowInviteNonLeaseModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleInviteNonLeaseHolders}
                disabled={nonLeaseHolders.some((h) => !h.name || !h.email)}
              >
                Send Invites
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Guarantor Modal */}
      {showInviteGuarantorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Invite Guarantor</h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add a guarantor who will co-sign the lease and be financially responsible.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Guarantor Name *</label>
                <Input
                  value={guarantor.name}
                  onChange={(e) => setGuarantor({ ...guarantor, name: e.target.value })}
                  placeholder="Enter guarantor's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Guarantor Email *</label>
                <Input
                  type="email"
                  value={guarantor.email}
                  onChange={(e) => setGuarantor({ ...guarantor, email: e.target.value })}
                  placeholder="Enter guarantor's email"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowInviteGuarantorModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleInviteGuarantor}
                disabled={!guarantor.name || !guarantor.email}
              >
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Cover Letter Upload Modal */}
      {showCoverLetterUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Your Own Cover Letter</h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You can submit your own cover letter at this step or later via the "My Documents" section in the left
                sidebar.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Cover Letter</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors"
                  onClick={() => document.getElementById("coverLetterUpload")?.click()}
                >
                  {uploadedCoverLetter ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-green-600">{uploadedCoverLetter.name}</p>
                      <p className="text-xs text-gray-500">{(uploadedCoverLetter.size / 1024).toFixed(1)} KB</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCoverLetterUpload(null)
                        }}
                        className="text-red-500 border-red-500 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700 mb-2">Click to Upload or Drag and Drop</p>
                      <p className="text-xs text-gray-500 mb-2">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                      <p className="text-xs text-blue-500 underline cursor-pointer">Browse Files</p>
                    </>
                  )}
                  <input
                    id="coverLetterUpload"
                    type="file"
                    className="hidden"
                    accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                    onChange={(e) => handleCoverLetterUpload(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCoverLetterUploadModal(false)
                  setActiveTab("complete")
                }}
              >
                Skip
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleCoverLetterConfirm}
                disabled={!uploadedCoverLetter}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </DashboardLayout>
  )
}
