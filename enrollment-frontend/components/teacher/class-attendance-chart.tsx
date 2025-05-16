"use client"

/**
 * Class Attendance Chart Component
 * 
 * This component displays a bar chart showing attendance rates for different classes.
 * 
 * Backend Integration:
 * To fully integrate with the backend API:
 * 1. Uncomment the API calls in the useEffect hook
 * 2. Import the necessary API functions from @/lib/api
 * 3. Add state for storing the fetched data
 * 4. Replace the sample data with the fetched data
 */

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

export function ClassAttendanceChart() {
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
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%'
          }
        }
      },
    },
  }

  const labels = ["CS101", "CS315", "CS401", "CS201", "CS105"]

  const data = {
    labels,
    datasets: [
      {
        label: "Attendance Rate",
        data: [92, 88, 94, 85, 90],
        backgroundColor: "rgba(231, 127, 51, 0.8)", // Primary orange color
        borderColor: "rgba(231, 127, 51, 1)",
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    // This effect can be used to update the chart if needed
    const chart = chartRef.current

    // In a real implementation, you would fetch data from the API
    // Example:
    // const fetchAttendanceData = async () => {
    //   try {
    //     const response = await fetchClassAttendance();
    //     if (response.data) {
    //       // Update chart data
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch attendance data:", error);
    //   }
    // };
    // 
    // fetchAttendanceData();

    return () => {
      // Cleanup if needed
    }
  }, [])

  return <Bar ref={chartRef} options={options} data={data} />
}
