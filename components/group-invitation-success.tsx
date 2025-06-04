"use client"

import { Button } from "@/components/ui/button"

export function GroupInvitationSuccess() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-6 text-center">
      <div className="bg-green-50 border-l-4 border-green-400 p-4 text-left">
        <h3 className="text-lg font-semibold text-green-700">Success!</h3>
        <p className="text-green-700 mt-2">
          Your group invitation process has been completed successfully. You can now proceed with your rental search.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => {
            window.location.href = "/"
          }}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
