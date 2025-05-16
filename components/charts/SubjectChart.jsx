import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './Chart.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const SubjectChart = ({ data, title = 'Subject Performance', className }) => {
  const chartData = {
    labels: data?.labels || ['Math', 'Science', 'English', 'History', 'Art'],
    datasets: [
      {
        label: 'Grades',
        data: data?.values || [85, 92, 78, 88, 95],
        backgroundColor: [
          'rgba(231, 127, 51, 0.8)',
          'rgba(63, 131, 248, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(231, 127, 51, 1)',
          'rgba(63, 131, 248, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(16, 185, 129, 1)',
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
        display: false
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
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className={`${styles.chartContainer} ${className || ''}`}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SubjectChart;
