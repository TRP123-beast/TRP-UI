"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  AlertTriangle,
  Database,
  Shield,
  Zap,
  Users,
  Monitor,
  GitBranch,
  Settings,
  Globe,
  Lock,
} from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  category: string
  priority: "critical" | "high" | "medium" | "low"
  estimatedTime: string
  dependencies?: string[]
  verificationSteps: string[]
}

export function ProductionDeploymentChecklist() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const checklistItems: ChecklistItem[] = [
    // Pre-Deployment Validation
    {
      id: "pre-001",
      title: "Code Review and Quality Assurance",
      description: "Complete comprehensive code review of all NLS credit assessment components",
      category: "pre-deployment",
      priority: "critical",
      estimatedTime: "4-6 hours",
      verificationSteps: [
        "All TypeScript types are properly defined",
        "No console.log statements in production code",
        "Error handling implemented for all user flows",
        "Code follows established patterns and conventions",
        "All components have proper prop validation",
      ],
    },
    {
      id: "pre-002",
      title: "Complete System Testing",
      description: "Execute all NLS workflow tests across all categories (NLS1, NLS2, NLS3)",
      category: "pre-deployment",
      priority: "critical",
      estimatedTime: "8-12 hours",
      dependencies: ["pre-001"],
      verificationSteps: [
        "All 216 employment combinations tested",
        "All 596 flag codes validated",
        "Edge cases and error scenarios covered",
        "Cross-browser compatibility verified",
        "Mobile responsiveness confirmed",
      ],
    },
    {
      id: "pre-003",
      title: "Data Migration Validation",
      description: "Verify workflow storage and flag management systems",
      category: "pre-deployment",
      priority: "critical",
      estimatedTime: "2-4 hours",
      verificationSteps: [
        "localStorage workflow data structure validated",
        "Flag persistence mechanisms tested",
        "Data cleanup and migration scripts ready",
        "Backup and restore procedures verified",
      ],
    },

    // Infrastructure and Environment
    {
      id: "infra-001",
      title: "Production Environment Setup",
      description: "Configure and validate production infrastructure",
      category: "infrastructure",
      priority: "critical",
      estimatedTime: "6-8 hours",
      verificationSteps: [
        "Next.js production build optimized",
        "Environment variables configured",
        "CDN and static asset delivery setup",
        "SSL certificates installed and verified",
        "Domain and DNS configuration complete",
      ],
    },
    {
      id: "infra-002",
      title: "Database Configuration",
      description: "Set up and configure production database systems",
      category: "infrastructure",
      priority: "critical",
      estimatedTime: "4-6 hours",
      verificationSteps: [
        "Database schema deployed and validated",
        "Connection pooling configured",
        "Backup and recovery procedures tested",
        "Database performance tuning applied",
        "Data retention policies implemented",
      ],
    },
    {
      id: "infra-003",
      title: "API Integration Setup",
      description: "Configure external API integrations (Google Maps, Credit Bureaus)",
      category: "infrastructure",
      priority: "high",
      estimatedTime: "3-4 hours",
      verificationSteps: [
        "Google Maps API keys configured and tested",
        "Credit bureau API endpoints validated",
        "Rate limiting and quota management setup",
        "API error handling and fallbacks tested",
        "Monitoring for API health implemented",
      ],
    },

    // Security and Compliance
    {
      id: "security-001",
      title: "Security Audit and Penetration Testing",
      description: "Comprehensive security assessment of the application",
      category: "security",
      priority: "critical",
      estimatedTime: "12-16 hours",
      verificationSteps: [
        "OWASP Top 10 vulnerabilities addressed",
        "Input validation and sanitization verified",
        "Authentication and authorization tested",
        "Data encryption at rest and in transit",
        "Security headers properly configured",
      ],
    },
    {
      id: "security-002",
      title: "Data Privacy and GDPR Compliance",
      description: "Ensure compliance with data protection regulations",
      category: "security",
      priority: "critical",
      estimatedTime: "6-8 hours",
      verificationSteps: [
        "Privacy policy updated and accessible",
        "Data collection consent mechanisms implemented",
        "Right to deletion functionality tested",
        "Data processing audit trail established",
        "Cross-border data transfer compliance verified",
      ],
    },
    {
      id: "security-003",
      title: "Access Control and User Management",
      description: "Implement and test user access controls",
      category: "security",
      priority: "high",
      estimatedTime: "4-6 hours",
      verificationSteps: [
        "Role-based access control implemented",
        "Multi-factor authentication configured",
        "Session management and timeout policies",
        "Account lockout and security policies",
        "Admin panel access restrictions verified",
      ],
    },

    // Performance and Scalability
    {
      id: "perf-001",
      title: "Performance Testing and Optimization",
      description: "Comprehensive performance testing under load",
      category: "performance",
      priority: "high",
      estimatedTime: "8-10 hours",
      verificationSteps: [
        "Load testing with expected user volumes",
        "Database query optimization verified",
        "Caching strategies implemented and tested",
        "CDN performance validated",
        "Core Web Vitals metrics meet targets",
      ],
    },
    {
      id: "perf-002",
      title: "Scalability and Auto-scaling",
      description: "Configure auto-scaling and resource management",
      category: "performance",
      priority: "medium",
      estimatedTime: "4-6 hours",
      verificationSteps: [
        "Auto-scaling policies configured",
        "Resource monitoring and alerting setup",
        "Database connection pooling optimized",
        "Memory and CPU usage baselines established",
        "Horizontal scaling procedures documented",
      ],
    },

    // User Acceptance and Training
    {
      id: "uat-001",
      title: "User Acceptance Testing",
      description: "Conduct comprehensive UAT with stakeholders",
      category: "user-acceptance",
      priority: "critical",
      estimatedTime: "16-20 hours",
      verificationSteps: [
        "All user workflows tested by business users",
        "NLS credit assessment flows validated",
        "Group creation and management tested",
        "Property search and filtering verified",
        "Mobile app functionality confirmed",
      ],
    },
    {
      id: "uat-002",
      title: "Staff Training and Documentation",
      description: "Train support staff and create user documentation",
      category: "user-acceptance",
      priority: "high",
      estimatedTime: "12-16 hours",
      verificationSteps: [
        "Admin training materials created",
        "User guides and help documentation",
        "Support team training completed",
        "Troubleshooting guides prepared",
        "FAQ and knowledge base updated",
      ],
    },

    // Monitoring and Logging
    {
      id: "monitor-001",
      title: "Application Monitoring Setup",
      description: "Implement comprehensive application monitoring",
      category: "monitoring",
      priority: "critical",
      estimatedTime: "6-8 hours",
      verificationSteps: [
        "Error tracking and alerting configured",
        "Performance monitoring dashboards setup",
        "User analytics and behavior tracking",
        "Business metrics and KPI monitoring",
        "Real-time alerting for critical issues",
      ],
    },
    {
      id: "monitor-002",
      title: "Logging and Audit Trail",
      description: "Configure comprehensive logging and audit systems",
      category: "monitoring",
      priority: "high",
      estimatedTime: "4-6 hours",
      verificationSteps: [
        "Structured logging implemented",
        "Log aggregation and search setup",
        "Audit trail for sensitive operations",
        "Log retention and archival policies",
        "Security event monitoring configured",
      ],
    },

    // Deployment and Rollback
    {
      id: "deploy-001",
      title: "Deployment Pipeline and CI/CD",
      description: "Set up automated deployment pipeline",
      category: "deployment",
      priority: "critical",
      estimatedTime: "8-12 hours",
      verificationSteps: [
        "CI/CD pipeline configured and tested",
        "Automated testing in pipeline",
        "Blue-green deployment strategy implemented",
        "Database migration automation",
        "Rollback procedures tested and documented",
      ],
    },
    {
      id: "deploy-002",
      title: "Production Deployment Execution",
      description: "Execute the production deployment",
      category: "deployment",
      priority: "critical",
      estimatedTime: "4-6 hours",
      dependencies: ["pre-002", "infra-001", "security-001", "uat-001"],
      verificationSteps: [
        "Production deployment executed successfully",
        "All services started and healthy",
        "Database migrations completed",
        "Static assets deployed and accessible",
        "Health checks passing",
      ],
    },

    // Post-Deployment Verification
    {
      id: "post-001",
      title: "Post-Deployment Smoke Testing",
      description: "Verify all critical functionality after deployment",
      category: "post-deployment",
      priority: "critical",
      estimatedTime: "2-4 hours",
      dependencies: ["deploy-002"],
      verificationSteps: [
        "All NLS workflows functional",
        "User registration and login working",
        "Property search and filtering operational",
        "Payment processing functional",
        "Email notifications working",
      ],
    },
    {
      id: "post-002",
      title: "Performance Validation",
      description: "Validate production performance metrics",
      category: "post-deployment",
      priority: "high",
      estimatedTime: "2-3 hours",
      dependencies: ["post-001"],
      verificationSteps: [
        "Response times within acceptable limits",
        "Database performance metrics normal",
        "CDN and caching working effectively",
        "Memory and CPU usage within bounds",
        "No performance regressions detected",
      ],
    },

    // Business Continuity
    {
      id: "bc-001",
      title: "Backup and Disaster Recovery",
      description: "Verify backup and disaster recovery procedures",
      category: "business-continuity",
      priority: "critical",
      estimatedTime: "4-6 hours",
      verificationSteps: [
        "Automated backup procedures tested",
        "Disaster recovery plan documented",
        "Recovery time objectives validated",
        "Data integrity verification procedures",
        "Business continuity plan updated",
      ],
    },
    {
      id: "bc-002",
      title: "Support and Maintenance Procedures",
      description: "Establish ongoing support and maintenance",
      category: "business-continuity",
      priority: "medium",
      estimatedTime: "3-4 hours",
      verificationSteps: [
        "Support escalation procedures defined",
        "Maintenance windows scheduled",
        "Update and patch management process",
        "Performance monitoring baselines set",
        "Incident response procedures documented",
      ],
    },
  ]

  const categories = [
    { id: "all", name: "All Items", icon: Settings, color: "gray" },
    { id: "pre-deployment", name: "Pre-Deployment", icon: GitBranch, color: "blue" },
    { id: "infrastructure", name: "Infrastructure", icon: Database, color: "green" },
    { id: "security", name: "Security", icon: Shield, color: "red" },
    { id: "performance", name: "Performance", icon: Zap, color: "yellow" },
    { id: "user-acceptance", name: "User Acceptance", icon: Users, color: "purple" },
    { id: "monitoring", name: "Monitoring", icon: Monitor, color: "indigo" },
    { id: "deployment", name: "Deployment", icon: Globe, color: "orange" },
    { id: "post-deployment", name: "Post-Deployment", icon: CheckCircle2, color: "teal" },
    { id: "business-continuity", name: "Business Continuity", icon: Lock, color: "pink" },
  ]

  const filteredItems =
    selectedCategory === "all" ? checklistItems : checklistItems.filter((item) => item.category === selectedCategory)

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId)
    } else {
      newCompleted.add(itemId)
    }
    setCompletedItems(newCompleted)
  }

  const totalItems = checklistItems.length
  const completedCount = completedItems.size
  const progressPercentage = Math.round((completedCount / totalItems) * 100)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200"
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getCategoryStats = () => {
    const stats: Record<string, { total: number; completed: number }> = {}

    categories.forEach((category) => {
      if (category.id === "all") return

      const categoryItems = checklistItems.filter((item) => item.category === category.id)
      const completedInCategory = categoryItems.filter((item) => completedItems.has(item.id)).length

      stats[category.id] = {
        total: categoryItems.length,
        completed: completedInCategory,
      }
    })

    return stats
  }

  const categoryStats = getCategoryStats()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Production Deployment Checklist</h1>
        <p className="text-gray-600 text-lg">Complete NLS Credit Assessment System</p>
      </div>

      {/* Overall Progress */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-blue-800">Deployment Progress</CardTitle>
              <p className="text-blue-600">Track your progress through all deployment phases</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-800">{progressPercentage}%</div>
              <div className="text-blue-600 text-sm">
                {completedCount} of {totalItems} completed
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Progress
            value={progressPercentage}
            className="h-4 mb-4"
            indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(categoryStats).map(([categoryId, stats]) => {
              const category = categories.find((c) => c.id === categoryId)
              if (!category) return null

              const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

              return (
                <div key={categoryId} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <category.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-800">{category.name}</div>
                  <div className="text-lg font-bold text-blue-600">{percentage}%</div>
                  <div className="text-xs text-gray-500">
                    {stats.completed}/{stats.total}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  {category.id !== "all" && categoryStats[category.id] && (
                    <Badge variant="secondary" className="ml-1">
                      {categoryStats[category.id].completed}/{categoryStats[category.id].total}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isCompleted = completedItems.has(item.id)
          const hasUnmetDependencies = item.dependencies?.some((dep) => !completedItems.has(dep))

          return (
            <Card
              key={item.id}
              className={`border-2 transition-all duration-200 ${
                isCompleted
                  ? "border-green-200 bg-green-50"
                  : hasUnmetDependencies
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : "border-gray-200 hover:border-blue-200"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleItem(item.id)}
                      disabled={hasUnmetDependencies}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className={`text-lg ${isCompleted ? "line-through text-gray-500" : ""}`}>
                          {item.title}
                        </CardTitle>
                        <Badge className={getPriorityColor(item.priority)}>{item.priority.toUpperCase()}</Badge>
                      </div>
                      <p className={`text-gray-600 ${isCompleted ? "line-through" : ""}`}>{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>⏱️ {item.estimatedTime}</span>
                        <span>📋 {item.id}</span>
                        {item.dependencies && <span>🔗 Depends on: {item.dependencies.join(", ")}</span>}
                      </div>
                    </div>
                  </div>
                  {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                  {hasUnmetDependencies && <AlertTriangle className="h-6 w-6 text-yellow-500" />}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="ml-8">
                  <h4 className="font-medium text-gray-800 mb-2">Verification Steps:</h4>
                  <ul className="space-y-1">
                    {item.verificationSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className={isCompleted ? "line-through" : ""}>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Critical Reminders */}
      <Card className="border-2 border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
          <CardTitle className="text-xl text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Critical Deployment Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-1">⚠️</span>
              <span>
                <strong>Backup First:</strong> Always create a complete backup before deployment
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-1">⚠️</span>
              <span>
                <strong>Rollback Plan:</strong> Have a tested rollback procedure ready
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-1">⚠️</span>
              <span>
                <strong>Communication:</strong> Notify all stakeholders of deployment schedule
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-1">⚠️</span>
              <span>
                <strong>Monitoring:</strong> Have monitoring dashboards ready during deployment
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-1">⚠️</span>
              <span>
                <strong>Support Team:</strong> Ensure support team is available post-deployment
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Summary */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
          <CardTitle className="text-xl text-green-800">System Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">NLS Credit Assessment System</h4>
              <div className="space-y-2 text-sm">
                <div>• 3 NLS Categories (NLS1, NLS2, NLS3)</div>
                <div>• 216 Employment Combinations</div>
                <div>• 596 Flag Codes</div>
                <div>• Complete Workflow Coverage</div>
                <div>• Automated Testing Suite</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-3">Key Features</h4>
              <div className="space-y-2 text-sm">
                <div>• Property Search & Filtering</div>
                <div>• Group Creation & Management</div>
                <div>• Calendar & Scheduling</div>
                <div>• Mobile-Responsive Design</div>
                <div>• Real-time Notifications</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
