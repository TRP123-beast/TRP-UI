"use client"

import { useState } from "react"
import { Bell, Clock, Mail, MessageSquare, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface NotificationSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationSettings({ isOpen, onClose }: NotificationSettingsProps) {
  const [notificationTypes, setNotificationTypes] = useState({
    email: true,
    push: true,
    sms: false,
  })

  const [notificationTiming, setNotificationTiming] = useState({
    dayBefore: true,
    hoursBefore: true,
    minutesBefore: false,
  })

  const [reminderTimes, setReminderTimes] = useState({
    dayBefore: 1, // 1 day before
    hoursBefore: 2, // 2 hours before
    minutesBefore: 15, // 15 minutes before
  })

  const [defaultReminder, setDefaultReminder] = useState("day")

  const [eventTypes, setEventTypes] = useState({
    showings: true,
    appointments: true,
    deadlines: true,
    reminders: true,
  })

  const handleSave = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated",
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
            Notification Settings
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
          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-[#000000]">Notification Methods</h3>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-[#FFA500] mr-3" />
                  <Label htmlFor="email-notifications" className="text-[#000000]">
                    Email Notifications
                  </Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationTypes.email}
                  onCheckedChange={(checked) => setNotificationTypes({ ...notificationTypes, email: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-[#FFA500] mr-3" />
                  <Label htmlFor="push-notifications" className="text-[#000000]">
                    Push Notifications
                  </Label>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notificationTypes.push}
                  onCheckedChange={(checked) => setNotificationTypes({ ...notificationTypes, push: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-[#FFA500] mr-3" />
                  <Label htmlFor="sms-notifications" className="text-[#000000]">
                    SMS Notifications
                  </Label>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notificationTypes.sms}
                  onCheckedChange={(checked) => setNotificationTypes({ ...notificationTypes, sms: checked })}
                />
              </div>
            </div>
          </div>

          {/* Notification Timing */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-[#000000]">When to Notify</h3>
            <div className="space-y-4 bg-gray-50 p-3 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#FFA500] mr-3" />
                    <Label htmlFor="day-before" className="text-[#000000]">
                      Day Before
                    </Label>
                  </div>
                  <Switch
                    id="day-before"
                    checked={notificationTiming.dayBefore}
                    onCheckedChange={(checked) => setNotificationTiming({ ...notificationTiming, dayBefore: checked })}
                  />
                </div>
                {notificationTiming.dayBefore && (
                  <div className="pl-8 pr-2 mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Days before event:</span>
                      <span className="text-sm font-medium text-[#000000]">{reminderTimes.dayBefore}</span>
                    </div>
                    <Slider
                      value={[reminderTimes.dayBefore]}
                      min={1}
                      max={7}
                      step={1}
                      onValueChange={(value) => setReminderTimes({ ...reminderTimes, dayBefore: value[0] })}
                      className="py-2"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#FFA500] mr-3" />
                    <Label htmlFor="hours-before" className="text-[#000000]">
                      Hours Before
                    </Label>
                  </div>
                  <Switch
                    id="hours-before"
                    checked={notificationTiming.hoursBefore}
                    onCheckedChange={(checked) =>
                      setNotificationTiming({ ...notificationTiming, hoursBefore: checked })
                    }
                  />
                </div>
                {notificationTiming.hoursBefore && (
                  <div className="pl-8 pr-2 mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Hours before event:</span>
                      <span className="text-sm font-medium text-[#000000]">{reminderTimes.hoursBefore}</span>
                    </div>
                    <Slider
                      value={[reminderTimes.hoursBefore]}
                      min={1}
                      max={12}
                      step={1}
                      onValueChange={(value) => setReminderTimes({ ...reminderTimes, hoursBefore: value[0] })}
                      className="py-2"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#FFA500] mr-3" />
                    <Label htmlFor="minutes-before" className="text-[#000000]">
                      Minutes Before
                    </Label>
                  </div>
                  <Switch
                    id="minutes-before"
                    checked={notificationTiming.minutesBefore}
                    onCheckedChange={(checked) =>
                      setNotificationTiming({ ...notificationTiming, minutesBefore: checked })
                    }
                  />
                </div>
                {notificationTiming.minutesBefore && (
                  <div className="pl-8 pr-2 mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Minutes before event:</span>
                      <span className="text-sm font-medium text-[#000000]">{reminderTimes.minutesBefore}</span>
                    </div>
                    <Slider
                      value={[reminderTimes.minutesBefore]}
                      min={5}
                      max={60}
                      step={5}
                      onValueChange={(value) => setReminderTimes({ ...reminderTimes, minutesBefore: value[0] })}
                      className="py-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Default Reminder */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-[#000000]">Default Reminder</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <RadioGroup value={defaultReminder} onValueChange={setDefaultReminder} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day" id="day" className="text-[#FFA500]" />
                  <Label htmlFor="day" className="text-[#000000]">
                    {reminderTimes.dayBefore} day{reminderTimes.dayBefore > 1 ? "s" : ""} before
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hour" id="hour" className="text-[#FFA500]" />
                  <Label htmlFor="hour" className="text-[#000000]">
                    {reminderTimes.hoursBefore} hour{reminderTimes.hoursBefore > 1 ? "s" : ""} before
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minute" id="minute" className="text-[#FFA500]" />
                  <Label htmlFor="minute" className="text-[#000000]">
                    {reminderTimes.minutesBefore} minute{reminderTimes.minutesBefore > 1 ? "s" : ""} before
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Event Types */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-[#000000]">Event Types</h3>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="showings-notifications" className="text-[#000000]">
                  Property Showings
                </Label>
                <Switch
                  id="showings-notifications"
                  checked={eventTypes.showings}
                  onCheckedChange={(checked) => setEventTypes({ ...eventTypes, showings: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="appointments-notifications" className="text-[#000000]">
                  Appointments
                </Label>
                <Switch
                  id="appointments-notifications"
                  checked={eventTypes.appointments}
                  onCheckedChange={(checked) => setEventTypes({ ...eventTypes, appointments: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="deadlines-notifications" className="text-[#000000]">
                  Deadlines
                </Label>
                <Switch
                  id="deadlines-notifications"
                  checked={eventTypes.deadlines}
                  onCheckedChange={(checked) => setEventTypes({ ...eventTypes, deadlines: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reminders-notifications" className="text-[#000000]">
                  General Reminders
                </Label>
                <Switch
                  id="reminders-notifications"
                  checked={eventTypes.reminders}
                  onCheckedChange={(checked) => setEventTypes({ ...eventTypes, reminders: checked })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="text-[#000000]">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#000000] text-white hover:bg-[#000000]/90">
            <Check className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
