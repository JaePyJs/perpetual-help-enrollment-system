import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from './Chart.module.css';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend
);

const AttendanceChart = ({ data, title = 'Attendance Summary', className }) => {
  const chartData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: data || [85, 5, 10],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          family: "'Poppins', sans-serif",
          size: 16,
          weight: 'bold'
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className={`${styles.chartContainer} ${className || ''}`}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default AttendanceChart;
