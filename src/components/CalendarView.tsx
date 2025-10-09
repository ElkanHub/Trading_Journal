'use client';

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Trade } from '@/types/trade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useIsMobile } from '@/hooks/use-mobile';
import { DayCell } from './DayCell';

interface CalendarViewProps {
  trades: Trade[];
}

export type DailySummary = {
  wins: number;
  losses: number;
  totalPL: number;
};

export const CalendarView: React.FC<CalendarViewProps> = ({ trades }) => {
  const isMobile = useIsMobile();
  const dailySummaries = trades.reduce((acc, trade) => {
    const date = new Date(trade.entryTime).toDateString();
    if (!acc[date]) {
      acc[date] = { wins: 0, losses: 0, totalPL: 0 };
    }
    if (trade.outcome === 'win') {
      acc[date].wins++;
    } else {
      acc[date].losses++;
    }
    acc[date].totalPL += trade.netProfit;
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
      color: 'white',
    },
    loss: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 1)',
      color: 'white',
    },
  };

  return (
    <Card className="bg-card border-border text-foreground">
      <CardHeader>
        <CardTitle>Trade Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <DayPicker
          numberOfMonths={isMobile ? 1 : 2}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            Day: (props) => <DayCell date={props.date} dailySummaries={dailySummaries} />,
          }}
          className="bg-card text-foreground"
          classNames={{
            caption: 'text-foreground',
            head: 'text-muted-foreground',
            day: isMobile ? 'w-12 h-12 border border-border text-foreground rounded-lg' : 'w-16 h-16 border border-border text-foreground rounded-lg',
            nav_button: 'text-foreground',
          }}
        />
      </CardContent>
    </Card>
  );
};