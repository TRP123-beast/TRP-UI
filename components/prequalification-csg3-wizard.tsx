"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type EmploymentType = "full-time" | "part-time" | "self-employed" | "unemployed" | "retired" | "student"

interface PrequalificationCSG3WizardProps {
  onComplete?: (data: any) => void
}

export function PrequalificationCSG3Wizard({ onComplete }: PrequalificationCSG3WizardProps) {
  // State for tracking the current step and progress
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(10)

  // State for user data
  const [workingWithRealtor, setWorkingWithRealtor] = useState<boolean | null>(null)
  const [hasExclusivityAgreement, setHasExclusivityAgreement] = useState<boolean | null>(null)
  const [rentResponsibility, setRentResponsibility] = useState<string | null>(null)
  const [representedOccupants, setRepresentedOccupants] = useState<string[]>([])
  const [citizenshipStatus, setCitizenshipStatus] = useState<boolean | null>(null)
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>([])
  const [isStudent, setIsStudent] = useState<boolean>(false)
  const [employmentTypeCode, setEmploymentTypeCode] = useState<string | null>(null)

  // State for flags
  const [flags, setFlags] = useState({
    flag3: false, // Exclusivity agreement
    flag9: false, // Citizenship status
    flag12: false, // Not responsible for rent
    flag17: false, // Fully responsible for rent
    flag18: false, // Partially responsible for rent
  })

  // Mock group members for the occupant selection step
  const [groupMembers, setGroupMembers] = useState([
    {
      id: "1",
      name: "Jane Smith",
      type: "Occupant",
      subType: "Applicant",
      status: "Confirmed",
      selected: false,
    },
    {
      id: "2",
      name: "Mike Johnson",
      type: "Occupant",
      subType: "Applicant",
      status: "Confirmed",
      selected: false,
    },
  ])

  // Update progress based on current step
  useEffect(() => {
    const totalSteps = 6
    const progressValue = Math.round((currentStep / totalSteps) * 100)
    setProgress(progressValue > 100 ? 100 : progressValue)
  }, [currentStep])

  // Load data from localStorage if it exists
  useEffect(() => {
    try {
      // Load flag data
      const storedFlag3 = localStorage.getItem("flag3") === "true"
      const storedFlag9 = localStorage.getItem("flag9") === "true"
      const storedFlag12 = localStorage.getItem("flag12") === "true"
      const storedFlag17 = localStorage.getItem("flag17") === "true"
      const storedFlag18 = localStorage.getItem("flag18") === "true"

      setFlags({
        flag3: storedFlag3,
        flag9: storedFlag9,
        flag12: storedFlag12,
        flag17: storedFlag17,
        flag18: storedFlag18,
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

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    // Log flags to console whenever they change
    console.log("CSG3 Flags updated:", {
      flag3: flags.flag3,
      flag9: flags.flag9,
      flag12: flags.flag12,
      flag17: flags.flag17,
      flag18: flags.flag18,
    })
  }, [flags])

  // Function to update flags
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

      // Update student status
      if (type === "student") {
        setIsStudent(true)
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

      // Update student status
      if (type === "student") {
        setIsStudent(false)
      }
    }
  }

  // Determine employment type code based on selected types
  const determineEmploymentTypeCode = () => {
    const hasFullTime = selectedEmploymentTypes.includes("full-time")
    const hasPartTime = selectedEmploymentTypes.includes("part-time")
    const hasSelfEmployed = selectedEmploymentTypes.includes("self-employed")
    const hasRetired = selectedEmploymentTypes.includes("retired")
    const hasUnemployed = selectedEmploymentTypes.includes("unemployed")

    // CSG3 specific employment codes
    if (flags.flag17) {
      // Fully responsible
      if (isStudent) {
        if (hasRetired) return "ET_CSG3_S_RET"
        if (hasUnemployed) return "ET_CSG3_S_UE"
        if (hasFullTime && !hasPartTime && !hasSelfEmployed) return "ET_CSG3_S_FT"
        if (!hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_CSG3_S_PT"
        if (!hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_CSG3_S_SE"
        if (hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_CSG3_S_FT_PT"
        if (hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_CSG3_S_FT_SE"
        if (!hasFullTime && hasPartTime && hasSelfEmployed) return "ET_CSG3_S_PT_SE"
        if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_CSG3_S_FT_PT_SE"
      } else {
        if (hasRetired) return "ET_CSG3_RET"
        if (hasUnemployed) return "ET_CSG3_UE"
        if (hasFullTime && !hasPartTime && !hasSelfEmployed) return "ET_CSG3_FT"
        if (!hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_CSG3_PT"
        if (!hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_CSG3_SE"
        if (hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_CSG3_FT_PT"
        if (hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_CSG3_FT_SE"
        if (!hasFullTime && hasPartTime && hasSelfEmployed) return "ET_CSG3_PT_SE"
        if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_CSG3_FT_PT_SE"
      }
    } else if (flags.flag18) {
      // Partially responsible
      if (isStudent) {
        if (hasRetired) return "ET_CSG3_PS_RET"
        if (hasUnemployed) return "ET_CSG3_PS_UE"
        if (hasFullTime) return "ET_CSG3_PS_FT"
        if (hasPartTime) return "ET_CSG3_PS_PT"
        if (hasSelfEmployed) return "ET_CSG3_PS_SE"
      } else {
        if (hasRetired) return "ET_CSG3_P_RET"
        if (hasUnemployed) return "ET_CSG3_P_UE"
        if (hasFullTime) return "ET_CSG3_P_FT"
        if (hasPartTime) return "ET_CSG3_P_PT"
        if (hasSelfEmployed) return "ET_CSG3_P_SE"
      }
    } else {
      // Not responsible
      if (isStudent) {
        if (hasRetired) return "ET_CSG3_NS_RET"
        if (hasUnemployed) return "ET_CSG3_NS_UE"
        if (hasFullTime) return "ET_CSG3_NS_FT"
        if (hasPartTime) return "ET_CSG3_NS_PT"
        if (hasSelfEmployed) return "ET_CSG3_NS_SE"
      } else {
        if (hasRetired) return "ET_CSG3_N_RET"
        if (hasUnemployed) return "ET_CSG3_N_UE"
        if (hasFullTime) return "ET_CSG3_N_FT"
        if (hasPartTime) return "ET_CSG3_N_PT"
        if (hasSelfEmployed) return "ET_CSG3_N_SE"
      }
    }

    return "ET_CSG3_DEFAULT"
  }

  // Toggle occupant selection
  const toggleOccupantSelection = (id: string) => {
    setGroupMembers((members) =>
      members.map((member) => (member.id === id ? { ...member, selected: !member.selected } : member)),
    )

    setRepresentedOccupants((prev) => {
      if (prev.includes(id)) {
        return prev.filter((memberId) => memberId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle next step
  const handleNext = () => {
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
      }

      // Save to localStorage
      try {
        localStorage.setItem("rentResponsibility", rentResponsibility || "")
      } catch (error) {
        console.error("Error saving rent responsibility to localStorage:", error)
      }
    }

    if (currentStep === 4 && citizenshipStatus === false) {
      updateFlag("flag9", true)
    }

    if (currentStep === 5) {
      const code = determineEmploymentTypeCode()
      setEmploymentTypeCode(code)

      // Save to localStorage
      try {
        localStorage.setItem("employmentTypeCode", code || "")
      } catch (error) {
        console.error("Error saving employment type code to localStorage:", error)
      }
    }

    // Validate current step
    if (!validateCurrentStep()) {
      return
    }

    // Move to next step or complete
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete the workflow
      if (onComplete) {
        onComplete({
          workingWithRealtor,
          hasExclusivityAgreement,
          rentResponsibility,
          representedOccupants,
          citizenshipStatus,
          selectedEmploymentTypes,
          employmentTypeCode,
          flags,
        })
      }

      // Save completion status
      try {
        localStorage.setItem("CSG3_COMPLETED", "true")
        localStorage.setItem("userRoleCode", "CSG3")
      } catch (error) {
        console.error("Error saving completion status:", error)
      }

      // Redirect to dashboard or next workflow
      window.location.href = "/"
    }
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

      case 3: // Occupants selection
        if (representedOccupants.length === 0) {
          alert("Please select at least one occupant that you represent")
          return false
        }
        return true

      case 4: // Citizenship
        if (citizenshipStatus === null) {
          alert("Please select your citizenship status")
          return false
        }
        return true

      case 5: // Employment
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

  // Handle restart
  const handleRestart = () => {
    setCurrentStep(1)
    setWorkingWithRealtor(null)
    setHasExclusivityAgreement(null)
    setRentResponsibility(null)
    setRepresentedOccupants([])
    setCitizenshipStatus(null)
    setSelectedEmploymentTypes([])
    setIsStudent(false)
    setEmploymentTypeCode(null)
    setFlags({
      flag3: false,
      flag9: false,
      flag12: false,
      flag17: false,
      flag18: false,
    })

    // Reset group members selection
    setGroupMembers((members) => members.map((member) => ({ ...member, selected: false })))
  }

  // Render steps
  const renderStep = () => {
    switch (currentStep) {
      case 1: // Realtor and exclusivity
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Working with a Realtor</h2>
            <p className="text-gray-600 mb-4">Are you working with a licensed realtor?</p>

            <div className="space-y-4">
              <RadioGroup
                value={workingWithRealtor === null ? "" : workingWithRealtor ? "yes" : "no"}
                onValueChange={(value) => setWorkingWithRealtor(value === "yes")}
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
            </div>

            {workingWithRealtor && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Exclusivity Agreement</h3>
                <p className="text-gray-600 mb-4">Have you signed an exclusivity agreement?</p>

                <RadioGroup
                  value={hasExclusivityAgreement === null ? "" : hasExclusivityAgreement ? "yes" : "no"}
                  onValueChange={(value) => setHasExclusivityAgreement(value === "yes")}
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

                {hasExclusivityAgreement && (
                  <Alert className="bg-amber-50 border-amber-200 mt-4">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-700">
                      Having an exclusivity agreement may affect your eligibility for certain properties.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        )

      case 2: // Rent responsibility
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Rent Responsibility</h2>
            <p className="text-gray-600 mb-4">What is your level of responsibility in paying the rent every month?</p>

            <RadioGroup value={rentResponsibility || ""} onValueChange={setRentResponsibility}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="fully" id="rent-fully" />
                <div>
                  <Label htmlFor="rent-fully">I am fully responsible</Label>
                  <p className="text-xs text-gray-500">You will be tagged as "Main Applicant/Co-Signer"</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="partially" id="rent-partially" />
                <div>
                  <Label htmlFor="rent-partially">I am partially responsible</Label>
                  <p className="text-xs text-gray-500">You will be tagged as "Co-Signer"</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not" id="rent-not" />
                <div>
                  <Label htmlFor="rent-not">I am not responsible</Label>
                  <p className="text-xs text-gray-500">You will be tagged as "Guarantor"</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 3: // Occupant selection
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Group Members</h2>
            <p className="text-gray-600 mb-4">Select the occupants that you represent:</p>

            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.type}/{member.subType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Checkbox
                          checked={member.selected}
                          onCheckedChange={() => toggleOccupantSelection(member.id)}
                          id={`member-${member.id}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 4: // Citizenship status
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Citizenship Status</h2>
            <p className="text-gray-600 mb-4">
              Are you a Canadian Citizen or do you have Permanent Residency Status in Canada?
            </p>

            <RadioGroup
              value={citizenshipStatus === null ? "" : citizenshipStatus ? "yes" : "no"}
              onValueChange={(value) => setCitizenshipStatus(value === "yes")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="citizenship-yes" />
                <Label htmlFor="citizenship-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="citizenship-no" />
                <Label htmlFor="citizenship-no">No</Label>
              </div>
            </RadioGroup>

            {citizenshipStatus === false && (
              <Alert className="bg-amber-50 border-amber-200 mt-4">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-700">
                  You may need to provide additional documentation due to your citizenship status.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 5: // Employment status
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Employment Status</h2>
            <p className="text-gray-600 mb-4">Select your current employment status (select all that apply):</p>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-student"
                  checked={selectedEmploymentTypes.includes("student")}
                  onCheckedChange={(checked) => handleEmploymentTypeChange("student", checked as boolean)}
                />
                <Label htmlFor="employment-student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-full-time"
                  checked={selectedEmploymentTypes.includes("full-time")}
                  onCheckedChange={(checked) => handleEmploymentTypeChange("full-time", checked as boolean)}
                />
                <Label htmlFor="employment-full-time">Full-Time Employment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-part-time"
                  checked={selectedEmploymentTypes.includes("part-time")}
                  onCheckedChange={(checked) => handleEmploymentTypeChange("part-time", checked as boolean)}
                />
                <Label htmlFor="employment-part-time">Part-Time Employment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-self-employed"
                  checked={selectedEmploymentTypes.includes("self-employed")}
                  onCheckedChange={(checked) => handleEmploymentTypeChange("self-employed", checked as boolean)}
                />
                <Label htmlFor="employment-self-employed">Self-Employed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-unemployed"
                  checked={selectedEmploymentTypes.includes("unemployed")}
                  onCheckedChange={(checked) => handleEmploymentTypeChange("unemployed", checked as boolean)}
                />
                <Label htmlFor="employment-unemployed">Unemployed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employment-retired"
                  checked={selectedEmploymentTypes.includes("retired")}
                  onCheckedChange={(checked) => handleEmploymentTypeChange("retired", checked as boolean)}
                />
                <Label htmlFor="employment-retired">Retired</Label>
              </div>
            </div>
          </div>
        )

      case 6: // Completion
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold">Pre-Qualification Complete</h2>
            </div>

            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Thank you for completing the CSG3 pre-qualification process. Your information has been submitted
                successfully.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-md space-y-4 mt-4">
              <h3 className="font-medium">Summary</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">
                    {flags.flag17
                      ? "Main Applicant/Co-Signer"
                      : flags.flag18
                        ? "Co-Signer"
                        : flags.flag12
                          ? "Guarantor"
                          : "Co-Signer (Default)"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Employment Code</p>
                  <p className="font-medium">{employmentTypeCode}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Working with Realtor</p>
                  <p className="font-medium">{workingWithRealtor ? "Yes" : "No"}</p>
                </div>

                {workingWithRealtor && (
                  <div>
                    <p className="text-sm text-gray-500">Exclusivity Agreement</p>
                    <p className="font-medium">{hasExclusivityAgreement ? "Yes" : "No"}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Citizenship Status</p>
                  <p className="font-medium">{citizenshipStatus ? "Citizen/PR" : "Non-Citizen/Non-PR"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Flags</p>
                  <p className="font-medium text-gray-400 italic">Hidden (check console)</p>
                  {/* Log flags to console */}
                  {console.log(
                    "Active flags:",
                    Object.entries(flags)
                      .filter(([_, value]) => value)
                      .map(([key]) => key),
                  )}
                </div>
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
          <span className="text-sm font-medium">Pre-Qualification (CSG3 Workflow)</span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-orange-500" />
      </div>

      <div className="space-y-6">
        {renderStep()}

        <div className="pt-4 flex justify-between">
          {currentStep > 1 && currentStep < 6 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep === 1 && <div></div>}

          {currentStep < 6 ? (
            <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
              Next
            </Button>
          ) : (
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleRestart}>
                Start Over
              </Button>
              <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                Complete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
