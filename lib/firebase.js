import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDy8YS-ptZHcK5YJc4FZgWzvcxuyNUlbv8",
  authDomain: "edulingo-f0f60.firebaseapp.com",
  projectId: "edulingo-f0f60",
  storageBucket: "edulingo-f0f60.firebasestorage.app",
  messagingSenderId: "748949119554",
  appId: "1:748949119554:web:f339d05a87ee68fe8d83db",
  measurementId: "G-MKHVLG14PN"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi layanan Firebase yang dibutuhkan
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;