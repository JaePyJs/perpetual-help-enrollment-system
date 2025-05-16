"use client"

import { Calendar, Info, Megaphone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentAnnouncements() {
  const announcements = [
    {
      id: 1,
      title: "Fall 2023 Registration Now Open",
      content:
        "Registration for Fall 2023 semester is now open. Please log in to your student portal to register for courses.",
      date: "July 15, 2023",
      author: {
        name: "Registrar's Office",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "RO",
      },
      type: "important",
      icon: Calendar,
    },
    {
      id: 2,
      title: "New Computer Lab Hours",
      content: "The computer lab in Building B will now be open 24/7 for student use during the exam period.",
      date: "July 12, 2023",
      author: {
        name: "IT Department",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "IT",
      },
      type: "info",
      icon: Info,
    },
    {
      id: 3,
      title: "CS Department Guest Lecture",
      content:
        "Join us for a guest lecture by Dr. Jane Smith on 'The Future of AI' on July 20 at 3:00 PM in Auditorium A.",
      date: "July 10, 2023",
      author: {
        name: "Computer Science Dept.",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "CS",
      },
      type: "event",
      icon: Megaphone,
    },
  ]

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "important":
        return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
      case "info":
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      case "event":
        return "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
      case "alert":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <announcement.icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">{announcement.title}</h3>
            </div>
            <Badge variant="outline" className={getBadgeVariant(announcement.type)}>
              {announcement.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{announcement.content}</p>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={announcement.author.avatar || "/placeholder.svg"} alt={announcement.author.name} />
                <AvatarFallback className="text-[10px]">{announcement.author.initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{announcement.author.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{announcement.date}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
