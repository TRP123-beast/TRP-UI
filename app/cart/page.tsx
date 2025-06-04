"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Copy, Share2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { ToastNotification } from "@/components/toast-notification"

// Move static/mock data outside the component
const MOCK_PROPERTIES = [
  {
    id: "20",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    price: "$2,600/mo",
    address: "20 O'Neill Rd #238, North York, ON",
    added: "5 months ago",
    beds: 3,
    baths: 2,
    parking: 1,
    sqft: "600 - 699",
    location: "North York",
    areaCode: "CO1",
    propertyType: "apartment",
  },
  {
    id: "312",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
    price: "$3,400/mo",
    address: "312 College St, Amherst, MA",
    added: "5 months ago",
    beds: 4,
    baths: 2,
    parking: 1,
    sqft: "1200",
    location: "Amherst",
    areaCode: "CO2",
    propertyType: "house",
  },
]

const MOCK_GROUP_MEMBERS = [
  {
    id: "1",
    firstName: "Maureen",
    lastName: "Wariara",
    profilePic: "/placeholder.svg?height=50&width=50",
    memberType: "Admin",
    occupantType: "Main Applicant",
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Smith",
    profilePic: "/placeholder.svg?height=50&width=50",
    memberType: "Member",
    occupantType: "Occupant",
  },
]

export default function CartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showShareTooltip, setShowShareTooltip] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Use the memoized static data instead of state for group members
  const groupMembers = useMemo(() => MOCK_GROUP_MEMBERS, [])

  // Get showing requests from localStorage
  useEffect(() => {
    const storedShowingRequests = localStorage.getItem("showingRequests")
    const showingRequests = storedShowingRequests ? JSON.parse(storedShowingRequests) : []

    // Fetch properties data from localStorage or API
    const storedProperties = localStorage.getItem("properties")
    const properties = storedProperties ? JSON.parse(storedProperties) : MOCK_PROPERTIES

    // Filter properties based on showing requests
    const items = properties.filter((p: any) => showingRequests.includes(p.id))
    setCartItems(items)
  }, [])

  // Handle URL property parameter only once on mount or when searchParams changes
  useEffect(() => {
    const propertyId = searchParams.get("property")

    if (propertyId) {
      // Get showing requests from localStorage
      const storedShowingRequests = localStorage.getItem("showingRequests")
      const showingRequests = storedShowingRequests ? JSON.parse(storedShowingRequests) : []

      // Get properties from localStorage or use mock data
      const storedProperties = localStorage.getItem("properties")
      const properties = storedProperties ? JSON.parse(storedProperties) : MOCK_PROPERTIES

      const property = properties.find((p: any) => p.id === propertyId)

      if (property && !showingRequests.includes(propertyId)) {
        // Add to showing requests
        const updatedShowingRequests = [...showingRequests, propertyId]
        localStorage.setItem("showingRequests", JSON.stringify(updatedShowingRequests))

        // Update cart items
        setCartItems((prev) => [...prev, property])

        // Show toast notification
        setToastMessage(`${property.address} added to cart`)
        setToastVisible(true)
      }
    }
  }, [searchParams])

  const removeFromCart = (id: string) => {
    // Remove from localStorage
    const storedShowingRequests = localStorage.getItem("showingRequests")
    const showingRequests = storedShowingRequests ? JSON.parse(storedShowingRequests) : []
    const updatedShowingRequests = showingRequests.filter((item: string) => item !== id)
    localStorage.setItem("showingRequests", JSON.stringify(updatedShowingRequests))

    // Update state
    setCartItems((prev) => prev.filter((item) => item.id !== id))

    // Show toast notification
    setToastMessage("Property removed from cart")
    setToastVisible(true)
  }

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareTooltip(true)
    setTimeout(() => setShowShareTooltip(false), 2000)
  }

  const handleCheckout = () => {
    router.push("/scheduling")
  }

  // Memoize the empty cart view to avoid recreating it on every render
  const emptyCartView = useMemo(
    () => (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">You haven't added any properties to your cart yet.</p>
        <Button onClick={() => router.push("/")} className="bg-black text-white hover:bg-gray-800 py-2 px-4">
          Browse Properties
        </Button>
      </div>
    ),
    [router],
  )

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-[#484848] hover:text-[#FF5A5F] active:text-[#FF5A5F] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-[#484848]">Cart</span>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TRP%20Logo-3ydAc5tBUCO0lbj7kiIrCEoYebKQVt.png"
            alt="The Rental Project Logo"
            width={120}
            height={40}
            className="h-9 w-auto"
          />
        </div>
        <div className="relative">
          <button
            onClick={handleShareLink}
            className="p-2 text-[#484848] hover:text-[#FF5A5F] active:text-[#FF5A5F] transition-colors"
            aria-label="Share cart"
          >
            <Share2 className="h-5 w-5" />
          </button>
          {showShareTooltip && (
            <div className="absolute right-0 top-full mt-2 bg-white text-[#484848] border border-gray-200 text-xs py-1 px-2 rounded shadow-sm">
              Link copied!
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          {cartItems.length === 0 ? (
            emptyCartView
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4 text-sm">
                  Vacant units will be available to view immediately whereas units that are currently tenanted require
                  24-hour notice.
                </p>

                <h2 className="text-lg font-semibold mb-4">Properties ({cartItems.length})</h2>

                <div className="space-y-4">
                  {cartItems.map((property) => (
                    <div key={property.id} className="flex gap-3 border-b pb-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={property.image || "/placeholder.svg"}
                          alt={property.address}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-sm">{property.address}</h3>
                          <button
                            className="text-gray-500 p-2 -mr-2"
                            onClick={() => removeFromCart(property.id)}
                            aria-label="Remove from cart"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-gray-500 text-xs">{property.location}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <span>{property.beds} Beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{property.baths} Baths</span>
                          </div>
                        </div>
                        <p className="font-semibold mt-1 text-sm">{property.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Group Members Required for Showings</h2>
                <div className="space-y-3">
                  {groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={member.profilePic || "/placeholder.svg"}
                          alt={`${member.firstName} ${member.lastName}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {member.firstName} {member.lastName}
                        </p>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>{member.memberType}</span>
                          <span>•</span>
                          <span>{member.occupantType}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Only render these elements when there are cart items */}
              <div className="pt-4">
                <button
                  className="w-full border border-[#484848] text-[#484848] py-3 rounded-md font-medium hover:bg-[#FF5A5F] hover:text-white hover:border-[#FF5A5F] active:bg-[#FF5A5F] active:text-white active:border-[#FF5A5F] transition-colors"
                  onClick={handleCheckout}
                >
                  Create Schedule for Showings
                </button>
              </div>

              <div className="text-center">
                <button
                  className="text-xs text-[#FF5A5F] flex items-center justify-center mx-auto p-2"
                  onClick={handleShareLink}
                  aria-label="Share this booking"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Share this booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} isVisible={toastVisible} onClose={() => setToastVisible(false)} />

      {/* Mobile Navigation */}
      <MobileNav cartItems={cartItems} onRemoveFromCart={removeFromCart} />
    </div>
  )
}
