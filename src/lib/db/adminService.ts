// src/lib/db/adminService.ts
import { firestoreDb, realtimeDb } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, push, get, update, remove } from "firebase/database";
import { AboutInfo } from "./beta";

// Utility: remove null or undefined values
const cleanupObject = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

//
// ─── FIRESTORE IMPLEMENTATION ───────────────────────────────────────────────
//
export const firestoreAdminService = {
  async getFeedback(userId: string) {
    try {
      const feedbackCol = collection(firestoreDb, "feedback");
      const q =
        userId === "all"
          ? query(feedbackCol)
          : query(feedbackCol, where("userId", "==", userId));
      const feedbackSnapshot = await getDocs(q);
      return feedbackSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching feedback (Firestore):", error);
      throw error;
    }
  },

  async addFeedbackReply(reply: any) {
    try {
      const replyCol = collection(firestoreDb, "feedback_replies");
      await addDoc(replyCol, cleanupObject(reply));
    } catch (error) {
      console.error("Error adding feedback reply (Firestore):", error);
      throw error;
    }
  },

  async getAboutInfo(): Promise<AboutInfo[]> {
    try {
      const aboutCol = collection(firestoreDb, "beta_about");
      const aboutSnapshot = await getDocs(aboutCol);
      return aboutSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AboutInfo, "id">),
      }));
    } catch (error) {
      console.error("Error fetching About Info (Firestore):", error);
      throw error;
    }
  },

  async addAboutInfo(info: any) {
    try {
      const aboutCol = collection(firestoreDb, "beta_about");
      await addDoc(aboutCol, cleanupObject(info));
    } catch (error) {
      console.error("Error adding About Info (Firestore):", error);
      throw error;
    }
  },

  async deleteAboutInfo(infoId: string): Promise<void> {
    try {
      const infoDoc = doc(firestoreDb, "beta_about", infoId);
      await deleteDoc(infoDoc);
    } catch (error) {
      console.error("Error deleting About Info (Firestore):", error);
      throw error;
    }
  },

  async updateAboutInfo(
    infoId: string,
    updates: Partial<AboutInfo>
  ): Promise<void> {
    try {
      const infoDoc = doc(firestoreDb, "beta_about", infoId);
      await updateDoc(infoDoc, cleanupObject(updates));
    } catch (error) {
      console.error("Error updating About Info (Firestore):", error);
      throw error;
    }
  },

  async updateFeedbackStatus(feedbackId: string, status: 'open' | 'cleared'): Promise<void> {
    try {
      const feedbackDoc = doc(firestoreDb, "feedback", feedbackId);
      await updateDoc(feedbackDoc, { status });
    } catch (error) {
      console.error("Error updating feedback status (Firestore):", error);
      throw error;
    }
  },
};

//
// ─── REALTIME DATABASE IMPLEMENTATION ───────────────────────────────────────
//
export const realtimeDbAdminService = {
  async getFeedback(userId: string) {
    try {
      const feedbackRef = ref(realtimeDb!, "feedback");
      const snapshot = await get(feedbackRef);
      if (!snapshot.exists()) return [];

      const allFeedback = snapshot.val();
      const feedbackList = Object.keys(allFeedback).map((key) => ({
        id: key,
        ...allFeedback[key],
      }));

      return userId === "all"
        ? feedbackList
        : feedbackList.filter((item) => item.userId === userId);
    } catch (error) {
      console.error("Error fetching feedback (Realtime DB):", error);
      throw error;
    }
  },

  async addFeedbackReply(reply: any) {
    try {
      const replyRef = ref(realtimeDb!, "feedback_replies");
      const newReplyRef = push(replyRef);
      await update(newReplyRef, cleanupObject(reply));
    } catch (error) {
      console.error("Error adding feedback reply (Realtime DB):", error);
      throw error;
    }
  },

  async getAboutInfo(): Promise<AboutInfo[]> {
    try {
      const aboutRef = ref(realtimeDb!, "beta_about");
      const snapshot = await get(aboutRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          id: key,
          ...(data[key] as Omit<AboutInfo, "id">),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching About Info (Realtime DB):", error);
      throw error;
    }
  },

  async addAboutInfo(info: any) {
    try {
      const aboutRef = ref(realtimeDb!, "beta_about");
      const newAboutRef = push(aboutRef);
      await update(newAboutRef, cleanupObject(info));
    } catch (error) {
      console.error("Error adding About Info (Realtime DB):", error);
      throw error;
    }
  },

  async deleteAboutInfo(infoId: string): Promise<void> {
    try {
      const infoRef = ref(realtimeDb!, `beta_about/${infoId}`);
      await remove(infoRef);
    } catch (error) {
      console.error("Error deleting About Info (Realtime DB):", error);
      throw error;
    }
  },

  async updateAboutInfo(
    infoId: string,
    updates: Partial<AboutInfo>
  ): Promise<void> {
    try {
      const infoRef = ref(realtimeDb!, `beta_about/${infoId}`);
      await update(infoRef, cleanupObject(updates));
    } catch (error) {
      console.error("Error updating About Info (Realtime DB):", error);
      throw error;
    }
  },

  async updateFeedbackStatus(feedbackId: string, status: 'open' | 'cleared'): Promise<void> {
    try {
      const feedbackRef = ref(realtimeDb!, `feedback/${feedbackId}`);
      await update(feedbackRef, { status });
    } catch (error) {
      console.error("Error updating feedback status (Realtime DB):", error);
      throw error;
    }
  },
};

//
// ─── SWITCHABLE SERVICE EXPORT ──────────────────────────────────────────────
//
const useRealtimeDB = true; // <--- toggle this to false to use Firestore
export const adminService = useRealtimeDB
  ? realtimeDbAdminService
  : firestoreAdminService;
