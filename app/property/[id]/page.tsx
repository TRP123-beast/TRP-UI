"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Grid3X3,
  Shield,
  Key,
  Award,
  Calendar,
  Users,
  MessageCircle,
  Flag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { ToastNotification } from "@/components/toast-notification"
import { MapView } from "@/components/map-view"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [activePropertyTab, setActivePropertyTab] = useState("details")

  const propertyId = params.id as string

  // Mock property data
  const properties = [
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
      location: "Toronto",
      areaCode: "CO1",
      propertyType: "apartment",
      availableDate: "Available Now",
      leaseTerms: "12+ months",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
      ],
    },
    {
      id: "809",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      price: "$4,200/mo",
      address: "809 Bay Street #1501, Toronto, ON",
      added: "3 months ago",
      beds: 2,
      baths: 2,
      parking: 1,
      sqft: "900",
      location: "Toronto",
      areaCode: "CO1",
      propertyType: "condo",
      availableDate: "Available Dec 1st",
      leaseTerms: "12+ months",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
      ],
    },
  ]

  useEffect(() => {
    const foundProperty = properties.find((p) => p.id === propertyId)
    if (foundProperty) {
      setProperty(foundProperty)
    }
    setLoading(false)
  }, [propertyId])

  const handleRequestShowing = () => {
    router.push(`/cart?property=${propertyId}`)
    setToastMessage("Property added to your showing requests!")
    setToastVisible(true)
  }

  const handleShareLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setToastMessage("Link copied to clipboard!")
        setToastVisible(true)
      })
      .catch(() => {
        setToastMessage("Failed to copy link")
        setToastVisible(true)
      })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-20 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold truncate max-w-md">{property.address}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShareLink} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-20 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
          {/* Main Image */}
          <div className="lg:col-span-2 relative aspect-[4/3] lg:aspect-[4/3]">
            <Image
              src={property.images[0] || "/placeholder.svg"}
              alt={property.address}
              fill
              className="object-cover hover:brightness-90 transition-all cursor-pointer"
              onClick={() => setShowAllPhotos(true)}
            />
          </div>

          {/* Side Images */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-2">
            {property.images.slice(1, 5).map((img: string, idx: number) => (
              <div key={idx} className="relative aspect-[4/3] lg:aspect-square">
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Property view ${idx + 2}`}
                  fill
                  className="object-cover hover:brightness-90 transition-all cursor-pointer"
                  onClick={() => setShowAllPhotos(true)}
                />
                {idx === 3 && property.images.length > 5 && (
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-md"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    Show all photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Gallery below main image */}
        <div className="flex gap-2 overflow-x-auto py-2 mb-8">
          {property.images.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden ${
                selectedImage === idx ? "ring-2 ring-[#FFA500]" : ""
              }`}
            >
              <Image src={img || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>

        {/* Horizontal Navigation Bar */}
        <Tabs value={activePropertyTab} onValueChange={setActivePropertyTab} className="w-full mb-8">
          <TabsList className="flex w-full bg-gray-100 overflow-x-auto scrollbar-hide min-h-12 border-b border-gray-200">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-[#FFA500] data-[state=active]:text-white text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 py-2 flex-shrink-0 min-w-fit"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="data-[state=active]:bg-[#FFA500] data-[state=active]:text-white text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 py-2 flex-shrink-0 min-w-fit"
            >
              Property Features & Amenities
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-[#FFA500] data-[state=active]:text-white text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 py-2 flex-shrink-0 min-w-fit"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="location"
              className="data-[state=active]:bg-[#FFA500] data-[state=active]:text-white text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 py-2 flex-shrink-0 min-w-fit"
            >
              Location
            </TabsTrigger>
            <TabsTrigger
              value="management"
              className="data-[state=active]:bg-[#FFA500] data-[state=active]:text-white text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 py-2 flex-shrink-0 min-w-fit"
            >
              Property Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0">
            {/* Details Section Content */}
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold mb-2">
                    {property.beds}-Bedroom {property.propertyType} in {property.location}
                  </h1>
                  <p className="text-gray-600">
                    {property.beds} bed · {property.baths} bath · {property.sqft} sqft · {property.parking} parking
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-green-600 font-medium">{property.availableDate}</span>
                    <span className="text-gray-600">· {property.leaseTerms}</span>
                  </div>
                </div>

                {/* Tenant Favorite Badge */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-6 w-6 text-[#FFA500]" />
                      <div>
                        <h3 className="font-semibold">Tenant favorite</h3>
                        <p className="text-sm text-gray-600">
                          One of the most loved rental properties on TRP, according to tenants
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-[#FFA500]" />
                          <span className="font-semibold">4.82</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">76</div>
                        <div className="text-sm text-gray-600">Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listing Highlights */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-6 w-6 mt-1 text-gray-700" />
                    <div>
                      <h3 className="font-semibold">Professional Management</h3>
                      <p className="text-gray-600">This property is professionally managed with 24/7 support.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Key className="h-6 w-6 mt-1 text-gray-700" />
                    <div>
                      <h3 className="font-semibold">Easy Move-in</h3>
                      <p className="text-gray-600">Streamlined application and move-in process.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="h-6 w-6 mt-1 text-gray-700" />
                    <div>
                      <h3 className="font-semibold">Verified Listing</h3>
                      <p className="text-gray-600">This listing has been verified and is MLS-powered.</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-gray-800">
                    Beautiful {property.beds}-bedroom {property.propertyType} located in the heart of{" "}
                    {property.location}. This modern rental offers comfort and convenience for your next home.
                  </p>
                  <p className="text-gray-800">
                    Features include updated appliances, in-unit laundry, and access to building amenities. Perfect for
                    professionals and families looking for quality rental housing in a prime location.
                  </p>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Lease Details</h3>
                    <p className="text-gray-800">
                      Minimum lease term: 12 months. First month's rent and security deposit required. Pet-friendly with
                      additional deposit.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Building Access</h3>
                    <p className="text-gray-800">
                      Secure building entry with intercom system and on-site management office.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Application Process</h3>
                    <p className="text-gray-800">
                      Complete your rental application through TRP's streamlined process. Background check and income
                      verification required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-0">
            {/* Property Features & Amenities Section */}
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Property Features & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "In-unit Washer/Dryer",
                  "High-speed Internet Ready",
                  "Central Air Conditioning",
                  "Assigned Parking Space",
                  "Fitness Center Access",
                  "24/7 Maintenance",
                  "Package Receiving",
                  "Dishwasher",
                  "Hardwood Floors",
                  "Balcony/Patio",
                  "Pet Friendly",
                  "Storage Unit Included",
                ].map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#FFA500] rounded-full"></div>
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-6 border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-white bg-transparent"
              >
                Show all amenities
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            {/* Reviews Section */}
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="flex items-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">4.82</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current text-[#FFA500]" />
                    ))}
                  </div>
                  <div className="text-lg font-semibold">Tenant favorite</div>
                  <div className="text-gray-600">
                    This rental is highly rated based on tenant reviews and property quality
                  </div>
                </div>
              </div>

              {/* Rating Categories */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
                {[
                  { label: "Property Condition", rating: "4.9" },
                  { label: "Management Response", rating: "4.8" },
                  { label: "Move-in Process", rating: "4.9" },
                  { label: "Communication", rating: "4.9" },
                  { label: "Location", rating: "4.5" },
                  { label: "Value", rating: "4.8" },
                ].map((category) => (
                  <div key={category.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{category.label}</span>
                      <span className="text-sm font-semibold">{category.rating}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-[#FFA500] h-1 rounded-full"
                        style={{ width: `${(Number.parseFloat(category.rating) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Individual Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    name: "Sarah M.",
                    date: "Current Tenant",
                    duration: "Living here for 8 months",
                    review:
                      "Great property with responsive management. The apartment is exactly as described and the building is well-maintained. The application process through TRP was smooth and efficient.",
                  },
                  {
                    name: "Mike R.",
                    date: "Former Tenant",
                    duration: "Lived here for 2 years",
                    review:
                      "Excellent rental experience. Margaret Properties was always quick to address any maintenance issues. The location is perfect for commuting and the amenities are top-notch.",
                  },
                ].map((review, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-semibold">{review.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{review.name}</div>
                        <div className="text-sm text-gray-600">{review.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-current text-[#FFA500]" />
                      ))}
                      <span className="text-sm text-gray-600">· {review.date}</span>
                    </div>
                    <p className="text-gray-800">{review.review}</p>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-[#FFA500] font-semibold">
                      Show more
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-8 border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-white bg-transparent"
              >
                Show all 76 reviews
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="location" className="mt-0">
            {/* Location Section */}
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-96 rounded-xl overflow-hidden mb-6">
                <MapView isOpen={true} onClose={() => {}} properties={[property]} isMiniMap={true} />
              </div>
              <h3 className="font-semibold mb-2">
                {property.location}, {property.location} County, Canada
              </h3>
              <div className="space-y-2 text-gray-800">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Pride in Paradise Shanzu - 10 mins drive</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Whitesands hotel - 8 mins drive</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Beach - 5-10 minutes walk...</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="management" className="mt-0">
            {/* Property Management Section */}
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Property Management</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-semibold">M</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Margaret Properties</h3>
                  <p className="text-gray-600 mb-6">⭐ Verified Property Manager</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-xl font-bold">91</div>
                      <div className="text-sm text-gray-600">Properties</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">4.8★</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">2</div>
                      <div className="text-sm text-gray-600">Years on TRP</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      <span>Established in 2022</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span>Specializes in: Downtown Toronto rentals</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Margaret Properties is Verified</h3>
                  <p className="text-gray-800 mb-6">
                    Verified property managers on TRP have been background-checked and are committed to providing
                    excellent rental experiences for tenants.
                  </p>

                  <h3 className="text-lg font-semibold mb-4">Management Details</h3>
                  <div className="space-y-2 mb-6">
                    <p>Response rate: 100%</p>
                    <p>Average response time: Within 2 hours</p>
                    <p>Maintenance requests handled: 24/7</p>
                  </div>

                  <Button className="w-full mb-4 bg-[#FFA500] hover:bg-[#FFA500]/90">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Property Manager
                  </Button>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>All communications and payments are secured through TRP's platform for your protection.</span>
                  </div>
                </div>
              </div>

              {/* Things to Know */}
              <div className="mt-16 py-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold mb-8">Things to know</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">House rules</h3>
                    <div className="space-y-2 text-gray-800">
                      <p>Check-in after 1:00 PM</p>
                      <p>Checkout before 10:00 AM</p>
                      <p>2 guests maximum</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Safety & property</h3>
                    <div className="space-y-2 text-gray-800">
                      <p>Carbon monoxide alarm not reported</p>
                      <p>Smoke alarm not reported</p>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-black font-semibold">
                      Show more
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Cancellation policy</h3>
                    <p className="text-gray-800">
                      Cancel before Jun 27 for a partial refund. After that, this reservation is non-refundable.
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-black font-semibold">
                      Review this Host's full policy for details.
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Right Column - Rental Application Card */}
          <div className="lg:col-span-1 lg:col-start-3">
            <div className="sticky top-24 border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-semibold">{property.price}</span>
                <span className="text-gray-600">per month</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm font-semibold text-green-600 mb-1">{property.availableDate}</div>
                <div className="text-sm text-gray-600">Lease Terms: {property.leaseTerms}</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Monthly Rent:</span>
                  <span className="font-semibold">{property.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Security Deposit:</span>
                  <span>{property.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Application Fee:</span>
                  <span>$50</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#FFA500] hover:bg-[#FFA500]/90 text-white py-3 text-base font-semibold mb-3"
                onClick={handleRequestShowing}
              >
                Request Showing
              </Button>

              <p className="text-center text-sm text-gray-600 mb-4">Schedule a showing to view this property</p>

              <Button variant="ghost" size="sm" className="w-full mt-4 text-gray-600">
                <Flag className="h-4 w-4 mr-2" />
                Report this listing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} isVisible={toastVisible} onClose={() => setToastVisible(false)} />

      {/* Mobile Navigation */}
      <MobileNav cartItems={cartItems} />
    </div>
  )
}
