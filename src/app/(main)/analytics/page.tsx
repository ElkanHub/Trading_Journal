'use client';

import { useTrades } from '@/lib/hooks/useTrades';
import { calculateStats } from '@/utils/tradeCalculations';
import { AnalyticsView } from '@/components/AnalyticsView';

export default function AnalyticsPage() {
  const { trades, loading } = useTrades();
  const stats = calculateStats(trades);

  return (
    <AnalyticsView trades={trades} stats={stats} loading={loading} />
  );
}
