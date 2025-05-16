"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const data = [
  {
    semester: "Fall 2021",
    gpa: 3.2,
    credits: 15,
  },
  {
    semester: "Spring 2022",
    gpa: 3.4,
    credits: 16,
  },
  {
    semester: "Fall 2022",
    gpa: 3.5,
    credits: 15,
  },
  {
    semester: "Spring 2023",
    gpa: 3.75,
    credits: 15,
  },
  {
    semester: "Fall 2023",
    gpa: 3.75,
    credits: 15,
  },
];

export function AcademicProgressChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set colors based on theme
  const isDark = mounted && theme === "dark";

  // Define colors for light and dark modes
  const colors = {
    gpa: "#e77f33", // Primary orange for both modes
    credits: isDark ? "#60a5fa" : "#3b82f6", // Brighter blue in dark mode
    grid: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: isDark ? "#e2e8f0" : "#64748b", // Slate-200 for dark, Slate-500 for light
    tooltip: {
      bg: isDark ? "#1e293b" : "#ffffff", // Slate-800 for dark, white for light
      border: isDark ? "#334155" : "#e2e8f0", // Slate-700 for dark, Slate-200 for light
      text: isDark ? "#e2e8f0" : "#1e293b", // Slate-200 for dark, Slate-800 for light
    },
  };

  // Custom tooltip component with dark mode support
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-md shadow-md ${
            isDark
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-slate-200"
          }`}
        >
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.stroke }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!mounted) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis
          dataKey="semester"
          tick={{ fill: colors.text }}
          stroke={colors.grid}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          domain={[0, 4]}
          tick={{ fill: colors.text }}
          stroke={colors.grid}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 20]}
          tick={{ fill: colors.text }}
          stroke={colors.grid}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: colors.text }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="gpa"
          name="GPA"
          stroke={colors.gpa}
          activeDot={{ r: 8, fill: colors.gpa }}
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="credits"
          name="Credits"
          stroke={colors.credits}
          activeDot={{ r: 6, fill: colors.credits }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
