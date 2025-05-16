"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

interface SystemStatusProps {
  className?: string
}

export function SystemStatus({ className }: SystemStatusProps) {
  const systems = [
    { name: "Enrollment System", status: "operational", uptime: "99.9%" },
    { name: "Payment Gateway", status: "operational", uptime: "99.7%" },
    { name: "Course Registration", status: "operational", uptime: "99.8%" },
    { name: "Student Portal", status: "operational", uptime: "99.9%" },
    { name: "Faculty Portal", status: "degraded", uptime: "97.2%" },
    { name: "Database System", status: "operational", uptime: "99.9%" },
    { name: "Email Notifications", status: "incident", uptime: "85.4%" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "incident":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Operational
          </Badge>
        )
      case "degraded":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Degraded
          </Badge>
        )
      case "incident":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Incident
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current status of all system components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systems.map((system) => (
            <div key={system.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(system.status)}
                <span className="text-sm font-medium">{system.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">{system.uptime}</span>
                {getStatusBadge(system.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
