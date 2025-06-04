"use client"

import { useState } from "react"
import { ProductionDeploymentChecklist } from "./production-deployment-checklist"
import { DeploymentTimeline } from "./deployment-timeline"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, Calendar, FileText, Download } from "lucide-react"

export default function DeploymentDashboard() {
  const [activeTab, setActiveTab] = useState("checklist")

  const downloadChecklist = () => {
    // In a real implementation, this would generate and download a PDF or Excel file
    const checklistData = {
      title: "NLS Credit Assessment System - Production Deployment Checklist",
      generatedDate: new Date().toISOString(),
      totalItems: 22,
      estimatedDuration: "3-4 weeks",
      criticalItems: 12,
      note: "This checklist ensures comprehensive validation and deployment of the complete NLS credit assessment system.",
    }

    console.log("Downloading checklist:", checklistData)
    alert("Checklist download functionality would be implemented here")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Deployment Management Dashboard</h1>
          <p className="text-gray-600 text-lg">Complete NLS Credit Assessment System Deployment</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">216</div>
              <div className="text-sm text-gray-600">Employment Combinations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">596</div>
              <div className="text-sm text-gray-600">Flag Codes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">22</div>
              <div className="text-sm text-gray-600">Checklist Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">3-4</div>
              <div className="text-sm text-gray-600">Weeks Timeline</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Checklist
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Docs
              </TabsTrigger>
            </TabsList>

            <Button onClick={downloadChecklist} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Checklist
            </Button>
          </div>

          <TabsContent value="checklist">
            <ProductionDeploymentChecklist />
          </TabsContent>

          <TabsContent value="timeline">
            <DeploymentTimeline />
          </TabsContent>

          <TabsContent value="documentation">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Documentation</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Technical Documentation</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• System Architecture Overview</li>
                      <li>• API Documentation</li>
                      <li>• Database Schema</li>
                      <li>• Security Implementation Guide</li>
                      <li>• Performance Optimization Guide</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Operational Documentation</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Deployment Procedures</li>
                      <li>• Monitoring and Alerting Setup</li>
                      <li>• Backup and Recovery Procedures</li>
                      <li>• Troubleshooting Guide</li>
                      <li>• Support Escalation Procedures</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
