"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, AlertTriangle } from "lucide-react"

export function DeploymentTimeline() {
  const phases = [
    {
      phase: "Phase 1: Pre-Deployment Preparation",
      duration: "3-5 days",
      priority: "critical",
      tasks: [
        { task: "Code review and quality assurance", time: "4-6 hours", owner: "Dev Team" },
        { task: "Complete system testing", time: "8-12 hours", owner: "QA Team" },
        { task: "Data migration validation", time: "2-4 hours", owner: "Dev Team" },
        { task: "Security audit", time: "12-16 hours", owner: "Security Team" },
        { task: "Performance testing", time: "8-10 hours", owner: "QA Team" },
      ],
    },
    {
      phase: "Phase 2: Infrastructure Setup",
      duration: "2-3 days",
      priority: "critical",
      tasks: [
        { task: "Production environment setup", time: "6-8 hours", owner: "DevOps Team" },
        { task: "Database configuration", time: "4-6 hours", owner: "DBA Team" },
        { task: "API integration setup", time: "3-4 hours", owner: "Dev Team" },
        { task: "Monitoring and logging setup", time: "6-8 hours", owner: "DevOps Team" },
      ],
    },
    {
      phase: "Phase 3: User Acceptance Testing",
      duration: "1-2 weeks",
      priority: "high",
      tasks: [
        { task: "Business user testing", time: "16-20 hours", owner: "Business Team" },
        { task: "Staff training", time: "12-16 hours", owner: "Training Team" },
        { task: "Documentation creation", time: "8-12 hours", owner: "Tech Writing" },
        { task: "Bug fixes and refinements", time: "Variable", owner: "Dev Team" },
      ],
    },
    {
      phase: "Phase 4: Deployment Execution",
      duration: "1 day",
      priority: "critical",
      tasks: [
        { task: "Final backup creation", time: "2-3 hours", owner: "DevOps Team" },
        { task: "Production deployment", time: "4-6 hours", owner: "DevOps Team" },
        { task: "Smoke testing", time: "2-4 hours", owner: "QA Team" },
        { task: "Performance validation", time: "2-3 hours", owner: "DevOps Team" },
      ],
    },
    {
      phase: "Phase 5: Post-Deployment",
      duration: "1 week",
      priority: "medium",
      tasks: [
        { task: "Monitoring and support", time: "Ongoing", owner: "Support Team" },
        { task: "User feedback collection", time: "Ongoing", owner: "Product Team" },
        { task: "Performance optimization", time: "Variable", owner: "Dev Team" },
        { task: "Documentation updates", time: "4-6 hours", owner: "Tech Writing" },
      ],
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200"
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">Deployment Timeline</h2>
        <p className="text-gray-600">Estimated timeline for complete system deployment</p>
      </div>

      {/* Timeline Overview */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Timeline Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3-4 weeks</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5 phases</div>
              <div className="text-sm text-gray-600">Deployment Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">80-120 hours</div>
              <div className="text-sm text-gray-600">Estimated Effort</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Details */}
      <div className="space-y-6">
        {phases.map((phase, index) => (
          <Card key={index} className="border-2 border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{phase.phase}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {phase.duration}
                    </div>
                    <Badge className={getPriorityColor(phase.priority)}>{phase.priority.toUpperCase()}</Badge>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{index + 1}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {phase.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{task.task}</div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {task.owner}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Path and Dependencies */}
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardTitle className="text-xl text-orange-800 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Critical Path & Dependencies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-orange-800 mb-2">Critical Dependencies</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Security audit must complete before UAT begins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Infrastructure setup blocks deployment execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>UAT completion required before production deployment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Database migration testing must complete before deployment</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-orange-800 mb-2">Risk Mitigation</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Buffer time included for unexpected issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Parallel execution where possible to reduce timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Rollback procedures tested and ready</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>24/7 support team availability during deployment</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
