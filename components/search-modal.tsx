"use client"

import { useState, useEffect, useRef } from "react"
import { X, SearchIcon, MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (filters: any) => void
}

export function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [step, setStep] = useState(1)
  const [location, setLocation] = useState("")
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" })
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
      setStep(1)
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const handlePropertyTypeToggle = (type: string) => {
    if (propertyTypes.includes(type)) {
      setPropertyTypes(propertyTypes.filter((t) => t !== type))
    } else {
      setPropertyTypes([...propertyTypes, type])
    }
  }

  const handleClearAll = () => {
    setLocation("")
    setPropertyTypes([])
    setPriceRange({ min: "", max: "" })
    setStep(1)
  }

  const handleSearch = () => {
    onSearch({
      location,
      propertyTypes,
      priceRange,
    })
    onClose()
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center md:items-center">
      <div ref={modalRef} className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
          <button onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </button>
          {step === 1 && <h2 className="text-xl font-semibold">Where to?</h2>}
          {step === 2 && <h2 className="text-xl font-semibold">What type of place?</h2>}
          {step === 3 && <h2 className="text-xl font-semibold">Price range</h2>}
          <div className="w-5"></div> {/* Spacer for alignment */}
        </div>

        <div className="p-4">
          {step === 1 && (
            <>
              <div className="relative mb-6">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search destinations"
                  className="w-full pl-10 pr-4 py-3 border rounded-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {location && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setLocation("")}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              <h3 className="text-lg font-medium mb-4">Suggested destinations</h3>

              <div className="space-y-4">
                <button
                  className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-gray-100"
                  onClick={() => {
                    setLocation("Nearby")
                    handleNextStep()
                  }}
                >
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Nearby</p>
                    <p className="text-gray-500 text-sm">Find what's around you</p>
                  </div>
                </button>

                <button
                  className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-gray-100"
                  onClick={() => {
                    setLocation("Toronto, ON")
                    handleNextStep()
                  }}
                >
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Home className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Toronto, ON</p>
                    <p className="text-gray-500 text-sm">Because your wishlist has stays in Toronto</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {["house", "apartment", "condo", "townhouse"].map((type) => (
                  <button
                    key={type}
                    className={`border rounded-xl p-4 flex flex-col items-center gap-2 ${
                      propertyTypes.includes(type) ? "border-teal-500 bg-teal-50" : ""
                    }`}
                    onClick={() => handlePropertyTypeToggle(type)}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {type === "house" && <span>🏠</span>}
                      {type === "apartment" && <span>🏢</span>}
                      {type === "condo" && <span>🏙️</span>}
                      {type === "townhouse" && <span>🏘️</span>}
                    </div>
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Minimum price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border rounded-lg"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Maximum price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="Any"
                      className="w-full pl-8 pr-4 py-3 border rounded-lg"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between">
          <Button variant="outline" onClick={handleClearAll}>
            Clear all
          </Button>

          {step < 3 ? (
            <Button onClick={handleNextStep} className="bg-teal-500 hover:bg-teal-600">
              Next
            </Button>
          ) : (
            <Button onClick={handleSearch} className="bg-teal-500 hover:bg-teal-600">
              Search
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
