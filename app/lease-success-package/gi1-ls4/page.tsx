"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useMobile } from "@/hooks/use-mobile"

// Mock data for GI1-LS4 user
const mockGI1LS4Data = {
  isInternationalStudent: false, // FLAG_21
  hasPassedPrequalification: true,
  qualificationDate: new Date("2024-01-15"),
  isOccupant: true,
  isInvitedToGroup: true,
  groupName: "Downtown Roommates",
}

export default function GI1LS4LeaseSuccessPackagePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMobile } = useMobile()
  const [activeTab, setActiveTab] = useState("qualification")
  const [currentStep, setCurrentStep] = useState("personal-info")
  const [groupName, setGroupName] = useState("")

  // Form data state
  const [formData, setFormData] = useState({
    // International student data
    yearInSchool: "",
    guarantorRelationship: "",

    // Personal information
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    currentAddress: "",
    ssn: "",
    driversLicense: "",

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
    employmentStatus: [] as string[],
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
    signedExclusivity: false,
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

    // Social links and personal description
    linkedinUrl: "",
    twitterUrl: "",
    personalDescription: "",
  })

  // Rent responsibility assessment state
  const [showRentAssessment, setShowRentAssessment] = useState(false)
  const [rentResponsibility, setRentResponsibility] = useState("")
  const [personalBudget, setPersonalBudget] = useState(2500)
  const [canPayMoreDeposit, setCanPayMoreDeposit] = useState<boolean | null>(null)
  const [assessmentStep, setAssessmentStep] = useState("responsibility")

  useEffect(() => {
    // Get group name from URL params
    const groupNameParam = searchParams.get("groupName")
    if (groupNameParam) {
      setGroupName(decodeURIComponent(groupNameParam))
    }

    // Load invitation acceptance data
    const acceptanceData = localStorage.getItem("groupInvitationAccepted")
    if (acceptanceData) {
      const data = JSON.parse(acceptanceData)
      setFormData((prev) => ({
        ...prev,
        firstName: data.memberDetails.firstName,
        lastName: data.memberDetails.lastName,
        email: data.memberDetails.email,
        phone: data.memberDetails.phone,
      }))
      setGroupName(data.groupName)
    }
  }, [searchParams])

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

  const handleRentResponsibilityChange = (value: string) => {
    setRentResponsibility(value)

    if (value === "fully-responsible") {
      console.log("[WORKFLOW] FLAG17 set to true - User is fully responsible for rent")
      setAssessmentStep("budget")
    } else if (value === "partially-responsible") {
      console.log("[WORKFLOW] FLAG18 set to true - User is partially responsible for rent")
      setAssessmentStep("budget")
    } else if (value === "not-responsible") {
      console.log("[WORKFLOW] Navigating to V_LS2 - User is not responsible for rent")
      handleNavigateToVLS2()
    }
  }

  const handlePersonalBudgetNext = () => {
    setAssessmentStep("deposit")
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

    // Store assessment results
    localStorage.setItem(
      "gi1ls4Assessment",
      JSON.stringify({
        rentResponsibility,
        personalBudget,
        canPayMoreDeposit,
        workflow: "V_LS1",
        completedAt: new Date().toISOString(),
      }),
    )

    // @ts-ignore - Using global toast function
    window.addToast?.("Assessment complete! Proceeding to V_LS1 workflow.", "success")
    setShowRentAssessment(false)

    // Navigate back to main lease success package with assessment complete
    router.push(`/lease-success-package?invited=true&groupName=${encodeURIComponent(groupName)}&assessment=complete`)
  }

  const handleNavigateToVLS654 = () => {
    console.log("[WORKFLOW] Navigating to V_LS654 path - Standard offer process")

    // Store assessment results
    localStorage.setItem(
      "gi1ls4Assessment",
      JSON.stringify({
        rentResponsibility,
        personalBudget,
        canPayMoreDeposit,
        workflow: "V_LS654",
        completedAt: new Date().toISOString(),
      }),
    )

    // @ts-ignore - Using global toast function
    window.addToast?.("Assessment complete! Proceeding to V_LS654 workflow.", "info")
    setShowRentAssessment(false)

    // Navigate back to main lease success package
    router.push(`/lease-success-package?invited=true&groupName=${encodeURIComponent(groupName)}&assessment=complete`)
  }

  const handleNavigateToVLS2 = () => {
    console.log("[WORKFLOW] Navigating to V_LS2 path - Non-responsible tenant path")

    // Store assessment results
    localStorage.setItem(
      "gi1ls4Assessment",
      JSON.stringify({
        rentResponsibility,
        workflow: "V_LS2",
        completedAt: new Date().toISOString(),
      }),
    )

    // @ts-ignore - Using global toast function
    window.addToast?.("Assessment complete! Proceeding to V_LS2 workflow.", "info")
    setShowRentAssessment(false)

    // Navigate back to main lease success package
    router.push(`/lease-success-package?invited=true&groupName=${encodeURIComponent(groupName)}&assessment=complete`)
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
          console.log("Submitting international student data:", {
            year: formData.yearInSchool,
            guarantorRelationship: formData.guarantorRelationship,
          })
          setShowRentAssessment(true)
        }}
      >
        Submit
      </Button>
    </div>
  )

  const renderRentAssessmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {assessmentStep === "responsibility" && (
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
              <Button variant="outline" onClick={() => setShowRentAssessment(false)}>
                Cancel
              </Button>
            </div>
          </>
        )}

        {assessmentStep === "budget" && (
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
              <Button variant="outline" onClick={() => setAssessmentStep("responsibility")}>
                Back
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handlePersonalBudgetNext}>
                Next
              </Button>
            </div>
          </>
        )}

        {assessmentStep === "deposit" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Deposit Capability Assessment</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4">
                  In the event that you have already viewed properties with our Rental Specialists and are ready to
                  submit an offer, the mandatory deposit requirement amount is the first and last month's rent.
                </h4>

                <p className="text-sm text-gray-600 mb-6">
                  In a multiple offer situation where there are competing tenants for the same property, would you be
                  able to comfortably set aside more than the minimum required amount to give yourself a greater
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
              <Button variant="outline" onClick={() => setAssessmentStep("budget")}>
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
              <h1 className="text-xl font-semibold">Lease Success Package - Group Member</h1>
            </div>
          )}

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
              </TabsList>

              <TabsContent value="qualification" className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Group Member Qualification</h2>
                  <p className="text-gray-600 mb-4">
                    You've successfully passed pre-qualification as a group member. Please proceed to the Lease Success
                    Package to secure your property.
                  </p>
                  {groupName && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        Group: <strong>{groupName}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="lease-success-package" className="p-6">
                {mockGI1LS4Data.isInternationalStudent ? (
                  renderInternationalStudentForm()
                ) : (
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Lease Success Package</h2>
                    <p className="text-gray-600 mb-6">
                      The Lease Success Package is exactly what it sounds like. We have put together a comprehensive and
                      effective criteria that will allow you as a tenant to always put your best foot forward and
                      increase your chances when trying to secure a new home.
                    </p>
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => setShowRentAssessment(true)}
                    >
                      Start
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Rent Assessment Modal */}
      {showRentAssessment && renderRentAssessmentModal()}
    </DashboardLayout>
  )
}
