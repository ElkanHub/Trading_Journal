import React, { useState, useMemo } from 'react';
import { Trade } from '@/types/trade';
import { MoreHorizontal, ArrowUpDown, ArrowDown01, ArrowDown10 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TradeTableProps {
  trades: Trade[];
  onEdit?: (trade: Trade) => void;
  onDelete?: (id: string) => void;
}

type SortConfig = {
  key: keyof Trade;
  direction: 'ascending' | 'descending';
} | null;

export const TradeTable: React.FC<TradeTableProps> = ({ trades, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'entryTime',
    direction: 'descending',
  });

  const sortedTrades = useMemo(() => {
    const sortableTrades = [...trades];
    if (sortConfig !== null) {
      sortableTrades.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // ✅ Handle undefined/null values safely
        if (aValue == null || bValue == null) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTrades;
  }, [trades, sortConfig]);

  const requestSort = (key: keyof Trade) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Trade) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="ml-2 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? <ArrowDown01 /> : <ArrowDown10 />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
              <button onClick={() => requestSort('entryTime')} className="flex items-center">
                Date {getSortIndicator('entryTime')}
              </button>
            </th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
              <button onClick={() => requestSort('pair')} className="flex items-center">
                Pair {getSortIndicator('pair')}
              </button>
            </th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
              <button onClick={() => requestSort('direction')} className="flex items-center">
                Direction {getSortIndicator('direction')}
              </button>
            </th>

            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">
              <button onClick={() => requestSort('netProfit')} className="flex items-center">
                Net P/L {getSortIndicator('netProfit')}
              </button>
            </th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
              <button onClick={() => requestSort('strategy')} className="flex items-center">
                Strategy {getSortIndicator('strategy')}
              </button>
            </th>
            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTrades.map((trade) => (
            <tr
              key={trade.id}
              className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3 px-4 text-slate-300 text-sm">
                {new Date(trade.entryTime).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-white font-medium">{trade.pair}</td>
              <td className="py-3 px-4">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    trade.direction === 'long'
                      ? 'bg-emerald-900/30 text-emerald-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  {trade.direction.toUpperCase()}
                </span>
              </td>

              <td className={`py-3 px-4 text-right font-bold text-sm ${
                trade?.netProfit > 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {trade?.netProfit > 0 ? '+' : ''}${(trade?.netProfit ?? 0).toFixed(2)}
              </td>
              <td className="py-3 px-4 text-slate-400 text-sm">{trade.strategy}</td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 text-slate-400 hover:text-white">
                      <MoreHorizontal size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit && onEdit(trade)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete && onDelete(trade.id)}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
