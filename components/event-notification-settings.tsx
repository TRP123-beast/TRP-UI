"use client"

import { useState } from "react"
import { Bell, Clock, X, Check, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface EventNotificationSettingsProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventTitle: string
}

export function EventNotificationSettings({ isOpen, onClose, eventId, eventTitle }: EventNotificationSettingsProps) {
  const [useDefaultSettings, setUseDefaultSettings] = useState(true)
  const [reminders, setReminders] = useState([
    { id: "1", type: "day", value: 1, enabled: true },
    { id: "2", type: "hour", value: 2, enabled: true },
  ])

  const handleAddReminder = () => {
    const newReminder = {
      id: `reminder-${Date.now()}`,
      type: "minute",
      value: 15,
      enabled: true,
    }
    setReminders([...reminders, newReminder])
  }

  const handleRemoveReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  const handleReminderTypeChange = (id: string, type: string) => {
    setReminders(reminders.map((reminder) => (reminder.id === id ? { ...reminder, type } : reminder)))
  }

  const handleReminderValueChange = (id: string, value: string) => {
    setReminders(
      reminders.map((reminder) => (reminder.id === id ? { ...reminder, value: Number.parseInt(value) } : reminder)),
    )
  }

  const handleToggleReminder = (id: string) => {
    setReminders(
      reminders.map((reminder) => (reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder)),
    )
  }

  const handleSave = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Notification settings saved",
      description: `Updated settings for "${eventTitle}"`,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#000000] flex items-center">
            <Bell className="h-5 w-5 text-[#FFA500] mr-2" />
            Event Notifications
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#000000] hover:text-[#FFA500] transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-md font-medium text-[#000000] mb-2">{eventTitle}</h3>
            <p className="text-sm text-gray-500 mb-4">Configure notification settings for this specific event.</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-[#FFA500] mr-3" />
                <span className="text-[#000000]">Use default settings</span>
              </div>
              <Switch checked={useDefaultSettings} onCheckedChange={setUseDefaultSettings} />
            </div>

            {!useDefaultSettings && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#000000] flex items-center">
                  <Clock className="h-4 w-4 text-[#FFA500] mr-2" />
                  Reminders
                </h4>

                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200"
                    >
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => handleToggleReminder(reminder.id)}
                        className="data-[state=checked]:bg-[#FFA500]"
                      />

                      <Select
                        value={reminder.value.toString()}
                        onValueChange={(value) => handleReminderValueChange(reminder.id, value)}
                        disabled={!reminder.enabled}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue placeholder="Value" />
                        </SelectTrigger>
                        <SelectContent>
                          {reminder.type === "day" &&
                            [1, 2, 3, 5, 7].map((value) => (
                              <SelectItem key={value} value={value.toString()}>
                                {value}
                              </SelectItem>
                            ))}
                          {reminder.type === "hour" &&
                            [1, 2, 3, 6, 12].map((value) => (
                              <SelectItem key={value} value={value.toString()}>
                                {value}
                              </SelectItem>
                            ))}
                          {reminder.type === "minute" &&
                            [5, 10, 15, 30, 45].map((value) => (
                              <SelectItem key={value} value={value.toString()}>
                                {value}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={reminder.type}
                        onValueChange={(value) => handleReminderTypeChange(reminder.id, value)}
                        disabled={!reminder.enabled}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day(s) before</SelectItem>
                          <SelectItem value="hour">Hour(s) before</SelectItem>
                          <SelectItem value="minute">Minute(s) before</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveReminder(reminder.id)}
                        className="ml-auto h-8 w-8 text-gray-500 hover:text-red-500"
                        disabled={!reminder.enabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddReminder}
                  className="w-full mt-2 text-[#000000] border-dashed border-gray-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="text-[#000000]">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#000000] text-white hover:bg-[#000000]/90">
            <Check className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
