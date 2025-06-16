"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Calendar, MessageSquare, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useMobile } from "@/hooks/use-mobile"

// Mock data for cart properties
const mockCartProperties = [
  {
    id: 1,
    address: "720 Bathurst St, Toronto, ON",
    rent: 2400,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    image: "/placeholder.svg?height=200&width=300",
    isVacant: true,
    landlordName: "Ms. Smith",
    landlordPhone: "(416) 555-0123",
    landlordEmail: "smith@email.com",
  },
  {
    id: 2,
    address: "456 Queen St W, Toronto, ON",
    rent: 2200,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    image: "/placeholder.svg?height=200&width=300",
    isVacant: false,
    landlordName: "John Davis",
    landlordPhone: "(416) 555-0456",
    landlordEmail: "davis@email.com",
  },
  {
    id: 3,
    address: "123 College St, Toronto, ON",
    rent: 2800,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    image: "/placeholder.svg?height=200&width=300",
    isVacant: true,
    landlordName: "Sarah Wilson",
    landlordPhone: "(416) 555-0789",
    landlordEmail: "wilson@email.com",
  },
]

// Mock group members data
const mockGroupMembers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    profilePic: "/placeholder.svg?height=50&width=50",
    memberType: "Primary Leaseholder",
    occupantType: "Tenant",
    isConnected: true,
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    profilePic: "/placeholder.svg?height=50&width=50",
    memberType: "Co-Leaseholder",
    occupantType: "Tenant",
    isConnected: true,
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    profilePic: "/placeholder.svg?height=50&width=50",
    memberType: "Guarantor",
    occupantType: "Non-Occupant",
    isConnected: false,
  },
]

// Mock tenant data for agent communication
const mockTenantData = {
  userName: "John Doe",
  creditScore: 750,
  combinedHouseholdIncome: 85000,
  earliestMoveInDate: "2024-03-01",
  extraRentPaymentsMonths: 3,
  numberOfPets: 1,
  petBreeds: "Golden Retriever",
  petSizes: "65 lbs",
  trpListingAgentNumber: "(416) 555-TRP1",
}

