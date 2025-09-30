import React, { useState } from 'react';
import { Trade } from '@/types/trade';
import { FilterBar } from './FilterBar';
import { TradeTable } from './TradeTable';
import { EmptyState } from './EmptyState';

interface TradesViewProps {
  trades: Trade[];
  onAddTrade: () => void;
}

export const TradesView: React.FC<TradesViewProps> = ({ trades, onAddTrade }) => {
  const [filters, setFilters] = useState({
    pair: '',
    strategy: '',
    outcome: '',
    dateFrom: '',
    dateTo: ''
  });

  const filteredTrades = trades.filter(trade => {
    if (filters.pair && trade.pair !== filters.pair) return false;
    if (filters.strategy && trade.strategy !== filters.strategy) return false;
    if (filters.outcome && trade.outcome !== filters.outcome) return false;
    if (filters.dateFrom && new Date(trade.entryTime) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(trade.entryTime) > new Date(filters.dateTo)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">All Trades</h2>
        <button 
          onClick={onAddTrade}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-semibold transition-colors"
        >
          + Add Trade
        </button>
      </div>

      {trades.length === 0 ? (
        <EmptyState 
          title="No Trades Yet"
          description="Start logging your trades to build your trading history and analyze your performance."
          actionLabel="Add Your First Trade"
          onAction={onAddTrade}
        />
      ) : (
        <>
          <FilterBar filters={filters} onFilterChange={setFilters} />

          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            {filteredTrades.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-400">No trades match your filters. Try adjusting your criteria.</p>
              </div>
            ) : (
              <TradeTable trades={filteredTrades} />
            )}
          </div>

          <div className="text-center text-slate-400">
            Showing {filteredTrades.length} of {trades.length} trades
          </div>
        </>
      )}
    </div>
  );
};
