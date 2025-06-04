import { PrequalificationLS3Wizard } from "@/components/prequalification-ls3-wizard"

export default function PrequalificationLS3Page() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Leaseholder Pre-Qualification</h1>
      <PrequalificationLS3Wizard />
    </div>
  )
}
