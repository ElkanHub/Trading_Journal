// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLbUs_-4pLNUejVEi65z9XUTadCQasKyc",
  authDomain: "trading-journal-55d40.firebaseapp.com",
  projectId: "trading-journal-55d40",
  storageBucket: "trading-journal-55d40.firebasestorage.app",
  messagingSenderId: "680262209513",
  appId: "1:680262209513:web:07fa366212fb7b6d028578",
  measurementId: "G-W4PSWGEE4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);