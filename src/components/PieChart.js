import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels);
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data = [] }) {
  const [chartData, setChartData] = useState(null);
  useEffect(
    function () {
      renderChart();
    },
    [data]
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        align: 'start',
      },
      title: {
        display: false,
      },
      datalabels: {
        display: true,
        anchor: 'end',
        offset: 30,
        align: 'start',
        color: 'white',
        formatter: function (value, context) {
          return Math.round(value * 10) / 10 + '%';
        },
        font: {
          size: 14,
          family: 'Helvetica',
        },
      },
    },
  };
  const renderChart = () => {
    const labels = data?.data?.map((singleData) => singleData.label) ?? [];
    const values = data?.data?.map((singleData) => singleData.value) ?? [];
    const datasets = [
      {
        data: values,
        backgroundColor: ['#4F46EF', '#58CFFF'],
        borderWidth: 0,
      },
    ];
    setChartData({ labels, datasets });
  };
  if (chartData === null) return;
  return <Pie options={options} data={chartData} style={{ width: '100%', height: '90%', maxHeight: '250px' }} />;
}
