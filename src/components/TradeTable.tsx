import React, { useState, useMemo } from 'react';
import { Trade } from '@/types/trade';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
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
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'entryTime', direction: 'descending' });

  const sortedTrades = useMemo(() => {
    let sortableTrades = [...trades];
    if (sortConfig !== null) {
      sortableTrades.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
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
              <button onClick={() => requestSort('entryPrice')} className="flex items-center">
                Entry {getSortIndicator('entryPrice')}
              </button>
            </th>
            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">
              <button onClick={() => requestSort('exitPrice')} className="flex items-center">
                Exit {getSortIndicator('exitPrice')}
              </button>
            </th>
            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">
              <button onClick={() => requestSort('profitLossPips')} className="flex items-center">
                Pips {getSortIndicator('profitLossPips')}
              </button>
            </th>
            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">
              <button onClick={() => requestSort('profitLoss')} className="flex items-center">
                P/L {getSortIndicator('profitLoss')}
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
                <span className={`text-xs px-2 py-1 rounded ${
                  trade.direction === 'long' 
                    ? 'bg-emerald-900/30 text-emerald-400' 
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {trade.direction.toUpperCase()}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-slate-300">{trade.entryPrice.toFixed(5)}</td>
              <td className="py-3 px-4 text-right text-slate-300">{trade.exitPrice.toFixed(5)}</td>
              <td className={`py-3 px-4 text-right font-medium ${
                trade.profitLossPips > 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {trade.profitLossPips > 0 ? '+' : ''}{trade.profitLossPips.toFixed(1)}
              </td>
              <td className={`py-3 px-4 text-right font-bold text-sm ${
                trade.profitLoss > 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {trade.profitLoss > 0 ? '+' : ''}${trade.profitLoss.toFixed(2)}
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
