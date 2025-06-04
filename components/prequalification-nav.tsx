import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PrequalificationNav() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="leaseholder">Leaseholder</TabsTrigger>
        <TabsTrigger value="non-leaseholder">Non-Leaseholder</TabsTrigger>
        <TabsTrigger value="other">Others</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WorkflowLink
            title="LS1: Leaseholder (Single)"
            href="/prequalification-gc1"
            description="For leaseholders living alone"
          />
          <WorkflowLink
            title="LS3: Leaseholder (Multiple)"
            href="/prequalification-ls3"
            description="For leaseholders living with others"
          />
          <WorkflowLink
            title="NLS1: Non-Leaseholder (Single)"
            href="/prequalification-gc2"
            description="For non-leaseholders living alone"
          />
          <WorkflowLink
            title="NLS3: Non-Leaseholder (Multiple)"
            href="/prequalification-nls3"
            description="For non-leaseholders living with others"
          />
          <WorkflowLink
            title="CSG1: Co-Signer/Guarantor (Single)"
            href="/prequalification-csg1"
            description="For co-signers of single occupants"
          />
          <WorkflowLink
            title="CSG3: Co-Signer/Guarantor (Multiple)"
            href="/prequalification-csg3"
            description="For co-signers of multiple occupants"
          />
          <WorkflowLink
            title="OTH1: Other (Single)"
            href="/prequalification-oth1"
            description="For other roles with single occupants"
          />
          <WorkflowLink
            title="OTH3: Other (Multiple)"
            href="/prequalification-oth3"
            description="For other roles with multiple occupants"
          />
        </div>
      </TabsContent>

      <TabsContent value="leaseholder" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WorkflowLink
            title="LS1: Leaseholder (Single)"
            href="/prequalification-gc1"
            description="For leaseholders living alone"
          />
          <WorkflowLink
            title="LS3: Leaseholder (Multiple)"
            href="/prequalification-ls3"
            description="For leaseholders living with others"
          />
        </div>
      </TabsContent>

      <TabsContent value="non-leaseholder" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WorkflowLink
            title="NLS1: Non-Leaseholder (Single)"
            href="/prequalification-gc2"
            description="For non-leaseholders living alone"
          />
          <WorkflowLink
            title="NLS3: Non-Leaseholder (Multiple)"
            href="/prequalification-nls3"
            description="For non-leaseholders living with others"
          />
        </div>
      </TabsContent>

      <TabsContent value="other" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WorkflowLink
            title="CSG1: Co-Signer/Guarantor (Single)"
            href="/prequalification-csg1"
            description="For co-signers of single occupants"
          />
          <WorkflowLink
            title="CSG3: Co-Signer/Guarantor (Multiple)"
            href="/prequalification-csg3"
            description="For co-signers of multiple occupants"
          />
          <WorkflowLink
            title="OTH1: Other (Single)"
            href="/prequalification-oth1"
            description="For other roles with single occupants"
          />
          <WorkflowLink
            title="OTH3: Other (Multiple)"
            href="/prequalification-oth3"
            description="For other roles with multiple occupants"
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

interface WorkflowLinkProps {
  title: string
  href: string
  description: string
}

function WorkflowLink({ title, href, description }: WorkflowLinkProps) {
  return (
    <Link href={href} className="block">
      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <Button className="mt-3 bg-orange-500 hover:bg-orange-600">Start</Button>
      </div>
    </Link>
  )
}
