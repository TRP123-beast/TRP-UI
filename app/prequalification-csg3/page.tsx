import { PrequalificationCSG3Wizard } from "@/components/prequalification-csg3-wizard"
import "./prequalification.css"

export default function PrequalificationCSG3Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Co-Signer/Guarantor Pre-Qualification (Multiple Occupants)</h1>
      <PrequalificationCSG3Wizard />
    </div>
  )
}
