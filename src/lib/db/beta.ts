
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export const getAboutInfo = async () => {
  const aboutCol = collection(db, 'beta_about');
  const aboutSnapshot = await getDocs(aboutCol);
  const aboutList = aboutSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return aboutList;
};

export const addFeedback = async (feedback: any) => {
  const feedbackCol = collection(db, 'feedback');
  await addDoc(feedbackCol, feedback);
};

export const getFeedback = async (userId: string) => {
  const feedbackCol = collection(db, 'feedback');
  let q;
  if (userId === 'all') {
    q = query(feedbackCol);
  } else {
    q = query(feedbackCol, where('userId', '==', userId));
  }
  const feedbackSnapshot = await getDocs(q);
  const feedbackList = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return feedbackList;
};

export const addFeedbackReply = async (reply: any) => {
  const replyCol = collection(db, 'feedback_replies');
  await addDoc(replyCol, reply);
};

export const addAboutInfo = async (info: any) => {
  const aboutCol = collection(db, 'beta_about');
  await addDoc(aboutCol, info);
};
