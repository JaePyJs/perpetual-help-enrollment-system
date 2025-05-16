"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Course {
  id: string
  code: string
  name: string
  schedule: {
    days: string[]
    startTime: string
    endTime: string
    location: string
  }
}

interface WeeklyScheduleViewProps {
  selectedCourses: Course[]
}

export function WeeklyScheduleView({ selectedCourses }: WeeklyScheduleViewProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  // Convert time string (e.g., "9:00 AM") to minutes since 8 AM
  const timeToMinutes = (timeStr: string) => {
    const [time, period] = timeStr.split(" ")
    let [hours, minutes] = time.split(":").map(Number)
    if (period === "PM" && hours !== 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0
    return (hours - 8) * 60 + minutes
  }

  // Calculate schedule blocks for visualization
  const scheduleBlocks = useMemo(() => {
    const blocks: Record<string, any[]> = {}

    days.forEach((day) => {
      blocks[day] = []

      selectedCourses.forEach((course) => {
        if (course.schedule.days.includes(day)) {
          const startMinutes = timeToMinutes(course.schedule.startTime)
          const endMinutes = timeToMinutes(course.schedule.endTime)
          const duration = endMinutes - startMinutes

          blocks[day].push({
            id: course.id,
            code: course.code,
            name: course.name,
            location: course.schedule.location,
            startMinutes,
            endMinutes,
            duration,
          })
        }
      })
    })

    return blocks
  }, [selectedCourses])

  // Generate a color based on course code for consistent coloring
  const getCourseColor = (courseCode: string) => {
    const colors = [
      "bg-primary/20 border-primary/30",
      "bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30",
      "bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30",
      "bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30",
      "bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800/30",
    ]

    // Simple hash function to get consistent color
    const hash = courseCode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  if (selectedCourses.length === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="relative overflow-x-auto rounded-md border">
          <div className="flex">
            <div className="w-12 shrink-0 border-r bg-muted/50">
              <div className="h-8"></div>
              {hours.map((hour) => (
                <div key={hour} className="h-12 border-t px-1 text-xs text-muted-foreground">
                  {hour % 12 === 0 ? 12 : hour % 12}
                  {hour < 12 ? "am" : "pm"}
                </div>
              ))}
            </div>
            <div className="flex flex-1 min-w-[500px]">
              {days.map((day) => (
                <div key={day} className="flex-1 border-r last:border-r-0">
                  <div className="h-8 border-b bg-muted/50 px-1 text-center text-xs font-medium">
                    {day.substring(0, 3)}
                  </div>
                  <div className="relative h-[144px]">
                    {hours.map((hour) => (
                      <div key={hour} className="absolute left-0 right-0 h-12 border-t"></div>
                    ))}

                    {scheduleBlocks[day].map((block) => (
                      <div
                        key={`${day}-${block.id}`}
                        className={`absolute left-1 right-1 rounded-sm border px-1 py-0.5 text-xs ${getCourseColor(block.code)}`}
                        style={{
                          top: `${(block.startMinutes / 60) * 12}px`,
                          height: `${(block.duration / 60) * 12}px`,
                        }}
                      >
                        <div className="font-medium truncate">{block.code}</div>
                        <div className="truncate">{block.location}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
