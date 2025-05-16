"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Computer Science",
    total: 580,
  },
  {
    name: "Business Admin",
    total: 420,
  },
  {
    name: "Nursing",
    total: 380,
  },
  {
    name: "Education",
    total: 280,
  },
  {
    name: "Engineering",
    total: 240,
  },
  {
    name: "Psychology",
    total: 170,
  },
  {
    name: "Fine Arts",
    total: 130,
  },
]

interface EnrollmentStatsProps {
  className?: string
}

export function EnrollmentStats({ className }: EnrollmentStatsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Enrollment by Department</CardTitle>
        <CardDescription>Current semester enrollment distribution</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
