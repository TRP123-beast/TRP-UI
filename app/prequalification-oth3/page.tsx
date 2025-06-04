import { PrequalificationOTH3Wizard } from "@/components/prequalification-oth3-wizard"
import "./prequalification.css"

export default function PrequalificationOTH3Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Other Pre-Qualification (Multiple Occupants)</h1>
      <PrequalificationOTH3Wizard />
    </div>
  )
}
