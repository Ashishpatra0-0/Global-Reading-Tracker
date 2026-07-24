import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXPNeThpfXmbvBXquXAsiIYDG7GtyCoEE",
  authDomain: "global-reading-tracker.firebaseapp.com",
  projectId: "global-reading-tracker",
  storageBucket: "global-reading-tracker.firebasestorage.app",
  messagingSenderId: "176417361252",
  appId: "1:176417361252:web:0a6c1a42a0d7bd6200be71",
  measurementId: "G-ZTSMYDVZRK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);