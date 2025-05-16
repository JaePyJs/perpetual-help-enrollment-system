"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "John Smith",
        email: "john.smith@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      action: "enrolled",
      target: "Introduction to Computer Science",
      timestamp: "2 minutes ago",
      type: "enrollment",
    },
    {
      id: 2,
      user: {
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      action: "updated",
      target: "Student Profile",
      timestamp: "15 minutes ago",
      type: "profile",
    },
    {
      id: 3,
      user: {
        name: "Dr. James Wilson",
        email: "james.wilson@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      action: "submitted",
      target: "Final Grades for Advanced Mathematics",
      timestamp: "1 hour ago",
      type: "grades",
    },
    {
      id: 4,
      user: {
        name: "Admin System",
        email: "system@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      action: "generated",
      target: "Monthly Enrollment Report",
      timestamp: "3 hours ago",
      type: "system",
    },
    {
      id: 5,
      user: {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      action: "paid",
      target: "Tuition Fee",
      timestamp: "5 hours ago",
      type: "payment",
    },
  ]

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "enrollment":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Enrollment</Badge>
      case "profile":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Profile</Badge>
      case "grades":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Grades</Badge>
      case "system":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">System</Badge>
      case "payment":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Payment</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across the enrollment system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={activity.user.image || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name} <span className="text-muted-foreground">{activity.action}</span>{" "}
                  {activity.target}
                </p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
              {getActivityBadge(activity.type)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
