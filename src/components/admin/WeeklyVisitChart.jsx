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
  Filler,
} from 'chart.js';

// Daftarkan semua komponen Chart.js yang akan digunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeeklyVisitChart = ({ weeklyData = [0, 0, 0, 0, 0, 0, 0] }) => { 
  const data = {
    labels: ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    datasets: [
      {
        label: 'Kunjungan Pasien',
        data: weeklyData,
        borderColor: '#36803E',
        backgroundColor: 'rgba(54, 128, 62, 0.2)',
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
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50, // <-- TAMBAHKAN KEMBALI BARIS INI
        ticks: {
          stepSize: 10,
          color: 'rgba(86, 86, 86, 1)',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(86, 86, 86, 1)',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Line options={options} data={data} />
    </div>
  );
};

export default WeeklyVisitChart;