import React from "react";
import { Trade, TradeStats } from "@/types/trade";
import { StatCard } from "./StatCard";
import { TradeCard } from "./TradeCard";
import { EmptyState } from "./EmptyState";

interface DashboardViewProps {
  trades: Trade[];
  stats: TradeStats;
  onAddTrade: () => void;
  loading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  trades,
  stats,
  onAddTrade,
  loading,
}) => {
  const recentTrades = trades.slice(0, 6);

  if (loading) {
    return <p className="text-white">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades}
          subtitle="All time"
          trend="neutral"
        />
        <StatCard
          title="Win Rate"
          value={`${(stats?.winRate ?? 0).toFixed(1)}%`}
          subtitle={`${(stats?.winningTrades ?? 0)}W / ${(stats?.losingTrades ?? 0)}L`}
          trend={stats?.winRate >= 50 ? "up" : "down"}
        />
        <StatCard
          title="Net P/L"
          value={`$${(stats?.netProfitLoss ?? 0).toFixed(2)}`}
          subtitle={`Best: $${(stats?.bestTrade ?? 0).toFixed(2)} / Worst: $${(stats?.worstTrade ?? 0).toFixed(2)}`}
          trend={stats?.netProfitLoss > 0 ? "up" : "down"}
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Trades</h2>
          <button
            onClick={onAddTrade}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            + Add Trade
          </button>
        </div>

        {recentTrades.length === 0 ? (
          <EmptyState
            title="No Trades Yet"
            description="Start tracking your trades to see performance statistics and analytics."
            actionLabel="Add Your First Trade"
            onAction={onAddTrade}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTrades.map((trade) => (
              <TradeCard key={trade.id} trade={trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
