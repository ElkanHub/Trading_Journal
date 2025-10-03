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
    profit: '',
    loss: '',
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
        profit: initialValues.profit?.toString() || '',
        loss: initialValues.loss?.toString() || '',
      });
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entry = parseFloat(formData.entryPrice);
    const profit = formData.profit ? parseFloat(formData.profit) : undefined;
    const loss = formData.loss ? parseFloat(formData.loss) : undefined;

    const netProfit = profit ? profit : loss ? -loss : 0;
    
    const trade: Omit<Trade, 'id'> = {
      pair: formData.pair,
      direction: formData.direction,
      entryPrice: entry,
      entryTime: formData.entryTime,
      exitTime: formData.exitTime,
      strategy: formData.strategy,
      emotionalState: formData.emotionalState,
      confidence: formData.confidence,
      notes: formData.notes,
      tags: formData.tags.split(',').map(t => t.trim()),
      outcome: netProfit > 0 ? 'win' : netProfit < 0 ? 'loss' : 'breakeven',
      profit: profit,
      loss: loss,
      netProfit: netProfit,
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
          <label className="block text-sm font-medium text-slate-300 mb-1">Profit</label>
          <input 
            type="number" 
            step="0.01"
            value={formData.profit}
            onChange={(e) => setFormData({...formData, profit: e.target.value, loss: ''})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            disabled={!!formData.loss}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Loss</label>
          <input 
            type="number" 
            step="0.01"
            value={formData.loss}
            onChange={(e) => setFormData({...formData, loss: e.target.value, profit: ''})}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            disabled={!!formData.profit}
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
