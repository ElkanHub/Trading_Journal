'use client';

import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { DailySummary } from './CalendarView'; // Assuming DailySummary is exported from CalendarView

interface DayCellProps {
  date: Date;
  dailySummaries: Record<string, DailySummary>;
}

export const DayCell: React.FC<DayCellProps> = ({ date, dailySummaries }) => {
  const summary = dailySummaries[date.toDateString()];

  if (!summary) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span>{date.getDate()}</span>
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer">
          <span>{date.getDate()}</span>
          <div className="absolute bottom-1 left-1 text-xs text-center">
            <div className="flex">
              <span className="text-emerald-500">{summary.wins}W</span>
              <span className="text-red-500">{summary.losses}L</span>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="space-y-2">
          <h4 className="font-semibold">{date.toDateString()}</h4>
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
    </Popover>
  );
};