export default function LeaseSuccessCartPage() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const [cartProperties, setCartProperties] = useState(mockCartProperties)
  const [showScheduling, setShowScheduling] = useState(false)
  const [showAgentCommunication, setShowAgentCommunication] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)

  // Agent communication state
  const [agentResponses, setAgentResponses] = useState({
    propertyAvailable: null as boolean | null,
    acceptsPets: null as boolean | null,
    hasOffers: null as boolean | null,
    numberOfOffers: "",
    wouldConsider: null as boolean | null,
    needsAdditionalDocs: null as boolean | null,
    additionalDocs: [] as number[],
    scheduleAPreference: null as string | null,
    keyDepositAmount: "",
    needsMoreTime: null as boolean | null,
    agentEmail: "",
  })

  const removeProperty = (propertyId: number) => {
    setCartProperties((prev) => prev.filter((property) => property.id !== propertyId))
  }

  const handleScheduleShowings = () => {
    setShowScheduling(true)
  }

  const handleConfirmScheduling = (property: any) => {
    setSelectedProperty(property)
    setShowAgentCommunication(true)
    setShowScheduling(false)
  }

  const updateAgentResponse = (field: string, value: any) => {
    setAgentResponses((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleAdditionalDoc = (docNumber: number) => {
    setAgentResponses((prev) => ({
      ...prev,
      additionalDocs: prev.additionalDocs.includes(docNumber)
        ? prev.additionalDocs.filter((doc) => doc !== docNumber)
        : [...prev.additionalDocs, docNumber],
    }))
  }

  const PropertyCard = ({ property }: { property: any }) => (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex">
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.address}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{property.address}</h3>
              <p className="text-2xl font-bold text-orange-600">${property.rent.toLocaleString()}/month</p>
            </div>
            <button
              onClick={() => removeProperty(property.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Remove property"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
            <span>{property.sqft} sqft</span>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                property.isVacant ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {property.isVacant ? "Available Immediately" : "24-hour Notice Required"}
            </div>

            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => handleConfirmScheduling(property)}
            >
              Schedule Viewing
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const GroupMemberCard = ({ member }: { member: any }) => (
    <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
      <div className="relative">
        <img
          src={member.profilePic || "/placeholder.svg"}
          alt={`${member.firstName} ${member.lastName}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            member.isConnected ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      <div className="flex-1">
        <p className="font-medium">
          {member.firstName} {member.lastName}
        </p>
        <p className="text-sm text-gray-600">{member.memberType}</p>
        <p className="text-xs text-gray-500">{member.occupantType}</p>
      </div>

      <div
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          member.isConnected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
        }`}
      >
        {member.isConnected ? "Connected" : "Pending"}
      </div>
    </div>
  )

  const AgentCommunicationFlow = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-800 mb-2">Agent Communication</h3>
        <p className="text-sm text-orange-700">Communicating with listing agent for: {selectedProperty?.address}</p>
      </div>

      {/* Initial Contact */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start space-x-3 mb-4">
          <MessageSquare className="h-5 w-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Initial Contact Message:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              "Hi, this is {mockTenantData.userName} from TRP Realty. I have a AAA tenant who is interested in viewing{" "}
              {selectedProperty?.address}. Is this property still available?"
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Response:</span>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="propertyAvailable"
                checked={agentResponses.propertyAvailable === true}
                onChange={() => updateAgentResponse("propertyAvailable", true)}
                className="text-orange-500"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="propertyAvailable"
                checked={agentResponses.propertyAvailable === false}
                onChange={() => updateAgentResponse("propertyAvailable", false)}
                className="text-orange-500"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>

        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          "This conversation is part of a text sequence. If you would rather talk on the phone, please call this number
          to discuss further: {mockTenantData.trpListingAgentNumber}."
        </div>
      </div>

      {/* Pet Question */}
      {mockTenantData.numberOfPets > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-start space-x-3 mb-4">
            <MessageSquare className="h-5 w-5 text-orange-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Pet Information:</p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                "My tenant has {mockTenantData.numberOfPets} pets. The breeds are {mockTenantData.petBreeds} and weight{" "}
                {mockTenantData.petSizes}. Will your landlord accept a tenant like this?"
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Response:</span>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="acceptsPets"
                  checked={agentResponses.acceptsPets === true}
                  onChange={() => updateAgentResponse("acceptsPets", true)}
                  className="text-orange-500"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="acceptsPets"
                  checked={agentResponses.acceptsPets === false}
                  onChange={() => updateAgentResponse("acceptsPets", false)}
                  className="text-orange-500"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Offers Question */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start space-x-3 mb-4">
          <MessageSquare className="h-5 w-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Current Offers:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">"Are there currently any offers?"</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-3">
          <span className="text-sm font-medium">Response:</span>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="hasOffers"
                checked={agentResponses.hasOffers === true}
                onChange={() => updateAgentResponse("hasOffers", true)}
                className="text-orange-500"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="hasOffers"
                checked={agentResponses.hasOffers === false}
                onChange={() => updateAgentResponse("hasOffers", false)}
                className="text-orange-500"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>

        {agentResponses.hasOffers === true && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">How many offers?</label>
            <Input
              type="number"
              value={agentResponses.numberOfOffers}
              onChange={(e) => updateAgentResponse("numberOfOffers", e.target.value)}
              className="w-24"
            />
          </div>
        )}

        {agentResponses.hasOffers === false && (
          <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700">
            <p className="font-medium mb-2">Tenant Qualifications:</p>
            <ul className="space-y-1 text-xs">
              <li>• Credit score: {mockTenantData.creditScore}</li>
              <li>• Combined household income: ${mockTenantData.combinedHouseholdIncome.toLocaleString()}</li>
              <li>• Willing to move as early as {mockTenantData.earliestMoveInDate}</li>
              <li>• Willing to pay {mockTenantData.extraRentPaymentsMonths} months in advance</li>
            </ul>
          </div>
        )}
      </div>

      {/* Consideration Question */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start space-x-3 mb-4">
          <MessageSquare className="h-5 w-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Tenant Consideration:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">"Is this somebody you would consider?"</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Response:</span>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="wouldConsider"
                checked={agentResponses.wouldConsider === true}
                onChange={() => updateAgentResponse("wouldConsider", true)}
                className="text-orange-500"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="wouldConsider"
                checked={agentResponses.wouldConsider === false}
                onChange={() => updateAgentResponse("wouldConsider", false)}
                className="text-orange-500"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Additional Documents */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start space-x-3 mb-4">
          <MessageSquare className="h-5 w-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Documentation:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              "We have our client's credit report/score, employment letter, rental application form, references, and
              cover letter. Would you require any additional documents if we submit an offer?"
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-3">
          <span className="text-sm font-medium">Response:</span>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="needsAdditionalDocs"
                checked={agentResponses.needsAdditionalDocs === true}
                onChange={() => updateAgentResponse("needsAdditionalDocs", true)}
                className="text-orange-500"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="needsAdditionalDocs"
                checked={agentResponses.needsAdditionalDocs === false}
                onChange={() => updateAgentResponse("needsAdditionalDocs", false)}
                className="text-orange-500"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>

        {agentResponses.needsAdditionalDocs === true && (
          <div>
            <p className="text-sm font-medium mb-2">Select required documents:</p>
            <div className="space-y-2">
              {[
                { id: 1, label: "Bank Statement (3 months)" },
                { id: 2, label: "Pay Stub" },
                { id: 3, label: "Notice of Assessment" },
              ].map((doc) => (
                <label key={doc.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={agentResponses.additionalDocs.includes(doc.id)}
                    onCheckedChange={() => toggleAdditionalDoc(doc.id)}
                  />
                  <span className="text-sm">
                    {doc.id}. {doc.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Schedule A */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start space-x-3 mb-4">
          <MessageSquare className="h-5 w-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Schedule A:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              "We have a comprehensive Schedule A that contains all the clauses to ensure that both sides of the
              agreement are protected. Can we use this Schedule A or would you prefer to send your own?"
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-3">
          <span className="text-sm font-medium">Response:</span>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="scheduleAPreference"
                value="use_yours"
                checked={agentResponses.scheduleAPreference === "use_yours"}
                onChange={(e) => updateAgentResponse("scheduleAPreference", e.target.value)}
                className="text-orange-500"
              />
              <span className="text-sm">Use your comprehensive Schedule A</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="scheduleAPreference"
                value="send_mine"
                checked={agentResponses.scheduleAPreference === "send_mine"}
                onChange={(e) => updateAgentResponse("scheduleAPreference", e.target.value)}
                className="text-orange-500"
              />
              <span className="text-sm">I will send you mine</span>
            </label>
          </div>
        </div>

        {agentResponses.scheduleAPreference === "use_yours" && (
          <div>
            <label className="block text-sm font-medium mb-2">What is the key deposit amount?</label>
            <Input
              value={agentResponses.keyDepositAmount}
              onChange={(e) => updateAgentResponse("keyDepositAmount", e.target.value)}
              placeholder="Enter amount"
              className="w-48"
            />
          </div>
        )}
      </div>

      {/* Irrevocability Time */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start space-x-3 mb-4">
          <MessageSquare className="h-5 w-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Irrevocability Period:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              "Do you need more than 24 hours for irrevocability on the Agreement to Lease?"
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Response:</span>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="needsMoreTime"
                checked={agentResponses.needsMoreTime === true}
                onChange={() => updateAgentResponse("needsMoreTime", true)}
                className="text-orange-500"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="needsMoreTime"
                checked={agentResponses.needsMoreTime === false}
                onChange={() => updateAgentResponse("needsMoreTime", false)}
                className="text-orange-500"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Agent Email */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start space-x-3 mb-4">
          <MessageSquare className="h-5 w-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Contact Information:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              "What is your email address to send an offer with supporting documentation when we are ready?"
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Agent Email:</label>
          <Input
            type="email"
            value={agentResponses.agentEmail}
            onChange={(e) => updateAgentResponse("agentEmail", e.target.value)}
            placeholder="agent@email.com"
            className="w-64"
          />
        </div>
      </div>

      {/* Final Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Check className="h-5 w-5 text-green-600 mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 mb-2">Closing Message:</p>
            <div className="text-sm text-green-700">
              "Thank you, we will now go ahead with booking a showing to view {selectedProperty?.address} and come back
              to you when ready to take the next step."
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => setShowAgentCommunication(false)}>
          Back to Cart
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => {
            // Process agent communication data
            console.log("Agent communication completed:", agentResponses)
            router.push("/scheduling")
          }}
        >
          Complete Communication
        </Button>
      </div>
    </div>
  )

  if (showAgentCommunication) {
    return (
      <DashboardLayout hideTopBar={true}>
        <div className="min-h-screen pt-6 pb-20 bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            {isMobile && (
              <div className="flex items-center mb-6">
                <button
                  className="p-2 rounded-full hover:bg-gray-100 mr-2"
                  onClick={() => setShowAgentCommunication(false)}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-semibold">Agent Communication</h1>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto p-6">
              <AgentCommunicationFlow />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout hideTopBar={true}>
      <div className="min-h-screen pt-6 pb-20 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Mobile header with back button */}
          {isMobile && (
            <div className="flex items-center mb-6">
              <button
                className="p-2 rounded-full hover:bg-gray-100 mr-2"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">Cart</h1>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Cart</h1>
                <div className="text-sm text-gray-600">
                  {cartProperties.length} {cartProperties.length === 1 ? "property" : "properties"}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Vacant units will be available to view immediately whereas units that are
                  currently tenanted require 24-hour notice.
                </p>
              </div>

              {/* Property List */}
              <div className="space-y-4 mb-8">
                <h2 className="text-lg font-semibold">Selected Properties</h2>
                {cartProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => router.push("/")}>
                      Browse Properties
                    </Button>
                  </div>
                ) : (
                  cartProperties.map((property) => <PropertyCard key={property.id} property={property} />)
                )}
              </div>

              {cartProperties.length > 0 && (
                <>
                  {/* Group Members Section */}
                  <div className="border-t pt-8 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Group Members Required for Showings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockGroupMembers.map((member) => (
                        <GroupMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
                        onClick={handleScheduleShowings}
                        size="lg"
                      >
                        <Calendar className="h-5 w-5" />
                        <span>Create Schedule for Showings</span>
                      </Button>
                    </div>

                    {showScheduling && (
                      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h3 className="font-semibold text-orange-800 mb-4">Schedule Showings</h3>
                        <p className="text-sm text-orange-700 mb-4">
                          Select properties to schedule viewings. This will initiate communication with the listing
                          agents.
                        </p>

                        <div className="space-y-3">
                          {cartProperties.map((property) => (
                            <div
                              key={property.id}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border"
                            >
                              <div>
                                <p className="font-medium">{property.address}</p>
                                <p className="text-sm text-gray-600">
                                  {property.isVacant ? "Available immediately" : "24-hour notice required"}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={() => handleConfirmScheduling(property)}
                              >
                                Confirm
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
