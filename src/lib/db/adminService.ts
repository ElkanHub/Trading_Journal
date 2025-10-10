// src/lib/db/adminService.ts
import { firestoreDb, realtimeDb } from '../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { ref, push, get, child } from 'firebase/database';

// --- Firestore Implementation ---
export const firestoreAdminService = {
  async getFeedback(userId: string) {
    const feedbackCol = collection(firestoreDb, 'feedback');
    let q;
    if (userId === 'all') {
      q = query(feedbackCol);
    } else {
      q = query(feedbackCol, where('userId', '==', userId));
    }
    const feedbackSnapshot = await getDocs(q);
    const feedbackList = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return feedbackList;
  },

  async addFeedbackReply(reply: any) {
    const replyCol = collection(firestoreDb, 'feedback_replies');
    await addDoc(replyCol, reply);
  },

  async addAboutInfo(info: any) {
    const aboutCol = collection(firestoreDb, 'beta_about');
    await addDoc(aboutCol, info);
  }
};

// --- Realtime Database Implementation ---
export const realtimeDbAdminService = {
  async getFeedback(userId: string) {
    const feedbackRef = ref(realtimeDb, 'feedback');
    const snapshot = await get(feedbackRef);
    if (snapshot.exists()) {
      const allFeedback = snapshot.val();
      if (userId === 'all') {
        return Object.keys(allFeedback).map(key => ({ id: key, ...allFeedback[key] }));
      } else {
        const userFeedback: any[] = [];
        Object.keys(allFeedback).forEach(key => {
          if (allFeedback[key].userId === userId) {
            userFeedback.push({ id: key, ...allFeedback[key] });
          }
        });
        return userFeedback;
      }
    }
    return [];
  },

  async addFeedbackReply(reply: any) {
    const replyRef = ref(realtimeDb, 'feedback_replies');
    const newReplyRef = push(replyRef);
    await push(newReplyRef, reply);
  },

  async addAboutInfo(info: any) {
    const aboutRef = ref(realtimeDb, 'beta_about');
    const newAboutRef = push(aboutRef);
    await push(newAboutRef, info);
  }
};