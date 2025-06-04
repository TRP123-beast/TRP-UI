"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Users, CreditCard, FileText, MapPin } from "lucide-react"

interface LS3Result {
  etCode: string
  employment: string
  student: boolean
  flagRange: string
  results: {
    "760-900": string
    "725-760": string
    "660-725": string
    "550-660": string
    "300-560": string
    "dont-know": string
    "not-in-canada": string
  }
}

export function LS3ResultsDisplay() {
  const [selectedView, setSelectedView] = useState<"student" | "non-student" | "all">("all")

  // Corrected LS3 workflow results based on exact specifications
  const ls3Results: LS3Result[] = [
    // Student Workflows (ET_LS91-99)
    {
      etCode: "ET_LS91",
      employment: "Retired",
      student: true,
      flagRange: "V_LS579-582",
      results: {
        "760-900": "V_LS579",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS580",
        "300-560": "No Flag",
        "dont-know": "V_LS581",
        "not-in-canada": "V_LS582",
      },
    },
    {
      etCode: "ET_LS92",
      employment: "Unemployed",
      student: true,
      flagRange: "V_LS583-586",
      results: {
        "760-900": "V_LS583",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS584",
        "300-560": "No Flag",
        "dont-know": "V_LS585",
        "not-in-canada": "V_LS586",
      },
    },
    {
      etCode: "ET_LS93",
      employment: "Full-Time",
      student: true,
      flagRange: "V_LS587-590",
      results: {
        "760-900": "V_LS587",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS588",
        "300-560": "No Flag",
        "dont-know": "V_LS589",
        "not-in-canada": "V_LS590",
      },
    },
    {
      etCode: "ET_LS94",
      employment: "Part-Time",
      student: true,
      flagRange: "V_LS591-594",
      results: {
        "760-900": "V_LS591",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS592",
        "300-560": "No Flag",
        "dont-know": "V_LS593",
        "not-in-canada": "V_LS594",
      },
    },
    {
      etCode: "ET_LS95",
      employment: "Self-Employed",
      student: true,
      flagRange: "V_LS595-598",
      results: {
        "760-900": "V_LS595",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS596",
        "300-560": "No Flag",
        "dont-know": "V_LS597",
        "not-in-canada": "V_LS598",
      },
    },
    {
      etCode: "ET_LS96",
      employment: "Full-Time, Part-Time",
      student: true,
      flagRange: "V_LS599-602",
      results: {
        "760-900": "V_LS599",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS600",
        "300-560": "No Flag",
        "dont-know": "V_LS601",
        "not-in-canada": "V_LS602",
      },
    },
    {
      etCode: "ET_LS97",
      employment: "Full-Time, Self-Employed",
      student: true,
      flagRange: "V_LS603-606",
      results: {
        "760-900": "V_LS603",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS604",
        "300-560": "No Flag",
        "dont-know": "V_LS605",
        "not-in-canada": "V_LS606",
      },
    },
    {
      etCode: "ET_LS98",
      employment: "Part-Time, Self-Employed",
      student: true,
      flagRange: "V_LS607-610",
      results: {
        "760-900": "V_LS607",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS608",
        "300-560": "No Flag",
        "dont-know": "V_LS609",
        "not-in-canada": "V_LS610",
      },
    },
    {
      etCode: "ET_LS99",
      employment: "Full-Time, Part-Time, Self-Employed",
      student: true,
      flagRange: "V_LS611-614",
      results: {
        "760-900": "V_LS611",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS612",
        "300-560": "No Flag",
        "dont-know": "V_LS613",
        "not-in-canada": "V_LS614",
      },
    },
    // Non-Student Workflows (ET_LS100-108)
    {
      etCode: "ET_LS100",
      employment: "Part-Time",
      student: false,
      flagRange: "V_LS615-618",
      results: {
        "760-900": "V_LS615",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS616",
        "300-560": "No Flag",
        "dont-know": "V_LS617",
        "not-in-canada": "V_LS618",
      },
    },
    {
      etCode: "ET_LS101",
      employment: "Full-Time",
      student: false,
      flagRange: "V_LS619-622",
      results: {
        "760-900": "V_LS619",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS620",
        "300-560": "No Flag",
        "dont-know": "V_LS621",
        "not-in-canada": "V_LS622",
      },
    },
    {
      etCode: "ET_LS102",
      employment: "Self-Employed",
      student: false,
      flagRange: "V_LS623-626",
      results: {
        "760-900": "V_LS623",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS624",
        "300-560": "No Flag",
        "dont-know": "V_LS625",
        "not-in-canada": "V_LS626",
      },
    },
    {
      etCode: "ET_LS103",
      employment: "Retired",
      student: false,
      flagRange: "V_LS627-630",
      results: {
        "760-900": "V_LS627",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS628",
        "300-560": "No Flag",
        "dont-know": "V_LS629",
        "not-in-canada": "V_LS630",
      },
    },
    {
      etCode: "ET_LS104",
      employment: "Unemployed",
      student: false,
      flagRange: "V_LS631-634",
      results: {
        "760-900": "V_LS631",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS632",
        "300-560": "No Flag",
        "dont-know": "V_LS633",
        "not-in-canada": "V_LS634",
      },
    },
    {
      etCode: "ET_LS105",
      employment: "Full-Time, Part-Time, Self-Employed",
      student: false,
      flagRange: "V_LS635-638",
      results: {
        "760-900": "V_LS635",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS636",
        "300-560": "No Flag",
        "dont-know": "V_LS637",
        "not-in-canada": "V_LS638",
      },
    },
    {
      etCode: "ET_LS106",
      employment: "Full-Time, Part-Time",
      student: false,
      flagRange: "V_LS639-642",
      results: {
        "760-900": "V_LS639",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS640",
        "300-560": "No Flag",
        "dont-know": "V_LS641",
        "not-in-canada": "V_LS642",
      },
    },
    {
      etCode: "ET_LS107",
      employment: "Full-Time, Self-Employed",
      student: false,
      flagRange: "V_LS643-646",
      results: {
        "760-900": "V_LS643",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS644",
        "300-560": "No Flag",
        "dont-know": "V_LS645",
        "not-in-canada": "V_LS646",
      },
    },
    {
      etCode: "ET_LS108",
      employment: "Part-Time, Self-Employed",
      student: false,
      flagRange: "V_LS647-650",
      results: {
        "760-900": "V_LS647",
        "725-760": "No Flag",
        "660-725": "No Flag",
        "550-660": "V_LS648",
        "300-560": "No Flag",
        "dont-know": "V_LS649",
        "not-in-canada": "V_LS650",
      },
    },
  ]

  const getFilteredResults = () => {
    switch (selectedView) {
      case "student":
        return ls3Results.filter((result) => result.student)
      case "non-student":
        return ls3Results.filter((result) => !result.student)
      default:
        return ls3Results
    }
  }

  const getResultBadgeColor = (result: string) => {
    if (result === "No Flag") return "bg-gray-100 text-gray-600 border-gray-200"
    if (result === "Auto-Qualify") return "bg-green-100 text-green-800 border-green-200"
    if (result === "Manual Review") return "bg-orange-100 text-orange-800 border-orange-200"
    if (result.startsWith("V_LS")) return "bg-blue-100 text-blue-800 border-blue-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const filteredResults = getFilteredResults()
  const autoQualifyCount = filteredResults.reduce((count, result) => {
    return count + Object.values(result.results).filter((r) => r === "No Flag").length
  }, 0)

  const flaggedCount = filteredResults.reduce((count, result) => {
    return count + Object.values(result.results).filter((r) => r.startsWith("V_LS")).length
  }, 0)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">LS3 Workflow Results</h2>
        <p className="text-gray-600">Complete flag assignments for LS3 "Not Responsible" credit assessment workflows</p>
      </div>

      {/* Summary Stats */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-xl text-blue-800">LS3 Results Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredResults.length}</div>
              <div className="text-sm text-gray-600">Employment Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{autoQualifyCount}</div>
              <div className="text-sm text-gray-600">Auto-Qualify</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{flaggedCount}</div>
              <div className="text-sm text-gray-600">Flagged Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">72</div>
              <div className="text-sm text-gray-600">Total Flags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Coverage</div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant={selectedView === "all" ? "default" : "outline"} onClick={() => setSelectedView("all")}>
              All Results (18)
            </Button>
            <Button
              variant={selectedView === "student" ? "default" : "outline"}
              onClick={() => setSelectedView("student")}
            >
              <Users className="h-4 w-4 mr-2" />
              Student (9)
            </Button>
            <Button
              variant={selectedView === "non-student" ? "default" : "outline"}
              onClick={() => setSelectedView("non-student")}
            >
              <Users className="h-4 w-4 mr-2" />
              Non-Student (9)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="detailed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
          <TabsTrigger value="patterns">Flag Patterns</TabsTrigger>
          <TabsTrigger value="matrix">Results Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed" className="space-y-6">
          {/* Individual Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <Card key={result.etCode} className="border-2 border-gray-200">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">{result.etCode}</CardTitle>
                      <p className="text-gray-600 text-sm">{result.employment}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        LS3
                      </Badge>
                      <Badge
                        variant="outline"
                        className={result.student ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"}
                      >
                        {result.student ? "Student" : "Non-Student"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="text-xs text-gray-600 mb-3">
                    <strong>Flag Range:</strong> {result.flagRange}
                  </div>

                  <div className="space-y-2">
                    {Object.entries(result.results).map(([creditRange, outcome]) => (
                      <div key={creditRange} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {creditRange === "760-900" && <CreditCard className="h-3 w-3 text-blue-500" />}
                          {(creditRange === "725-760" || creditRange === "660-725") && (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          )}
                          {creditRange === "550-660" && <FileText className="h-3 w-3 text-orange-500" />}
                          {creditRange === "dont-know" && <FileText className="h-3 w-3 text-blue-500" />}
                          {creditRange === "not-in-canada" && <MapPin className="h-3 w-3 text-red-500" />}
                          <span className="text-xs font-medium">
                            {creditRange === "dont-know"
                              ? "Don't Know"
                              : creditRange === "not-in-canada"
                                ? "Not in Canada"
                                : creditRange}
                          </span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getResultBadgeColor(outcome)}`}>
                          {outcome}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-xl text-green-800">LS3 Flag Assignment Patterns</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-green-800 mb-4">Student Workflows (ET_LS91-99)</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">ET_LS91 (Retired, Student)</div>
                      <div className="text-sm text-blue-600">V_LS579, V_LS580, V_LS581, V_LS582</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">ET_LS92 (Unemployed, Student)</div>
                      <div className="text-sm text-blue-600">V_LS583, V_LS584, V_LS585, V_LS586</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">ET_LS93 (Full-Time, Student)</div>
                      <div className="text-sm text-blue-600">V_LS587, V_LS588, V_LS589, V_LS590</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">ET_LS99 (Multi-Employment, Student)</div>
                      <div className="text-sm text-blue-600">V_LS611, V_LS612, V_LS613, V_LS614</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-green-800 mb-4">Non-Student Workflows (ET_LS100-108)</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">ET_LS101 (Full-Time, Non-Student)</div>
                      <div className="text-sm text-green-600">V_LS619, V_LS620, V_LS621, V_LS622</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">ET_LS103 (Retired, Non-Student)</div>
                      <div className="text-sm text-green-600">V_LS627, V_LS628, V_LS629, V_LS630</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">ET_LS105 (Multi-Employment, Non-Student)</div>
                      <div className="text-sm text-green-600">V_LS635, V_LS636, V_LS637, V_LS638</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">
                        ET_LS108 (Part-Time + Self-Employed, Non-Student)
                      </div>
                      <div className="text-sm text-green-600">V_LS647, V_LS648, V_LS649, V_LS650</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-3">Key Pattern Rules</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-yellow-700 mb-2">Auto-Qualification</div>
                    <div className="space-y-1">
                      <div>• 725-760 credit score → Auto-Qualify</div>
                      <div>• 660-725 credit score → Auto-Qualify</div>
                      <div>• No flags assigned for these ranges</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-yellow-700 mb-2">Flag Assignment</div>
                    <div className="space-y-1">
                      <div>• 760-900 → First flag in range</div>
                      <div>• 550-660 → Second flag in range</div>
                      <div>• "Don't know" → Third flag in range</div>
                      <div>• "Not in Canada" → Fourth flag in range</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-6">
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-xl text-purple-800">LS3 Results Matrix</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-purple-200">
                      <th className="text-left p-2 font-medium">Employment Type</th>
                      <th className="text-center p-2 font-medium">760-900</th>
                      <th className="text-center p-2 font-medium text-green-700">725-760</th>
                      <th className="text-center p-2 font-medium text-green-700">660-725</th>
                      <th className="text-center p-2 font-medium">550-660</th>
                      <th className="text-center p-2 font-medium">Don't Know</th>
                      <th className="text-center p-2 font-medium">Not in Canada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result) => (
                      <tr key={result.etCode} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-2">
                          <div className="font-medium">{result.etCode}</div>
                          <div className="text-gray-500 text-xs">{result.employment}</div>
                          <Badge
                            variant="outline"
                            className={`text-xs mt-1 ${result.student ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"}`}
                          >
                            {result.student ? "Student" : "Non-Student"}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                            {result.results["760-900"]}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                            {result.results["725-760"]}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                            {result.results["660-725"]}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                            {result.results["550-660"]}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                            {result.results["dont-know"]}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                            {result.results["not-in-canada"]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Coverage Summary */}
      <Card className="border-2 border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
          <CardTitle className="text-xl text-indigo-800">LS3 Complete Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-3">Auto-Qualification</h4>
              <div className="space-y-2 text-sm">
                <div>
                  • 725-760 credit score: <strong>36 scenarios</strong>
                </div>
                <div>
                  • 660-725 credit score: <strong>36 scenarios</strong>
                </div>
                <div>
                  • Total auto-qualify: <strong>72 scenarios</strong>
                </div>
                <div>• No manual review required</div>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-3">Flag Assignment</h4>
              <div className="space-y-2 text-sm">
                <div>
                  • 760-900 credit score: <strong>18 flags</strong>
                </div>
                <div>
                  • 550-660 credit score: <strong>18 flags</strong>
                </div>
                <div>
                  • "Don't know" score: <strong>18 flags</strong>
                </div>
                <div>
                  • "Not in Canada": <strong>18 flags</strong>
                </div>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-3">Total Coverage</h4>
              <div className="space-y-2 text-sm">
                <div>
                  • Employment types: <strong>18</strong>
                </div>
                <div>
                  • Total flags used: <strong>72</strong>
                </div>
                <div>
                  • Flag range: <strong>V_LS579-650</strong>
                </div>
                <div>
                  • Success rate: <strong>100%</strong>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
