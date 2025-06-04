import { PrequalificationNav } from "@/components/prequalification-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrequalificationLandingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Pre-Qualification Workflows</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        <PrequalificationNav />
      </div>

      <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <WorkflowCard
          title="Leaseholder (Single Occupant)"
          description="For individuals who are currently on a lease and looking to rent on their own."
          href="/prequalification-gc1"
          variant="LS1"
        />

        <WorkflowCard
          title="Leaseholder (Multiple Occupants)"
          description="For individuals who are currently on a lease and looking to rent with others."
          href="/prequalification-ls3"
          variant="LS3"
        />

        <WorkflowCard
          title="Non-Leaseholder (Single Occupant)"
          description="For individuals who are not currently on a lease and looking to rent on their own."
          href="/prequalification-gc2"
          variant="NLS1"
        />

        <WorkflowCard
          title="Non-Leaseholder (Multiple Occupants)"
          description="For individuals who are not currently on a lease and looking to rent with others."
          href="/prequalification-nls3"
          variant="NLS3"
        />

        <WorkflowCard
          title="Co-Signer/Guarantor (Single Occupant)"
          description="For co-signers or guarantors who will be helping a single occupant rent a property."
          href="/prequalification-csg1"
          variant="CSG1"
        />

        <WorkflowCard
          title="Co-Signer/Guarantor (Multiple Occupants)"
          description="For co-signers or guarantors who will be helping multiple occupants rent a property."
          href="/prequalification-csg3"
          variant="CSG3"
        />

        <WorkflowCard
          title="Other (Single Occupant)"
          description="For individuals who have a relationship with a single occupant but are not co-signers or guarantors."
          href="/prequalification-oth1"
          variant="OTH1"
        />

        <WorkflowCard
          title="Other (Multiple Occupants)"
          description="For individuals who have a relationship with multiple occupants but are not co-signers or guarantors."
          href="/prequalification-oth3"
          variant="OTH3"
        />
      </div>
    </div>
  )
}

interface WorkflowCardProps {
  title: string
  description: string
  href: string
  variant: string
}

function WorkflowCard({ title, description, href, variant }: WorkflowCardProps) {
  const getVariantColor = (variant: string) => {
    switch (variant) {
      case "LS1":
      case "LS3":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
      case "NLS1":
      case "NLS3":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "CSG1":
      case "CSG3":
        return "bg-purple-50 border-purple-200 hover:bg-purple-100"
      case "OTH1":
      case "OTH3":
        return "bg-amber-50 border-amber-200 hover:bg-amber-100"
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  return (
    <div className={`border rounded-lg p-6 transition-colors ${getVariantColor(variant)}`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium px-2 py-1 bg-white rounded border">{variant}</span>
        <Link href={href}>
          <Button className="bg-orange-500 hover:bg-orange-600">Start</Button>
        </Link>
      </div>
    </div>
  )
}
