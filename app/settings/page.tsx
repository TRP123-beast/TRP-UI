"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SettingsPage() {
  const router = useRouter()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [currentWeek, setCurrentWeek] = useState("Apr 24 - Apr 30")

  const teamMembers = [
    {
      firstName: "Waruna",
      lastName: "Gidrane",
      type: "Occupant",
      subType: "Non-Applicant",
      role: "Non-Admin",
      requiredForShowings: false,
    },
    {
      firstName: "Viral",
      lastName: "Kotli",
      type: "Non-Occupant",
      subType: "Main Applicant",
      role: "Admin",
      requiredForShowings: true,
    },
  ]

  // Time slots for the calendar
  const timeSlots = [
    "9:00 am - 10:00 am",
    "10:00 am - 11:00 am",
    "11:00 am - 12:00 pm",
    "12:00 pm - 1:00 pm",
    "1:00 pm - 2:00 pm",
    "2:00 pm - 3:00 pm",
    "3:00 pm - 4:00 pm",
    "4:00 pm - 5:00 pm",
    "5:00 pm - 6:00 pm",
    "6:00 pm - 7:00 pm",
  ]

  // Days of the week
  const daysOfWeek = [
    { name: "Fri", date: "04" },
    { name: "Sat", date: "05" },
    { name: "Sun", date: "06" },
    { name: "Mon", date: "07" },
    { name: "Tue", date: "08" },
    { name: "Wed", date: "09" },
    { name: "Thu", date: "10" },
  ]

  return (
    <DashboardLayout>
      <div className="px-4 md:px-8 lg:px-10 py-6">
        <h1 className="text-2xl font-bold mb-6 hidden md:block">End of Lease</h1>

        <Tabs defaultValue="endoflease" className="w-auto mb-6">
          <TabsList className="bg-white border-b">
            <TabsTrigger
              value="leasestatus"
              className="data-[state=active]:text-navy-blue data-[state=active]:border-b-2 data-[state=active]:border-navy-blue rounded-none px-6 py-2"
            >
              Lease Status
            </TabsTrigger>
            <TabsTrigger
              value="endoflease"
              className="data-[state=active]:text-navy-blue data-[state=active]:border-b-2 data-[state=active]:border-navy-blue rounded-none px-6 py-2"
            >
              End of Lease
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="data-[state=active]:text-navy-blue data-[state=active]:border-b-2 data-[state=active]:border-navy-blue rounded-none px-6 py-2"
            >
              Properties
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Choose a Group</label>
          <div className="flex items-center gap-2 justify-between">
            <select className="border rounded-md px-3 py-2 w-64">
              <option>Blue Team</option>
              <option>Red Team</option>
              <option>Green Team</option>
            </select>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">Add New Group</Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Group Name: Blue team</h2>
            <div className="flex gap-2">
              <Button className="bg-navy-blue hover:bg-navy-blue/90">Add User</Button>
              <Button variant="destructive">Remove Group</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2 text-left">First Name</th>
                  <th className="border px-4 py-2 text-left">Last Name</th>
                  <th className="border px-4 py-2 text-left">Type</th>
                  <th className="border px-4 py-2 text-left">Sub-Type</th>
                  <th className="border px-4 py-2 text-left">Role</th>
                  <th className="border px-4 py-2 text-center">Required For Showings</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{member.firstName}</td>
                    <td className="border px-4 py-2">{member.lastName}</td>
                    <td className="border px-4 py-2">{member.type}</td>
                    <td className="border px-4 py-2">{member.subType}</td>
                    <td className="border px-4 py-2">{member.role}</td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-navy-blue focus:ring-navy-blue"
                        checked={member.requiredForShowings}
                        readOnly
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="border px-4 py-2">
                    <select className="w-full border rounded-sm px-2 py-1 text-sm">
                      <option>Select User</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2">
                    <select className="w-full border rounded-sm px-2 py-1 text-sm">
                      <option>Occupant</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <select className="w-full border rounded-sm px-2 py-1 text-sm">
                      <option>Select Member Type</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <select className="w-full border rounded-sm px-2 py-1 text-sm">
                      <option>Non-Admin</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2 text-center"></td>
                  <td className="border px-4 py-2 text-center">
                    <Button size="sm" className="bg-navy-blue hover:bg-navy-blue/90 h-7 px-2 text-xs">
                      Add Member
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Members Availability Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Members Availability</h2>
          <div className="flex gap-2 mb-4">
            <button className="text-navy-blue underline font-medium">Waruna Gidrane</button>
            <span className="text-gray-400">•</span>
            <button className="text-navy-blue underline font-medium">Viral Kotli</button>
          </div>

          {/* Calendar Week Navigation */}
          <div className="flex justify-between items-center mb-3">
            <button className="p-1 border rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium">{currentWeek}</div>
            <button className="p-1 border rounded-full">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded overflow-hidden">
            {/* Calendar Headers */}
            <div className="grid grid-cols-8 bg-gray-50 border-b">
              <div className="p-2 border-r"></div> {/* Empty header for time slots */}
              {daysOfWeek.map((day, index) => (
                <div key={index} className="p-2 text-center border-r text-sm">
                  <div>{day.name}</div>
                  <div>{day.date}</div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            {timeSlots.map((timeSlot, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-8 border-b last:border-b-0">
                <div className="p-2 text-xs text-center border-r text-gray-500">{timeSlot}</div>
                {daysOfWeek.map((_, colIndex) => (
                  <div key={colIndex} className="p-2 border-r last:border-r-0 hover:bg-gray-50 cursor-pointer"></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Reset Status Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Reset Status</h2>
          <div className="flex items-center gap-4 border p-4 rounded-md">
            <div className="text-sm">1. Search Process</div>
            <Button size="sm" className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-7 px-4">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
