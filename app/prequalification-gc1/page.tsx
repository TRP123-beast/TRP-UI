"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { PrequalificationGC1Wizard } from "@/components/prequalification-gc1-wizard"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { GC1GroupCreationWizard } from "@/components/gc1-group-creation-wizard"

export default function PrequalificationGC1Page() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const [showBackButton, setShowBackButton] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showGroupCreation, setShowGroupCreation] = useState(false)
  const [groupCreationFlags, setGroupCreationFlags] = useState<{ flag7?: boolean }>({})
  const [showPopup, setShowPopup] = useState(true)

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

  const handleGroupCreationComplete = (flags: { flag7?: boolean }) => {
    setGroupCreationFlags(flags)
    setShowGroupCreation(false)

    // Navigate to appropriate workflow based on flags
    if (flags.flag7) {
      console.log("Navigating to LS2 workflow")
      // Navigate to LS2 workflow
    } else {
      console.log("Navigating to LS1 workflow")
      // Navigate to LS1 workflow
    }
  }

  const renderPopup = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 relative max-w-md w-full mx-4 shadow-xl">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Welcome to Pre-Qualification</h3>
          <p className="text-gray-600 text-center">Ready to start your rental journey?</p>
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setShowGroupCreation(true)
                setShowPopup(false)
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Create Group
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {showPopup && renderPopup()}
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

      {!showGroupCreation && !showPopup && (
        <div className="mb-6 flex justify-center">
          <Button onClick={() => setShowGroupCreation(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
            Create Group
          </Button>
        </div>
      )}

      {showGroupCreation && (
        <GC1GroupCreationWizard
          onComplete={handleGroupCreationComplete}
          userData={{
            firstName: "Brian",
            lastName: "Plus",
            email: "brianp@gmail.com",
            phone: "+1991 424-1242",
          }}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-2 max-w-3xl overflow-y-auto flex flex-col items-center">
        <PrequalificationGC1Wizard />
      </div>

      {/* Bottom spacing for mobile */}
      {isMobile && <div className="h-20"></div>}
    </div>
  )
}
