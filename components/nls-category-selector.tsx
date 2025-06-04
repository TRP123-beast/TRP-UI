"use client"

import React from "react"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface NLSCategorySelectorProps {
  onCategorySelected: (category: "NLS1" | "NLS2" | "NLS3" | "LS3") => void
  onBack: () => void
}

const NLSCategorySelector: React.FC<NLSCategorySelectorProps> = ({ onCategorySelected, onBack }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<"NLS1" | "NLS2" | "NLS3" | "LS3">("NLS1")

  React.useEffect(() => {
    onCategorySelected(selectedCategory)
  }, [selectedCategory, onCategorySelected])

  return (
    <div className="flex flex-col space-y-4">
      <button onClick={onBack} className="text-sm text-blue-500 hover:underline">
        Back
      </button>
      <RadioGroup
        defaultValue="NLS1"
        className="flex flex-col space-y-2"
        onValueChange={(value) => setSelectedCategory(value as "NLS1" | "NLS2" | "NLS3" | "LS3")}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="NLS1" id="nls1" />
          <Label htmlFor="nls1" className="text-sm">
            <div>
              <div className="font-medium">NLS1 - Non-Lease Signer 1 (Rent Responsible)</div>
              <div className="text-gray-500 text-xs">For non-lease signers who are contributing to rent payments</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="NLS2" id="nls2" />
          <Label htmlFor="nls2" className="text-sm">
            <div>
              <div className="font-medium">NLS2 - Non-Lease Signer 2 (Not Rent Responsible)</div>
              <div className="text-gray-500 text-xs">
                For non-lease signers who are not contributing to rent payments
              </div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="NLS3" id="nls3" />
          <Label htmlFor="nls3" className="text-sm">
            <div>
              <div className="font-medium">NLS3 - Non-Lease Signer 3 (Rent Responsible)</div>
              <div className="text-gray-500 text-xs">For non-lease signers who are contributing to rent payments</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="LS3" id="ls3" />
          <Label htmlFor="ls3" className="text-sm">
            <div>
              <div className="font-medium">LS3 - Lease Signer 3 (Not Rent Responsible)</div>
              <div className="text-gray-500 text-xs">For lease signers who are not contributing to rent payments</div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

export default NLSCategorySelector
