"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: "left" | "right" | "bottom"
}

export function MobileDrawer({ isOpen, onClose, title = "", children, position = "right" }: MobileDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Handle open/close animations
  useEffect(() => {
    if (isOpen && !isVisible) {
      setIsVisible(true)
      // Small delay to allow the drawer to render before animating
      setTimeout(() => setIsAnimating(true), 10)
    } else if (!isOpen && isVisible) {
      setIsAnimating(false)
      // Wait for animation to complete before hiding the drawer
      setTimeout(() => setIsVisible(false), 300)
    }
  }, [isOpen, isVisible])

  // Handle clicks outside the drawer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isVisible])

  // Position-specific styles
  const getPositionStyles = () => {
    if (position === "left") {
      return {
        drawer: `fixed inset-y-0 left-0 w-4/5 max-w-sm h-full transform ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`,
      }
    } else if (position === "bottom") {
      return {
        drawer: `fixed inset-x-0 bottom-0 w-full h-[85vh] transform ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`,
      }
    } else {
      // Default is right
      return {
        drawer: `fixed inset-y-0 right-0 w-4/5 max-w-sm h-full transform ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`,
      }
    }
  }

  const styles = getPositionStyles()

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
      style={{ opacity: isAnimating ? 1 : 0 }}
    >
      <div
        ref={drawerRef}
        className={`${styles.drawer} bg-white shadow-lg transition-transform duration-300 ease-in-out flex flex-col z-50 rounded-${position === "bottom" ? "t" : position === "left" ? "r" : "l"}-xl`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}
