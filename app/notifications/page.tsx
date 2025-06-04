"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Bell, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Reschedule request!",
      timestamp: "Mar 30, 2025 4:59 pm",
      read: false,
    },
    {
      id: "2",
      title: "Showing Cancelled!",
      timestamp: "Mar 20, 2025 3:00 pm",
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

  const unreadCount = notifications.filter((notification) => !notification.read).length

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 px-4 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/")}
            className="text-[#484848] hover:text-[#FF5A5F] active:text-[#FF5A5F] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-base font-medium mx-auto text-[#484848]">Notifications</h1>
        </div>
      </div>

      {/* Subheader */}
      <div className="py-3 px-4 flex justify-between items-center border-b bg-white shadow-sm">
        <h2 className="font-medium text-[#484848]">
          Notifications
          {unreadCount > 0 && <span className="ml-1 font-normal">({unreadCount} unread)</span>}
        </h2>
        {unreadCount > 0 && (
          <button
            className="text-sm text-[#8B6632] hover:text-[#FF5A5F] active:text-[#FF5A5F] transition-colors"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 p-3">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-[#484848] bg-white rounded-lg shadow-sm">No notifications</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 rounded-lg shadow-sm ${
                  notification.read ? "bg-white" : "bg-[#767676]/10 border-l-4 border-[#767676]"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="mr-3 mt-0.5">
                    <Bell className="h-5 w-5 text-[#FF5A5F]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black">{notification.title}</h3>
                    {notification.address && <p className="text-sm text-[#484848] mt-1">{notification.address}</p>}
                    <p className="text-sm text-[#484848] mt-1">{notification.timestamp}</p>
                  </div>
                  <button
                    onClick={(e) => deleteNotification(notification.id, e)}
                    className="text-[#484848] hover:text-[#FF5A5F] active:text-[#FF5A5F] transition-colors ml-2 self-start mt-0.5"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
