"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToastNotification } from "@/components/toast-notification"
import { MobileNav } from "@/components/mobile-nav"
import { MapView } from "@/components/map-view"
import { FilterModal } from "@/components/filter-modal"
import { WishlistDialog } from "@/components/wishlist-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PropertyCard } from "@/components/property-card"
import { addToRecentlyViewed } from "@/utils/search-utils"

export default function RentalDashboard() {
  // Existing state variables...
  const [favorites, setFavorites] = useState<string[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])
  const [showingRequests, setShowingRequests] = useState<string[]>([])
  const [showMap, setShowMap] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false)
  const [selectedPropertyForWishlist, setSelectedPropertyForWishlist] = useState<any>(null)
  const [selectedAreaCode, setSelectedAreaCode] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" })
  const [location, setLocation] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [activeFilter, setActiveFilter] = useState<"location" | "type" | "price" | null>(null)

  // Fixed the destructuring declaration error
  const [appliedFilters, setAppliedFilters] = useState<{
    priceRange: { min: string; max: string }
    location: string
    propertyType: string
    areaCode: string | null
  }>({
    priceRange: { min: "", max: "" },
    location: "",
    propertyType: "",
    areaCode: null,
  })

  const [cartPreviewOpen, setCartPreviewOpen] = useState(false)
  const [cartProperty, setCartProperty] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<any>({})
  const [miniMapVisible, setMiniMapVisible] = useState(false)
  const [showTooltips, setShowTooltips] = useState(true)
  const [hasSeenTooltips, setHasSeenTooltips] = useState(false)
  const [miniMapAnimating, setMiniMapAnimating] = useState(false)

  // Add pagination state and logic
  const [currentPage, setCurrentPage] = useState(1)
  const propertiesPerPage = 8

  // Add toast notification state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const filterPanelRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [mapViewOpen, setMapViewOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const router = useRouter()

  // Add to the top of the RentalDashboard component:
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const filterButtonRef = useRef(null)
  const [filtersActive, setFiltersActive] = useState(false)

  const onSearch = () => {}
  const onFilterClick = () => {}

  const handleFilterClick = () => {
    setFilterModalOpen(true)
  }

  const handleClosePopup = () => {
    setShowFilterPopup(false)
  }

  // Debug logging for wishlist dialog state
  useEffect(() => {
    console.log("Wishlist dialog state:", {
      open: wishlistDialogOpen,
      property: selectedPropertyForWishlist,
    })
  }, [wishlistDialogOpen, selectedPropertyForWishlist])

  // Check if it's the user's first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore")
    if (!hasVisitedBefore) {
      setShowTooltips(true)
      localStorage.setItem("hasVisitedBefore", "true")
    } else {
      setHasSeenTooltips(true)
      setShowTooltips(false)
    }
  }, [])

  // Dismiss tooltips after 10 seconds
  useEffect(() => {
    if (showTooltips) {
      const timer = setTimeout(() => {
        setShowTooltips(false)
        setHasSeenTooltips(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [showTooltips])

  // Store properties in localStorage for the map page to access
  useEffect(() => {
    localStorage.setItem("properties", JSON.stringify(properties))
  }, [])

  // Area codes data - moved to be passed to FilterModal
  const areaCodes = [
    { code: "All", name: "All Listings" },
    { code: "CO1", name: "Downtown" },
    { code: "CO2", name: "Uptown" },
    { code: "CO3", name: "Midtown" },
    { code: "CO4", name: "West End" },
    { code: "CO5", name: "East Side" },
    { code: "CO6", name: "North Hills" },
    { code: "CO7", name: "South Bay" },
    { code: "CO8", name: "Riverside" },
    { code: "CO9", name: "Lakefront" },
  ]

  // Load showing requests from localStorage on component mount
  useEffect(() => {
    const storedShowingRequests = localStorage.getItem("showingRequests")
    if (storedShowingRequests) {
      setShowingRequests(JSON.parse(storedShowingRequests))
    }
  }, [])

  // Update localStorage whenever showing requests change
  useEffect(() => {
    localStorage.setItem("showingRequests", JSON.stringify(showingRequests))

    // Update cart items based on showing requests
    const items = properties.filter((p) => showingRequests.includes(p.id))
    setCartItems(items)
  }, [showingRequests])

  // Close filter panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node) && activeFilter !== null) {
        setActiveFilter(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeFilter])

  // Toggle mini-map visibility with animation
  const toggleMiniMap = () => {
    if (miniMapVisible) {
      setMiniMapAnimating(true)
      // Start hiding animation
      setTimeout(() => {
        setMiniMapVisible(false)
        setMiniMapAnimating(false)
      }, 500) // Match this with the CSS transition duration
    } else {
      setMiniMapVisible(true)
    }
  }

  // Completely revised toggleFavorite function
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Toggle favorite clicked for property ID:", id)

    // Find the property to add to wishlist
    const property = properties.find((p) => p.id === id)
    console.log("Found property:", property)

    if (favorites.includes(id)) {
      // If already in favorites, remove it
      setFavorites((prev) => prev.filter((item) => item !== id))
      console.log("Removed from favorites")
    } else {
      // If not in favorites, add it and show wishlist dialog
      setFavorites((prev) => [...prev, id])
      console.log("Added to favorites")

      if (property) {
        // First set the property
        setSelectedPropertyForWishlist(property)
        console.log("Set selected property for wishlist:", property)

        // Then open the dialog in the next tick
        setTimeout(() => {
          setWishlistDialogOpen(true)
          console.log("Opened wishlist dialog")
        }, 50)
      }
    }
  }

  // Add this useEffect near the other useEffects:
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDismissed((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Update the toggleShowingRequest function to show toast notification
  const toggleShowingRequest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    // Find the property to add to cart
    const property = properties.find((p) => p.id === id)

    if (showingRequests.includes(id)) {
      setShowingRequests((prev) => prev.filter((item) => item !== id))
      setCartItems((prev) => prev.filter((item) => item.id !== id))

      // Show toast notification
      setToastMessage(`${property?.address || "Property"} removed from cart`)
      setToastVisible(true)
    } else {
      setShowingRequests((prev) => [...prev, id])
      // Show cart preview
      if (property) {
        setCartProperty(property)
        setCartItems((prev) => [...prev, property])
        setCartPreviewOpen(true)

        // Show toast notification
        setToastMessage(`${property.address} added to cart`)
        setToastVisible(true)

        // Auto close cart preview after 5 seconds
        setTimeout(() => {
          setCartPreviewOpen(false)
        }, 5000)
      }
    }
  }

  const removeFromCart = (id: string) => {
    setShowingRequests((prev) => prev.filter((item) => item !== id))
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Update the properties array with Canadian residential properties and better images
  const properties = [
    {
      id: "20",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
      ],
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
    },
    {
      id: "809",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      ],
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
    },
    {
      id: "312",
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
      ],
      price: "$3,400/mo",
      address: "312 Queen Street West, Toronto, ON",
      added: "2 months ago",
      beds: 2,
      baths: 1,
      parking: 0,
      sqft: "1200",
      location: "Toronto",
      areaCode: "CO2",
      propertyType: "residential",
    },
    {
      id: "224",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop"],
      price: "$3,200/mo",
      address: "224 King St W #1901, Toronto, ON",
      added: "5 months ago",
      beds: 1,
      baths: 1,
      parking: 0,
      sqft: "625",
      location: "Toronto",
      areaCode: "CO4",
      propertyType: "condo",
    },
    {
      id: "508",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"],
      price: "$5,500/mo",
      address: "508 Wellington St W #602, Toronto, ON",
      added: "1 month ago",
      beds: 3,
      baths: 2,
      parking: 1,
      sqft: "1470",
      location: "Toronto",
      areaCode: "CO5",
      propertyType: "condo",
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"],
      price: "$8,900/mo",
      address: "5 Bloor Street East, Toronto, ON",
      added: "2 months ago",
      beds: 4,
      baths: 3,
      parking: 2,
      sqft: "2500",
      location: "Toronto",
      areaCode: "CO3",
      propertyType: "residential",
    },
    {
      id: "10th",
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop"],
      price: "$1,299,000",
      address: "10 Lakeshore Dr, Mississauga, ON",
      added: "3 months ago",
      beds: 4,
      baths: 3,
      parking: 2,
      sqft: "2200",
      location: "Mississauga",
      areaCode: "CO9",
      propertyType: "house",
    },
    {
      id: "101",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop"],
      price: "$4,200/mo",
      address: "101 Dundas Street, Vancouver, BC",
      added: "2 months ago",
      beds: 3,
      baths: 2,
      parking: 1,
      sqft: "1100",
      location: "Vancouver",
      areaCode: "CO6",
      propertyType: "house",
    },
    {
      id: "555",
      image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=2070&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=2070&auto=format&fit=crop"],
      price: "$3,800/mo",
      address: "555 Riverside Drive, Montreal, QC",
      added: "1 month ago",
      beds: 2,
      baths: 2,
      parking: 1,
      sqft: "950",
      location: "Montreal",
      areaCode: "CO8",
      propertyType: "apartment",
    },
    {
      id: "777",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"],
      price: "$6,500/mo",
      address: "777 Harbourfront Ave, Halifax, NS",
      added: "2 weeks ago",
      beds: 3,
      baths: 3,
      parking: 2,
      sqft: "1800",
      location: "Halifax",
      areaCode: "CO7",
      propertyType: "house",
    },
  ]

  const applyFilters = () => {
    setAppliedFilters({
      priceRange,
      location,
      propertyType,
      areaCode: selectedAreaCode,
    })
    setActiveFilter(null)
  }

  const clearFilter = (filter: "priceRange" | "location" | "propertyType" | "areaCode") => {
    if (filter === "priceRange") {
      setPriceRange({ min: "", max: "" })
      setAppliedFilters((prev) => ({ ...prev, priceRange: { min: "", max: "" } }))
    } else if (filter === "areaCode") {
      setSelectedAreaCode(null)
      setAppliedFilters((prev) => ({ ...prev, areaCode: null }))
    } else {
      const newState = { ...appliedFilters, [filter]: "" }
      setAppliedFilters(newState)
      if (filter === "location") setLocation("")
      if (filter === "propertyType") setPropertyType("")
    }
  }

  // Update the handleSearch function to accept an array of locations
  const handleSearch = (locations: string[]) => {
    console.log("Search locations:", locations) // Debug log to check received search terms

    // Clean up empty locations
    const validLocations = locations.filter((loc) => loc && loc.trim() !== "")

    // Update state for filtering
    setSelectedLocations(validLocations)
    setSearchQuery(validLocations.length > 0 ? validLocations[0] : "")

    // Count how many properties match the selected locations
    const matchedProperties = getFilteredPropertiesWithSearch(validLocations)

    // Show toast with the correct count only if properties are found and this is not a real-time update
    // Only show toast for significant searches (not for every keystroke)
    const isSignificantSearch =
      validLocations.length > 0 && validLocations.some((loc) => loc.length > 2) && matchedProperties.length > 0

    if (isSignificantSearch) {
      // Debounce the toast to avoid showing it for every keystroke
      clearTimeout(window.searchToastTimeout)
      window.searchToastTimeout = setTimeout(() => {
        setToastMessage(`Found ${matchedProperties.length} properties`)
        setToastVisible(true)
      }, 500)
    }

    // Reset to first page when searching
    setCurrentPage(1)
  }

  // Add this helper function for search property filtering
  const getFilteredPropertiesWithSearch = (searchTerms: string[]) => {
    if (!searchTerms || searchTerms.length === 0 || (searchTerms.length === 1 && searchTerms[0].trim() === "")) {
      return properties
    }

    return properties.filter((property) =>
      searchTerms.some((term) => {
        if (!term || term.trim() === "") return true
        const searchLower = term.toLowerCase()

        // Check address, location, and also property type for more comprehensive search
        return (
          property.address.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower) ||
          property.propertyType.toLowerCase().includes(searchLower) ||
          // Also check beds and baths if the search term is a number
          (searchLower.match(/^\d+$/) &&
            (property.beds.toString() === searchLower || property.baths.toString() === searchLower))
        )
      }),
    )
  }

  // Function to get filtered properties based on all active filters
  const getFilteredProperties = () => {
    return properties.filter((property) => {
      // Search query filter - This now handles both selected locations and general search
      if (selectedLocations.length > 0) {
        const matchesLocation = selectedLocations.some((loc) => {
          if (!loc || loc.trim() === "") return true
          const locationMatch = loc.toLowerCase()
          return (
            property.address.toLowerCase().includes(locationMatch) ||
            property.location.toLowerCase().includes(locationMatch) ||
            property.propertyType.toLowerCase().includes(locationMatch) ||
            // Also check beds and baths if the search term is a number
            (locationMatch.match(/^\d+$/) &&
              (property.beds.toString() === locationMatch || property.baths.toString() === locationMatch))
          )
        })
        if (!matchesLocation) return false
      } else if (searchQuery && searchQuery.trim() !== "") {
        const queryMatch = searchQuery.toLowerCase()
        const matchesQuery =
          property.address.toLowerCase().includes(queryMatch) ||
          property.location.toLowerCase().includes(queryMatch) ||
          property.propertyType.toLowerCase().includes(queryMatch) ||
          // Also check beds and baths if the search term is a number
          (queryMatch.match(/^\d+$/) &&
            (property.beds.toString() === queryMatch || property.baths.toString() === queryMatch))
        if (!matchesQuery) return false
      }

      // Filter modal filters
      if (Object.keys(activeFilters).length > 0) {
        // Verified only filter
        if (activeFilters.verifiedOnly && !property.verified) {
          return false
        }

        // Property type filter
        if (activeFilters.propertyTypes && activeFilters.propertyTypes.length > 0) {
          const propertyTypeMatches = activeFilters.propertyTypes.some((type: string) => {
            if (type.startsWith("All ")) {
              const category = type.replace("All ", "").toLowerCase()
              if (category === "apartments")
                return (
                  property.propertyType === "apartment" ||
                  property.propertyType === "studio" ||
                  property.propertyType === "bachelor"
                )
              if (category === "condos") return property.propertyType === "condo"
              if (category === "houses")
                return property.propertyType === "house" || property.propertyType === "townhouse"
              return false
            }
            return property.propertyType.toLowerCase() === type.toLowerCase()
          })
          if (!propertyTypeMatches) return false
        }

        // Price range filter
        if (activeFilters.priceRange) {
          const propertyPrice = Number.parseInt(property.price.replace(/[^0-9]/g, ""))
          if (propertyPrice < activeFilters.priceRange[0] || propertyPrice > activeFilters.priceRange[1]) return false
        }

        // Size range filter
        if (activeFilters.sizeRange) {
          const sqftRange = property.sqft.split(" - ")
          const minSqft = Number.parseInt(sqftRange[0])
          const maxSqft = sqftRange.length > 1 ? Number.parseInt(sqftRange[1]) : minSqft
          if (minSqft < activeFilters.sizeRange[0] || maxSqft > activeFilters.sizeRange[1]) return false
        }

        // Bedrooms filter
        if (activeFilters.bedrooms && activeFilters.bedrooms.length > 0) {
          const bedroomCount = property.beds.toString()
          const matches = activeFilters.bedrooms.some((b: string) => {
            if (b === "4+") return property.beds >= 4
            return bedroomCount === b
          })
          if (!matches) return false
        }

        // Bathrooms filter
        if (activeFilters.bathrooms && activeFilters.bathrooms.length > 0) {
          const bathroomCount = property.baths.toString()
          const matches = activeFilters.bathrooms.some((b: string) => {
            if (b === "4+") return property.baths >= 4
            return bathroomCount === b
          })
          if (!matches) return false
        }

        // Amenities filter
        if (activeFilters.amenities && activeFilters.amenities.length > 0) {
          // In a real app, you would check if the property has all selected amenities
          // For now, we'll assume properties with more beds have more amenities
          if (property.beds < activeFilters.amenities.length / 2) return false
        }

        // Utilities filter
        if (activeFilters.utilities && activeFilters.utilities.length > 0) {
          // In a real app, you would check if the property includes all selected utilities
          // For now, we'll assume properties with higher price include more utilities
          const propertyPrice = Number.parseInt(property.price.replace(/[^0-9]/g, ""))
          if (propertyPrice < 2000 && activeFilters.utilities.length > 2) return false
        }

        // Categories filter
        if (activeFilters.categories && activeFilters.categories.length > 0) {
          // In a real app, you would check if the property belongs to selected categories
          // For now, we'll assume some basic mapping
          if (
            activeFilters.categories.includes("luxury") &&
            Number.parseInt(property.price.replace(/[^0-9]/g, "")) < 3000
          )
            return false
          if (activeFilters.categories.includes("student") && property.beds < 1) return false
        }
      }

      // Area code filter
      if (appliedFilters.areaCode && property.areaCode !== appliedFilters.areaCode) return false

      // Price range filter from top filters
      if (appliedFilters.priceRange.min || appliedFilters.priceRange.max) {
        const propertyPrice = Number.parseInt(property.price.replace(/[^0-9]/g, ""))
        const min = appliedFilters.priceRange.min ? Number.parseInt(appliedFilters.priceRange.min) : 0
        const max = appliedFilters.priceRange.max
          ? Number.parseInt(appliedFilters.priceRange.max)
          : Number.POSITIVE_INFINITY
        if (propertyPrice < min || propertyPrice > max) return false
      }

      // Location filter from top filters
      if (appliedFilters.location && !property.location.toLowerCase().includes(appliedFilters.location.toLowerCase())) {
        return false
      }

      // Property type filter from top filters
      if (appliedFilters.propertyType && property.propertyType !== appliedFilters.propertyType) {
        return false
      }

      return true
    })
  }

  const handleApplyFilters = (filters: any) => {
    console.log("Received filters in parent:", filters) // Debug log

    // Store the complete filters object
    setActiveFilters(filters)

    // Set filtersActive flag based on whether any filters are applied
    const hasActiveFilters =
      filters.verifiedOnly ||
      (filters.propertyTypes && filters.propertyTypes.length > 0) ||
      (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000)) ||
      (filters.sizeRange && (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 2000)) ||
      (filters.bedrooms && filters.bedrooms.length > 0) ||
      (filters.bathrooms && filters.bathrooms.length > 0) ||
      (filters.amenities && filters.amenities.length > 0) ||
      (filters.utilities && filters.utilities.length > 0) ||
      (filters.categories && filters.categories.length > 0)

    setFiltersActive(hasActiveFilters)

    // Reset to first page when applying new filters
    setCurrentPage(1)

    // Show toast with the count of filtered properties
    setTimeout(() => {
      const filteredCount = getFilteredProperties().length
      if (filteredCount > 0) {
        setToastMessage(`Found ${filteredCount} properties matching your filters`)
        setToastVisible(true)
      }
    }, 100)
  }

  const filteredProperties = getFilteredProperties()
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty)
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
  }

  // Update the handlePropertyDetails function to only be used by the Details button
  const handlePropertyDetails = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    // Add the property to recently viewed
    addToRecentlyViewed(id)

    router.push(`/property/${id}`)
  }

  return (
    <DashboardLayout cartItems={cartItems} onFilterClick={handleFilterClick} properties={properties}>
      <TooltipProvider>
        <div className="flex min-h-screen h-full bg-gray-50">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
            {/* Applied Filters Display */}
            {(appliedFilters.location ||
              appliedFilters.propertyType ||
              appliedFilters.priceRange.min ||
              appliedFilters.priceRange.max ||
              appliedFilters.areaCode ||
              Object.keys(activeFilters).length > 0) && (
              <div className="px-4 py-2 flex flex-wrap gap-2 bg-white border-b border-gray-100 sticky top-14 z-40">
                <div className="text-sm font-medium mr-2 text-gray-700">Applied Filters:</div>

                {appliedFilters.location && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200">
                    Location: {appliedFilters.location}
                    <button
                      onClick={() => clearFilter("location")}
                      className="ml-1 hover:text-gray-900 p-1"
                      aria-label="Clear location filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {appliedFilters.propertyType && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200">
                    Type: {appliedFilters.propertyType}
                    <button
                      onClick={() => clearFilter("propertyType")}
                      className="ml-1 hover:text-gray-900 p-1"
                      aria-label="Clear property type filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {(appliedFilters.priceRange.min || appliedFilters.priceRange.max) && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200">
                    Price: ${appliedFilters.priceRange.min || "0"} - ${appliedFilters.priceRange.max || "∞"}
                    <button
                      onClick={() => clearFilter("priceRange")}
                      className="ml-1 hover:text-gray-900 p-1"
                      aria-label="Clear price range filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {appliedFilters.areaCode && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200">
                    Area: {areaCodes.find((a) => a.code === appliedFilters.areaCode)?.name || appliedFilters.areaCode}
                    <button
                      onClick={() => clearFilter("areaCode")}
                      className="ml-1 hover:text-gray-900 p-1"
                      aria-label="Clear area code filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setAppliedFilters({
                      priceRange: { min: "", max: "" },
                      location: "",
                      propertyType: "",
                      areaCode: null,
                    })
                    setSelectedAreaCode(null)
                    setActiveFilters({})
                  }}
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Mini Map - Slide up from bottom when toggled */}
            {miniMapVisible && (
              <div
                className={`fixed bottom-0 left-0 right-0 z-30 bg-white shadow-lg rounded-t-xl transition-all duration-500 ease-in-out transform ${
                  miniMapAnimating ? "translate-y-full" : "translate-y-0"
                } h-[40vh]`}
              >
                <div className="p-3 flex justify-between items-center border-b">
                  <h3 className="font-semibold text-gray-800">Map View</h3>
                  <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={toggleMiniMap}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative h-full">
                  <MapView isOpen={true} onClose={toggleMiniMap} properties={filteredProperties} isMiniMap={true} />
                  <Button
                    variant="default"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black border border-black hover:bg-gray-50 px-4 py-2 rounded-full shadow-lg"
                    onClick={() => {
                      setMiniMapVisible(false)
                      router.push("/map")
                    }}
                  >
                    View Full Map
                  </Button>
                </div>
              </div>
            )}

            {/* Property listings */}
            <div className="px-0 md:px-0 py-4">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12 bg-white mx-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-gray-500 mb-2">
                    {searchQuery || selectedLocations.length > 0 ? (
                      <>
                        No properties match your search for{" "}
                        <span className="font-medium text-black">"{searchQuery || selectedLocations.join(", ")}"</span>
                      </>
                    ) : Object.keys(activeFilters).length > 0 ? (
                      <>No properties match your selected filters</>
                    ) : (
                      <>No properties available. Try adjusting your search criteria.</>
                    )}
                  </p>

                  {/* Show search suggestions if search was used */}
                  {(searchQuery || selectedLocations.length > 0) && (
                    <div className="mt-4 mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">Try searching for:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["Toronto", "Vancouver", "Montreal", "Apartment", "Condo", "2 Beds"].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            className="bg-gray-50 hover:bg-gray-100"
                            onClick={() => handleSearch([suggestion])}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="mt-4 bg-white hover:bg-gray-50 py-2 px-4 text-black border border-black"
                    onClick={() => {
                      setSelectedAreaCode(null)
                      setAppliedFilters({
                        priceRange: { min: "", max: "" },
                        location: "",
                        propertyType: "",
                        areaCode: null,
                      })
                      setSearchQuery("")
                      setSelectedLocations([])
                      setActiveFilters({})
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-full px-2 sm:px-4 md:px-8 lg:px-10">
                  {currentProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onToggleShowingRequest={toggleShowingRequest}
                      onToggleFavorite={toggleFavorite}
                      onToggleDismiss={toggleDismiss}
                      showingRequests={showingRequests}
                      favorites={favorites}
                      dismissed={dismissed}
                      onClick={() => {
                        addToRecentlyViewed(property.id)
                        router.push(`/property/${property.id}`)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {filteredProperties.length > 0 && (
              <>
                {/* Mobile pagination with arrow icons */}
                <div className="flex justify-center items-center gap-4 mt-6 mb-16">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-gray-300 text-gray-700 bg-white shadow-md"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <span className="text-sm font-medium bg-white px-4 py-2 rounded-full shadow-md">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-gray-300 text-gray-700 bg-white shadow-md"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Toast Notification */}
        <ToastNotification message={toastMessage} isVisible={toastVisible} onClose={() => setToastVisible(false)} />

        {/* Mobile Navigation */}
        <MobileNav cartItems={cartItems} onRemoveFromCart={removeFromCart} />

        {/* Filter Modal */}
        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          propertyCount={filteredProperties.length}
          properties={properties}
          areaCodes={areaCodes}
        />

        {/* First-time user guide button */}
        {hasSeenTooltips && (
          <div className="fixed bottom-24 right-4 z-40">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white border border-gray-200 shadow-md"
                  onClick={() => setShowTooltips(true)}
                >
                  <Info className="h-5 w-5 text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-black text-white p-2 text-xs">
                Show help tooltips
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Wishlist Dialog - Always render it but control visibility with open prop */}
        <WishlistDialog
          open={wishlistDialogOpen}
          onOpenChange={setWishlistDialogOpen}
          property={selectedPropertyForWishlist}
        />
      </TooltipProvider>
    </DashboardLayout>
  )
}
