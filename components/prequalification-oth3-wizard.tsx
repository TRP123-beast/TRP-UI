"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle, RefreshCw, Home } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type EmploymentType = "full-time" | "part-time" | "self-employed" | "unemployed" | "retired" | "student"

interface GroupMember {
  id: string
  firstName: string
  lastName: string
  type: "Occupant" | "Non-Occupant"
  subType: string
  relationship: string
  email: string
  status: string
  represented: boolean
}

export function PrequalificationOTH3Wizard() {
  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(10)

  // State for user data
  const [workingWithRealtor, setWorkingWithRealtor] = useState<boolean | null>(null)
  const [hasExclusivityAgreement, setHasExclusivityAgreement] = useState<boolean | null>(null)
  const [rentResponsibility, setRentResponsibility] = useState<string | null>(null)
  const [acknowledgedDisclosure, setAcknowledgedDisclosure] = useState(false)
  const [userTypeChanged, setUserTypeChanged] = useState(false)
  const [citizenshipStatus, setCitizenshipStatus] = useState<boolean | null>(null)
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>([])
  const [employmentTypeCode, setEmploymentTypeCode] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  // Group members
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    {
      id: "1",
      firstName: "Michael",
      lastName: "Brown",
      type: "Occupant",
      subType: "Applicant",
      relationship: "Not Applicable",
      email: "michael.brown@example.com",
      status: "Confirmed",
      represented: false,
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Jones",
      type: "Occupant",
      subType: "Applicant",
      relationship: "Not Applicable",
      email: "sarah.jones@example.com",
      status: "Confirmed",
      represented: false,
    },
    {
      id: "3",
      firstName: "David",
      lastName: "Miller",
      type: "Occupant",
      subType: "Applicant",
      relationship: "Not Applicable",
      email: "david.miller@example.com",
      status: "Confirmed",
      represented: false,
    },
  ])

  // Flags
  const [flags, setFlags] = useState({
    flag3: false, // Exclusivity agreement
    flag9: false, // Not a citizen/PR
    flag12: false, // Not responsible for rent
    flag17: false, // Fully responsible for rent
    flag18: false, // Partially responsible for rent
    flag23: false, // User type changed from OTH to CSG
  })

  // Update progress based on current step
  useEffect(() => {
    const totalSteps = isConverting ? 8 : 4
    const progressValue = Math.round((currentStep / totalSteps) * 100)
    setProgress(progressValue > 100 ? 100 : progressValue)
  }, [currentStep, isConverting])

  // Load data from localStorage if it exists
  useEffect(() => {
    try {
      // Load flag data
      const storedFlag3 = localStorage.getItem("flag3") === "true"
      const storedFlag9 = localStorage.getItem("flag9") === "true"
      const storedFlag12 = localStorage.getItem("flag12") === "true"
      const storedFlag17 = localStorage.getItem("flag17") === "true"
      const storedFlag18 = localStorage.getItem("flag18") === "true"
      const storedFlag23 = localStorage.getItem("flag23") === "true"

      setFlags({
        flag3: storedFlag3,
        flag9: storedFlag9,
        flag12: storedFlag12,
        flag17: storedFlag17,
        flag18: storedFlag18,
        flag23: storedFlag23,
      })

      // Load other user data
      const storedRentResponsibility = localStorage.getItem("rentResponsibility")
      if (storedRentResponsibility) {
        setRentResponsibility(storedRentResponsibility)
      }

      const storedEmploymentTypes = localStorage.getItem("employmentTypes")
      if (storedEmploymentTypes) {
        setSelectedEmploymentTypes(JSON.parse(storedEmploymentTypes))
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [])

  // Update flag function
  const updateFlag = (flagName: keyof typeof flags, value: boolean) => {
    setFlags((prev) => ({
      ...prev,
      [flagName]: value,
    }))

    // Save to localStorage
    try {
      localStorage.setItem(flagName, value.toString())
    } catch (error) {
      console.error(`Error saving ${flagName} to localStorage:`, error)
    }
  }

  // Handle employment type selection
  const handleEmploymentTypeChange = (type: EmploymentType, checked: boolean) => {
    if (checked) {
      const newTypes = [...selectedEmploymentTypes, type]
      setSelectedEmploymentTypes(newTypes)

      // Save to localStorage
      try {
        localStorage.setItem("employmentTypes", JSON.stringify(newTypes))
      } catch (error) {
        console.error("Error saving employment types to localStorage:", error)
      }
    } else {
      const newTypes = selectedEmploymentTypes.filter((t) => t !== type)
      setSelectedEmploymentTypes(newTypes)

      // Save to localStorage
      try {
        localStorage.setItem("employmentTypes", JSON.stringify(newTypes))
      } catch (error) {
        console.error("Error saving employment types to localStorage:", error)
      }
    }
  }

  // Toggle occupant representation
  const toggleOccupantRepresentation = (id: string) => {
    setGroupMembers((members) =>
      members.map((member) => (member.id === id ? { ...member, represented: !member.represented } : member)),
    )
  }

  // Convert from OTH3 to CSG3
  const convertFromOTH3ToCSG3 = () => {
    console.log("[WORKFLOW] Converting user type from OTH3 to CSG3")
    updateFlag("flag23", true)
    setUserTypeChanged(true)
    setIsConverting(true)
    setCurrentStep(4) // Go to occupant selection step
  }

  // Determine employment type code based on selected types
  const determineEmploymentTypeCode = () => {
    const hasFullTime = selectedEmploymentTypes.includes("full-time")
    const hasPartTime = selectedEmploymentTypes.includes("part-time")
    const hasSelfEmployed = selectedEmploymentTypes.includes("self-employed")
    const hasRetired = selectedEmploymentTypes.includes("retired")
    const hasUnemployed = selectedEmploymentTypes.includes("unemployed")
    const hasStudent = selectedEmploymentTypes.includes("student")

    // For OTH3 workflow
    if (flags.flag23) {
      // Converted to CSG3
      if (flags.flag17) {
        // Main Applicant/Co-Signer
        if (hasRetired) return "ET_OTH3_CSG_RET"
        if (hasFullTime && hasPartTime) return "ET_OTH3_CSG_FT_PT"
        if (hasFullTime && hasSelfEmployed) return "ET_OTH3_CSG_FT_SE"
        if (hasPartTime && hasSelfEmployed) return "ET_OTH3_CSG_PT_SE"
        if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_OTH3_CSG_FT_PT_SE"
        if (hasFullTime) return "ET_OTH3_CSG_FT"
        if (hasPartTime) return "ET_OTH3_CSG_PT"
        if (hasSelfEmployed) return "ET_OTH3_CSG_SE"
        if (hasUnemployed) return "ET_OTH3_CSG_UE"
      } else if (flags.flag18) {
        // Co-Signer
        if (hasRetired) return "ET_OTH3_COSG_RET"
        if (hasFullTime) return "ET_OTH3_COSG_FT"
        if (hasPartTime) return "ET_OTH3_COSG_PT"
        if (hasSelfEmployed) return "ET_OTH3_COSG_SE"
        if (hasUnemployed) return "ET_OTH3_COSG_UE"
      } else {
        // Guarantor (not responsible)
        return "ET_OTH3_GTR_DEFAULT"
      }
    } else {
      // Standard OTH3 workflow
      if (hasRetired) return "ET_OTH3_RET"
      if (hasFullTime) return "ET_OTH3_FT"
      if (hasPartTime) return "ET_OTH3_PT"
      if (hasSelfEmployed) return "ET_OTH3_SE"
      if (hasUnemployed) return "ET_OTH3_UE"
      if (hasStudent) return "ET_OTH3_STU"
    }

    return "ET_OTH3_DEFAULT"
  }

  // Handle next button
  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return
    }

    // Process current step
    if (currentStep === 1 && workingWithRealtor === true && hasExclusivityAgreement === true) {
      updateFlag("flag3", true)
    }

    if (currentStep === 2) {
      if (rentResponsibility === "fully") {
        updateFlag("flag17", true)
        updateFlag("flag18", false)
        updateFlag("flag12", false)
      } else if (rentResponsibility === "partially") {
        updateFlag("flag17", false)
        updateFlag("flag18", true)
        updateFlag("flag12", false)
      } else if (rentResponsibility === "not") {
        updateFlag("flag17", false)
        updateFlag("flag18", false)
        updateFlag("flag12", true)

        // Skip to completion for not responsible
        setCurrentStep(8)
        return
      }

      // Save to localStorage
      try {
        localStorage.setItem("rentResponsibility", rentResponsibility || "")
      } catch (error) {
        console.error("Error saving rent responsibility to localStorage:", error)
      }
    }

    if (currentStep === 3 && acknowledgedDisclosure) {
      convertFromOTH3ToCSG3()
      return
    }

    if (currentStep === 5 && citizenshipStatus === false) {
      updateFlag("flag9", true)

      // Skip employment for non-citizens
      setCurrentStep(7)
      return
    }

    if (currentStep === 6) {
      const code = determineEmploymentTypeCode()
      setEmploymentTypeCode(code)

      // Save to localStorage
      try {
        localStorage.setItem("employmentTypeCode", code || "")
      } catch (error) {
        console.error("Error saving employment type code to localStorage:", error)
      }
    }

    // Move to next step
    setCurrentStep(currentStep + 1)
  }

  // Validate current step
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Realtor
        if (workingWithRealtor === null) {
          alert("Please select if you are working with a realtor")
          return false
        }
        if (workingWithRealtor && hasExclusivityAgreement === null) {
          alert("Please select if you have signed an exclusivity agreement")
          return false
        }
        return true

      case 2: // Rent responsibility
        if (!rentResponsibility) {
          alert("Please select your level of responsibility")
          return false
        }
        return true

      case 3: // Disclosure
        if (!acknowledgedDisclosure) {
          alert("Please acknowledge the disclosure to continue")
          return false
        }
        return true

      case 4: // Occupant selection (after conversion)
        if (isConverting && !groupMembers.some((m) => m.represented)) {
          alert("Please select at least one occupant that you represent")
          return false
        }
        return true

      case 5: // Citizenship
        if (citizenshipStatus === null) {
          alert("Please select your citizenship status")
          return false
        }
        return true

      case 6: // Employment
        if (selectedEmploymentTypes.length === 0) {
          alert("Please select at least one employment status")
          return false
        }
        return true

      default:
        return true
    }
  }

  // Handle back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle start over
  const handleStartOver = () => {
    setCurrentStep(1)
    setWorkingWithRealtor(null)
    setHasExclusivityAgreement(null)
    setRentResponsibility(null)
    setAcknowledgedDisclosure(false)
    setUserTypeChanged(false)
    setCitizenshipStatus(null)
    setSelectedEmploymentTypes([])
    setEmploymentTypeCode(null)
    setIsConverting(false)
    setFlags({
      flag3: false,
      flag9: false,
      flag12: false,
      flag17: false,
      flag18: false,
      flag23: false,
    })

    // Reset group members
    setGroupMembers((members) => members.map((member) => ({ ...member, represented: false })))
  }

  // Handle go to dashboard
  const handleGoToDashboard = () => {
    // Save completion status
    try {
      localStorage.setItem("OTH3_COMPLETED", "true")
      localStorage.setItem("userRoleCode", userTypeChanged ? "CSG3" : "OTH3")
    } catch (error) {
      console.error("Error saving completion status:", error)
    }

    // Navigate to dashboard
    window.location.href = "/"
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: // Realtor question
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Working with Realtor</h2>
            </div>

            <div className="space-y-4">
              <p>Are you working with a licensed realtor?</p>

              <RadioGroup
                value={workingWithRealtor === null ? "" : workingWithRealtor ? "yes" : "no"}
                onValueChange={(value) => setWorkingWithRealtor(value === "yes")}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="realtor-yes" />
                  <Label htmlFor="realtor-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="realtor-no" />
                  <Label htmlFor="realtor-no">No</Label>
                </div>
              </RadioGroup>

              {workingWithRealtor && (
                <div className="pt-4 space-y-4">
                  <h3 className="text-lg font-medium">Exclusivity Agreement</h3>
                  <p>Have you signed an exclusivity agreement?</p>

                  <RadioGroup
                    value={hasExclusivityAgreement === null ? "" : hasExclusivityAgreement ? "yes" : "no"}
                    onValueChange={(value) => setHasExclusivityAgreement(value === "yes")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="exclusivity-yes" />
                      <Label htmlFor="exclusivity-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="exclusivity-no" />
                      <Label htmlFor="exclusivity-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
        )

      case 2: // Rent responsibility question
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Rent Responsibility</h2>
            </div>

            <div className="space-y-4">
              <p>What is your level of responsibility in paying the rent every month?</p>

              <RadioGroup value={rentResponsibility || ""} onValueChange={setRentResponsibility} className="space-y-3">
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="fully" id="rent-fully-responsible" />
                  <div>
                    <Label htmlFor="rent-fully-responsible" className="font-medium">
                      I am fully responsible
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">You will be tagged as "Main Applicant/Co-Signer"</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="partially" id="rent-partially-responsible" />
                  <div>
                    <Label htmlFor="rent-partially-responsible" className="font-medium">
                      I am partially responsible
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">You will be tagged as "Co-Signer"</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="not" id="rent-not-responsible" />
                  <div>
                    <Label htmlFor="rent-not-responsible" className="font-medium">
                      I am not responsible
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">You will be tagged as "Guarantor"</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 3: // Disclosure and conversion option
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Role Disclosure</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-800">
                  <strong>Disclaimer:</strong> Non-Occupants who are fully or partially responsible for monthly rental
                  payments do not qualify as "Other." Landlords require that all parties responsible for making payment
                  are disclosed as Main Applicants/Co-Signers on the Lease Agreement.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800 mb-4">
                  By continuing as a Main Applicant/Co-Signer, you acknowledge that you:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-blue-800">
                  <li>Will be responsible for making rent payments as disclosed</li>
                  <li>Will be included on the lease agreement</li>
                  <li>May be required to provide additional financial documentation</li>
                  <li>Must complete additional qualification steps</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-md">
                <Checkbox
                  id="disclosure-acknowledgment"
                  checked={acknowledgedDisclosure}
                  onCheckedChange={(checked) => setAcknowledgedDisclosure(checked as boolean)}
                />
                <Label htmlFor="disclosure-acknowledgment">
                  I acknowledge and understand my responsibilities as a Main Applicant/Co-Signer
                </Label>
              </div>
            </div>
          </div>
        )

      case 4: // Occupant selection step
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Group Members</h2>
            </div>

            <div className="space-y-4">
              <p className="font-medium">Please select the Occupants whom you represent:</p>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Name</TableHead>
                      <TableHead className="w-[120px]">Type</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px] bg-amber-50">I Represent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupMembers
                      .filter((member) => member.type === "Occupant")
                      .map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            {member.firstName} {member.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-xs">
                              <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                              {member.type}/{member.subType}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                              {member.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-center bg-amber-50">
                            <Checkbox
                              checked={member.represented}
                              onCheckedChange={() => toggleOccupantRepresentation(member.id)}
                              className="h-4 w-4"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    {groupMembers.filter((member) => member.type === "Occupant").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          No occupants found in your group. Please add occupants to continue.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )

      case 5: // Citizenship question
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Citizenship Status</h2>
            </div>

            <div className="space-y-4">
              <p>Are you a Canadian Citizen or have Permanent Residency Status in Canada?</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <RadioGroupItem
                    value="yes"
                    id="citizenship-yes"
                    checked={citizenshipStatus === true}
                    onClick={() => setCitizenshipStatus(true)}
                  />
                  <Label htmlFor="citizenship-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <RadioGroupItem
                    value="no"
                    id="citizenship-no"
                    checked={citizenshipStatus === false}
                    onClick={() => setCitizenshipStatus(false)}
                  />
                  <Label htmlFor="citizenship-no">No</Label>
                </div>
              </div>

              {citizenshipStatus === false && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-amber-700">
                    <strong>Note:</strong> Additional documentation may be required due to your citizenship status.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )

      case 6: // Employment status question
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Employment Status</h2>
            </div>

            <div className="space-y-4">
              <p>Select your current employment status (select all that apply)</p>

              <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <Checkbox
                    id="employment-student"
                    checked={selectedEmploymentTypes.includes("student")}
                    onCheckedChange={(checked) => handleEmploymentTypeChange("student", checked as boolean)}
                  />
                  <Label htmlFor="employment-student">Student</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <Checkbox
                    id="employment-full-time"
                    checked={selectedEmploymentTypes.includes("full-time")}
                    onCheckedChange={(checked) => handleEmploymentTypeChange("full-time", checked as boolean)}
                  />
                  <Label htmlFor="employment-full-time">Full-Time Employment</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <Checkbox
                    id="employment-part-time"
                    checked={selectedEmploymentTypes.includes("part-time")}
                    onCheckedChange={(checked) => handleEmploymentTypeChange("part-time", checked as boolean)}
                  />
                  <Label htmlFor="employment-part-time">Part-Time Employment</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <Checkbox
                    id="employment-self-employed"
                    checked={selectedEmploymentTypes.includes("self-employed")}
                    onCheckedChange={(checked) => handleEmploymentTypeChange("self-employed", checked as boolean)}
                  />
                  <Label htmlFor="employment-self-employed">Self-Employed</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <Checkbox
                    id="employment-unemployed"
                    checked={selectedEmploymentTypes.includes("unemployed")}
                    onCheckedChange={(checked) => handleEmploymentTypeChange("unemployed", checked as boolean)}
                  />
                  <Label htmlFor="employment-unemployed">Unemployed</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                  <Checkbox
                    id="employment-retired"
                    checked={selectedEmploymentTypes.includes("retired")}
                    onCheckedChange={(checked) => handleEmploymentTypeChange("retired", checked as boolean)}
                  />
                  <Label htmlFor="employment-retired">Retired</Label>
                </div>
              </div>
            </div>
          </div>
        )

      case 7: // Completion for converted user
      case 8: // Completion for not responsible user
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-semibold">Complete</h2>
            </div>

            <div className="space-y-4">
              {flags.flag12 && !userTypeChanged ? (
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-green-800">
                    Thank you! Once your group is qualified, you will be able to book showings and initiate offers on
                    behalf of the group.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-green-800">Your prequalification process has been successfully completed!</p>
                  </div>

                  {userTypeChanged && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-blue-800">
                        <strong>Note:</strong> Your user type has been changed from "Other" to "Main
                        Applicant/Co-Signer".
                      </p>
                    </div>
                  )}

                  {employmentTypeCode && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-blue-800">
                        Employment Type Code: <span className="font-bold">{employmentTypeCode}</span>
                      </p>
                    </div>
                  )}

                  {flags.flag9 && (
                    <div className="bg-amber-50 p-4 rounded-md">
                      <p className="text-amber-800">
                        <strong>Note:</strong> Additional documentation may be required due to your citizenship status.
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="pt-4 flex space-x-4">
                <Button onClick={handleStartOver} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Start Over
                </Button>
                <Button
                  onClick={handleGoToDashboard}
                  className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Pre-Qualification (OTH3 Workflow)</span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {renderCurrentStep()}

      {/* Navigation buttons */}
      {currentStep < 7 && (
        <div className="pt-4 flex justify-between">
          {currentStep > 1 && (
            <Button onClick={handleBack} variant="outline">
              Back
            </Button>
          )}
          {currentStep === 1 && <div></div>}

          <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
