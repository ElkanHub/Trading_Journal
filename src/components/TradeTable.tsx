import React from 'react';
import { Trade } from '@/types/trade';

interface TradeTableProps {
  trades: Trade[];
  onEdit?: (trade: Trade) => void;
  onDelete?: (id: string) => void;
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Date</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Pair</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Direction</th>
            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Entry</th>
            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Exit</th>
            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Pips</th>
            <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">P/L</th>
            <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Strategy</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
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
              <td className={`py-3 px-4 text-right font-bold ${
                trade.profitLoss > 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {trade.profitLoss > 0 ? '+' : ''}${trade.profitLoss.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-slate-400 text-sm">{trade.strategy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
