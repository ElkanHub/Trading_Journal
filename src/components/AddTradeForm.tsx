import React, { useState, useEffect } from 'react';
import { Trade } from '@/types/trade';

interface AddTradeFormProps {
  onSubmit: (trade: Omit<Trade, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Trade;
}

export const AddTradeForm: React.FC<AddTradeFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [formData, setFormData] = useState({
    pair: 'EUR/USD',
    direction: 'long' as 'long' | 'short',
    entryPrice: '',
    exitPrice: '',
    lotSize: '',
    stopLoss: '',
    takeProfit: '',
    entryTime: '',
    exitTime: '',
    strategy: '',
    emotionalState: '',
    confidence: 5,
    notes: '',
    tags: ''
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        tags: initialValues.tags.join(', '),
        entryPrice: initialValues.entryPrice.toString(),
        exitPrice: initialValues.exitPrice.toString(),
        lotSize: initialValues.lotSize.toString(),
        stopLoss: initialValues.stopLoss.toString(),
        takeProfit: initialValues.takeProfit.toString(),
      });
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const sl = parseFloat(formData.stopLoss);
    const tp = parseFloat(formData.takeProfit);
    const lotSize = parseFloat(formData.lotSize);

    const pips = formData.pair.includes('JPY') 
      ? (formData.direction === 'long' ? (exit - entry) * 100 : (entry - exit) * 100)
      : (formData.direction === 'long' ? (exit - entry) * 10000 : (entry - exit) * 10000);

    const pl = pips * lotSize;

    const riskRewardRatio = Math.abs((tp - entry) / (entry - sl));
    
    const trade: Omit<Trade, 'id'> = {
      pair: formData.pair,
      direction: formData.direction,
      entryPrice: entry,
      exitPrice: exit,
      lotSize: lotSize,
      stopLoss: sl,
      takeProfit: tp,
      entryTime: formData.entryTime,
      exitTime: formData.exitTime,
      profitLoss: pl,
      profitLossPips: pips,
      strategy: formData.strategy,
      emotionalState: formData.emotionalState,
      confidence: formData.confidence,
      notes: formData.notes,
      tags: formData.tags.split(',').map(t => t.trim()),
      riskRewardRatio: riskRewardRatio,
      outcome: pl > 0 ? 'win' : pl < 0 ? 'loss' : 'breakeven'
    };
    
    onSubmit(trade);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Currency Pair</label>
          <select 
            value={formData.pair}
            onChange={(e) => setFormData({...formData, pair: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          >
            <option>EUR/USD</option>
            <option>GBP/USD</option>
            <option>USD/JPY</option>
            <option>GBP/JPY</option>
            <option>EUR/JPY</option>
            <option>AUD/USD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Direction</label>
          <select 
            value={formData.direction}
            onChange={(e) => setFormData({...formData, direction: e.target.value as 'long' | 'short'})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Entry Price</label>
          <input 
            type="number" 
            step="0.00001"
            value={formData.entryPrice}
            onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Exit Price</label>
          <input 
            type="number" 
            step="0.00001"
            value={formData.exitPrice}
            onChange={(e) => setFormData({...formData, exitPrice: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Lot Size</label>
          <input 
            type="number" 
            step="0.01"
            value={formData.lotSize}
            onChange={(e) => setFormData({...formData, lotSize: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Stop Loss</label>
          <input 
            type="number" 
            step="0.00001"
            value={formData.stopLoss}
            onChange={(e) => setFormData({...formData, stopLoss: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Take Profit</label>
          <input 
            type="number" 
            step="0.00001"
            value={formData.takeProfit}
            onChange={(e) => setFormData({...formData, takeProfit: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Entry Time</label>
          <input 
            type="datetime-local"
            value={formData.entryTime}
            onChange={(e) => setFormData({...formData, entryTime: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Exit Time</label>
          <input 
            type="datetime-local"
            value={formData.exitTime}
            onChange={(e) => setFormData({...formData, exitTime: e.target.value})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Strategy</label>
        <input 
          type="text"
          value={formData.strategy}
          onChange={(e) => setFormData({...formData, strategy: e.target.value})}
          placeholder="e.g., Breakout, Reversal, Trend Following"
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Emotional State</label>
        <input 
          type="text"
          value={formData.emotionalState}
          onChange={(e) => setFormData({...formData, emotionalState: e.target.value})}
          placeholder="e.g., Confident, Anxious, Calm"
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Confidence (1-10): {formData.confidence}</label>
        <input 
          type="range"
          min="1"
          max="10"
          value={formData.confidence}
          onChange={(e) => setFormData({...formData, confidence: parseInt(e.target.value)})}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
        <input 
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="e.g., breakout, trend-following"
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
        <textarea 
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={3}
          placeholder="Detailed notes about the trade..."
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-semibold transition-colors"
        >
          {initialValues ? 'Update Trade' : 'Add Trade'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
