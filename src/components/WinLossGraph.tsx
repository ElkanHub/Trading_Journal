'use client';

import React, { useState, useMemo } from 'react';
import { Trade } from '@/types/trade';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface WinLossGraphProps {
  trades: Trade[];
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

export const WinLossGraph: React.FC<WinLossGraphProps> = ({ trades }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const filteredTrades = useMemo(() => {
    const now = new Date();
    const fromDate = new Date();

    switch (timeRange) {
      case '7d':
        fromDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        fromDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        fromDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        fromDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return trades.filter(trade => new Date(trade.exitTime) >= fromDate);
  }, [trades, timeRange]);

  const chartData = useMemo(() => {
    const sortedTrades = filteredTrades.sort((a, b) => new Date(a.exitTime).getTime() - new Date(b.exitTime).getTime());

    const labels = sortedTrades.map(trade => new Date(trade.exitTime));
    const winData = sortedTrades.map(trade => (trade.outcome === 'win' ? trade.netProfit : 0));
    const lossData = sortedTrades.map(trade => (trade.outcome === 'loss' ? Math.abs(trade.netProfit) : 0));

    return {
      labels,
      datasets: [
        {
          label: 'Wins',
          data: winData,
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          fill: true,
        },
        {
          label: 'Losses',
          data: lossData,
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true,
        },
      ],
    };
  }, [filteredTrades]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Win/Loss Progress',
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Win/Loss Progress</h3>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <Line options={options} data={chartData} />
    </div>
  );
};
