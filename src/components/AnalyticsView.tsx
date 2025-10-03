import React from 'react';
import { Trade, TradeStats, initialTradeStats } from '@/types/trade';
import { CalendarView } from './CalendarView';

interface AnalyticsViewProps {
  trades: Trade[];
  stats: TradeStats;
  loading: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ trades, stats, loading }) => {
  const [displayStats, setDisplayStats] = React.useState<TradeStats>(initialTradeStats);

  React.useEffect(() => {
    if (!loading && trades.length > 0) {
      setDisplayStats(stats);
    }
  }, [loading, trades, stats]);

  if (loading) {
    return <p className="text-white">Loading analytics...</p>;
  }

  const pairPerformance = trades.reduce((acc, trade) => {
    if (!acc[trade.pair]) {
      acc[trade.pair] = { wins: 0, losses: 0, totalPL: 0 };
    }
    if (trade.outcome === 'win') acc[trade.pair].wins++;
    if (trade.outcome === 'loss') acc[trade.pair].losses++;
    acc[trade.pair].totalPL += trade.netProfit;
    return acc;
  }, {} as Record<string, { wins: number; losses: number; totalPL: number }>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics</h2>

      {/* Performance Summary */}
      {displayStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Win/Loss Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Winning Trades</span>
                <span className="text-emerald-500 font-bold">{displayStats.winningTrades}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-emerald-500 h-3 rounded-full transition-all"
                  style={{ width: `${displayStats.winRate}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Losing Trades</span>
                <span className="text-red-500 font-bold">{displayStats.losingTrades}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{ width: `${100 - displayStats.winRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Profit/Loss Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Profit</span>
                <span className="text-emerald-500 font-bold">${(displayStats?.totalProfit ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Loss</span>
                <span className="text-red-500 font-bold">-${(displayStats?.totalLoss ?? 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-700 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Net P/L</span>
                  <span className={`font-bold text-xl ${displayStats?.netProfitLoss > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    ${(displayStats?.netProfitLoss ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance by Pair */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance by Currency Pair</h3>
        <div className="space-y-4">
          {Object.entries(pairPerformance).map(([pair, data]) => (
            <div key={pair} className="border-b border-slate-700 pb-3 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">{pair}</span>
                <span className={`font-bold ${data.totalPL > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${(data.totalPL ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-emerald-400">{data.wins} wins</span>
                <span className="text-red-400">{data.losses} losses</span>
                <span className="text-slate-400">
                  {((data.wins / (data.wins + data.losses)) * 100).toFixed(1)}% win rate
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CalendarView trades={trades} />
    </div>
  );
};
