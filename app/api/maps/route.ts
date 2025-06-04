import { NextResponse } from "next/server"

export async function GET() {
  // This keeps the API key on the server side
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  // Return minimal data needed for the client
  return NextResponse.json({
    status: apiKey ? "available" : "unavailable",
  })
}
