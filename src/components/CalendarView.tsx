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

interface DayContentProps {
  date: Date;
  displayMonth: Date;
}

function CustomDayContent(props: DayContentProps, dailySummaries: Record<string, DailySummary>): React.ReactElement {
  const summary = dailySummaries[props.date.toDateString()];
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <span>{props.date.getDate()}</span>
      {summary && (
        <div className="absolute bottom-1 left-1 text-xs text-center">
          <div className="flex">
            <span className="text-emerald-500">{summary.wins}W</span>
            <span className="text-red-500">{summary.losses}L</span>
          </div>
          <span className={`font-bold ${summary.totalPL > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {summary.totalPL.toFixed(0)}
          </span>
        </div>
      )}
    </div>
  );
}

import { useIsMobile } from '@/hooks/use-mobile';

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
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: (props) => CustomDayContent(props, dailySummaries),
          }}
          className="bg-card text-foreground"
          classNames={{
            caption: 'text-foreground',
            head: 'text-muted-foreground',
            day: isMobile ? 'w-14 h-15 border border-border text-foreground rounded-lg' : 'w-24 h-24 border border-border text-foreground rounded-lg',
            nav_button: 'text-foreground',
          }}
        />
      </CardContent>
    </Card>
  );
};