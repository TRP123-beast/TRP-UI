"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MiLsCodePage() {
  const params = useParams()
  const router = useRouter()
  const { miLsCode } = params

  const [monthlyRentalBudget, setMonthlyRentalBudget] = useState<number>(2500)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(3000)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInternationalStudent, setIsInternationalStudent] = useState<boolean>(false)
  const [showBackButton, setShowBackButton] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  // Get the corresponding CS_LS code
  const csLsCode = miLsCode?.toString().replace("MI_", "CS_")

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Check if user is an international student from localStorage
  useEffect(() => {
    const flag21 = localStorage.getItem("FLAG21")
    if (flag21 === "true") {
      setIsInternationalStudent(true)
    }
  }, [])

  const handleComplete = () => {
    setIsSubmitting(true)

    // In a real app, you would save the data to your state management or database
    console.log("Workflow completed with the following data:", {
      miLsCode,
      csLsCode,
      monthlyRentalBudget,
      monthlyIncome,
      incomeAbove5000: monthlyIncome >= 5000,
      isInternationalStudent,
    })

    // Set FLAG 4 if income is below $5000
    if (monthlyIncome < 5000) {
      console.log("Setting FLAG 4: Income Below $5000")
      localStorage.setItem("FLAG4", "true")
    } else {
      localStorage.removeItem("FLAG4")
    }

    // Save workflow data to localStorage
    try {
      const workflowData = {
        miLsCode: miLsCode?.toString(),
        csLsCode: csLsCode?.toString(),
        monthlyRentalBudget,
        monthlyIncome,
        flags: {
          FLAG4: monthlyIncome < 5000,
        },
        completedWorkflows: [miLsCode?.toString() || ""],
      }
      localStorage.setItem("workflowData", JSON.stringify(workflowData))
    } catch (error) {
      console.error("Error saving workflow data:", error)
    }

    // Redirect to the dashboard or next step
    router.push("/")
  }

  const renderRentalBudgetQuestion = () => (
    <div>
      <h2 className="text-2xl font-semibold text-black">Monthly Rental Budget</h2>
      <p className="text-gray-600">What is your personal monthly rental budget?</p>

      <div className="space-y-4 mt-4">
        <div className="flex justify-between text-sm">
          <span>$1,000</span>
          <span>$5,000+</span>
        </div>
        <input
          type="range"
          min="1000"
          max="5000"
          step="100"
          value={monthlyRentalBudget}
          onChange={(e) => setMonthlyRentalBudget(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFA500]"
        />
        <div className="text-center font-medium">${monthlyRentalBudget}</div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={() => setCurrentQuestion(1)} className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black">
          Next
        </Button>
      </div>
    </div>
  )

  const renderMonthlyIncomeQuestion = () => (
    <div>
      <h2 className="text-2xl font-semibold text-black">Monthly Income</h2>
      <p className="text-gray-600">What is your monthly income?</p>

      <div className="space-y-4 mt-4">
        <div className="flex justify-between text-sm">
          <span>$1,000</span>
          <span>$10,000+</span>
        </div>
        <input
          type="range"
          min="1000"
          max="10000"
          step="100"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFA500]"
        />
        <div className="text-center font-medium">${monthlyIncome}</div>
      </div>

      {monthlyIncome < 5000 && (
        <Alert className="bg-amber-50 border-amber-200 mt-4">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-800">Income Below Threshold</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your income is below $5,000 per month. This may affect your qualification and will be flagged [FLAG 4].
          </AlertDescription>
        </Alert>
      )}

      {monthlyIncome >= 5000 && (
        <Alert className="bg-green-50 border-green-200 mt-4">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800">Income Above Threshold</AlertTitle>
          <AlertDescription className="text-green-700">
            Your income is above $5,000 per month, which improves your qualification.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setCurrentQuestion(0)}>
          Back
        </Button>
        <Button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-black"
        >
          {isSubmitting ? "Processing..." : "Complete"}
        </Button>
      </div>
    </div>
  )

  // Display workflow information at the top based on miLsCode
  const renderWorkflowInfo = () => {
    // Extract the LS number from the miLsCode (e.g., "MI_LS10" -> "10")
    const lsNumber = miLsCode?.toString().replace("MI_LS", "")

    // Convert to number
    const lsNum = Number.parseInt(lsNumber || "0", 10)

    // Define employment type based on LS number
    let employmentType = ""
    const studentStatus = "Student: No"
    const rentResponsibility = "Rent: Responsible"

    // Non-student workflows (LS10-LS18)
    switch (lsNum) {
      case 10:
        employmentType = "Employment: Part-Time"
        break
      case 11:
        employmentType = "Employment: Full-Time"
        break
      case 12:
        employmentType = "Employment: Self-Employed"
        break
      case 13:
        employmentType = "Employment: Retired"
        break
      case 14:
        employmentType = "Employment: Unemployed"
        break
      case 15:
        employmentType = "Employment: Full-Time, Part-Time, Self-Employed"
        break
      case 16:
        employmentType = "Employment: Full-Time, Part-Time"
        break
      case 17:
        employmentType = "Employment: Full-Time, Self-Employed"
        break
      case 18:
        employmentType = "Employment: Part-Time, Self-Employed"
        break
    }

    return (
      <div className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
        <div className="text-sm font-medium">Qualification Path: {miLsCode}</div>
        <div className="text-xs text-gray-600">{studentStatus}</div>
        <div className="text-xs text-gray-600">{rentResponsibility}</div>
        <div className="text-xs text-gray-600">{employmentType}</div>
        {isInternationalStudent && <div className="text-xs text-gray-600">International Student: Yes</div>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - with conditional styling based on scroll */}
      <div
        className={`${
          isScrolled ? "bg-transparent text-white" : "bg-transparent text-black"
        } p-4 flex items-center justify-between sticky top-0 z-10 transition-all duration-300`}
      >
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className={`${isScrolled ? "text-white hover:bg-gray-800/20" : "text-black hover:bg-gray-100"}`}
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className={`text-xl font-semibold flex-1 text-center ${isScrolled ? "qualification-header-scrolled" : ""}`}>
          Pre-Qualification
        </h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-black text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Monthly Income Qualification</CardTitle>
                <CardDescription className="text-white/80 mt-1">
                  {miLsCode} → {csLsCode}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 px-3 py-1">
                Step {currentQuestion + 1} of 2
              </Badge>
            </div>
          </CardHeader>

          <div className="px-6 pt-6">
            <Progress
              value={currentQuestion === 0 ? 50 : 100}
              className="h-2 bg-gray-100"
              indicatorClassName="bg-orange-500"
            />
            <p className="text-right text-sm text-gray-500 mt-1">{currentQuestion === 0 ? 50 : 100}% Complete</p>
          </div>

          {/* Display workflow info */}
          {renderWorkflowInfo()}

          <CardContent className="p-6">
            {currentQuestion === 0 ? renderRentalBudgetQuestion() : renderMonthlyIncomeQuestion()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
