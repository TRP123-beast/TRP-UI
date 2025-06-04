"use client"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OccupantCounterProps {
  label: string
  count: number
  minCount?: number
  onChange: (newCount: number) => void
}

export function OccupantCounter({ label, count, minCount = 0, onChange }: OccupantCounterProps) {
  const increment = () => {
    onChange(count + 1)
  }

  const decrement = () => {
    if (count > minCount) {
      onChange(count - 1)
    }
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
      <span className="font-medium">{label}</span>
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="icon" onClick={decrement} disabled={count <= minCount}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{count}</span>
        <Button variant="outline" size="icon" onClick={increment}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
