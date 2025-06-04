"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FilterModal } from "@/components/filter-modal"

export default function FiltersPage() {
  const router = useRouter()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [noPropertiesFound, setNoPropertiesFound] = useState(false)
  const [filters, setFilters] = useState<any>({})
  const [areaCodes, setAreaCodes] = useState<{ code: string; name: string }[]>([
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
  ])

  // Fetch properties data (mock for now)
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const mockProperties = [
      {
        id: "20",
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
        beds: 3,
        baths: 3,
        parking: 2,
        sqft: "1800",
        location: "Halifax",
        areaCode: "CO7",
        propertyType: "house",
      },
    ]
    setProperties(mockProperties)
  }, [])

  const handleClearFilters = () => {
    // Clear all filters
    setFilters({})
  }

  const handleShowListings = () => {
    // Store filters in localStorage to be used in the dashboard
    localStorage.setItem("appliedFilters", JSON.stringify(filters))
    // Navigate back to the dashboard
    router.push("/")
  }

  const handleApplyFilters = (newFilters: any) => {
    // Store the filters for use with the top buttons
    setFilters(newFilters)

    // Filter properties based on the selected filters
    const filtered = properties.filter((property) => {
      // Property type filter
      if (newFilters.propertyTypes.length > 0 && !newFilters.propertyTypes.includes(property.propertyType)) {
        return false
      }

      // Bedrooms filter
      if (newFilters.bedrooms.length > 0) {
        const bedroomCount = property.beds.toString()
        const matches = newFilters.bedrooms.some((b: string) => {
          if (b === "4+") return property.beds >= 4
          return bedroomCount === b
        })
        if (!matches) return false
      }

      // Bathrooms filter
      if (newFilters.bathrooms.length > 0) {
        const bathroomCount = property.baths.toString()
        const matches = newFilters.bathrooms.some((b: string) => {
          if (b === "4+") return property.baths >= 4
          return bathroomCount === b
        })
        if (!matches) return false
      }

      // Size range filter
      if (newFilters.sizeRange[0] > 0 || newFilters.sizeRange[1] < 2000) {
        const sqftRange = property.sqft.split(" - ")
        const minSqft = Number.parseInt(sqftRange[0])
        const maxSqft = sqftRange.length > 1 ? Number.parseInt(sqftRange[1]) : minSqft

        if (minSqft < newFilters.sizeRange[0] || maxSqft > newFilters.sizeRange[1]) {
          return false
        }
      }

      // Area code filter
      if (newFilters.areaCodes && newFilters.areaCodes.length > 0 && !newFilters.areaCodes.includes("All")) {
        if (!newFilters.areaCodes.includes(property.areaCode)) return false
      }

      return true
    })

    setFilteredProperties(filtered)

    // Check if no properties were found
    if (filtered.length === 0) {
      setNoPropertiesFound(true)
    } else {
      // Store filters in localStorage to be used in the dashboard
      localStorage.setItem("appliedFilters", JSON.stringify(newFilters))
      // Navigate back to the dashboard
      router.push("/")
    }
  }

  const handleCloseFilters = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-white">
      {noPropertiesFound ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-black mb-4">No properties were found</h2>
            <p className="text-gray-700 mb-8">
              We couldn't find any properties matching your selected filters. Please try adjusting your search criteria.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-white text-black border border-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return to dashboard
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* FilterModal component with full screen on mobile */}
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={handleCloseFilters}
            onApplyFilters={handleApplyFilters}
            propertyCount={properties.length}
            properties={properties}
            areaCodes={areaCodes}
            isMobile={true}
          />
        </>
      )}
    </div>
  )
}
