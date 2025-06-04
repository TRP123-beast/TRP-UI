"use client"

import { useState, useEffect } from "react"
import { Clock, User, UserPlus, Edit, Check } from "lucide-react"

export interface ActivityLogItem {
  id: string
  type: "add" | "update" | "remove" | "status"
  message: string
  timestamp: Date
  user?: string
}

interface ActivityLogProps {
  items: ActivityLogItem[]
  maxItems?: number
}

export function ActivityLog({ items, maxItems = 5 }: ActivityLogProps) {
  const [visibleItems, setVisibleItems] = useState<ActivityLogItem[]>([])

  useEffect(() => {
    // Show only the most recent items
    setVisibleItems(items.slice(0, maxItems))
  }, [items, maxItems])

  const getIcon = (type: ActivityLogItem["type"]) => {
    switch (type) {
      case "add":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "update":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "remove":
        return <User className="h-4 w-4 text-red-500" />
      case "status":
        return <Check className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(date)
  }

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 rounded-md p-3 border max-h-48 overflow-y-auto">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <Clock className="h-4 w-4 mr-1" /> Recent Activity
      </h3>
      <ul className="space-y-2">
        {visibleItems.map((item) => (
          <li key={item.id} className="text-xs flex items-start gap-2 p-2 rounded-md bg-white border animate-fade-in">
            <div className="mt-0.5">{getIcon(item.type)}</div>
            <div className="flex-1">
              <p>{item.message}</p>
              <div className="flex justify-between items-center mt-1 text-gray-500">
                <span>{formatTime(item.timestamp)}</span>
                {item.user && <span className="text-xs">{item.user}</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
