import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './Chart.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const GpaChart = ({ data, title = 'GPA Progression', className }) => {
  const chartData = {
    labels: data?.labels || ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem'],
    datasets: [
      {
        label: 'GPA',
        data: data?.values || [3.5, 3.7, 3.2, 3.8],
        fill: false,
        backgroundColor: '#e77f33',
        borderColor: '#e77f33',
        tension: 0.2,
        pointBackgroundColor: '#e77f33',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
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
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        min: 0,
        max: 4.0,
        ticks: {
          stepSize: 0.5,
          font: {
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className={`${styles.chartContainer} ${className || ''}`}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default GpaChart;
