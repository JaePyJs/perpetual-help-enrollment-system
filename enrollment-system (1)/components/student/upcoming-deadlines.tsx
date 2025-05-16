"use client"

import { CalendarClock, FileText, GraduationCap, CreditCard, BookOpen } from "lucide-react"

export function UpcomingDeadlines() {
  const deadlines = [
    {
      id: 1,
      title: "Tuition Payment Due",
      date: "August 15, 2023",
      icon: CreditCard,
      color: "text-red-500",
    },
    {
      id: 2,
      title: "Course Add/Drop Deadline",
      date: "August 25, 2023",
      icon: BookOpen,
      color: "text-amber-500",
    },
    {
      id: 3,
      title: "CS301 Project Proposal",
      date: "September 5, 2023",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      id: 4,
      title: "Midterm Exam - MATH240",
      date: "October 10, 2023",
      icon: GraduationCap,
      color: "text-blue-500",
    },
    {
      id: 5,
      title: "Spring Registration Begins",
      date: "November 1, 2023",
      icon: CalendarClock,
      color: "text-indigo-500",
    },
  ]

  return (
    <div className="space-y-4">
      {deadlines.map((deadline) => (
        <div key={deadline.id} className="flex items-start gap-3">
          <div className={`rounded-full p-1.5 ${deadline.color} bg-opacity-10`}>
            <deadline.icon className={`h-4 w-4 ${deadline.color}`} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{deadline.title}</p>
            <p className="text-xs text-muted-foreground">{deadline.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
