import React from 'react';
import { Trade, TradeStats } from '@/types/trade';

interface AnalyticsViewProps {
  trades: Trade[];
  stats: TradeStats;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ trades, stats }) => {
  const pairPerformance = trades.reduce((acc, trade) => {
    if (!acc[trade.pair]) {
      acc[trade.pair] = { wins: 0, losses: 0, totalPL: 0 };
    }
    if (trade.outcome === 'win') acc[trade.pair].wins++;
    if (trade.outcome === 'loss') acc[trade.pair].losses++;
    acc[trade.pair].totalPL += trade.profitLoss;
    return acc;
  }, {} as Record<string, { wins: number; losses: number; totalPL: number }>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics</h2>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Win/Loss Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Winning Trades</span>
              <span className="text-emerald-500 font-bold">{stats.winningTrades}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${stats.winRate}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Losing Trades</span>
              <span className="text-red-500 font-bold">{stats.losingTrades}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all"
                style={{ width: `${100 - stats.winRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Profit/Loss Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Profit</span>
              <span className="text-emerald-500 font-bold">${stats.totalProfit.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Loss</span>
              <span className="text-red-500 font-bold">-${stats.totalLoss.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-700 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Net P/L</span>
                <span className={`font-bold text-xl ${stats.netProfitLoss > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${stats.netProfitLoss.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance by Pair */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance by Currency Pair</h3>
        <div className="space-y-4">
          {Object.entries(pairPerformance).map(([pair, data]) => (
            <div key={pair} className="border-b border-slate-700 pb-3 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">{pair}</span>
                <span className={`font-bold ${data.totalPL > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${data.totalPL.toFixed(2)}
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
    </div>
  );
};
