"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { TooltipProvider } from "@/components/ui/tooltip"
import { GroupInvitationWizard } from "@/components/group-invitation-wizard"

export default function GroupInvitationPage() {
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
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* Header - with transparent background */}
        <div
          className={`${
            isScrolled ? "bg-transparent text-black" : "bg-transparent text-black"
          } p-4 flex items-center justify-between sticky top-0 z-10 transition-all duration-300`}
        >
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:bg-gray-100/50"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1
            className={`text-xl font-semibold flex-1 text-center transition-opacity duration-300 ${
              isScrolled ? "opacity-0" : "opacity-100"
            }`}
          >
            Group Invitation Process
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Real Estate Image */}
        <div className="w-full flex justify-center mb-6">
          <div className="relative w-full max-w-md h-48 md:h-64">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Happy%20family%20with%20kid%20buying%20new%20house%20_%20Free%E2%80%A6.jpg-6CXjxUHLjkGpeJYIk9vbndk9ao1CxS.jpeg"
              alt="Family buying a new house"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-2 max-w-3xl overflow-y-auto">
          <GroupInvitationWizard />
        </div>

        {/* Bottom spacing for mobile */}
        {isMobile && <div className="h-20"></div>}
      </div>
    </TooltipProvider>
  )
}
