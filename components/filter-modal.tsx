"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
  propertyCount?: number
  properties?: any[]
  areaCodes?: { code: string; name: string }[]
  isMobile?: boolean
}

interface FilterSection {
  id: string
  title: string
  isExpanded: boolean
}

export function FilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  propertyCount = 0,
  properties = [],
  areaCodes = [],
  isMobile,
}: FilterModalProps) {
  const { isMobile: isMobileHook } = useMobile()
  const actualMobile = isMobile !== undefined ? isMobile : isMobileHook

  // Refs for the elements that need to stick
  const headerRef = useRef<HTMLDivElement>(null)
  const filterSummaryRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  // Filter sections state
  const [sections, setSections] = useState<FilterSection[]>([
    { id: "propertyType", title: "Property Type", isExpanded: true },
    { id: "rentPrice", title: "Rent Price", isExpanded: true },
    { id: "size", title: "Size (sqft)", isExpanded: true },
    { id: "bedrooms", title: "Bedrooms", isExpanded: true },
    { id: "bathrooms", title: "Bathrooms", isExpanded: true },
    { id: "amenities", title: "Features & Amenities", isExpanded: false },
    { id: "utilities", title: "Utilities Included", isExpanded: false },
    { id: "categories", title: "Categories", isExpanded: false },
  ])

  // Filter values state
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [showMorePropertyTypes, setShowMorePropertyTypes] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 2000])
  const [bedrooms, setBedrooms] = useState<string[]>([])
  const [bathrooms, setBathrooms] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [utilities, setUtilities] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filteredCount, setFilteredCount] = useState(propertyCount)
  const [isScrolled, setIsScrolled] = useState(false)

  // Selected filters summary
  const [selectedFiltersCount, setSelectedFiltersCount] = useState(0)
  const [selectedFiltersSummary, setSelectedFiltersSummary] = useState<{ type: string; value: string }[]>([])

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) => (section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section)),
    )
  }

  // Reset all filters
  const handleClearFilters = () => {
    setSelectedPropertyTypes([])
    setPriceRange([0, 5000])
    setSizeRange([0, 2000])
    setBedrooms([])
    setBathrooms([])
    setAmenities([])
    setUtilities([])
    setCategories([])
  }

  // Toggle property type selection
  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Toggle selection for any filter array (bedrooms, bathrooms, amenities, etc)
  const toggleSelection = (
    item: string,
    currentItems: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setItems(currentItems.includes(item) ? currentItems.filter((i) => i !== item) : [...currentItems, item])
  }

  // Remove a specific filter
  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case "propertyType":
        if (value) {
          setSelectedPropertyTypes((prev) => prev.filter((type) => type !== value))
        } else {
          setSelectedPropertyTypes([])
        }
        break
      case "priceRange":
        setPriceRange([0, 5000])
        break
      case "sizeRange":
        setSizeRange([0, 2000])
        break
      case "bedrooms":
        if (value) {
          setBedrooms((prev) => prev.filter((b) => b !== value))
        } else {
          setBedrooms([])
        }
        break
      case "bathrooms":
        if (value) {
          setBathrooms((prev) => prev.filter((b) => b !== value))
        } else {
          setBathrooms([])
        }
        break
      case "amenities":
        if (value) {
          setAmenities((prev) => prev.filter((a) => a !== value))
        } else {
          setAmenities([])
        }
        break
      case "utilities":
        if (value) {
          setUtilities((prev) => prev.filter((u) => u !== value))
        } else {
          setUtilities([])
        }
        break
      case "categories":
        if (value) {
          setCategories((prev) => prev.filter((c) => c !== value))
        } else {
          setCategories([])
        }
        break
      default:
        break
    }
  }

  // Handle clicking on a price distribution bar
  const handlePriceBarClick = (rangeStart: number, rangeEnd: number) => {
    setPriceRange([rangeStart, rangeEnd])
  }

  // Handle clicking on a size distribution bar
  const handleSizeBarClick = (rangeStart: number, rangeEnd: number) => {
    setSizeRange([rangeStart, rangeEnd])
  }

  // Update filtered count whenever filters change
  useEffect(() => {
    if (!properties || properties.length === 0) {
      setFilteredCount(propertyCount)
      return
    }

    // Filter properties based on current filter settings
    const filtered = properties.filter((property) => {
      // Property type filter
      if (selectedPropertyTypes.length > 0) {
        const propertyTypeMatches = selectedPropertyTypes.some((type) => {
          if (type.startsWith("All ")) {
            const category = type.replace("All ", "").toLowerCase()
            if (category === "apartments")
              return (
                property.propertyType === "apartment" ||
                property.propertyType === "studio" ||
                property.propertyType === "bachelor"
              )
            if (category === "condos") return property.propertyType === "condo"
            if (category === "houses") return property.propertyType === "house" || property.propertyType === "townhouse"
            return false
          }
          return property.propertyType.toLowerCase() === type.toLowerCase()
        })
        if (!propertyTypeMatches) return false
      }

      // Price range filter
      const propertyPrice = Number.parseInt(property.price?.replace(/[^0-9]/g, "") || "0")
      if (propertyPrice < priceRange[0] || propertyPrice > priceRange[1]) return false

      // Size range filter
      if (property.sqft) {
        const sqftRange = property.sqft.split(" - ")
        const minSqft = Number.parseInt(sqftRange[0])
        const maxSqft = sqftRange.length > 1 ? Number.parseInt(sqftRange[1]) : minSqft
        if (minSqft < sizeRange[0] || maxSqft > sizeRange[1]) return false
      }

      // Bedrooms filter
      if (bedrooms.length > 0) {
        const bedroomCount = property.beds?.toString()
        if (!bedroomCount) return false
        const matches = bedrooms.some((b) => {
          if (b === "4+") return property.beds >= 4
          return bedroomCount === b
        })
        if (!matches) return false
      }

      // Bathrooms filter
      if (bathrooms.length > 0) {
        const bathroomCount = property.baths?.toString()
        if (!bathroomCount) return false
        const matches = bathrooms.some((b) => {
          if (b === "4+") return property.baths >= 4
          return bathroomCount === b
        })
        if (!matches) return false
      }

      // Amenities filter
      if (amenities.length > 0) {
        // In a real app, you would check if the property has all selected amenities
        // For now, we'll assume properties with more beds have more amenities
        if (property.beds < amenities.length / 2) return false
      }

      // Utilities filter
      if (utilities.length > 0) {
        // In a real app, you would check if the property includes all selected utilities
        // For now, we'll assume properties with higher price include more utilities
        const propertyPrice = Number.parseInt(property.price?.replace(/[^0-9]/g, "") || "0")
        if (propertyPrice < 2000 && utilities.length > 2) return false
      }

      // Categories filter
      if (categories.length > 0) {
        // In a real app, you would check if the property belongs to selected categories
        // For now, we'll assume some basic mapping
        const propertyPrice = Number.parseInt(property.price?.replace(/[^0-9]/g, "") || "0")
        if (categories.includes("luxury") && propertyPrice < 3000) return false
        if (categories.includes("student") && property.beds < 1) return false
      }

      return true
    })

    setFilteredCount(filtered.length)
  }, [
    properties,
    selectedPropertyTypes,
    priceRange,
    sizeRange,
    bedrooms,
    bathrooms,
    amenities,
    utilities,
    categories,
    propertyCount,
  ])

  // Update selected filters summary
  useEffect(() => {
    const summary: { type: string; value: string }[] = []
    let count = 0

    if (selectedPropertyTypes.length > 0) {
      selectedPropertyTypes.forEach((type) => {
        summary.push({ type: "propertyType", value: type })
      })
      count += selectedPropertyTypes.length
    }

    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      const label = `$${priceRange[0]} - $${priceRange[1] === 5000 ? "5000+" : priceRange[1]}`
      summary.push({ type: "priceRange", value: label })
      count++
    }

    if (sizeRange[0] > 0 || sizeRange[1] < 2000) {
      const label = `${sizeRange[0]} - ${sizeRange[1] === 2000 ? "2000+" : sizeRange[1]} sqft`
      summary.push({ type: "sizeRange", value: label })
      count++
    }

    if (bedrooms.length > 0) {
      bedrooms.forEach((bedroom) => {
        summary.push({ type: "bedrooms", value: `${bedroom} Bed${bedroom !== "1" ? "s" : ""}` })
      })
      count += bedrooms.length
    }

    if (bathrooms.length > 0) {
      bathrooms.forEach((bathroom) => {
        summary.push({ type: "bathrooms", value: `${bathroom} Bath${bathroom !== "1" ? "s" : ""}` })
      })
      count += bathrooms.length
    }

    if (amenities.length > 0) {
      amenities.forEach((amenity) => {
        const label = amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/-/g, " ")
        summary.push({ type: "amenities", value: label })
      })
      count += amenities.length
    }

    if (utilities.length > 0) {
      utilities.forEach((utility) => {
        const label = utility.charAt(0).toUpperCase() + utility.slice(1).replace(/-/g, " ")
        summary.push({ type: "utilities", value: label })
      })
      count += utilities.length
    }

    if (categories.length > 0) {
      categories.forEach((category) => {
        const label = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
        summary.push({ type: "categories", value: label })
      })
      count += categories.length
    }

    setSelectedFiltersSummary(summary)
    setSelectedFiltersCount(count)
  }, [selectedPropertyTypes, priceRange, sizeRange, bedrooms, bathrooms, amenities, utilities, categories])

  // Apply filters and close modal
  const handleApplyFilters = () => {
    const filters = {
      propertyTypes: selectedPropertyTypes,
      priceRange,
      sizeRange,
      bedrooms,
      bathrooms,
      amenities,
      utilities,
      categories,
    }
    console.log("Applying filters:", filters) // Debug log
    onApplyFilters(filters)
    onClose()
  }

  // Handle scroll events to implement sticky elements
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    if (isOpen) {
      window.addEventListener("scroll", handleScroll)
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isOpen])

  // Set smart defaults based on property data
  useEffect(() => {
    if (properties && properties.length > 0 && !selectedFiltersCount) {
      // Example: Pre-select the most common property type
      const propertyTypeCounts: Record<string, number> = {}
      properties.forEach((property) => {
        propertyTypeCounts[property.propertyType] = (propertyTypeCounts[property.propertyType] || 0) + 1
      })

      // Find the most common property type
      let mostCommonType = ""
      let highestCount = 0
      Object.entries(propertyTypeCounts).forEach(([type, count]) => {
        if (count > highestCount) {
          mostCommonType = type
          highestCount = count
        }
      })

      // Set smart defaults only if user hasn't selected anything yet
      if (mostCommonType && selectedPropertyTypes.length === 0) {
        // Convert to proper format (e.g., "apartment" -> "Apartment")
        const formattedType = mostCommonType.charAt(0).toUpperCase() + mostCommonType.slice(1)
        setSelectedPropertyTypes([formattedType])
      }
    }
  }, [properties, selectedFiltersCount, selectedPropertyTypes.length])

  // Add a useEffect to handle overflow and prevent scrolling of body when modal is open
  useEffect(() => {
    if (isOpen) {
      // Add overflow hidden to body to prevent scrolling behind modal
      document.body.style.overflow = "hidden"

      // Cleanup function
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // Distribution data for sliders (mock data - in a real app this would be calculated from property data)
  const priceDistribution = [
    { range: [0, 1000], count: 10 },
    { range: [1000, 2000], count: 25 },
    { range: [2000, 3000], count: 35 },
    { range: [3000, 4000], count: 20 },
    { range: [4000, 5000], count: 10 },
  ]

  const sizeDistribution = [
    { range: [0, 500], count: 15 },
    { range: [500, 1000], count: 30 },
    { range: [1000, 1500], count: 35 },
    { range: [1500, 2000], count: 20 },
  ]

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full">
      {/* Header - Sticky */}
      <div
        ref={headerRef}
        className={`${isScrolled ? "shadow-md" : ""} sticky top-0 z-10 bg-white transition-shadow duration-200`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#FFA500] mr-2"
            >
              <path d="M3 6h18M6 12h12M10 18h4"></path>
            </svg>
            <h2 className="text-lg font-medium text-black">Filters</h2>
          </div>
          <div className="flex gap-2">
            {selectedFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-[#FFA500] hover:text-[#FFA500] hover:bg-[#FFA500]/10 px-3 h-auto rounded-lg text-sm"
              >
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100 active:bg-gray-200 h-11 w-11 rounded-full"
              aria-label="Close filters"
            >
              <X className="h-5 w-5 text-black" />
            </Button>
          </div>
        </div>

        {/* Show Listings Button - At top */}
        <div className="flex justify-end p-4 bg-white border-b border-gray-100">
          <Button
            className="bg-black hover:bg-black/90 active:bg-black/80 px-6 py-3 rounded-lg text-white font-medium min-h-[48px]"
            onClick={handleApplyFilters}
          >
            Show {filteredCount > 0 ? filteredCount : ""} listings
          </Button>
        </div>

        {/* Filter Summary - Chips */}
        {selectedFiltersCount > 0 && (
          <div
            ref={filterSummaryRef}
            className="px-4 py-2 border-b border-gray-200 bg-gray-50 overflow-x-auto whitespace-nowrap"
          >
            <div className="flex flex-nowrap gap-2 pb-1">
              {selectedFiltersSummary.map((filter, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-white border border-gray-300 rounded-full px-3 py-1.5 text-sm flex items-center shadow-sm whitespace-nowrap"
                >
                  <span className="text-black">{filter.value}</span>
                  <button
                    onClick={() => removeFilter(filter.type, filter.value)}
                    className="ml-1.5 hover:bg-gray-100 p-1 rounded-full"
                    aria-label={`Remove ${filter.value} filter`}
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content - Flex-grow to take available space between header and footer */}
      <div className="flex-grow overflow-y-auto pb-[76px] md:pb-[76px]">
        <div className="p-4">
          {/* Property Types Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("propertyType")}
            >
              <h3 className="text-base font-medium text-black">Property Type</h3>
              {sections.find((s) => s.id === "propertyType")?.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {sections.find((s) => s.id === "propertyType")?.isExpanded && (
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-w-[120px] min-h-[48px] ${
                      selectedPropertyTypes.includes("All Apartments")
                        ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                        : "border-gray-300 text-black"
                    }`}
                    onClick={() => togglePropertyType("All Apartments")}
                  >
                    All Apartments
                  </Button>

                  <Button
                    variant="outline"
                    className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                      selectedPropertyTypes.includes("Apartment")
                        ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                        : "border-gray-300 text-black"
                    }`}
                    onClick={() => togglePropertyType("Apartment")}
                  >
                    Apartment
                  </Button>

                  <Button
                    variant="outline"
                    className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                      selectedPropertyTypes.includes("Studio")
                        ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                        : "border-gray-300 text-black"
                    }`}
                    onClick={() => togglePropertyType("Studio")}
                  >
                    Studio
                  </Button>

                  <Button
                    variant="outline"
                    className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                      selectedPropertyTypes.includes("Bachelor")
                        ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                        : "border-gray-300 text-black"
                    }`}
                    onClick={() => togglePropertyType("Bachelor")}
                  >
                    Bachelor
                  </Button>

                  <Button
                    variant="outline"
                    className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                      selectedPropertyTypes.includes("All Condos")
                        ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                        : "border-gray-300 text-black"
                    }`}
                    onClick={() => togglePropertyType("All Condos")}
                  >
                    All Condos
                  </Button>

                  <Button
                    variant="outline"
                    className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                      selectedPropertyTypes.includes("All Houses")
                        ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                        : "border-gray-300 text-black"
                    }`}
                    onClick={() => togglePropertyType("All Houses")}
                  >
                    All Houses
                  </Button>

                  <Button
                    variant="outline"
                    className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                      selectedPropertyTypes.includes("House")
                        ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                        : "border-gray-300 text-black"
                    }`}
                    onClick={() => togglePropertyType("House")}
                  >
                    House
                  </Button>

                  <Button
                    variant="outline"
                    className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                      selectedPropertyTypes.includes("Town House")
                        ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                        : "border-gray-300 text-black"
                    }`}
                    onClick={() => togglePropertyType("Town House")}
                  >
                    Town House
                  </Button>
                </div>

                {showMorePropertyTypes && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    <Button
                      variant="outline"
                      className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                        selectedPropertyTypes.includes("Basement")
                          ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                          : "border-gray-300 text-black"
                      }`}
                      onClick={() => togglePropertyType("Basement")}
                    >
                      Basement
                    </Button>

                    <Button
                      variant="outline"
                      className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                        selectedPropertyTypes.includes("Duplex")
                          ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                          : "border-gray-300 text-black"
                      }`}
                      onClick={() => togglePropertyType("Duplex")}
                    >
                      Duplex
                    </Button>

                    <Button
                      variant="outline"
                      className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                        selectedPropertyTypes.includes("Loft")
                          ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                          : "border-gray-300 text-black"
                      }`}
                      onClick={() => togglePropertyType("Loft")}
                    >
                      Loft
                    </Button>

                    <Button
                      variant="outline"
                      className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                        selectedPropertyTypes.includes("Multi-Unit")
                          ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                          : "border-gray-300 text-black"
                      }`}
                      onClick={() => togglePropertyType("Multi-Unit")}
                    >
                      Multi-Unit
                    </Button>

                    <Button
                      variant="outline"
                      className={`rounded-full py-3 px-4 h-auto flex justify-center items-center min-h-[48px] ${
                        selectedPropertyTypes.includes("Rooms")
                          ? "bg-white text-black border-[#FFA500] border-2 shadow-md"
                          : "border-gray-300 text-black"
                      }`}
                      onClick={() => togglePropertyType("Rooms")}
                    >
                      Rooms
                    </Button>
                  </div>
                )}

                <Button
                  variant="link"
                  className="text-[#FFA500] mt-3 p-0 h-auto text-sm"
                  onClick={() => setShowMorePropertyTypes(!showMorePropertyTypes)}
                >
                  {showMorePropertyTypes ? "- Less Property Types" : "+ More Property Types"}
                </Button>
              </div>
            )}
          </div>

          {/* Rent Price Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("rentPrice")}
            >
              <h3 className="text-base font-medium text-black">Rent Price</h3>
              {sections.find((s) => s.id === "rentPrice")?.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {sections.find((s) => s.id === "rentPrice")?.isExpanded && (
              <div className="p-4">
                <div className="px-2">
                  {/* Distribution histogram - now clickable */}
                  <div className="h-12 flex items-end mb-2">
                    {priceDistribution.map((segment, index) => (
                      <button
                        key={index}
                        className="flex-1 mx-0.5 rounded-t cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-50"
                        style={{
                          height: `${(segment.count / 35) * 100}%`,
                          backgroundColor:
                            priceRange[0] <= segment.range[0] && priceRange[1] >= segment.range[1]
                              ? "#FFD580"
                              : "#e5e7eb",
                        }}
                        onClick={() => handlePriceBarClick(segment.range[0], segment.range[1])}
                      />
                    ))}
                  </div>

                  {/* Price range markers */}
                  <div className="flex justify-between mb-2 text-xs text-gray-500">
                    <span>$0</span>
                    <span>$1000</span>
                    <span>$2000</span>
                    <span>$3000</span>
                    <span>$4000</span>
                    <span>$5000+</span>
                  </div>

                  <Slider
                    value={priceRange}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-6"
                  />
                  <div className="flex justify-between mt-4">
                    <div className="bg-gray-100 px-4 py-3 rounded-md w-24 text-center text-sm font-medium border border-gray-300">
                      ${priceRange[0]}
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-md w-24 text-center text-sm font-medium border border-gray-300">
                      ${priceRange[1] === 5000 ? "$5000+" : `$${priceRange[1]}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Size Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("size")}
            >
              <h3 className="text-base font-medium text-black">Size (sqft)</h3>
              {sections.find((s) => s.id === "size")?.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {sections.find((s) => s.id === "size")?.isExpanded && (
              <div className="p-4">
                <div className="px-2">
                  {/* Distribution histogram - now clickable */}
                  <div className="h-12 flex items-end mb-2">
                    {sizeDistribution.map((segment, index) => (
                      <button
                        key={index}
                        className="flex-1 mx-0.5 rounded-t cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-50"
                        style={{
                          height: `${(segment.count / 35) * 100}%`,
                          backgroundColor:
                            sizeRange[0] <= segment.range[0] && sizeRange[1] >= segment.range[1]
                              ? "#FFD580"
                              : "#e5e7eb",
                        }}
                        onClick={() => handleSizeBarClick(segment.range[0], segment.range[1])}
                      />
                    ))}
                  </div>

                  {/* Size range markers */}
                  <div className="flex justify-between mb-2 text-xs text-gray-500">
                    <span>0</span>
                    <span>500</span>
                    <span>1000</span>
                    <span>1500</span>
                    <span>2000+</span>
                  </div>

                  <Slider
                    value={sizeRange}
                    min={0}
                    max={2000}
                    step={50}
                    onValueChange={(value) => setSizeRange(value as [number, number])}
                    className="my-6"
                  />
                  <div className="flex justify-between mt-4">
                    <div className="bg-gray-100 px-4 py-3 rounded-md w-24 text-center text-sm font-medium border border-gray-300">
                      {sizeRange[0]}
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-md w-24 text-center text-sm font-medium border border-gray-300">
                      {sizeRange[1] === 2000 ? "2000+" : sizeRange[1]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bedrooms Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("bedrooms")}
            >
              <h3 className="text-base font-medium text-black">Bedrooms</h3>
              {sections.find((s) => s.id === "bedrooms")?.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {sections.find((s) => s.id === "bedrooms")?.isExpanded && (
              <div className="p-4">
                <div className="flex flex-wrap gap-3">
                  {["0", "1", "2", "3", "4+"].map((num) => (
                    <Button
                      key={`bed-${num}`}
                      variant="outline"
                      className={`rounded-full w-16 h-16 min-w-[64px] min-h-[64px] ${
                        bedrooms.includes(num)
                          ? "bg-white text-black border-[#FFA500] border-2 shadow-md font-medium"
                          : "border-gray-300 text-black"
                      }`}
                      onClick={() => toggleSelection(num, bedrooms, setBedrooms)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bathrooms Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("bathrooms")}
            >
              <h3 className="text-base font-medium text-black">Bathrooms</h3>
              {sections.find((s) => s.id === "bathrooms")?.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {sections.find((s) => s.id === "bathrooms")?.isExpanded && (
              <div className="p-4">
                <div className="flex flex-wrap gap-3">
                  {["0", "1", "2", "3", "4+"].map((num) => (
                    <Button
                      key={`bath-${num}`}
                      variant="outline"
                      className={`rounded-full w-16 h-16 min-w-[64px] min-h-[64px] ${
                        bathrooms.includes(num)
                          ? "bg-white text-black border-[#FFA500] border-2 shadow-md font-medium"
                          : "border-gray-300 text-black"
                      }`}
                      onClick={() => toggleSelection(num, bathrooms, setBathrooms)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features & Amenities Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("amenities")}
            >
              <h3 className="text-base font-medium text-black">Features & Amenities</h3>
              {sections.find((s) => s.id === "amenities")?.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {sections.find((s) => s.id === "amenities")?.isExpanded && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "ac", label: "A/C" },
                    { id: "dishwasher", label: "Dishwasher" },
                    { id: "gym", label: "Gym" },
                    { id: "laundry-insuite", label: "Laundry Insuite" },
                    { id: "wheelchair", label: "Wheelchair Access" },
                    { id: "balcony", label: "Balcony" },
                    { id: "fireplace", label: "Fireplace" },
                    { id: "pool", label: "Pool" },
                    { id: "laundry-facilities", label: "Laundry Facilities" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center">
                      <Checkbox
                        id={item.id}
                        checked={amenities.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAmenities([...amenities, item.id])
                          } else {
                            setAmenities(amenities.filter((a) => a !== item.id))
                          }
                        }}
                        className="border-gray-400 text-[#FFA500] focus:ring-[#FFA500] h-5 w-5"
                      />
                      <label htmlFor={item.id} className="ml-2 text-sm text-black cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Utilities Included Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("utilities")}
            >
              <h3 className="text-base font-medium text-black">Utilities Included</h3>
              {sections.find((s) => s.id === "utilities")?.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {sections.find((s) => s.id === "utilities")?.isExpanded && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "heating", label: "Heating" },
                    { id: "hydro", label: "Hydro / Electricity" },
                    { id: "satellite", label: "Satellite TV" },
                    { id: "water", label: "Water" },
                    { id: "internet", label: "Internet / WiFi" },
                    { id: "cable", label: "Cable TV" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center">
                      <Checkbox
                        id={item.id}
                        checked={utilities.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setUtilities([...utilities, item.id])
                          } else {
                            setUtilities(utilities.filter((u) => u !== item.id))
                          }
                        }}
                        className="border-gray-400 text-[#FFA500] focus:ring-[#FFA500] h-5 w-5"
                      />
                      <label htmlFor={item.id} className="ml-2 text-sm text-black cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("categories")}
            >
              <h3 className="text-base font-medium text-black">Categories</h3>
              {sections.find((s) => s.id === "categories")?.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {sections.find((s) => s.id === "categories")?.isExpanded && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "corporate", label: "Corporate Housing" },
                    { id: "senior", label: "Senior Housing" },
                    { id: "sublet", label: "Sublet" },
                    { id: "luxury", label: "Luxury" },
                    { id: "student", label: "Student Housing" },
                    { id: "coop", label: "Co-op Housing" },
                    { id: "vacation", label: "Vacation" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center">
                      <Checkbox
                        id={`cat-${item.id}`}
                        checked={categories.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCategories([...categories, item.id])
                          } else {
                            setCategories(categories.filter((c) => c !== item.id))
                          }
                        }}
                        className="border-gray-400 text-[#FFA500] focus:ring-[#FFA500] h-5 w-5"
                      />
                      <label htmlFor={`cat-${item.id}`} className="ml-2 text-sm text-black cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom using absolute positioning */}
      <div
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 p-4 border-t flex justify-between items-center bg-white z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      >
        <Button
          variant="outline"
          className="px-6 py-3 rounded-lg border-gray-400 text-black hover:bg-gray-50 active:bg-gray-100 min-w-[100px] min-h-[48px]"
          onClick={handleClearFilters}
        >
          Clear all
        </Button>
        <Button
          className="bg-black hover:bg-black/90 active:bg-black/80 px-6 py-3 rounded-lg text-white min-w-[180px] min-h-[48px] font-medium"
          onClick={handleApplyFilters}
        >
          {filteredCount > 0 ? `Show ${filteredCount} listings` : "Show listings"}
        </Button>
      </div>
    </div>
  )
}
