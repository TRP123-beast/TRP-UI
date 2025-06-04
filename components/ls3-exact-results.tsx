"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LS3ExactResults() {
  // Exact data from the attachment
  const ls3WorkflowData = [
    {
      code: "ET_LS96",
      miCode: "MI_LS96",
      csCode: "CS_LS96",
      rent: "Not Responsible",
      employment: "Full-Time, Part-Time",
      student: "Yes",
      flags: {
        "760-900": "V_LS599",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS600",
        "300-560": "—",
        "I don't know": "V_LS601",
        "Not in Canada for 12+ months": "V_LS602",
      },
    },
    {
      code: "ET_LS101",
      miCode: "MI_LS101",
      csCode: "CS_LS101",
      rent: "Not Responsible",
      employment: "Full-Time",
      student: "No",
      flags: {
        "760-900": "V_LS619",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS620",
        "300-560": "—",
        "I don't know": "V_LS621",
        "Not in Canada for 12+ months": "V_LS622",
      },
    },
    {
      code: "ET_LS100",
      miCode: "MI_LS100",
      csCode: "CS_LS100",
      rent: "Not Responsible",
      employment: "Part-Time",
      student: "No",
      flags: {
        "760-900": "V_LS615",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS616",
        "300-560": "—",
        "I don't know": "V_LS617",
        "Not in Canada for 12+ months": "V_LS618",
      },
    },
    {
      code: "ET_LS106",
      miCode: "MI_LS106",
      csCode: "CS_LS106",
      rent: "Not Responsible",
      employment: "Full-Time, Part-Time",
      student: "No",
      flags: {
        "760-900": "V_LS639",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS640",
        "300-560": "—",
        "I don't know": "V_LS641",
        "Not in Canada for 12+ months": "V_LS642",
      },
    },
    {
      code: "ET_LS98",
      miCode: "MI_LS98",
      csCode: "CS_LS98",
      rent: "Not Responsible",
      employment: "Part-Time, Self-Employed",
      student: "Yes",
      flags: {
        "760-900": "V_LS607",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS608",
        "300-560": "—",
        "I don't know": "V_LS609",
        "Not in Canada for 12+ months": "V_LS610",
      },
    },
    {
      code: "ET_LS97",
      miCode: "MI_LS97",
      csCode: "CS_LS97",
      rent: "Not Responsible",
      employment: "Full-Time, Self-Employed",
      student: "Yes",
      flags: {
        "760-900": "V_LS603",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS604",
        "300-560": "—",
        "I don't know": "V_LS605",
        "Not in Canada for 12+ months": "V_LS606",
      },
    },
    {
      code: "ET_LS99",
      miCode: "MI_LS99",
      csCode: "CS_LS99",
      rent: "Not Responsible",
      employment: "Full-Time, Part-Time, Self-Employed",
      student: "Yes",
      flags: {
        "760-900": "V_LS611",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS612",
        "300-560": "—",
        "I don't know": "V_LS613",
        "Not in Canada for 12+ months": "V_LS614",
      },
    },
    {
      code: "ET_LS103",
      miCode: "MI_LS103",
      csCode: "CS_LS103",
      rent: "Not Responsible",
      employment: "Retired",
      student: "No",
      flags: {
        "760-900": "V_LS627",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS628",
        "300-560": "—",
        "I don't know": "V_LS629",
        "Not in Canada for 12+ months": "V_LS630",
      },
    },
    {
      code: "ET_LS93",
      miCode: "MI_LS93",
      csCode: "CS_LS93",
      rent: "Not Responsible",
      employment: "Full-Time",
      student: "Yes",
      flags: {
        "760-900": "V_LS587",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS588",
        "300-560": "—",
        "I don't know": "V_LS589",
        "Not in Canada for 12+ months": "V_LS590",
      },
    },
    {
      code: "ET_LS94",
      miCode: "MI_LS94",
      csCode: "CS_LS94",
      rent: "Not Responsible",
      employment: "Part-Time",
      student: "Yes",
      flags: {
        "760-900": "V_LS591",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS592",
        "300-560": "—",
        "I don't know": "V_LS593",
        "Not in Canada for 12+ months": "V_LS594",
      },
    },
    {
      code: "ET_LS107",
      miCode: "MI_LS107",
      csCode: "CS_LS107",
      rent: "Not Responsible",
      employment: "Full-Time, Self-Employed",
      student: "No",
      flags: {
        "760-900": "V_LS643",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS644",
        "300-560": "—",
        "I don't know": "V_LS645",
        "Not in Canada for 12+ months": "V_LS646",
      },
    },
    {
      code: "ET_LS108",
      miCode: "MI_LS108",
      csCode: "CS_LS108",
      rent: "Not Responsible",
      employment: "Part-Time, Self-Employed",
      student: "No",
      flags: {
        "760-900": "V_LS647",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS648",
        "300-560": "—",
        "I don't know": "V_LS649",
        "Not in Canada for 12+ months": "V_LS650",
      },
    },
    {
      code: "ET_LS102",
      miCode: "MI_LS102",
      csCode: "CS_LS102",
      rent: "Not Responsible",
      employment: "Self-Employed",
      student: "No",
      flags: {
        "760-900": "V_LS623",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS624",
        "300-560": "—",
        "I don't know": "V_LS625",
        "Not in Canada for 12+ months": "V_LS626",
      },
    },
    {
      code: "ET_LS104",
      miCode: "MI_LS104",
      csCode: "CS_LS104",
      rent: "Not Responsible",
      employment: "Unemployed",
      student: "No",
      flags: {
        "760-900": "V_LS631",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS632",
        "300-560": "—",
        "I don't know": "V_LS633",
        "Not in Canada for 12+ months": "V_LS634",
      },
    },
    {
      code: "ET_LS95",
      miCode: "MI_LS95",
      csCode: "CS_LS95",
      rent: "Not Responsible",
      employment: "Self-Employed", // Note: attachment shows "Self-Time" - assuming typo
      student: "Yes",
      flags: {
        "760-900": "V_LS595",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS596",
        "300-560": "—",
        "I don't know": "V_LS597",
        "Not in Canada for 12+ months": "V_LS598",
      },
    },
    {
      code: "ET_LS105",
      miCode: "MI_LS105",
      csCode: "CS_LS105",
      rent: "Not Responsible",
      employment: "Full-Time, Part-Time, Self-Employed",
      student: "No",
      flags: {
        "760-900": "V_LS635",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS636",
        "300-560": "—",
        "I don't know": "V_LS637",
        "Not in Canada for 12+ months": "V_LS638",
      },
    },
    {
      code: "ET_LS91",
      miCode: "MI_LS91",
      csCode: "CS_LS91",
      rent: "Not Responsible",
      employment: "Retired",
      student: "Yes",
      flags: {
        "760-900": "V_LS579",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS580",
        "300-560": "—",
        "I don't know": "V_LS581",
        "Not in Canada for 12+ months": "V_LS582",
      },
    },
    {
      code: "ET_LS92",
      miCode: "MI_LS92",
      csCode: "CS_LS92",
      rent: "Not Responsible",
      employment: "Unemployed",
      student: "Yes",
      flags: {
        "760-900": "V_LS583",
        "725-760": "—",
        "660-725": "—",
        "550-660": "V_LS584",
        "300-560": "—",
        "I don't know": "V_LS585",
        "Not in Canada for 12+ months": "V_LS586",
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">LS3 Workflow Flag Results</h2>
        <p className="text-gray-600">Exact results from workflow specifications</p>
      </div>

      {/* Quick Summary */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">18</div>
              <div className="text-sm text-gray-600">Employment Types</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">72</div>
              <div className="text-sm text-gray-600">Total Flags</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">36</div>
              <div className="text-sm text-gray-600">No Flag Scenarios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Coverage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Complete LS3 Flag Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ls3WorkflowData.map((workflow) => (
              <div key={workflow.code} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 font-mono">
                      {workflow.code}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 font-mono">
                      {workflow.miCode}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 font-mono">
                      {workflow.csCode}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Rent:</strong> {workflow.rent} | <strong>Employment:</strong> {workflow.employment} |{" "}
                    <strong>Student:</strong> {workflow.student}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(workflow.flags).map(([creditRange, flag]) => (
                    <div key={creditRange} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{creditRange}:</span>
                      <Badge
                        variant="outline"
                        className={flag === "—" ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-800 font-mono"}
                      >
                        {flag}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flag Range Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Flag Range Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded">
              <div className="font-medium text-blue-800">Student Flags</div>
              <div className="text-sm text-blue-600">V_LS579 - V_LS614 (36 flags)</div>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <div className="font-medium text-green-800">Non-Student Flags</div>
              <div className="text-sm text-green-600">V_LS615 - V_LS650 (36 flags)</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="font-medium text-purple-800">Total Range</div>
              <div className="text-sm text-purple-600">V_LS579 - V_LS650 (72 flags)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Flag Assignment Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Credit Score Ranges That Get Flags:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium">760-900</div>
                  <div className="text-gray-600">1st flag in range</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium">550-660</div>
                  <div className="text-gray-600">2nd flag in range</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium">I don't know</div>
                  <div className="text-gray-600">3rd flag in range</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium">Not in Canada</div>
                  <div className="text-gray-600">4th flag in range</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Credit Score Ranges With No Flags:</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium">725-760</div>
                  <div className="text-gray-600">No flag assigned</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium">660-725</div>
                  <div className="text-gray-600">No flag assigned</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium">300-560</div>
                  <div className="text-gray-600">No flag assigned</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
