import React, { useState, useEffect } from 'react';
import { Trade } from '@/types/trade';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';


interface AddTradeFormProps {
  onSubmit: (trade: Omit<Trade, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Trade;
}

const currencyPairs = [
  // Majors
  'EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD',
  // Minors
  'EUR/GBP', 'EUR/CHF', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CAD/JPY', 'NZD/JPY',
  'AUD/NZD', 'AUD/CHF', 'GBP/CHF', 'CAD/CHF',
  // Exotics
  'USD/RUB', 'GBP/TRY', 'EUR/SEK', 'USD/SGD', 'AUD/NOK', 'AUD/PLN', 'AUD/SEK', 
  'AUD/SGD', 'CAD/SGD', 'CHF/SEK', 'CHF/SGD', 'EUR/CZK', 'EUR/HUF', 'EUR/NOK', 
  'EUR/PLN', 'EUR/RON', 'EUR/RUB', 'EUR/TRY', 'NOK/TRY', 'TRY/RUB',
];

export const AddTradeForm: React.FC<AddTradeFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [formData, setFormData] = useState({
    pair: 'EUR/USD',
    direction: 'long' as 'long' | 'short',
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
  const [popoverOpen, setPopoverOpen] = useState(false);


  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        tags: initialValues.tags.join(', '),
        profit: initialValues.profit?.toString() || '',
        loss: initialValues.loss?.toString() || '',
      });
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profit = formData.profit ? parseFloat(formData.profit) : null;
    const loss = formData.loss ? parseFloat(formData.loss) : null;

    const netProfit = profit ? profit : loss ? -loss : 0;
    
    const trade: Omit<Trade, 'id'> = {
      pair: formData.pair,
      direction: formData.direction,
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
          <label className="block text-sm font-medium text-muted-foreground mb-1">Currency Pair</label>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={popoverOpen}
                className="w-full justify-between bg-card border-border text-foreground hover:bg-muted hover:text-foreground"
              >
                {formData.pair}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-popover border-border">
              <Command>
                <CommandInput placeholder="Search currency pair..." className="h-9 bg-card border-border text-foreground" />
                <CommandEmpty>No currency pair found.</CommandEmpty>
                <CommandGroup>
                  {currencyPairs.map((pair) => (
                    <CommandItem
                      key={pair}
                      value={pair}
                      onSelect={(currentValue) => {
                        setFormData({ ...formData, pair: currentValue === formData.pair ? "" : currentValue });
                        setPopoverOpen(false);
                      }}
                      className="text-foreground hover:bg-muted"
                    >
                      {pair}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Direction</label>
          <select 
            value={formData.direction}
            onChange={(e) => setFormData({...formData, direction: e.target.value as 'long' | 'short'})}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Profit</label>
          <input 
            type="number" 
            step="0.01"
            value={formData.profit}
            onChange={(e) => setFormData({...formData, profit: e.target.value, loss: ''})}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
            disabled={!!formData.loss}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Loss</label>
          <input 
            type="number" 
            step="0.01"
            value={formData.loss}
            onChange={(e) => setFormData({...formData, loss: e.target.value, profit: ''})}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
            disabled={!!formData.profit}
          />
        </div>
      </div>



      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Entry Time</label>
          <input 
            type="datetime-local"
            value={formData.entryTime}
            onChange={(e) => setFormData({...formData, entryTime: e.target.value})}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Exit Time</label>
          <input 
            type="datetime-local"
            value={formData.exitTime}
            onChange={(e) => setFormData({...formData, exitTime: e.target.value})}
            className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Strategy</label>
        <input 
          type="text"
          value={formData.strategy}
          onChange={(e) => setFormData({...formData, strategy: e.target.value})}
          placeholder="e.g., Breakout, Reversal, Trend Following"
          className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Emotional State</label>
        <input 
          type="text"
          value={formData.emotionalState}
          onChange={(e) => setFormData({...formData, emotionalState: e.target.value})}
          placeholder="e.g., Confident, Anxious, Calm"
          className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Confidence (1-10): {formData.confidence}</label>
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
        <label className="block text-sm font-medium text-muted-foreground mb-1">Tags (comma-separated)</label>
        <input 
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="e.g., breakout, trend-following"
          className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
        <textarea 
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={3}
          placeholder="Detailed notes about the trade..."
          className="w-full bg-card border border-border rounded px-3 py-2 text-foreground"
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
          className="flex-1 bg-muted hover:bg-accent text-foreground px-4 py-2 rounded font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
