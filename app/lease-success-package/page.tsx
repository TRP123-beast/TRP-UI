"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, Download, Check, Plus, Minus, ChevronDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useMobile } from "@/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils" // Import cn for conditional class names

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
    employmentStatus: [] as string[], // Changed to array for multi-select
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
    signedExclusivity: false, // Added new checkbox
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
    resume: null as File | null,

    // Credit check
    cardNumber: "",
    expirationDate: "",
    cvc: "",
    postalCode: "",
    termsAccepted: false,

    // Social links and personal description for cover letter
    linkedinUrl: "",
    twitterUrl: "",
    personalDescription: "",
  })

  // Update the state management section to include new states for group workflow
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showInviteNonLeaseModal, setShowInviteNonLeaseModal] = useState(false)
  const [showInviteGuarantorModal, setShowInviteGuarantorModal] = useState(false)
  const [showAddApplicantGuarantorModal, setShowAddApplicantGuarantorModal] = useState(false)
  const [showAdditionalIncomeModal, setShowAdditionalIncomeModal] = useState(false)
  const [groupCreated, setGroupCreated] = useState(false)
  const [groupBudgetData, setGroupBudgetData] = useState({
    individualBudget: 2500,
    group1Budget: 3500,
    group1Name: "",
    leaseholdersName: "Primary Leaseholders",
    leaseholdersList: ["John Doe"],
    addedMembers: [] as Array<{
      firstName: string
      lastName: string
      contributionAmount: string
      email?: string
      phone?: string
    }>,
  })
  const [singleKeyScore, setSingleKeyScore] = useState("AAA - Excellent Credit Profile")
  const [newApplicantGuarantor, setNewApplicantGuarantor] = useState({
    firstName: "",
    lastName: "",
    type: "",
    subType: "",
    relationship: "",
    email: "",
    phone: "",
    isAdmin: false,
  })
  const [additionalIncomeContact, setAdditionalIncomeContact] = useState({
    name: "",
    email: "",
  })

  const [groupName, setGroupName] = useState("")
  const [groupMembers, setGroupMembers] = useState([{ name: "", email: "" }])
  const [nonLeaseHolders, setNonLeaseHolders] = useState([{ name: "", email: "" }])
  const [guarantor, setGuarantor] = useState({ name: "", email: "" })
  const [highlightAdditionalIncome, setHighlightAdditionalIncome] = useState(false)
  const [showCoverLetterUploadModal, setShowCoverLetterUploadModal] = useState(false)
  const [uploadedCoverLetter, setUploadedCoverLetter] = useState<File | null>(null)
  const [isPackageCollapsed, setIsPackageCollapsed] = useState(false)
  const [showAddedMembersInfo, setShowAddedMembersInfo] = useState(false)
  const [isGroupApplication, setIsGroupApplication] = useState(false)
  const [activeReviewTab, setActiveReviewTab] = useState("individual")
  const [pendingLeaseholders, setPendingLeaseholders] = useState<
    Array<{
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
      status: string
      contributionAmount: number
      rentabilityScore: string
    }>
  >([])
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationInput, setVerificationInput] = useState("")
  const [isOtherLeaseholdersCollapsed, setIsOtherLeaseholdersCollapsed] = useState(true)

  // Add these new state variables after the existing ones
  const [showGI1LS4Modal, setShowGI1LS4Modal] = useState(false)
  const [gi1ls4Step, setGI1LS4Step] = useState("rent-responsibility")
  const [rentResponsibility, setRentResponsibility] = useState("")
  const [personalBudget, setPersonalBudget] = useState(2500)
  const [canPayMoreDeposit, setCanPayMoreDeposit] = useState<boolean | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [gi1ls4Flags, setGI1LS4Flags] = useState({
    flag17: false, // Fully responsible for rent
    flag18: false, // Partially responsible for rent
  })

  const [isInvitedGroupMember, setIsInvitedGroupMember] = useState(false)
  const [invitationGroupName, setInvitationGroupName] = useState("")
  const [memberBudgetAmount, setMemberBudgetAmount] = useState(2500)
  const [rentResponsibilityFlags, setRentResponsibilityFlags] = useState({
    flag17: false, // Fully responsible
    flag18: false, // Partially responsible
  })

  // Add this function after the existing state declarations and before the useEffect hooks
  const addNotificationToSystem = (notification: {
    title: string
    address?: string
    timestamp: string
    read: boolean
  }) => {
    // Get existing notifications from localStorage
    const existingNotifications = JSON.parse(localStorage.getItem("systemNotifications") || "[]")

    // Create new notification with unique ID
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
    }

    // Add to beginning of array (most recent first)
    const updatedNotifications = [newNotification, ...existingNotifications]

    // Store back to localStorage
    localStorage.setItem("systemNotifications", JSON.stringify(updatedNotifications))

    // Dispatch event to update notification components
    window.dispatchEvent(
      new CustomEvent("notificationSystemUpdated", {
        detail: { notifications: updatedNotifications },
      }),
    )
  }

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

  // Check for invitation parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const invited = urlParams.get("invited")
    const groupName = urlParams.get("groupName")

    if (invited === "true" && groupName) {
      setIsInvitedGroupMember(true)
      setInvitationGroupName(decodeURIComponent(groupName))

      // Load invitation acceptance data
      const acceptanceData = localStorage.getItem("groupInvitationAccepted")
      if (acceptanceData) {
        const data = JSON.parse(acceptanceData)
        // Pre-fill form with accepted member details
        setFormData((prev) => ({
          ...prev,
          firstName: data.memberDetails.firstName,
          lastName: data.memberDetails.lastName,
          email: data.memberDetails.email,
          phone: data.memberDetails.phone,
        }))
      }
    }
  }, [])

  const handleAddressSearch = (query: string) => {
    if (query.length > 2) {
      const filtered = mockAddressSuggestions
        .filter((addr) => addr.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5) // Limit to 5 suggestions
      setAddressSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setAddressSuggestions([])
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
    setGroupMembers([...groupMembers, { name: "", email: "" }])
  }

  const removeGroupMember = (index: number) => {
    setGroupMembers(groupMembers.filter((_, i) => i !== index))
  }

  const updateGroupMember = (index: number, field: string, value: string) => {
    const updated = [...groupMembers]
    updated[index] = { ...updated[index], [field]: value }
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

  // Update the state for group member creation to include all required fields
  const [newGroupMember, setNewGroupMember] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    email: "",
    phone: "",
    type: "Occupant",
    subType: "Applicant",
    isAdmin: false,
  })

  // Update the handleCreateGroup function
  const handleCreateGroup = () => {
    setGroupBudgetData((prev) => ({
      ...prev,
      group1Name: groupName,
      leaseholdersList: ["John Doe", `${newGroupMember.firstName} ${newGroupMember.lastName}`],
      addedMembers: [
        ...prev.addedMembers,
        {
          firstName: newGroupMember.firstName,
          lastName: newGroupMember.lastName,
          email: newGroupMember.email,
          phone: newGroupMember.phone,
          contributionAmount: "0", // Default contribution
        },
      ],
    }))

    // Add to pending leaseholders
    setPendingLeaseholders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        firstName: newGroupMember.firstName,
        lastName: newGroupMember.lastName,
        email: newGroupMember.email,
        phone: newGroupMember.phone,
        status: "Pending",
        contributionAmount: 0,
        rentabilityScore: "Pending",
      },
    ])

    setGroupCreated(true)

    // Add notification to the system
    addNotificationToSystem({
      title: "Group Created Successfully!",
      address: `Group "${groupName}" created. Invitation sent to ${newGroupMember.firstName} ${newGroupMember.lastName}.`,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      read: false,
    })

    // @ts-ignore - Using global toast function
    window.addToast?.(
      `Group "${groupName}" created successfully! Invitation sent to ${newGroupMember.firstName} ${newGroupMember.lastName}.`,
      "success",
    )

    // Dispatch custom event for notification animation
    window.dispatchEvent(new Event("notificationAdded"))

    // Store the member data for potential future use
    console.log("New group member data:", newGroupMember)

    setShowCreateGroupModal(false)
    setGroupName("")
    setNewGroupMember({
      firstName: "",
      lastName: "",
      relationship: "",
      email: "",
      phone: "",
      type: "Occupant",
      subType: "Applicant",
      isAdmin: false,
    })
  }

  // Add new handler functions
  const handleAddApplicantGuarantor = () => {
    const updatedLeaseholdersList = [
      ...groupBudgetData.leaseholdersList,
      `${newApplicantGuarantor.firstName} ${newApplicantGuarantor.lastName}`,
    ]

    setGroupBudgetData((prev) => ({
      ...prev,
      leaseholdersList: updatedLeaseholdersList,
      addedMembers: [
        ...prev.addedMembers,
        {
          firstName: newApplicantGuarantor.firstName,
          lastName: newApplicantGuarantor.lastName,
          email: newApplicantGuarantor.email,
          phone: newApplicantGuarantor.phone,
          contributionAmount: "0", // Default contribution
        },
      ],
    }))

    // Add to pending leaseholders
    setPendingLeaseholders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        firstName: newApplicantGuarantor.firstName,
        lastName: newApplicantGuarantor.lastName,
        email: newApplicantGuarantor.email,
        phone: newApplicantGuarantor.phone,
        status: "Pending",
        contributionAmount: 0,
        rentabilityScore: "Pending",
      },
    ])

    // Add notification to the system
    addNotificationToSystem({
      title: "Applicant/Guarantor Added!",
      address: `${newApplicantGuarantor.firstName} ${newApplicantGuarantor.lastName} has been added as ${newApplicantGuarantor.type}.`,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      read: false,
    })

    // @ts-ignore - Using global toast function
    window.addToast?.(
      `${newApplicantGuarantor.firstName} ${newApplicantGuarantor.lastName} added to primary leaseholders.`,
      "success",
    )

    // Dispatch custom event for notification animation
    window.dispatchEvent(new Event("notificationAdded"))

    setShowAddApplicantGuarantorModal(false)
    setNewApplicantGuarantor({
      firstName: "",
      lastName: "",
      type: "",
      subType: "",
      relationship: "",
      email: "",
      phone: "",
      isAdmin: false,
    })
  }

  const handleAdditionalIncomeInvite = () => {
    // @ts-ignore - Using global toast function
    window.addToast?.(`Income disclosure invitation sent to ${additionalIncomeContact.name}`, "success")
    setShowAdditionalIncomeModal(false)
    setAdditionalIncomeContact({ name: "", email: "" })
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

  // Add these handler functions after the existing ones
  const handleGI1LS4Start = (memberId: string) => {
    setSelectedMemberId(memberId)
    setShowGI1LS4Modal(true)
    setGI1LS4Step("rent-responsibility")
    setRentResponsibility("")
    setPersonalBudget(2500)
    setCanPayMoreDeposit(null)
    setGI1LS4Flags({ flag17: false, flag18: false })
  }

  const handleRentResponsibilityChange = (value: string) => {
    setRentResponsibility(value)

    if (value === "fully-responsible") {
      setGI1LS4Flags((prev) => ({ ...prev, flag17: true, flag18: false }))
      console.log("[WORKFLOW] FLAG17 set to true - User is fully responsible for rent")
      setGI1LS4Step("personal-budget")
    } else if (value === "partially-responsible") {
      setGI1LS4Flags((prev) => ({ ...prev, flag17: false, flag18: true }))
      console.log("[WORKFLOW] FLAG18 set to true - User is partially responsible for rent")
      setGI1LS4Step("personal-budget")
    } else if (value === "not-responsible") {
      setGI1LS4Flags((prev) => ({ ...prev, flag17: false, flag18: false }))
      console.log("[WORKFLOW] Navigating to V_LS2 - User is not responsible for rent")
      handleNavigateToVLS2()
    }
  }

  const handlePersonalBudgetNext = () => {
    if (rentResponsibility === "fully-responsible") {
      setGI1LS4Step("deposit-question")
    } else {
      // For partially responsible, might have different flow
      setGI1LS4Step("deposit-question")
    }
  }

  const handleDepositResponse = (canPay: boolean) => {
    setCanPayMoreDeposit(canPay)

    if (canPay) {
      handleNavigateToVLS1()
    } else {
      handleNavigateToVLS654()
    }
  }

  const handleNavigateToVLS1 = () => {
    console.log("[WORKFLOW] Navigating to V_LS1 path - Enhanced offer capabilities")

    // Update group budget with member's contribution
    handleGroupMemberBudgetUpdate(personalBudget, gi1ls4Flags)

    // @ts-ignore - Using global toast function
    window.addToast?.("Proceeding to V_LS1 workflow - Enhanced offer capabilities", "success")
    setShowGI1LS4Modal(false)
  }

  const handleNavigateToVLS654 = () => {
    console.log("[WORKFLOW] Navigating to V_LS654 path - Standard offer process")

    // Update group budget with member's contribution
    handleGroupMemberBudgetUpdate(personalBudget, gi1ls4Flags)

    // @ts-ignore - Using global toast function
    window.addToast?.("Proceeding to V_LS654 workflow - Standard offer process", "info")
    setShowGI1LS4Modal(false)
  }

  const handleNavigateToVLS2 = () => {
    console.log("[WORKFLOW] Navigating to V_LS2 path - Non-responsible tenant path")

    // For non-responsible members, don't add to budget but still update flags
    setRentResponsibilityFlags(gi1ls4Flags)

    // @ts-ignore - Using global toast function
    window.addToast?.("Proceeding to V_LS2 workflow - Non-responsible tenant path", "info")
    setShowGI1LS4Modal(false)
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  Can’t find address <Info className="h-3 w-3" />
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>For best results use the address shown on your driver's license</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      <div className="border rounded-lg p-4 bg-white">
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
                    onMouseDown={() => {
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
      <div className="border rounded-lg p-4 bg-white">
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
            className="h-3 w-3 md:h-4 md:w-4"
          />
          <label htmlFor="noLandlord" className="text-sm">
            I do not have a current landlord
          </label>
        </div>
      </div>

      {/* Previous Address */}
      <div className="border rounded-lg p-4 bg-white">
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
                    onMouseDown={() => {
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
                  className="text-red-500 border-red-500 hover:bg-red-50 bg-transparent"
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

  const renderFinancialHistoryStep = () => {
    const employmentOptions = ["Full-Time", "Part-Time", "Self-Employed", "Retired", "Unemployed"]
    const showDetailedEmploymentFields = formData.employmentStatus.some((status) =>
      ["Full-Time", "Part-Time", "Self-Employed"].includes(status),
    )

    const handleEmploymentStatusChange = (status: string, checked: boolean) => {
      let newStatuses = [...formData.employmentStatus]

      if (checked) {
        if (status === "Retired" || status === "Unemployed") {
          newStatuses = [status] // Exclusive selection
        } else {
          newStatuses = newStatuses.filter((s) => s !== "Retired" && s !== "Unemployed") // Remove exclusive if other selected
          newStatuses.push(status)
        }
      } else {
        newStatuses = newStatuses.filter((s) => s !== status)
      }
      updateFormData("employmentStatus", newStatuses)
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Employment Status *</label>
          <div className="grid grid-cols-2 gap-2">
            {employmentOptions.map((status) => (
              <label key={status} className="flex items-center space-x-2 text-sm">
                <Checkbox
                  id={`employment-${status}`}
                  checked={formData.employmentStatus.includes(status)}
                  onCheckedChange={(checked) => handleEmploymentStatusChange(status, !!checked)}
                  className="h-3 w-3 md:h-4 md:w-4" // Smaller on mobile
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Multiple selections allowed for Full-Time, Part-Time, and Self-Employed. Retired and Unemployed are
            exclusive options.
          </p>
        </div>

        {showDetailedEmploymentFields && (
          <>
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
          </>
        )}

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
                      className="text-red-500 border-red-500 hover:bg-red-50 bg-transparent"
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
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Self-Employed">Self-Employed</option>
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
            className="h-3 w-3 md:h-4 md:w-4"
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
            className={cn(
              "text-white",
              formData.verificationChecked && !isQualificationExpired()
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-400 cursor-not-allowed",
            )}
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
  }

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
                  className="scale-75 md:scale-100"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="ownsCar"
                  checked={formData.ownsCar === false}
                  onChange={() => updateFormData("ownsCar", false)}
                  className="scale-75 md:scale-100"
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
                  className="scale-75 md:scale-100"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="hasPets"
                  checked={formData.hasPets === false}
                  onChange={() => updateFormData("hasPets", false)}
                  className="scale-75 md:scale-100"
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
            { key: "signedExclusivity", label: "Have you signed an exclusivity agreement with a realtor?" },
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
                    className="scale-75 md:scale-100"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={key}
                    checked={formData[key as keyof typeof formData] === false}
                    onChange={() => updateFormData(key, false)}
                    className="scale-75 md:scale-100"
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

      <div className="border rounded-lg p-4 bg-white">
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
                className="scale-75 md:scale-100"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="additionalDeposit"
                checked={formData.additionalDeposit === false}
                onChange={() => updateFormData("additionalDeposit", false)}
                className="scale-75 md:scale-100"
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

      {/* Add new section for social links and personal description */}
      <div className="border-t pt-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Resume Upload</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 transition-colors"
            onClick={() => document.getElementById("resumeUpload")?.click()}
          >
            {formData.resume ? (
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-600">{formData.resume.name}</p>
                <p className="text-xs text-gray-500">{(formData.resume.size / 1024).toFixed(1)} KB</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFileUpload("resume", null)
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
                <p className="text-xs text-gray-500">PDF, DOC, DOCX (max. 5MB)</p>
              </>
            )}
            <input
              id="resumeUpload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload("resume", e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn Profile URL</label>
            <Input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => updateFormData("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter Profile URL</label>
            <Input
              type="url"
              value={formData.twitterUrl}
              onChange={(e) => updateFormData("twitterUrl", e.target.value)}
              placeholder="https://twitter.com/yourusername"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Personal Description</label>
          <Textarea
            value={formData.personalDescription}
            onChange={(e) => updateFormData("personalDescription", e.target.value)}
            placeholder="Tell us about yourself, your interests, lifestyle, etc. This will help personalize your cover letter."
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            This information will be used to create a more personalized cover letter for your rental applications.
          </p>
        </div>
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

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-800 font-medium mb-2">NOTE</p>
            <p className="text-xs text-gray-700">
              UPLOAD PROOF NOTICE TO VACATE IF WE TRP DID NOT INITIATE THE CREATION AND UPLOADING OF NOTICE TO VACATE
            </p>
            <div className="mt-2">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-orange-400 transition-colors"
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
                    <Upload className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-700">Upload Notice to Vacate</p>
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
                  className="scale-75 md:scale-100"
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
                  className="scale-75 md:scale-100"
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
                    className="scale-75 md:scale-100"
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
                    className="scale-75 md:scale-100"
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
            className="h-3 w-3 md:h-4 md:w-4"
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

  // Add this function to handle budget updates from group members
  const handleGroupMemberBudgetUpdate = (memberBudget: number, flags: any) => {
    setMemberBudgetAmount(memberBudget)
    setRentResponsibilityFlags(flags)

    // Update group budget calculation
    const userBudget = Number.parseFloat(formData.budget) || 2500
    const newGroupBudget = userBudget + memberBudget

    setGroupBudgetData((prev) => ({
      ...prev,
      group1Budget: newGroupBudget,
    }))

    // Log flags for console (as requested)
    console.log("[WORKFLOW FLAGS]", {
      FLAG17: flags.flag17,
      FLAG18: flags.flag18,
      memberBudget: memberBudget,
      totalGroupBudget: newGroupBudget,
    })

    // @ts-ignore - Using global toast function
    window.addToast?.(`Budget updated! New group budget: $${newGroupBudget.toLocaleString()}`, "success")
  }

  // Replace the renderInReviewTab function completely
  const renderInReviewTab = () => (
    <div className="space-y-6">
      {groupCreated ? (
        // Group Created Success View with Tabs
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your Group Has Been Created Successfully</h2>
            <p className="text-gray-600 mb-6">
              Our concierge is working as quickly as possible to review your application to get you out to showings.
            </p>
          </div>

          {/* Individual vs Group View Tabs */}
          {groupCreated || isInvitedGroupMember ? (
            <>
              <Tabs value={activeReviewTab} onValueChange={setActiveReviewTab} className="w-full mb-4">
                <TabsList className="grid w-full grid-cols-2 h-12 mb-4">
                  <TabsTrigger value="individual" className="h-10">
                    Individual View
                  </TabsTrigger>
                  <TabsTrigger value="group" className="h-10">
                    Group View
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="individual" className="space-y-4">
                  <h3 className="font-semibold mb-4">
                    Maximum Recommended Rent Amount & Rentability Score for Individual
                  </h3>

                  <div className="bg-white border border-orange-500 rounded-lg p-4">
                    <h4 className="font-medium text-black mb-2">Individual Budget Amount</h4>
                    <div className="text-2xl font-bold text-orange-600">
                      ${groupBudgetData.individualBudget.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-white border border-orange-500 rounded-lg p-4">
                    <h4 className="font-medium text-black mb-3">Primary Leaseholder</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-2 px-3">Name</th>
                            <th className="text-left py-2 px-3">Email</th>
                            <th className="text-left py-2 px-3">Phone</th>
                            <th className="text-left py-2 px-3">Budget</th>
                            <th className="text-left py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-3 font-medium">
                              {formData.firstName} {formData.lastName} (You)
                            </td>
                            <td className="py-2 px-3 text-gray-600">{formData.email}</td>
                            <td className="py-2 px-3 text-gray-600">{formData.phone}</td>
                            <td className="py-2 px-3 text-gray-600">
                              ${Number.parseFloat(formData.budget || "2500").toLocaleString()}
                            </td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Qualified
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="group" className="space-y-4">
                  <h3 className="font-semibold mb-4">
                    Maximum Recommended Rent Amount & Rentability Score for Your Group
                  </h3>

                  <div className="bg-white border border-orange-500 rounded-lg p-4">
                    <h4 className="font-medium text-black mb-2">{groupBudgetData.group1Name} Amount</h4>
                    <div className="text-2xl font-bold text-orange-600">
                      <em className="text-base font-bold text-orange-600">Calculation in progress</em>
                    </div>
                  </div>

                  <div className="bg-white border border-orange-500 rounded-lg p-4">
                    <h4 className="font-medium text-black mb-3">Qualified Leaseholders</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-2 px-3">Name</th>
                            <th className="text-left py-2 px-3">Email</th>
                            <th className="text-left py-2 px-3">Phone</th>
                            <th className="text-left py-2 px-3">Budget</th>
                            <th className="text-left py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-3 font-medium">
                              {formData.firstName} {formData.lastName} (You)
                            </td>
                            <td className="py-2 px-3 text-gray-600">{formData.email}</td>
                            <td className="py-2 px-3 text-gray-600">{formData.phone}</td>
                            <td className="py-2 px-3 text-gray-600">
                              ${Number.parseFloat(formData.budget || "2500").toLocaleString()}
                            </td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Qualified
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pending Leaseholders Table */}
                  {pendingLeaseholders.length > 0 && (
                    <div className="bg-white border border-orange-500 rounded-lg p-4">
                      <div
                        className="flex items-center justify-between cursor-pointer mb-3"
                        onClick={() => setIsOtherLeaseholdersCollapsed(!isOtherLeaseholdersCollapsed)}
                      >
                        <h4 className="font-medium text-black">Other Leaseholders</h4>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            isOtherLeaseholdersCollapsed ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {!isOtherLeaseholdersCollapsed && (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-300">
                                  <th className="text-left py-2 px-3">Name</th>
                                  <th className="text-left py-2 px-3">Email</th>
                                  <th className="text-left py-2 px-3">Phone</th>
                                  <th className="text-left py-2 px-3">Status</th>
                                  <th className="text-left py-2 px-3">Contribution</th>
                                  <th className="text-left py-2 px-3">Rentability Score</th>
                                  <th className="text-left py-2 px-3">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pendingLeaseholders.map((member, index) => (
                                  <tr key={member.id} className="border-b border-gray-200">
                                    <td className="py-2 px-3 font-medium">
                                      {member.firstName} {member.lastName}
                                    </td>
                                    <td className="py-2 px-3 text-gray-600">{member.email}</td>
                                    <td className="py-2 px-3 text-gray-600">{member.phone}</td>
                                    <td className="py-2 px-3">
                                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                        {member.status}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-gray-600">${member.contributionAmount}</td>
                                    <td className="py-2 px-3 text-gray-600">{member.rentabilityScore}</td>
                                    <td className="py-2 px-3">
                                      <Button
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1"
                                        onClick={() => handleGI1LS4Start(member.id)}
                                      >
                                        Proceed to View
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            * Pending members need to complete their qualification process to contribute to the group
                            budget.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            // Show only individual view
            <>
              <h3 className="font-semibold mb-2">Maximum Recommended Rent Amount & Rentability Score for Individual</h3>
              <div className="text-3xl font-bold text-orange-600 mb-4">$2,500</div>
              <p className="text-sm text-black">
                Based on your credit score and combined household income, you have been approved to book showings for
                properties up to $2,500.
              </p>
            </>
          )}

          {/* Rest of existing approval message and optional methods... */}
          <div className="bg-white border border-orange-500 rounded-lg p-6">
            <p className="text-sm text-black mb-4">
              Based on your credit score and combined household income, you have been approved to book showings for
              properties up to{" "}
              <strong>
                $
                {activeReviewTab === "individual"
                  ? groupBudgetData.individualBudget.toLocaleString()
                  : groupBudgetData.group1Budget.toLocaleString()}
              </strong>
              .
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-black">Single Key Score Output:</div>
              <div className="text-lg font-bold text-orange-600">{singleKeyScore}</div>
            </div>

            <p className="text-sm text-black">
              In order to gain access to more properties, consider the following options:
            </p>
          </div>

          {/* Optional Methods */}
          <div>
            <h3 className="font-semibold mb-4">Optional Methods to Access Additional Properties</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <span className="text-sm">Add an Applicant or Guarantor to the Lease</span>
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setShowAddApplicantGuarantorModal(true)}
                >
                  Start
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <span className="text-sm">Disclose additional sources of income</span>
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    setCurrentStep("financial-history")
                    setActiveTab("lease-success-package")
                    setHighlightAdditionalIncome(true)
                    // @ts-ignore - Using global toast function
                    window.addToast?.("Redirecting to add additional income sources...", "info")
                  }}
                >
                  Start
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setActiveTab("cover-letter")} className="px-8">
              Skip
            </Button>
          </div>
        </div>
      ) : (
        // Original Individual View
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

          <div className="bg-white border border-orange-500 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Maximum Recommended Rent Amount & Rentability Score for Individual</h3>
            <div className="text-3xl font-bold text-orange-600 mb-4">$2,500</div>
            <p className="text-sm text-black">
              Based on your credit score and combined household income, you have been approved to book showings for
              properties up to $2,500.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Optional Methods to Access Additional Properties</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <span className="text-sm flex-1 pr-2">Create a group and add additional leaseholders</span>
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px] md:min-w-[100px] whitespace-nowrap"
                  onClick={() => setShowCreateGroupModal(true)}
                >
                  Create Group
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
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
            <Button variant="outline" onClick={() => setActiveTab("cover-letter")}>
              Skip
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setActiveTab("cover-letter")}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
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
        {/* Only Individual Cover Letter */}
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold">
              {formData.firstName} {formData.lastName}
            </p>
            <p>{formData.currentAddress}</p>
            <p>
              {formData.phone}, {formData.email}
            </p>
            {/* Add social links if provided */}
            {(formData.linkedinUrl || formData.twitterUrl) && (
              <div className="text-xs text-gray-600">
                {formData.linkedinUrl && <p>LinkedIn: {formData.linkedinUrl}</p>}
                {formData.twitterUrl && <p>Twitter: {formData.twitterUrl}</p>}
              </div>
            )}
          </div>

          <p>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

          <p>Dear [landlord_name],</p>

          <p className="font-semibold">RE: The rental property at [property_address_name]</p>

          <p>
            I am writing today about your apartment advertised for rent at [property_address_name]. This apartment would
            be perfect for my needs as I am looking for a place that is close to amenities and includes parking and
            laundry services. This apartment is great for us because it is close to our daughter's school and I have
            family in the area.
          </p>

          {/* Include personal description if provided */}
          {formData.personalDescription && <p>{formData.personalDescription}</p>}

          <p>
            I am 27 years old and my partner Juan Rodriguez is 28. We would like to rent this apartment for ourselves
            and our 5-year-old daughter. I am a former athlete and an active member of my community. Juan loves reading
            and is a great cook.
          </p>

          {/* Rest of the existing cover letter content... */}
          <p className="font-semibold">Rental History</p>
          <p>
            Most recently, I lived at [previous_address]. My landlord is [landlord_reference_name]
            ([landlord_reference_phone]) and they would be willing to provide you with a reference. Prior to that I was
            living with my parents. Please see my rental history and references, attached.
          </p>

          <p className="font-semibold">Financial Information</p>
          <p>
            I have attached a recent credit check to this application. As you can see, my credit score is
            [tenant_credit_score], which is considered to be good by Equifax. We have not included my partner's credit
            report as they have not been in Canada for a long time, and it would not reflect their credit worthiness.
            However, we have included a letter from their employer stating that they are a valuable and trusted
            employee.
          </p>

          <p>
            Our household income is approximately [monthly_household_income] per month. Our normal expenses, other than
            rent, are about [monthly_expenses]. I am on [income_program_or_employment_status], which provides a secure
            and guaranteed income. My partner has worked with their employer for [years_with_employer] years and is
            expecting a raise this year. We also receive [additional_income_sources, e.g., Canada Child Benefit]. I can
            provide a guarantor if requested. We would be able to setup a pre-authorized payment with you if required.
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
            {formData.firstName} {formData.lastName}
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
          onClick={() => setShowCoverLetterUploadModal(true)}
        >
          Decline
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setActiveTab("complete")}>
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

      <div className="bg-white border border-orange-500 rounded-lg p-6 text-center">
        {groupCreated || isInvitedGroupMember ? (
          <>
            <Tabs value={activeReviewTab} onValueChange={setActiveReviewTab} className="w-full mb-4">
              <TabsList className="grid w-full grid-cols-2 h-12 mb-4">
                <TabsTrigger value="individual" className="h-10">
                  Individual
                </TabsTrigger>
                <TabsTrigger value="group" className="h-10">
                  Group
                </TabsTrigger>
              </TabsList>

              <TabsContent value="individual">
                <h3 className="font-semibold mb-2">
                  Maximum Recommended Rent Amount & Rentability Score for Individual
                </h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">
                  ${groupBudgetData.individualBudget.toLocaleString()}
                </div>
                <p className="text-sm text-black mb-4">
                  Your request has been received and is under review. In the meantime, your approved budget as an
                  individual is ${groupBudgetData.individualBudget.toLocaleString()}. It is intended for you only and
                  does not reflect the dynamic of your group.
                </p>
              </TabsContent>

              <TabsContent value="group">
                <h3 className="font-semibold mb-2">
                  Maximum Recommended Rent Amount & Rentability Score for {groupBudgetData.group1Name}
                </h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">
                  <em className="text-base font-bold text-orange-600">Calculation in progress</em>
                </div>
                <p className="text-sm text-black mb-4">
                  Your group request has been received and is under review. The group budget is calculation in progress
                  for qualification of other members.
                </p>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <h3 className="font-semibold mb-2">Maximum Recommended Rent Amount & Rentability Score for Individual</h3>
            <div className="text-3xl font-bold text-orange-600 mb-4">$2,500</div>
            <p className="text-sm text-black mb-4">
              Your request has been received and is under review. In the meantime, your approved budget is $2,500. While
              you wait, would you still proceed in browsing properties for your current approved budget:
            </p>
          </>
        )}

        <p className="text-sm text-black mb-4">
          While you wait, would you still proceed in browsing properties for your current approved budget:
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto text-sm px-2 border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
          >
            Increase My Budget
          </Button>
          <Button
            className="w-full sm:w-auto text-sm px-2 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => router.push("/")}
          >
            Browse Properties
          </Button>
          <Button
            className="w-full sm:w-auto text-sm px-2 bg-black hover:bg-gray-800 text-white"
            onClick={() => router.push("/cart")}
          >
            Go to Cart
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
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-black font-medium mb-2">Individual Package Only</p>
              <p className="text-xs text-gray-700">
                Your Lease Success Package is personalized for you as an individual. Group packages are not available
                for download.
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-4">Your Lease Success Package can be downloaded below</p>

            <div className="space-y-3">
              {[
                "Rental Application",
                "Proof of Employment/Income",
                "Proof of Identification",
                "Credit report & score",
                "Cover Letter",
                "Reference Letter",
              ].map((document) => (
                <div key={document} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <span className="text-sm font-medium">{document}</span>
                  <Button size="sm" variant="outline" onClick={() => setShowVerificationModal(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setShowVerificationModal(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Lease Success Package
            </Button>
          </>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="border-gray-500 text-gray-500 hover:bg-gray-50 bg-transparent"
          onClick={() => router.push("/")}
        >
          Exit
        </Button>
      </div>
    </div>
  )

  const removeMember = (indexToRemove: number) => {
    const memberToRemove = groupBudgetData.addedMembers[indexToRemove]
    const removedContribution = Number.parseFloat(memberToRemove.contributionAmount) || 0

    // Update added members array
    const updatedMembers = groupBudgetData.addedMembers.filter((_, index) => index !== indexToRemove)

    // Update leaseholders list
    const memberNameToRemove = `${memberToRemove.firstName} ${memberToRemove.lastName}`
    const updatedLeaseholdersList = groupBudgetData.leaseholdersList.filter((name) => name !== memberNameToRemove)

    // Recalculate budget
    const userBudget = Number.parseFloat(formData.budget) || 2500
    const remainingContributions = updatedMembers.reduce(
      (sum, member) => sum + Number.parseFloat(member.contributionAmount),
      0,
    )
    const newGroupBudget = userBudget + remainingContributions

    setGroupBudgetData((prev) => ({
      ...prev,
      group1Budget: newGroupBudget,
      leaseholdersList: updatedLeaseholdersList,
      addedMembers: updatedMembers,
    }))

    // @ts-ignore - Using global toast function
    window.addToast?.(
      `${memberNameToRemove} removed from group. New budget: $${newGroupBudget.toLocaleString()}`,
      "success",
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen pt-6 pb-20 bg-gray-50">
        <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex w-full bg-gray-100 overflow-x-auto scrollbar-hide min-h-12 border-none">
                <TabsTrigger
                  value="qualification"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm whitespace-nowrap px-2 sm:px-3 py-2 min-w-fit flex-shrink-0"
                >
                  Qualification
                </TabsTrigger>
                <TabsTrigger
                  value="lease-success-package"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm whitespace-nowrap px-2 sm:px-3 py-2 min-w-fit flex-shrink-0"
                >
                  Lease Success Package
                </TabsTrigger>
                <TabsTrigger
                  value="in-review"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                >
                  In Review
                </TabsTrigger>
                <TabsTrigger
                  value="cover-letter"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                >
                  Cover Letter
                </TabsTrigger>
                <TabsTrigger
                  value="complete"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                >
                  Complete
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qualification" className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    {isInvitedGroupMember ? "Group Member Qualification" : "Qualification Complete"}
                  </h2>
                  <p className="text-gray-600">
                    {isInvitedGroupMember
                      ? "You've successfully passed pre-qualification as a group member. Please proceed to the Lease Success Package to secure your property."
                      : "You have successfully passed the pre-qualification process."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="lease-success-package" className="p-6">
                {mockUserData.isInternationalStudent ? (
                  renderInternationalStudentForm()
                ) : (
                  <>
                    {currentStep !== "" && activeTab === "lease-success-package" && (
                      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
                        <TabsList className="flex w-full bg-gray-100 mb-6 overflow-x-auto scrollbar-hide min-h-12 border-none">
                          <TabsTrigger
                            value="personal-info"
                            className="text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Personal Info
                          </TabsTrigger>
                          <TabsTrigger
                            value="address-history"
                            className="text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-2 sm:px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Address
                          </TabsTrigger>
                          <TabsTrigger
                            value="financial-history"
                            className="text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Financial History
                          </TabsTrigger>
                          <TabsTrigger
                            value="additional-info"
                            className="text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Additional Info
                          </TabsTrigger>
                          <TabsTrigger
                            value="documents"
                            className="text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
                          >
                            Documents
                          </TabsTrigger>
                          <TabsTrigger
                            value="credit-check"
                            className="text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap px-3 py-2 min-w-fit flex-shrink-0"
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
      {/* Enhanced Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Group</h3>

            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Group Name *</label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Add Group Member</h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <Input
                      value={newGroupMember.firstName}
                      onChange={(e) => setNewGroupMember({ ...newGroupMember, firstName: e.target.value })}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <Input
                      value={newGroupMember.lastName}
                      onChange={(e) => setNewGroupMember({ ...newGroupMember, lastName: e.target.value })}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Relationship *</label>
                  <select
                    value={newGroupMember.relationship}
                    onChange={(e) => setNewGroupMember({ ...newGroupMember, relationship: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="Roommate">Roommate</option>
                    <option value="Spouse/Partner">Spouse/Partner</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      value={newGroupMember.email}
                      onChange={(e) => setNewGroupMember({ ...newGroupMember, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <Input
                      type="tel"
                      value={newGroupMember.phone}
                      onChange={(e) => setNewGroupMember({ ...newGroupMember, phone: e.target.value })}
                      placeholder="(416) 555-0123"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type *</label>
                    <select
                      value={newGroupMember.type}
                      onChange={(e) => {
                        const newType = e.target.value
                        setNewGroupMember({
                          ...newGroupMember,
                          type: newType,
                          subType: newType === "Occupant" ? "Applicant" : "Main Applicant/Co-Signer/Guarantor",
                        })
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="Occupant">Occupant</option>
                      <option value="Non-Occupant">Non-Occupant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sub-type *</label>
                    <select
                      value={newGroupMember.subType}
                      onChange={(e) => setNewGroupMember({ ...newGroupMember, subType: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      {newGroupMember.type === "Occupant" ? (
                        <>
                          <option value="Applicant">Applicant</option>
                          <option value="Non-Applicant">Non-Applicant</option>
                        </>
                      ) : (
                        <>
                          <option value="Main Applicant/Co-Signer/Guarantor">Main Applicant/Co-Signer/Guarantor</option>
                          <option value="Other">Other</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Admin *</label>
                  <select
                    value={newGroupMember.isAdmin ? "Yes" : "No"}
                    onChange={(e) => setNewGroupMember({ ...newGroupMember, isAdmin: e.target.value === "Yes" })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Admin privileges allow managing the application, inviting others, and editing group details.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateGroupModal(false)
                  setNewGroupMember({
                    firstName: "",
                    lastName: "",
                    relationship: "",
                    email: "",
                    phone: "",
                    type: "Occupant",
                    subType: "Applicant",
                    isAdmin: false,
                  })
                }}
              >
                Skip
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  if (
                    !groupName ||
                    !newGroupMember.firstName ||
                    !newGroupMember.email ||
                    !newGroupMember.phone ||
                    !newGroupMember.relationship
                  ) {
                    // @ts-ignore - Using global toast function
                    window.addToast?.("Please fill in all required fields", "error")
                    return
                  }

                  handleCreateGroup()
                }}
                disabled={
                  !groupName ||
                  !newGroupMember.firstName ||
                  !newGroupMember.email ||
                  !newGroupMember.phone ||
                  !newGroupMember.relationship
                }
              >
                Invite
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
      {/* Add Applicant/Guarantor Modal */}
      {showAddApplicantGuarantorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add an Applicant or Guarantor</h3>

            <div className="space-y-4">
              {groupBudgetData.leaseholdersList.length > 1 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Current Primary Leaseholders:</h4>
                  <div className="flex flex-wrap gap-2">
                    {groupBudgetData.leaseholdersList.map((name, index) => (
                      <span key={index} className="bg-white px-3 py-1 rounded-full text-sm border">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <Input
                    value={newApplicantGuarantor.firstName}
                    onChange={(e) => setNewApplicantGuarantor({ ...newApplicantGuarantor, firstName: e.target.value })}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <Input
                    value={newApplicantGuarantor.lastName}
                    onChange={(e) => setNewApplicantGuarantor({ ...newApplicantGuarantor, lastName: e.target.value })}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type *</label>
                  <select
                    value={newApplicantGuarantor.type}
                    onChange={(e) => setNewApplicantGuarantor({ ...newApplicantGuarantor, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Applicant">Applicant</option>
                    <option value="Guarantor">Guarantor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sub-type *</label>
                  <select
                    value={newApplicantGuarantor.subType}
                    onChange={(e) => setNewApplicantGuarantor({ ...newApplicantGuarantor, subType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Sub-type</option>
                    <option value="Co-Signer">Co-Signer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Relationship *</label>
                <select
                  value={newApplicantGuarantor.relationship}
                  onChange={(e) => setNewApplicantGuarantor({ ...newApplicantGuarantor, relationship: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="Roommate">Roommate</option>
                  <option value="Spouse/Partner">Spouse/Partner</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={newApplicantGuarantor.email}
                    onChange={(e) => setNewApplicantGuarantor({ ...newApplicantGuarantor, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <Input
                    type="tel"
                    value={newApplicantGuarantor.phone}
                    onChange={(e) => setNewApplicantGuarantor({ ...newApplicantGuarantor, phone: e.target.value })}
                    placeholder="(416) 555-0123"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Admin *</label>
                <select
                  value={newApplicantGuarantor.isAdmin ? "Yes" : "No"}
                  onChange={(e) =>
                    setNewApplicantGuarantor({ ...newApplicantGuarantor, isAdmin: e.target.value === "Yes" })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Admin privileges allow managing the application, inviting others, and editing group details.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddApplicantGuarantorModal(false)
                  setNewApplicantGuarantor({
                    firstName: "",
                    lastName: "",
                    type: "",
                    subType: "",
                    relationship: "",
                    email: "",
                    phone: "",
                    isAdmin: false,
                  })
                }}
              >
                Skip
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  if (
                    !newApplicantGuarantor.firstName ||
                    !newApplicantGuarantor.lastName ||
                    !newApplicantGuarantor.email ||
                    !newApplicantGuarantor.phone ||
                    !newApplicantGuarantor.type ||
                    !newApplicantGuarantor.subType ||
                    !newApplicantGuarantor.relationship
                  ) {
                    // @ts-ignore - Using global toast function
                    window.addToast?.("Please fill in all required fields", "error")
                    return
                  }

                  handleAddApplicantGuarantor()
                }}
                disabled={
                  !newApplicantGuarantor.firstName ||
                  !newApplicantGuarantor.lastName ||
                  !newApplicantGuarantor.email ||
                  !newApplicantGuarantor.phone ||
                  !newApplicantGuarantor.type ||
                  !newApplicantGuarantor.subType ||
                  !newApplicantGuarantor.relationship
                }
              >
                Invite
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify Account Ownership</h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                To download your Lease Success Package, please verify that you are the account owner by entering your
                email address.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <p className="text-xs text-gray-500">
                This verification ensures that only the primary leaseholder can download individual documents.
              </p>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVerificationModal(false)
                  setVerificationInput("")
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  if (verificationInput.toLowerCase() === formData.email.toLowerCase()) {
                    // @ts-ignore - Using global toast function
                    window.addToast?.("Verification successful! Download starting...", "success")
                    setShowVerificationModal(false)
                    setVerificationInput("")
                    // Trigger download logic here
                  } else {
                    // @ts-ignore - Using global toast function
                    window.addToast?.("Email verification failed. Please enter the correct email address.", "error")
                  }
                }}
                disabled={!verificationInput}
              >
                Verify & Download
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* GI1-LS4 Workflow Modal */}
      {showGI1LS4Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {gi1ls4Step === "rent-responsibility" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Rent Responsibility Assessment</h3>

                <div className="space-y-4">
                  <div className="mb-6">
                    <h4 className="text-base font-medium mb-4">
                      What is your level of responsibility in paying the rent every month?
                    </h4>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="rentResponsibility"
                          value="fully-responsible"
                          checked={rentResponsibility === "fully-responsible"}
                          onChange={(e) => handleRentResponsibilityChange(e.target.value)}
                          className="text-orange-500"
                        />
                        <div>
                          <span className="font-medium">I am fully responsible</span>
                          <p className="text-sm text-gray-600">
                            You will be responsible for the entire monthly rent payment
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="rentResponsibility"
                          value="partially-responsible"
                          checked={rentResponsibility === "partially-responsible"}
                          onChange={(e) => handleRentResponsibilityChange(e.target.value)}
                          className="text-orange-500"
                        />
                        <div>
                          <span className="font-medium">I am partially responsible</span>
                          <p className="text-sm text-gray-600">
                            You will share rent payment responsibilities with other group members
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="rentResponsibility"
                          value="not-responsible"
                          checked={rentResponsibility === "not-responsible"}
                          onChange={(e) => handleRentResponsibilityChange(e.target.value)}
                          className="text-orange-500"
                        />
                        <div>
                          <span className="font-medium">I am not responsible</span>
                          <p className="text-sm text-gray-600">You will not be responsible for rent payments</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowGI1LS4Modal(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {gi1ls4Step === "personal-budget" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Personal Budget Assessment</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-medium mb-4">
                      What is your personal monthly rental budget towards this group?
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium min-w-[60px]">$500</span>
                        <input
                          type="range"
                          min="500"
                          max="5000"
                          step="50"
                          value={personalBudget}
                          onChange={(e) => setPersonalBudget(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #FFA500 0%, #FFA500 ${((personalBudget - 500) / (5000 - 500)) * 100}%, #e5e7eb ${((personalBudget - 500) / (5000 - 500)) * 100}%, #e5e7eb 100%)`,
                          }}
                        />
                        <span className="text-sm font-medium min-w-[60px]">$5000</span>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">${personalBudget.toLocaleString()}</div>
                        <p className="text-sm text-gray-600">Monthly budget contribution</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setGI1LS4Step("rent-responsibility")}>
                    Back
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handlePersonalBudgetNext}>
                    Next
                  </Button>
                </div>
              </>
            )}

            {gi1ls4Step === "deposit-question" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Deposit Capability Assessment</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-medium mb-4">
                      In the event that you have already viewed properties with our Rental Specialists and are ready to
                      submit an offer, the mandatory deposit requirement amount is the first and last month's rent.
                    </h4>

                    <p className="text-sm text-gray-600 mb-6">
                      In a multiple offer situation where there are competing tenants for the same property, would you
                      be able to comfortably set aside more than the minimum required amount to give yourself a greater
                      advantage in the offer presentation?
                    </p>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="depositCapability"
                          value="yes"
                          checked={canPayMoreDeposit === true}
                          onChange={() => setCanPayMoreDeposit(true)}
                          className="text-orange-500"
                        />
                        <div>
                          <span className="font-medium">Yes</span>
                          <p className="text-sm text-gray-600">
                            I can provide additional deposit funds for competitive offers
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="depositCapability"
                          value="no"
                          checked={canPayMoreDeposit === false}
                          onChange={() => setCanPayMoreDeposit(false)}
                          className="text-orange-500"
                        />
                        <div>
                          <span className="font-medium">No</span>
                          <p className="text-sm text-gray-600">I can only provide the minimum required deposit</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setGI1LS4Step("personal-budget")}>
                    Back
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                      if (canPayMoreDeposit !== null) {
                        handleDepositResponse(canPayMoreDeposit)
                      }
                    }}
                    disabled={canPayMoreDeposit === null}
                  >
                    Complete Assessment
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
