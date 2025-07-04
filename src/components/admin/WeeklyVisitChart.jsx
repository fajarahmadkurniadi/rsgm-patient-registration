import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyVisitChart = () => {
  const data = {
    labels: ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    datasets: [
      {
        label: 'Kunjungan Pasien',
        data: [16, 19, 31, 28, 37, 18, 27],
        borderColor: '#36803E',
        backgroundColor: 'rgba(46, 96, 52, 0.2)',
        pointBackgroundColor: '#E7C11F',
        pointBorderColor: '#E7C11F',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ini sudah benar
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        ticks: { stepSize: 10, color: 'rgba(86, 86, 86, 1)' },
        grid: { color: 'rgba(86, 86, 86, 1)' },
      },
      x: {
        ticks: { color: 'rgba(86, 86, 86, 1)' },
        grid: { color: 'rgba(86, 86, 86, 1)' },
      },
    },
  };

  // KUNCI PERBAIKAN: Bungkus <Line> dengan div ini
  return (
    <div className="chart-wrapper">
      <Line options={options} data={data} />
    </div>
  );
};

export default WeeklyVisitChart;