"use client"
import { useState, useEffect } from 'react';
import { journalService } from '@/lib/journalService';
import { useAuth } from './useAuth';
import { Trade } from '@/types/trade';

export const useTrades = () => {
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
    if (!user) return;
    const newTrade = await journalService.addTrade(user.uid, trade);
    setTrades([newTrade, ...trades]);
  };

  const updateTrade = async (trade: Trade) => {
    if (!user) return;
    const updatedTrade = await journalService.updateTrade(user.uid, trade);
    setTrades(trades.map(t => t.id === trade.id ? updatedTrade : t));
  };

  const deleteTrade = async (id: string) => {
    if (!user) return;
    await journalService.deleteTrade(user.uid, id);
    setTrades(trades.filter(t => t.id !== id));
  };

  return { trades, loading, addTrade, updateTrade, deleteTrade };
};
