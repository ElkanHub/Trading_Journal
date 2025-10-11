// src/lib/db/beta.ts
import { firestoreDb, realtimeDb } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { ref, push, get, update } from "firebase/database";

// Utility to remove null or undefined fields
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
export const firestoreBetaService = {
  async getAboutInfo() {
    try {
      const aboutCol = collection(firestoreDb, "beta_about");
      const aboutSnapshot = await getDocs(aboutCol);
      return aboutSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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

  async addFeedback(feedback: any) {
    try {
      const feedbackCol = collection(firestoreDb, "feedback");
      await addDoc(feedbackCol, cleanupObject(feedback));
    } catch (error) {
      console.error("Error adding feedback (Firestore):", error);
      throw error;
    }
  },

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
};

//
// ─── REALTIME DATABASE IMPLEMENTATION ─────────────────────────────────────────
//
export const realtimeBetaService = {
  async getAboutInfo() {
    try {
      const aboutRef = ref(realtimeDb!, "beta_about");
      const snapshot = await get(aboutRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
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

  async addFeedback(feedback: any) {
    try {
      const feedbackRef = ref(realtimeDb!, "feedback");
      const newFeedbackRef = push(feedbackRef);
      await update(newFeedbackRef, cleanupObject(feedback));
    } catch (error) {
      console.error("Error adding feedback (Realtime DB):", error);
      throw error;
    }
  },

  async getFeedback(userId: string) {
    try {
      const feedbackRef = ref(realtimeDb!, "feedback");
      const snapshot = await get(feedbackRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const feedbackList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        if (userId === "all") return feedbackList;
        return feedbackList.filter((item) => item.userId === userId);
      }
      return [];
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
};
