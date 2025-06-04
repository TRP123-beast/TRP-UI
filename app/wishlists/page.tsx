"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TopNav } from "@/components/top-nav"
import { Sidebar } from "@/components/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function WishlistsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newWishlistName, setNewWishlistName] = useState("")

  // Mock properties in folders
  const folderProperties = {
    "1": [
      {
        id: "101",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        price: "$2,600/mo",
        address: "20 O'Neill Rd #238, North York, ON",
        beds: 3,
        baths: 2,
        inCart: false,
      },
      {
        id: "102",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        price: "$4,200/mo",
        address: "809 Bay Street #1501, Toronto, ON",
        beds: 2,
        baths: 2,
        inCart: true,
      },
      {
        id: "103",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
        price: "$3,400/mo",
        address: "312 Queen Street West, Toronto, ON",
        beds: 2,
        baths: 1,
        inCart: false,
      },
    ],
    "2": [
      {
        id: "201",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
        price: "$3,200/mo",
        address: "224 King St W #1901, Toronto, ON",
        beds: 1,
        baths: 1,
        inCart: false,
      },
      {
        id: "202",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
        price: "$5,500/mo",
        address: "508 Wellington St W #602, Toronto, ON",
        beds: 3,
        baths: 2,
        inCart: true,
      },
    ],
  }

  // Mock wishlist folders
  const [folders, setFolders] = useState([
    {
      id: "1",
      name: "Dream Homes",
      count: 3,
      image: folderProperties["1"]?.[0]?.image || "/placeholder.svg?height=300&width=400",
    },
    {
      id: "2",
      name: "Toronto Properties",
      count: 2,
      image: folderProperties["2"]?.[0]?.image || "/placeholder.svg?height=300&width=400",
    },
  ])

  const [properties, setProperties] = useState<any>(folderProperties)

  const toggleShowingRequest = (folderId: string, propertyId: string) => {
    setProperties({
      ...properties,
      [folderId]: properties[folderId].map((property: any) =>
        property.id === propertyId ? { ...property, inCart: !property.inCart } : property,
      ),
    })
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? "block" : "hidden md:block"} activePage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} cartItems={[]} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              {selectedFolder ? (
                <Button variant="ghost" size="icon" onClick={() => setSelectedFolder(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl font-semibold">
                {selectedFolder ? folders.find((f) => f.id === selectedFolder)?.name : "Wishlists"}
              </h1>
            </div>

            {/* Folders or Properties */}
            {!selectedFolder ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <button
                    className="border-2 border-dashed border-navy-blue/30 rounded-lg p-6 flex flex-col items-center justify-center text-futuristic-darker hover:border-navy-blue hover:text-navy-blue transition-colors duration-200"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="font-medium font-quicksand">Create new wishlist</span>
                  </button>

                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="border border-navy-blue/30 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:shadow-navy-blue/20 transition-all duration-200 relative"
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <button
                        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("Are you sure you want to delete this wishlist?")) {
                            const newFolders = folders.filter((f) => f.id !== folder.id)
                            setFolders(newFolders)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-[#FF5A5F]" />
                      </button>
                      <div className="relative aspect-square">
                        <Image
                          src={folder.image || "/placeholder.svg"}
                          alt={folder.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-futuristic-darker/50 to-transparent"></div>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-semibold text-futuristic-darker">{folder.name}</h3>
                        <p className="text-[#FF5A5F] font-medium text-sm">{folder.count} saved</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties[selectedFolder].map((property: any) => (
                  <div key={property.id} className="border rounded-lg overflow-hidden relative">
                    <button
                      className="absolute top-2 left-2 z-10 bg-white rounded-full p-1.5 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm("Remove this property from wishlist?")) {
                          const updatedProperties = { ...properties }
                          updatedProperties[selectedFolder] = properties[selectedFolder].filter(
                            (p) => p.id !== property.id,
                          )
                          setProperties(updatedProperties)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-[#FF5A5F]" />
                    </button>
                    <div className="relative aspect-square">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.address}
                        fill
                        className="object-cover"
                      />
                      <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
                        <Heart className="h-5 w-5 text-navy-blue fill-navy-blue" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{property.price}</h3>
                      <p className="text-gray-700 text-sm">{property.address}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {property.beds} beds • {property.baths} baths
                      </p>

                      <Button
                        className={`w-full mt-3 ${
                          property.inCart
                            ? "bg-white text-gray-700 border border-gray-300"
                            : "bg-navy-blue hover:bg-navy-blue/90 text-white"
                        }`}
                        onClick={() => toggleShowingRequest(selectedFolder, property.id)}
                      >
                        {property.inCart ? "Cancel Request" : "Request Showing"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add padding at the bottom for mobile nav */}
        <div className="h-16 md:hidden"></div>
      </div>
      {/* Create Wishlist Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Wishlist Name
              </label>
              <Input
                id="name"
                placeholder="Enter wishlist name"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newWishlistName.trim()) {
                  const newFolder = {
                    id: Date.now().toString(),
                    name: newWishlistName,
                    count: 0,
                    image: "/placeholder.svg?height=300&width=400",
                  }
                  setFolders([...folders, newFolder])
                  setProperties({
                    ...properties,
                    [newFolder.id]: [],
                  })
                  setNewWishlistName("")
                  setCreateDialogOpen(false)
                }
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
