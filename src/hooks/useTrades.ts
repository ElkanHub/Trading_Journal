import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trade } from '@/types/trade';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    const querySnapshot = await getDocs(collection(db, 'trades'));
    const tradesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Trade[];
    setTrades(tradesData);
    setLoading(false);
  };

  const addTrade = async (trade: Omit<Trade, 'id'>) => {
    const docRef = await addDoc(collection(db, 'trades'), trade);
    setTrades([{ ...trade, id: docRef.id }, ...trades]);
  };

  const deleteTrade = async (id: string) => {
    await deleteDoc(doc(db, 'trades', id));
    setTrades(trades.filter(t => t.id !== id));
  };

  return { trades, loading, addTrade, deleteTrade };
};
