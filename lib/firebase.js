// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATHdTHrDds-jPOjKeZF3hbBjtz3q_BiOU",
  authDomain: "jackson-3c4bc.firebaseapp.com",
  projectId: "jackson-3c4bc",
  storageBucket: "jackson-3c4bc.firebasestorage.app",
  messagingSenderId: "278411577622",
  appId: "1:278411577622:web:8a8d3513f02e8fcc4c2837",
  measurementId: "G-4P2BK14180",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
