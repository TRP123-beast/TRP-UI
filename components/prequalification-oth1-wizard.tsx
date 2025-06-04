"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Users, FileText, User, Briefcase, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Types
type GroupMember = {
  id: string
  firstName: string
  lastName: string
  type: "Occupant" | "Non-Occupant"
  subType: string
  status: string
  represented: boolean
}

type EmploymentType = "retired" | "unemployed" | "full-time" | "part-time" | "self-employed"

export function PrequalificationOTH1Wizard() {
  // State
  const [currentStep, setCurrentStep] = useState(1)
  const [workingWithRealtor, setWorkingWithRealtor] = useState<boolean | null>(null)
  const [hasExclusivityAgreement, setHasExclusivityAgreement] = useState<boolean | null>(null)
  const [rentResponsibilityLevel, setRentResponsibilityLevel] = useState<string | null>(null)
  const [acknowledgedDisclosure, setAcknowledgedDisclosure] = useState(false)
  const [userTypeChanged, setUserTypeChanged] = useState(false)
  const [citizenshipStatus, setCitizenshipStatus] = useState<boolean | null>(null)
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>([])
  const [employmentTypeCode, setEmploymentTypeCode] = useState<string | null>(null)
  const [workflowComplete, setWorkflowComplete] = useState(false)

  // Group members
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      type: "Occupant",
      subType: "Applicant",
      status: "Confirmed",
      represented: false,
    },
  ])

  // Flags
  const [flags, setFlags] = useState({
    flag3: false, // Exclusivity agreement
    flag9: false, // Not a citizen
    flag12: false, // Not responsible for rent
    flag17: false, // Fully responsible for rent
    flag18: false, // Partially responsible for rent
    flag23: false, // User type changed from OTH1 to CSG1
  })

  // Update flag function
  const updateFlag = (flag: keyof typeof flags, value: boolean) => {
    setFlags((prev) => {
      const newFlags = { ...prev, [flag]: value }
      console.log(`[FLAG] ${flag} set to ${value}`)
      return newFlags
    })
  }

  // Handle employment type selection
  const handleEmploymentTypeChange = (type: EmploymentType, checked: boolean) => {
    if (checked) {
      setSelectedEmploymentTypes((prev) => [...prev, type])
    } else {
      setSelectedEmploymentTypes((prev) => prev.filter((t) => t !== type))
    }
  }

  // Determine employment type code based on selected types
  const determineEmploymentTypeCode = () => {
    const hasRetired = selectedEmploymentTypes.includes("retired")
    const hasUnemployed = selectedEmploymentTypes.includes("unemployed")
    const hasFullTime = selectedEmploymentTypes.includes("full-time")
    const hasPartTime = selectedEmploymentTypes.includes("part-time")
    const hasSelfEmployed = selectedEmploymentTypes.includes("self-employed")

    if (hasRetired && !hasFullTime && !hasPartTime && !hasSelfEmployed && !hasUnemployed) return "ET_CSG1_Retired"

    if (hasUnemployed) return "ET_CSG2_E:UE"

    if (hasFullTime && !hasPartTime && !hasSelfEmployed) return "ET_CSG3_E:F/T"

    if (!hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_CSG4_E:P/T"

    if (!hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_CSG5_E:SE"

    if (hasFullTime && hasPartTime && !hasSelfEmployed) return "ET_CSG6_E:F/T,E:P/T"

    if (hasFullTime && !hasPartTime && hasSelfEmployed) return "ET_CSG7_E:F/T,E:SE"

    if (!hasFullTime && hasPartTime && hasSelfEmployed) return "ET_CSG8_E:P/T,SE"

    if (hasFullTime && hasPartTime && hasSelfEmployed) return "ET_CSG9_E:F/T,E:P/T,E:SE"

    return null
  }

  // Toggle occupant representation
  const toggleOccupantRepresentation = (id: string) => {
    setGroupMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, represented: !member.represented } : member)),
    )
  }

  // Convert from OTH1 to CSG1
  const convertFromOTH1ToCSG1 = () => {
    console.log("[WORKFLOW] Converting user type from OTH1 to CSG1")
    updateFlag("flag23", true)
    setUserTypeChanged(true)
    setCurrentStep(5) // Go to occupant selection step
  }

  // Handle next button
  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return
    }

    // Process current step
    processCurrentStep()

    // Move to next step
    setCurrentStep((prev) => prev + 1)
  }

  // Validate current step
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Realtor question
        if (workingWithRealtor === null) {
          alert("Please select if you are working with a realtor")
          return false
        }
        return true

      case 2: // Exclusivity agreement
        if (hasExclusivityAgreement === null) {
          alert("Please select if you have signed an exclusivity agreement")
          return false
        }
        return true

      case 3: // Rent responsibility
        if (!rentResponsibilityLevel) {
          alert("Please select your rent responsibility level")
          return false
        }
        return true

      case 4: // Disclosure acknowledgment
        if (!acknowledgedDisclosure) {
          alert("Please acknowledge the disclosure to continue")
          return false
        }
        return true

      case 5: // Occupant selection
        if (!groupMembers.some((member) => member.represented)) {
          alert("Please select at least one occupant that you represent")
          return false
        }
        return true

      case 6: // Citizenship
        if (citizenshipStatus === null) {
          alert("Please select your citizenship status")
          return false
        }
        return true

      case 7: // Employment status
        if (selectedEmploymentTypes.length === 0) {
          alert("Please select at least one employment status")
          return false
        }
        return true

      default:
        return true
    }
  }

  // Process current step
  const processCurrentStep = () => {
    switch (currentStep) {
      case 1: // Realtor question
        // No processing needed, just move to next step
        break

      case 2: // Exclusivity agreement
        if (hasExclusivityAgreement) {
          updateFlag("flag3", true)
        }
        break

      case 3: // Rent responsibility
        if (rentResponsibilityLevel === "fully-responsible") {
          updateFlag("flag17", true)
        } else if (rentResponsibilityLevel === "partially-responsible") {
          updateFlag("flag18", true)
        } else if (rentResponsibilityLevel === "not-responsible") {
          updateFlag("flag12", true)
          // Skip to completion for not responsible
          setCurrentStep(8)
        }
        break

      case 4: // Disclosure acknowledgment
        convertFromOTH1ToCSG1()
        break

      case 5: // Occupant selection
        // No processing needed, just move to next step
        break

      case 6: // Citizenship
        if (!citizenshipStatus) {
          updateFlag("flag9", true)
          // Skip employment for non-citizens
          setCurrentStep(7)
        }
        break

      case 7: // Employment status
        const code = determineEmploymentTypeCode()
        setEmploymentTypeCode(code)
        console.log(`[EMPLOYMENT] Type code determined: ${code}`)
        break

      case 8: // Completion
        setWorkflowComplete(true)
        break
    }
  }

  // Handle start over
  const handleStartOver = () => {
    setCurrentStep(1)
    setWorkingWithRealtor(null)
    setHasExclusivityAgreement(null)
    setRentResponsibilityLevel(null)
    setAcknowledgedDisclosure(false)
    setUserTypeChanged(false)
    setCitizenshipStatus(null)
    setSelectedEmploymentTypes([])
    setEmploymentTypeCode(null)
    setWorkflowComplete(false)
    setFlags({
      flag3: false,
      flag9: false,
      flag12: false,
      flag17: false,
      flag18: false,
      flag23: false,
    })
    setGroupMembers(groupMembers.map((member) => ({ ...member, represented: false })))
  }

  // Handle go to dashboard
  const handleGoToDashboard = () => {
    window.location.href = "/"
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: // Realtor question
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
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

              <div className="pt-4">
                <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )

      case 2: // Exclusivity agreement
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Exclusivity Agreement</h2>
            </div>

            <div className="space-y-4">
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

              <div className="pt-4">
                <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )

      case 3: // Rent responsibility
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Rent Responsibility</h2>
            </div>

            <div className="space-y-4">
              <p>What is your level of responsibility in paying the rent every month?</p>

              <RadioGroup
                value={rentResponsibilityLevel || ""}
                onValueChange={setRentResponsibilityLevel}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fully-responsible" id="rent-fully-responsible" />
                  <Label htmlFor="rent-fully-responsible">I am fully responsible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partially-responsible" id="rent-partially-responsible" />
                  <Label htmlFor="rent-partially-responsible">I am partially responsible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-responsible" id="rent-not-responsible" />
                  <Label htmlFor="rent-not-responsible">I am not responsible</Label>
                </div>
              </RadioGroup>

              <div className="pt-4">
                <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )

      case 4: // Disclosure
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disclosure-acknowledgment"
                  checked={acknowledgedDisclosure}
                  onCheckedChange={(checked) => setAcknowledgedDisclosure(checked as boolean)}
                />
                <Label htmlFor="disclosure-acknowledgment">
                  I acknowledge and understand my responsibilities as a Main Applicant/Co-Signer
                </Label>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={!acknowledgedDisclosure}
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )

      case 5: // Occupant selection
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Group Members</h2>
            </div>

            <div className="space-y-4">
              <p className="font-medium">Please select the Occupants whom you represent:</p>

              <div className="border rounded-md overflow-hidden">
                <Table className="w-full border-collapse text-sm">
                  <TableHeader>
                    <TableRow className="[&>th]:py-2 [&>th]:px-2 bg-gray-50">
                      <TableHead className="w-[120px]">Name</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px] bg-amber-50">I Represent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupMembers
                      .filter((member) => member.type === "Occupant")
                      .map((member) => (
                        <TableRow key={member.id} className="[&>td]:py-1.5 [&>td]:px-2">
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

              <div className="pt-4 flex justify-end">
                <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )

      case 6: // Citizenship
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Citizenship Status</h2>
            </div>

            <div className="space-y-4">
              <p>Are you a Canadian Citizen or have Permanent Residency Status in Canada?</p>

              <div className="flex space-x-4">
                <Button
                  variant={citizenshipStatus === true ? "default" : "outline"}
                  onClick={() => setCitizenshipStatus(true)}
                  className={citizenshipStatus === true ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  Yes
                </Button>
                <Button
                  variant={citizenshipStatus === false ? "default" : "outline"}
                  onClick={() => setCitizenshipStatus(false)}
                  className={citizenshipStatus === false ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  No
                </Button>
              </div>

              <div className="pt-4">
                <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )

      case 7: // Employment status
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Employment Status</h2>
            </div>

            <div className="space-y-4">
              <p>Select your current employment status (select all that apply)</p>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="employment-retired"
                    checked={selectedEmploymentTypes.includes("retired")}
                    onCheckedChange={(checked) => handleEmploymentTypeChange("retired", checked as boolean)}
                  />
                  <Label htmlFor="employment-retired">Retired</Label>
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
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={selectedEmploymentTypes.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )

      case 8: // Completion
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-semibold">Complete</h2>
            </div>

            <div className="space-y-4">
              {flags.flag12 ? (
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

                  {employmentTypeCode && citizenshipStatus && (
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
          <span className="text-sm font-medium">Pre-Qualification (OTH1 Workflow)</span>
          <span className="text-sm font-medium">{Math.round((currentStep / 8) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-orange-500 rounded-full"
            style={{ width: `${Math.round((currentStep / 8) * 100)}%` }}
          ></div>
        </div>
      </div>

      {renderCurrentStep()}
    </div>
  )
}
