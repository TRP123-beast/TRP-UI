"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Property {
  id: string
  image: string
  price: string
  address: string
  location: string
  [key: string]: any
}

interface WishlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property | null
}

interface Wishlist {
  id: string
  name: string
  count: number
  image: string
  isEditing?: boolean
}

export function WishlistDialog({ open, onOpenChange, property }: WishlistDialogProps) {
  // Start with some sample wishlists for better UX
  const [wishlists, setWishlists] = useState<Wishlist[]>([
    {
      id: "1",
      name: "Dream Homes",
      count: 3,
      image: property?.image || "/placeholder.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "Beach Houses",
      count: 1,
      image: property?.image || "/placeholder.svg?height=200&width=200",
    },
  ])
  const [newWishlistName, setNewWishlistName] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [editingWishlistId, setEditingWishlistId] = useState<string | null>(null)
  const [editingWishlistName, setEditingWishlistName] = useState("")

  // Debug logging
  useEffect(() => {
    console.log("WishlistDialog rendered with open:", open)
    console.log("Property:", property)
  }, [open, property])

  // Update wishlists when property changes
  useEffect(() => {
    if (property) {
      setWishlists((prev) =>
        prev.map((w) => ({
          ...w,
          image: property.image || w.image,
        })),
      )
    }
  }, [property])

  const handleAddToWishlist = (wishlistId: string) => {
    // In a real app, you would update the backend here
    alert(`Added to wishlist: ${wishlists.find((w) => w.id === wishlistId)?.name}`)
    onOpenChange(false)
  }

  const handleCreateNewWishlist = () => {
    if (newWishlistName.trim()) {
      const newWishlist = {
        id: Date.now().toString(),
        name: newWishlistName,
        count: 1,
        image: property?.image || "/placeholder.svg?height=200&width=200",
      }
      setWishlists([...wishlists, newWishlist])
      setNewWishlistName("")
      setIsCreatingNew(false)
      alert(`Created new wishlist: ${newWishlistName}`)
      onOpenChange(false)
    }
  }

  const handleDeleteWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this wishlist?")) {
      setWishlists(wishlists.filter((w) => w.id !== id))
    }
  }

  const handleStartEditWishlist = (wishlist: Wishlist, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingWishlistId(wishlist.id)
    setEditingWishlistName(wishlist.name)
  }

  const handleSaveEditWishlist = () => {
    if (editingWishlistName.trim() && editingWishlistId) {
      setWishlists(wishlists.map((w) => (w.id === editingWishlistId ? { ...w, name: editingWishlistName } : w)))
      setEditingWishlistId(null)
      setEditingWishlistName("")
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto p-4 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-center flex-1">Save to a Wishlist</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {wishlists.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            {wishlists.map((wishlist) => (
              <div
                key={wishlist.id}
                className="cursor-pointer relative"
                onClick={() => handleAddToWishlist(wishlist.id)}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                  <Image
                    src={wishlist.image || "/placeholder.svg?height=200&width=200"}
                    alt={wishlist.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      className="bg-white/80 backdrop-blur-sm p-1 rounded-full hover:bg-white"
                      onClick={(e) => handleStartEditWishlist(wishlist, e)}
                    >
                      <Pencil className="h-3 w-3 text-gray-700" />
                    </button>
                    <button
                      className="bg-white/80 backdrop-blur-sm p-1 rounded-full hover:bg-white"
                      onClick={(e) => handleDeleteWishlist(wishlist.id, e)}
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                </div>
                {editingWishlistId === wishlist.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingWishlistName}
                      onChange={(e) => setEditingWishlistName(e.target.value)}
                      className="h-8 text-sm border-gray-300 text-gray-800"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      size="sm"
                      className="h-8 px-2 bg-[#FF5A5F] text-white hover:bg-[#FF5A5F]/90"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveEditWishlist()
                      }}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-800">{wishlist.name}</h3>
                    <p className="text-sm text-gray-500">{wishlist.count} saved</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            <p>You don't have any wishlists yet.</p>
            <p>Create your first wishlist below.</p>
          </div>
        )}

        {isCreatingNew ? (
          <div className="mt-2">
            <Input
              placeholder="Name your wishlist"
              value={newWishlistName}
              onChange={(e) => setNewWishlistName(e.target.value)}
              className="mb-2 border-gray-300 text-gray-800"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreatingNew(false)}
                className="border-gray-300 text-gray-800 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#FF5A5F] text-white hover:bg-[#FF5A5F]/90 font-medium"
                onClick={handleCreateNewWishlist}
              >
                Create
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full mt-2 bg-[#FF5A5F] text-white hover:bg-[#FF5A5F]/90 font-medium"
            onClick={() => setIsCreatingNew(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create new wishlist
          </Button>
        )}
      </div>
    </div>
  )
}
