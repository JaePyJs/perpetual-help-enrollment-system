"use client"

import { useEffect, useRef } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function GradeDistributionChart() {
  const chartRef = useRef<ChartJS>(null)

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  const labels = ["90-100", "80-89", "75-79", "70-74", "Below 70"]

  const data = {
    labels,
    datasets: [
      {
        label: "Number of Students",
        data: [3, 2, 1, 1, 0],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // Green for A
          "rgba(59, 130, 246, 0.8)", // Blue for B
          "rgba(250, 204, 21, 0.8)", // Yellow for C
          "rgba(249, 115, 22, 0.8)", // Orange for D
          "rgba(239, 68, 68, 0.8)", // Red for F
        ],
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    // This effect can be used to update the chart if needed
    const chart = chartRef.current

    return () => {
      // Cleanup if needed
    }
  }, [])

  return <Bar ref={chartRef} options={options} data={data} />
}
