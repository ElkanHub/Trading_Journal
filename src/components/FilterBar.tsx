import React from 'react';

interface Filters {
  pair: string;
  strategy: string;
  outcome: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Currency Pair</label>
          <select
            value={filters.pair}
            onChange={(e) => onFilterChange({ ...filters, pair: e.target.value })}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground text-sm"
          >
            <option value="">All Pairs</option>
            <option>EUR/USD</option>
            <option>GBP/USD</option>
            <option>USD/JPY</option>
            <option>GBP/JPY</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Strategy</label>
          <select
            value={filters.strategy}
            onChange={(e) => onFilterChange({ ...filters, strategy: e.target.value })}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground text-sm"
          >
            <option value="">All Strategies</option>
            <option>Breakout</option>
            <option>Reversal</option>
            <option>Trend Following</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Outcome</label>
          <select
            value={filters.outcome}
            onChange={(e) => onFilterChange({ ...filters, outcome: e.target.value })}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground text-sm"
          >
            <option value="">All</option>
            <option value="win">Wins</option>
            <option value="loss">Losses</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground text-sm"
          />
        </div>
      </div>
    </div>
  );
};
