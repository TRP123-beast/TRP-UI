import type React from "react"
import "../globals.css"

export const metadata = {
  title: "Group Creation - TRP Rental Dashboard",
  description: "Create a group for your rental search experience",
}

export default function GroupCreationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main>{children}</main>
    </div>
  )
}
