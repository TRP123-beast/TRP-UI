"use client"

import { useEffect, useState } from "react"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastNotificationProps {
  message: string
  duration?: number
  onClose: () => void
  isVisible: boolean
  variant?: "success" | "error" | "info"
}

export function ToastNotification({
  message,
  duration = 3000,
  onClose,
  isVisible,
  variant = "success",
}: ToastNotificationProps) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsClosing(true)
        setTimeout(() => {
          onClose()
          setIsClosing(false)
        }, 300) // Animation duration
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const getVariantStyles = () => {
    switch (variant) {
      case "error":
        return "border-red-500 bg-white text-black"
      case "info":
        return "border-blue-500 bg-white text-black"
      case "success":
      default:
        return "border-[#FFA500] bg-white text-black"
    }
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-300 mx-auto",
        isClosing ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
      )}
    >
      <div className={cn("flex items-center gap-3 rounded-b-lg p-3 shadow-md border-t-0 max-w-md", getVariantStyles())}>
        {variant === "success" && <Check className="h-5 w-5 flex-shrink-0 text-[#FFA500]" />}
        <p className="font-medium text-sm">{message}</p>
        <button
          onClick={() => {
            setIsClosing(true)
            setTimeout(() => {
              onClose()
              setIsClosing(false)
            }, 300)
          }}
          className="ml-1 hover:opacity-70 p-1 flex-shrink-0 text-black"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
