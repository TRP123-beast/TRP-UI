"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { PrequalificationGC3Wizard } from "@/components/prequalification-gc3-wizard"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function PrequalificationGC3Page() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const [showBackButton, setShowBackButton] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

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
          Pre-Qualification (GC3)
        </h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Real Estate Image */}
      <div className="w-full flex justify-center mb-6">
        <div className="relative w-full max-w-md h-48 md:h-64">
          <Image
            src="/images/financial-qualification.jpg"
            alt="Financial qualification"
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-2 max-w-3xl overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Non-Applicant Occupant Pre-Qualification</h2>
          <p className="text-gray-600">
            This pre-qualification process is for non-applicant occupants. Please complete all steps to determine your
            eligibility.
          </p>
        </div>
        <PrequalificationGC3Wizard />
      </div>

      {/* Bottom spacing for mobile */}
      {isMobile && <div className="h-20"></div>}
    </div>
  )
}
