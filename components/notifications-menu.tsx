"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Bell, Trash2 } from "lucide-react"

interface NotificationsMenuProps {
  onClose: () => void
}

interface Notification {
  id: string
  title: string
  address: string
  timestamp: string
  read: boolean
}

export function NotificationsMenu({ onClose }: NotificationsMenuProps) {
  // Mock notifications data with state to allow updates
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "End of Lease Completed",
      address: "224 King St W #1901, Toronto, ON M5H 1K4, Canada",
      timestamp: "Mar 28, 2025 9:35 pm",
      read: false,
    },
    {
      id: "2",
      title: "End of Lease Completed",
      address: "224 King St W #1901, Toronto, ON M5H 1K4, Canada",
      timestamp: "Mar 28, 2025 9:30 pm",
      read: false,
    },
    {
      id: "3",
      title: "End of Lease Completed",
      address: "224 King St W #1901, Toronto, ON M5H 1K4, Canada",
      timestamp: "Mar 28, 2025 9:25 pm",
      read: true,
    },
    {
      id: "4",
      title: "New Property Alert",
      address: "508 Wellington St W #602, Toronto, ON",
      timestamp: "Mar 27, 2025 10:15 am",
      read: true,
    },
  ])

  // Store read status in localStorage to persist across sessions
  useEffect(() => {
    // Load saved read status from localStorage
    const savedReadStatus = localStorage.getItem("notificationReadStatus")
    if (savedReadStatus) {
      const parsedStatus = JSON.parse(savedReadStatus)
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: parsedStatus[notification.id] || notification.read,
        })),
      )
    }
  }, [])

  // Save read status to localStorage whenever it changes
  useEffect(() => {
    const readStatus = notifications.reduce(
      (acc, notification) => {
        acc[notification.id] = notification.read
        return acc
      },
      {} as Record<string, boolean>,
    )

    localStorage.setItem("notificationReadStatus", JSON.stringify(readStatus))
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the markAsRead function
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border z-50 w-80 max-h-[80vh] overflow-auto sm:w-80 w-[calc(100vw-2rem)] sm:right-0 -right-4">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-medium text-black">
          Notifications
          {unreadCount > 0 && <span className="ml-2 text-sm text-[#484848]">({unreadCount} unread)</span>}
        </h3>
        <button
          className="text-[#484848] hover:text-[#FF5A5F] active:text-[#FF5A5F] transition-colors"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="divide-y max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-[#484848]">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 hover:bg-gray-50 cursor-pointer ${notification.read ? "bg-white" : "bg-[#767676]/10"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className="bg-[#FF5A5F]/10 rounded-full p-2 mt-1 mr-3">
                  <Bell className="h-4 w-4 text-[#FF5A5F]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-black">{notification.title}</h4>
                  <p className="text-xs text-[#484848] mt-1">{notification.address}</p>
                  <p className="text-xs text-[#484848] mt-1">Completed At: {notification.timestamp}</p>
                </div>
                <button
                  onClick={(e) => deleteNotification(notification.id, e)}
                  className="text-[#484848] hover:text-[#FF5A5F] active:text-[#FF5A5F] transition-colors p-1"
                  aria-label="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {unreadCount > 0 && (
        <div className="p-2 border-t text-center">
          <button
            className="text-sm text-[#484848] hover:text-[#FF5A5F] active:text-[#FF5A5F] transition-colors"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  )
}
