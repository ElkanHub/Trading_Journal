import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { journalService } from '@/lib/journalService';
import { useAuth } from '@/hooks/useAuth';
import { Trade } from '@/types/trade';

interface TradesContextType {
  trades: Trade[];
  loading: boolean;
  addTrade: (trade: Omit<Trade, 'id'>) => Promise<void>;
  updateTrade: (trade: Trade) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

export const TradesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrades();
    }
  }, [user]);

  const loadTrades = async () => {
    if (!user) return;
    setLoading(true);
    const tradesData = await journalService.getTrades(user.uid);
    setTrades(tradesData);
    setLoading(false);
  };

  const addTrade = async (trade: Omit<Trade, 'id'>) => {
    if (!user) {
      console.error("No user found. Cannot add trade.");
      return;
    }
    console.log("Adding trade for user:", user.uid, trade);
    try {
      const newTrade = await journalService.addTrade(user.uid, trade);
      setTrades((prevTrades) => [newTrade, ...prevTrades]);
    } catch (error) {
      console.error("Error adding trade:", error);
    }
  };

  const updateTrade = async (trade: Trade) => {
    if (!user) return;
    const updatedTrade = await journalService.updateTrade(user.uid, trade);
    setTrades((prevTrades) =>
      prevTrades.map((t) => (t.id === trade.id ? updatedTrade : t))
    );
  };

  const deleteTrade = async (id: string) => {
    if (!user) return;
    await journalService.deleteTrade(user.uid, id);
    setTrades((prevTrades) => prevTrades.filter((t) => t.id !== id));
  };

  return (
    <TradesContext.Provider value={{ trades, loading, addTrade, updateTrade, deleteTrade }}>
      {children}
    </TradesContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradesContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradesProvider');
  }
  return context;
};
