import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Young_Serif, Quicksand, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})
const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-young-serif",
})
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Rental Dashboard",
  description: "A modern rental property dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/images/rental-logo.png" />
      </head>
      <body
        className={`${inter.className} ${playfair.variable} ${youngSerif.variable} ${quicksand.variable} ${inter.variable} ${spaceGrotesk.variable}`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
