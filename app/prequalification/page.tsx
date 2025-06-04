"use client"

import { Button } from "@/components/ui/button"

export default function PrequalificationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Pre-Qualification Process</h1>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center space-y-6">
            <p className="text-gray-600 text-lg leading-relaxed">
              In order for landlords to feel secure in renting their property there are certain requirements that need
              to be met. To provide you with the best possible experience in your search, we have put together a
              pre-qualification process to help us understand your needs and whether you would be an ideal applicant for
              our service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="px-8 py-3">Start</Button>
              <Button variant="destructive" className="px-8 py-3">
                Skip to Group Invitation
              </Button>
            </div>

            {/* Button Explainer Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Button Functions</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                {/* Start Button Explanation */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <h4 className="font-semibold text-orange-800">Start Pre-Qualification</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Begin the complete pre-qualification process. This will guide you through questions about your
                    financial situation, rental history, and preferences to help match you with suitable properties and
                    landlords.
                  </p>
                </div>

                {/* Skip Button Explanation */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <h4 className="font-semibold text-red-800">Skip to Group Invitation</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Use this option if you've been invited to join a rental group. This is for users who:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Have been invited to a group</li>
                    <li>• Already have a profile</li>
                    <li>• Do NOT have an active lease signing process</li>
                    <li>• Do NOT belong to another group</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
