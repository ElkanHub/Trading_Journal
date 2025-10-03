import React from 'react';
import { Trade } from '@/types/trade';

interface TradeCardProps {
  trade: Trade;
  onEdit?: (trade: Trade) => void;
  onDelete?: (id: string) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({ trade, onEdit, onDelete }) => {
  const isProfit = trade.netProfit > 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg">{trade.pair}</h3>
          <span className={`text-xs px-2 py-1 rounded ${trade.direction === 'long' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
            {trade.direction.toUpperCase()}
          </span>
        </div>
        <div className={`text-right ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
          <p className="font-bold text-2xl">{isProfit ? '+' : ''}{(trade?.netProfit ?? 0).toFixed(2)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-slate-500">Entry</p>
          <p className="text-white">{trade.entryPrice}</p>
        </div>
      </div>
      
      <p className="text-slate-400 text-xs mb-2">{trade.strategy}</p>
      <p className="text-slate-500 text-xs">{new Date(trade.entryTime).toLocaleDateString()}</p>
    </div>
  );
};
