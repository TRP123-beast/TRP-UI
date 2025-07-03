"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GroupInvitationNotificationProps {
  groupName: string
  inviterName: string
  onDismiss?: () => void
}

export function GroupInvitationNotification({ groupName, inviterName, onDismiss }: GroupInvitationNotificationProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  const handleViewInvitation = () => {
    router.push(
      `/group-invitation-acceptance?groupName=${encodeURIComponent(groupName)}&inviter=${encodeURIComponent(inviterName)}`,
    )
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Group Invitation</span>
          </div>

          <p className="text-sm text-blue-700 mb-3">
            You have been invited to become a leaseholder in <strong>{groupName}</strong>!
          </p>

          <div className="flex items-center space-x-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleViewInvitation}>
              Click to View
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
