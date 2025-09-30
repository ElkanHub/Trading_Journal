// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: It is recommended to use environment variables for Firebase configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLbUs_-4pLNUejVEi65z9XUTadCQasKyc",
  authDomain: "trading-journal-55d40.firebaseapp.com",
  projectId: "trading-journal-55d40",
  storageBucket: "trading-journal-55d40.appspot.com",
  messagingSenderId: "680262209513",
  appId: "1:680262209513:web:07fa366212fb7b6d028578",
  measurementId: "G-W4PSWGEE4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(atool_code);
export const auth = getAuth(app);
export const db = getFirestore(app);