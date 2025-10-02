
'use client';

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Trade } from '@/types/trade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalendarViewProps {
  trades: Trade[];
}

type DailySummary = {
  wins: number;
  losses: number;
  totalPL: number;
};

export const CalendarView: React.FC<CalendarViewProps> = ({ trades }) => {
  const dailySummaries = trades.reduce((acc, trade) => {
    const date = new Date(trade.date).toDateString();
    if (!acc[date]) {
      acc[date] = { wins: 0, losses: 0, totalPL: 0 };
    }
    if (trade.outcome === 'win') {
      acc[date].wins++;
    } else {
      acc[date].losses++;
    }
    acc[date].totalPL += trade.profitLoss;
    return acc;
  }, {} as Record<string, DailySummary>);

  const modifiers = {
    win: (date: Date) => {
      const summary = dailySummaries[date.toDateString()];
      return summary && summary.totalPL > 0;
    },
    loss: (date: Date) => {
      const summary = dailySummaries[date.toDateString()];
      return summary && summary.totalPL < 0;
    },
  };

  const modifiersStyles = {
    win: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgba(16, 185, 129, 1)',
    },
    loss: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 1)',
    },
  };

  const renderDayContent = (day: Date) => {
    const summary = dailySummaries[day.toDateString()];
    if (summary) {
      return (
        <div className="text-xs p-1">
          <div className="font-bold">{day.getDate()}</div>
          <div className="flex justify-between">
            <span className="text-emerald-500">{summary.wins}W</span>
            <span className="text-red-500">{summary.losses}L</span>
          </div>
        </div>
      );
    }
    return <div className="font-bold">{day.getDate()}</div>;
  };

  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader>
        <CardTitle>Trade Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <DayPicker
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: ({ date }) => renderDayContent(date as Date),
          }}
          className="bg-slate-800 text-white"
          classNames={{
            caption: 'text-white',
            head: 'text-slate-400',
            day: 'text-white',
            nav_button: 'text-white',
          }}
        />
      </CardContent>
    </Card>
  );
};
