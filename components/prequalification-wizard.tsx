"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const PrequalificationWizard = () => {
  const router = useRouter()

  return (
    <div>
      <h1>Prequalification Wizard</h1>
      <p>This is a placeholder for the prequalification wizard.</p>

      <Button onClick={() => alert("Start button clicked!")}>Start</Button>

      <Button variant="destructive" onClick={() => router.push("/group-invitation")} showTooltip={true}>
        Skip to Group Invitation
      </Button>
    </div>
  )
}

export default PrequalificationWizard
