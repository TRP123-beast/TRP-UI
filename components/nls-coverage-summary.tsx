"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Users, CreditCard, Building } from "lucide-react"

export function NLSCoverageSummary() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">NLS Credit Assessment Coverage</h2>
        <p className="text-gray-600">Comprehensive overview of all Non-Lease Signer workflows</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* NLS1 Category */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl text-blue-800">NLS1 Category</CardTitle>
                <p className="text-blue-600 text-sm">Primary Non-Lease Signer Workflows</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Not Rent Responsible</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ET_NLS1-18
                </Badge>
              </div>
              <div className="text-xs text-gray-600 ml-4">
                • Flag Range: V_NLS3-56
                <br />• Simplified workflow (no deposit questions)
                <br />• Flags only for 660-725 credit scores and "don't know"
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rent Responsible</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  ET_NLS55-72
                </Badge>
              </div>
              <div className="text-xs text-gray-600 ml-4">
                • Flag Range: V_NLS165-308
                <br />• Full workflow with deposit capability assessment
                <br />• Comprehensive flag mapping for all scenarios
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700 font-medium">90 Employment Combinations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NLS2 Category */}
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center space-x-3">
              <Building className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl text-purple-800">NLS2 Category</CardTitle>
                <p className="text-purple-600 text-sm">Extended Non-Lease Signer Workflows</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Not Rent Responsible</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ET_NLS19-36
                </Badge>
              </div>
              <div className="text-xs text-gray-600 ml-4">
                • Flag Range: V_NLS57-110
                <br />• Simplified workflow (no deposit questions)
                <br />• Flags only for 660-725 credit scores and "don't know"
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rent Responsible</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  ET_NLS73-90
                </Badge>
              </div>
              <div className="text-xs text-gray-600 ml-4">
                • Flag Range: V_NLS309-452
                <br />• Full workflow with deposit capability assessment
                <br />• Exception: ET_NLS75 (not responsible despite being in this range)
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700 font-medium">54 Employment Combinations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NLS3 Category */}
        <Card className="border-2 border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-orange-600" />
              <div>
                <CardTitle className="text-xl text-orange-800">NLS3 Category</CardTitle>
                <p className="text-orange-600 text-sm">Complete NLS3 Workflows</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Not Rent Responsible</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ET_NLS37-54
                </Badge>
              </div>
              <div className="text-xs text-gray-600 ml-4">
                • Flag Range: V_NLS111-164
                <br />• Simplified workflow (no deposit questions)
                <br />• Flags only for 660-725 credit scores and "don't know"
                <br />• 18 employment types × 3 flags each = 54 total flags
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rent Responsible</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  ET_NLS91-108
                </Badge>
              </div>
              <div className="text-xs text-gray-600 ml-4">
                • Flag Range: V_NLS453-596
                <br />• Full workflow with deposit capability assessment
                <br />• Comprehensive flag mapping for all credit scenarios
                <br />• 18 employment types × 8 flags each = 144 total flags
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700 font-medium">72 Employment Combinations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-gray-600" />
            <div>
              <CardTitle className="text-xl text-gray-800">System Coverage Summary</CardTitle>
              <p className="text-gray-600 text-sm">Complete NLS credit assessment capabilities</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">216</div>
              <div className="text-sm text-gray-600">Total Employment Combinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">596</div>
              <div className="text-sm text-gray-600">Maximum Flag Code</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">NLS Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">108</div>
              <div className="text-sm text-gray-600">Employment Type Codes</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Key Features</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Automatic workflow routing based on rent responsibility</li>
              <li>• Dynamic flag assignment with comprehensive coverage</li>
              <li>• Support for all employment types and student status combinations</li>
              <li>• Simplified workflows for non-rent-responsible users</li>
              <li>• Full deposit capability assessment for rent-responsible users</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
