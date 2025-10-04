// journalService.ts
import { firestoreDb, realtimeDb } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, push, get, remove, update } from 'firebase/database';
import { Trade } from '@/types/trade';

const useRealtimeDB = true; // switch to false for Firestore

// --- Firestore Implementation ---
const firestoreService = {
  async addTrade(uid: string, trade: Omit<Trade, 'id'>): Promise<Trade> {
    try {
      const docRef = await addDoc(collection(firestoreDb, `users/${uid}/trades`), trade);
      return { ...trade, id: docRef.id };
    } catch (error) {
      console.error("Error adding trade to Firestore:", error);
      throw error;
    }
  },

  async getTrades(uid: string): Promise<Trade[]> {
    try {
      const querySnapshot = await getDocs(collection(firestoreDb, `users/${uid}/trades`));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Trade[];
    } catch (error) {
      console.error("Error getting trades from Firestore:", error);
      throw error;
    }
  },

  async updateTrade(uid: string, trade: Trade): Promise<Trade> {
    try {
      const tradeRef = doc(firestoreDb, `users/${uid}/trades`, trade.id);
      await updateDoc(tradeRef, trade as Partial<Trade>);
      const updatedDoc = await getDoc(tradeRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as Trade;
    } catch (error) {
      console.error("Error updating trade in Firestore:", error);
      throw error;
    }
  },

  async deleteTrade(uid: string, tradeId: string): Promise<void> {
    try {
      const tradeRef = doc(firestoreDb, `users/${uid}/trades`, tradeId);
      await deleteDoc(tradeRef);
    } catch (error) {
      console.error("Error deleting trade from Firestore:", error);
      throw error;
    }
  }
};

// --- Realtime Database Implementation ---
const realtimeDbService = {
  async addTrade(uid: string, trade: Omit<Trade, 'id'>): Promise<Trade> {
    try {
      const tradesRef = ref(realtimeDb!, `users/${uid}/trades`);
      const newTradeRef = push(tradesRef);
      await update(newTradeRef, trade);
      return { ...trade, id: newTradeRef.key! };
    } catch (error) {
      console.error("Error adding trade to Realtime DB:", error);
      throw error;
    }
  },

  async getTrades(uid: string): Promise<Trade[]> {
    try {
      const tradesRef = ref(realtimeDb!, `users/${uid}/trades`);
      const snapshot = await get(tradesRef);
      if (snapshot.exists()) {
        const tradesData = snapshot.val();
        return Object.keys(tradesData).map(key => ({ id: key, ...tradesData[key] }));
      }
      return [];
    } catch (error) {
      console.error("Error getting trades from Realtime DB:", error);
      throw error;
    }
  },

  async updateTrade(uid: string, trade: Trade): Promise<Trade> {
    try {
      const tradeRef = ref(realtimeDb!, `users/${uid}/trades/${trade.id}`);
      await update(tradeRef, trade);
      const snapshot = await get(tradeRef);
      return { id: snapshot.key!, ...snapshot.val() };
    } catch (error) {
      console.error("Error updating trade in Realtime DB:", error);
      throw error;
    }
  },

  async deleteTrade(uid: string, tradeId: string): Promise<void> {
    try {
      const tradeRef = ref(realtimeDb!, `users/${uid}/trades/${tradeId}`);
      await remove(tradeRef);
    } catch (error) {
      console.error("Error deleting trade from Realtime DB:", error);
      throw error;
    }
  }
};

// Export the active service
export const journalService = useRealtimeDB ? realtimeDbService : firestoreService;
