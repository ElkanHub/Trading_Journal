// journalService.ts
import { firestoreDb, realtimeDb } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, push, get, remove, update } from 'firebase/database';
import { Trade } from '@/types/trade';

const useRealtimeDB = true; // switch to false for Firestore

// --- Firestore Implementation ---
const firestoreService = {
  async addTrade(uid: string, trade: Omit<Trade, 'id'>): Promise<Trade> {
    const docRef = await addDoc(collection(firestoreDb, `users/${uid}/trades`), trade);
    return { ...trade, id: docRef.id };
  },

  async getTrades(uid: string): Promise<Trade[]> {
    const querySnapshot = await getDocs(collection(firestoreDb, `users/${uid}/trades`));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Trade[];
  },

  async updateTrade(uid: string, trade: Trade): Promise<Trade> {
    const tradeRef = doc(firestoreDb, `users/${uid}/trades`, trade.id);
    await updateDoc(tradeRef, trade as Partial<Trade>);
    const updatedDoc = await getDoc(tradeRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Trade;
  },

  async deleteTrade(uid: string, tradeId: string): Promise<void> {
    const tradeRef = doc(firestoreDb, `users/${uid}/trades`, tradeId);
    return await deleteDoc(tradeRef);
  }
};

// --- Realtime Database Implementation ---
const realtimeDbService = {
  async addTrade(uid: string, trade: Omit<Trade, 'id'>): Promise<Trade> {
    const tradesRef = ref(realtimeDb!, `users/${uid}/trades`);
    const newTradeRef = push(tradesRef);
    await update(newTradeRef, trade);
    return { ...trade, id: newTradeRef.key! };
  },

  async getTrades(uid: string): Promise<Trade[]> {
    const tradesRef = ref(realtimeDb!, `users/${uid}/trades`);
    const snapshot = await get(tradesRef);
    if (snapshot.exists()) {
      const tradesData = snapshot.val();
      return Object.keys(tradesData).map(key => ({ id: key, ...tradesData[key] }));
    }
    return [];
  },

  async updateTrade(uid: string, trade: Trade): Promise<Trade> {
    const tradeRef = ref(realtimeDb!, `users/${uid}/trades/${trade.id}`);
    await update(tradeRef, trade);
    const snapshot = await get(tradeRef);
    return { id: snapshot.key!, ...snapshot.val() };
  },

  async deleteTrade(uid: string, tradeId: string): Promise<void> {
    const tradeRef = ref(realtimeDb!, `users/${uid}/trades/${tradeId}`);
    return await remove(tradeRef);
  }
};

// Export the active service
export const journalService = useRealtimeDB ? realtimeDbService : firestoreService;
