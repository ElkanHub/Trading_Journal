import { firestoreDb, realtimeDb } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, push, get, remove, update, child } from 'firebase/database';
import { Trade } from '@/types/trade';

const useRealtimeDB = true; // Set to false to switch to Firestore

// --- Firestore Implementation (Inactive) ---
const firestoreService = {
  async addTrade(uid: string, trade: Omit<Trade, 'id'>): Promise<Trade> {
    console.warn("Firestore is not active. Billing needs to be enabled.");
    const docRef = await addDoc(collection(firestoreDb, `users/${uid}/trades`), trade);
    return { ...trade, id: docRef.id };
  },

  async getTrades(uid: string): Promise<Trade[]> {
    console.warn("Firestore is not active. Billing needs to be enabled.");
    const querySnapshot = await getDocs(collection(firestoreDb, `users/${uid}/trades`));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Trade[];
  },

  async updateTrade(uid: string, tradeId: string, trade: Partial<Trade>): Promise<void> {
    console.warn("Firestore is not active. Billing needs to be enabled.");
    const tradeRef = doc(firestoreDb, `users/${uid}/trades`, tradeId);
    return await updateDoc(tradeRef, trade);
  },

  async deleteTrade(uid: string, tradeId: string): Promise<void> {
    console.warn("Firestore is not active. Billing needs to be enabled.");
    const tradeRef = doc(firestoreDb, `users/${uid}/trades`, tradeId);
    return await deleteDoc(tradeRef);
  }
};

// --- Realtime Database Implementation (Active) ---
const realtimeDbService = {
  async addTrade(uid: string, trade: Omit<Trade, 'id'>): Promise<Trade> {
    const tradesRef = ref(realtimeDb, `users/${uid}/trades`);
    const newTradeRef = push(tradesRef);
    await update(newTradeRef, trade);
    return { ...trade, id: newTradeRef.key! };
  },

  async getTrades(uid: string): Promise<Trade[]> {
    const tradesRef = ref(realtimeDb, `users/${uid}/trades`);
    const snapshot = await get(tradesRef);
    if (snapshot.exists()) {
      const tradesData = snapshot.val();
      return Object.keys(tradesData).map(key => ({ id: key, ...tradesData[key] }));
    }
    return [];
  },

  async updateTrade(uid: string, tradeId: string, trade: Partial<Trade>): Promise<void> {
    const tradeRef = ref(realtimeDb, `users/${uid}/trades/${tradeId}`);
    return await update(tradeRef, trade);
  },

  async deleteTrade(uid: string, tradeId: string): Promise<void> {
    const tradeRef = ref(realtimeDb, `users/${uid}/trades/${tradeId}`);
    return await remove(tradeRef);
  }
};

export const journalService = useRealtimeDB ? realtimeDbService : firestoreService;
