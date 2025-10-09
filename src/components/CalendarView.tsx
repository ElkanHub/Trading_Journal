'use client';

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Trade } from '@/types/trade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface CalendarViewProps {
  trades: Trade[];
}

export type DailySummary = {
  wins: number;
  losses: number;
  totalPL: number;
};

function DayContent(props: { date: Date, dailySummaries: Record<string, DailySummary> }): React.ReactElement {
  const summary = props.dailySummaries[props.date.toDateString()];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer">
          <span>{props.date.getDate()}</span>
          {summary && (
            <span className={`absolute bottom-1 text-xs font-bold ${summary.totalPL > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {summary.totalPL.toFixed(0)}
            </span>
          )}
        </div>
      </PopoverTrigger>
      {summary &&
        <PopoverContent className="w-48">
          <div className="space-y-2">
            <h4 className="font-semibold">{props.date.toDateString()}</h4>
            <div className="flex justify-between">
              <span>Wins:</span>
              <span className="text-emerald-500">{summary.wins}</span>
            </div>
            <div className="flex justify-between">
              <span>Losses:</span>
              <span className="text-red-500">{summary.losses}</span>
            </div>
            <div className="flex justify-between">
              <span>Net P/L:</span>
              <span className={summary.totalPL > 0 ? 'text-emerald-500' : 'text-red-500'}>
                {summary.totalPL.toFixed(2)}
              </span>
            </div>
          </div>
        </PopoverContent>
      }
    </Popover>
  );
}

export const CalendarView: React.FC<CalendarViewProps> = ({ trades }) => {
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
      backgroundColor: 'hsl(var(--muted-green))',
    },
    loss: {
      backgroundColor: 'hsl(var(--muted-red))',
    },
  };

  return (
    <Card className="bg-card border-border text-foreground">
      <CardHeader>
        <CardTitle>Trade Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <DayPicker
          numberOfMonths={1}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: (props) => <DayContent date={props.date} dailySummaries={dailySummaries} />,
          }}
          className="bg-card text-foreground"
          classNames={{
            caption: 'text-foreground',
            head: 'text-muted-foreground',
            day: 'w-12 h-12 sm:w-16 sm:h-16 border border-border text-foreground rounded-lg',
            nav_button: 'text-foreground',
          }}
        />
      </CardContent>
    </Card>
  );
};