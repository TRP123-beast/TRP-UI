"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { QualificationWizard } from "@/components/qualification-wizard"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import "./qualification.css"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function QualificationPage() {
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
        {/* Header - now with conditional styling based on scroll */}
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
          <h1
            className={`text-xl font-semibold flex-1 text-center transition-opacity duration-300 ${
              isScrolled ? "qualification-header-scrolled opacity-0" : ""
            }`}
          >
            Pre-Qualification
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Real Estate Image */}
        <div className="w-full flex justify-center mb-6">
          <div className="relative w-full max-w-md h-48 md:h-64">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Real%20estate%20pic.jpg-2mro0crGh9xwKw7hKykA7iesTYH3sR.jpeg"
              alt="Real estate keys and house model"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* Main Content - Now only showing the QualificationWizard */}
        <div className="container mx-auto px-4 py-2 max-w-3xl overflow-y-auto">
          <QualificationWizard />
        </div>

        {/* Bottom spacing for mobile */}
        {isMobile && <div className="h-20"></div>}
      </div>
    </TooltipProvider>
  )
}
