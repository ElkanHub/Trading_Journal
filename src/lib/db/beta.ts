// src/lib/db/beta.ts
import { firestoreDb, realtimeDb } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { ref, push, get, update } from "firebase/database";

export interface Reply {
  feedbackId: string;
  reply: string;
  createdAt: Date;
}

export interface FeedbackData {
  id: string;
  userId: string;
  feedback: string;
  featureRequest?: string;
  createdAt: Date;
  replies?: Reply[];
}

export interface AboutInfo {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isNew: boolean;
}

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
  async getAboutInfo(): Promise<AboutInfo[]> {
    try {
      const aboutCol = collection(firestoreDb, "beta_about");
      const aboutSnapshot = await getDocs(aboutCol);
      return aboutSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AboutInfo, 'id'>),
      }));
    } catch (error) {
      console.error("Error fetching About Info (Firestore):", error);
      throw error;
    }
  },

  async addAboutInfo(info: Omit<AboutInfo, 'id'>) {
    try {
      const aboutCol = collection(firestoreDb, "beta_about");
      await addDoc(aboutCol, cleanupObject(info));
    } catch (error) {
      console.error("Error adding About Info (Firestore):", error);
      throw error;
    }
  },

  async addFeedback(feedback: Omit<FeedbackData, 'id'>) {
    try {
      const feedbackCol = collection(firestoreDb, "feedback");
      await addDoc(feedbackCol, cleanupObject(feedback));
    } catch (error) {
      console.error("Error adding feedback (Firestore):", error);
      throw error;
    }
  },

  async getFeedback(userId: string): Promise<FeedbackData[]> {
    try {
      const feedbackCol = collection(firestoreDb, "feedback");
      const q =
        userId === "all"
          ? query(feedbackCol)
          : query(feedbackCol, where("userId", "==", userId));
      const feedbackSnapshot = await getDocs(q);

      const feedbackList = await Promise.all(feedbackSnapshot.docs.map(async (doc) => {
        const feedbackData = doc.data() as Omit<FeedbackData, 'id' | 'replies'>;
        const repliesCol = collection(firestoreDb, "feedback_replies");
        const repliesQuery = query(repliesCol, where("feedbackId", "==", doc.id));
        const repliesSnapshot = await getDocs(repliesQuery);
        const replies = repliesSnapshot.docs.map(replyDoc => replyDoc.data() as Reply);
        return {
          id: doc.id,
          ...feedbackData,
          replies,
        };
      }));

      return feedbackList;
    } catch (error) {
      console.error("Error fetching feedback (Firestore):", error);
      throw error;
    }
  },

  async addFeedbackReply(reply: Reply) {
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
  async getAboutInfo(): Promise<AboutInfo[]> {
    try {
      const aboutRef = ref(realtimeDb!, "beta_about");
      const snapshot = await get(aboutRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({ id: key, ...(data[key] as Omit<AboutInfo, 'id'>) }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching About Info (Realtime DB):", error);
      throw error;
    }
  },

  async addAboutInfo(info: Omit<AboutInfo, 'id'>) {
    try {
      const aboutRef = ref(realtimeDb!, "beta_about");
      const newAboutRef = push(aboutRef);
      await update(newAboutRef, cleanupObject(info));
    } catch (error) {
      console.error("Error adding About Info (Realtime DB):", error);
      throw error;
    }
  },

  async addFeedback(feedback: Omit<FeedbackData, 'id'>) {
    try {
      const feedbackRef = ref(realtimeDb!, "feedback");
      const newFeedbackRef = push(feedbackRef);
      await update(newFeedbackRef, cleanupObject(feedback));
    } catch (error) {
      console.error("Error adding feedback (Realtime DB):", error);
      throw error;
    }
  },

  async getFeedback(userId: string): Promise<FeedbackData[]> {
    try {
      const feedbackRef = ref(realtimeDb!, "feedback");
      const snapshot = await get(feedbackRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        let feedbackList: FeedbackData[] = Object.keys(data).map((key) => ({
          id: key,
          ...(data[key] as Omit<FeedbackData, 'id'>),
        }));

        const repliesRef = ref(realtimeDb!, "feedback_replies");
        const repliesSnapshot = await get(repliesRef);
        if (repliesSnapshot.exists()) {
          const repliesData = repliesSnapshot.val();
          const repliesByFeedbackId: {[key: string]: Reply[]} = Object.values(repliesData).reduce((acc: {[key: string]: Reply[]}, reply: any) => {
            const r = reply as Reply;
            if (!acc[r.feedbackId]) {
              acc[r.feedbackId] = [];
            }
            acc[r.feedbackId].push(r);
            return acc;
          }, {});

          feedbackList = feedbackList.map(feedback => ({
            ...feedback,
            replies: repliesByFeedbackId[feedback.id] || [],
          }));
        }

        if (userId === "all") return feedbackList;
        return feedbackList.filter((item) => item.userId === userId);
      }
      return [];
    } catch (error) {
      console.error("Error fetching feedback (Realtime DB):", error);
      throw error;
    }
  },

  async addFeedbackReply(reply: Reply) {
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


// Choose which database implementation to use:
const useRealtimeDB = true; // change to true if you want realtime db

export const getAboutInfo = useRealtimeDB
  ? realtimeBetaService.getAboutInfo
  : firestoreBetaService.getAboutInfo;

export const addAboutInfo = useRealtimeDB
  ? realtimeBetaService.addAboutInfo
  : firestoreBetaService.addAboutInfo;

export const getFeedback = useRealtimeDB
  ? realtimeBetaService.getFeedback
  : firestoreBetaService.getFeedback;

export const addFeedback = useRealtimeDB
  ? realtimeBetaService.addFeedback
  : firestoreBetaService.addFeedback;

export const addFeedbackReply = useRealtimeDB
  ? realtimeBetaService.addFeedbackReply
  : firestoreBetaService.addFeedbackReply;
