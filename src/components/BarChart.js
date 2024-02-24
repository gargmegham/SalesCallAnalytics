import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(...registerables);
ChartJS.register(ChartDataLabels);

const availableColors = ['#0956E0', '#02394A', '#5158BB', '#4F46EF'];

export default function BarChart({ data = [] }) {
  const [chartData, setChartData] = useState(null);
  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          color: 'black',
          font: {
            size: 10,
          },
          family: 'Helvetica',
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      legend: false,
      title: {
        display: false,
      },
      datalabels: {
        display: true,
        anchor: 'end',
        offset: -20,
        align: 'start',
        color: 'black',
        formatter: function (value, context) {
          return Math.round(value * 10) / 10 + '%';
        },
        font: {
          size: 12,
          family: 'Helvetica',
        },
      },
    },
  };
  useEffect(() => {
    renderChart();
  }, [data]);
  const generateColors = (length = 0) => {
    let colors = [];
    for (var i = 1; i <= length; i++) {
      const color_index = i % availableColors.length;
      colors.push({
        bgColor: availableColors[color_index],
        brColor: availableColors[color_index],
      });
    }
    return colors;
  };
  const renderChart = () => {
    const labels = data?.data?.map((item) => item.category.replace('LACK OF', '').trim()) ?? [];
    const values = data?.data?.map((item) => item.percentage * 100) ?? [];
    const colors = generateColors(labels.length);
    const datasets = [
      {
        data: values,
        backgroundColor: colors?.map((color) => color.bgColor) ?? [],
        borderWidth: 0,
        borderRadius: 10,
        barPercentage: 0.4,
        categoryPercentage: 0.9,
      },
    ];

    setChartData({ labels, datasets });
  };
  if (chartData === null) return;
  return <Bar options={options} data={chartData} style={{ height: '100%' }} />;
}
