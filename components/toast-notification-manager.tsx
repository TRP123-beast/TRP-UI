"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastNotificationProps {
  toast: Toast
  onClose: (id: string) => void
}

export function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast, onClose])

  // Updated color scheme to match app's palette (orange, black, white)
  const bgColor = {
    success: "bg-white border-orange-500 text-black",
    error: "bg-white border-black text-black",
    info: "bg-white border-orange-300 text-black",
    warning: "bg-white border-orange-400 text-black",
  }

  const iconColor = {
    success: "text-orange-500",
    error: "text-black",
    info: "text-orange-400",
    warning: "text-orange-400",
  }

  return (
    <div
      className={`${bgColor[toast.type]} border-l-4 p-4 rounded shadow-md flex justify-between items-center mb-2 animate-slide-in`}
    >
      <p>{toast.message}</p>
      <button onClick={() => onClose(toast.id)} className={`${iconColor[toast.type]} hover:opacity-70`}>
        <X size={18} />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Function to add a toast
  const addToast = (message: string, type: ToastType = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  // Function to remove a toast
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Expose the addToast function globally
  useEffect(() => {
    // @ts-ignore - Adding to window object
    window.addToast = addToast
    return () => {
      // @ts-ignore - Cleanup
      delete window.addToast
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-full">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  )
}
