// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATHdTHrDds-jPOjKeZF3hbBjtz3q_BiOU",
  authDomain: "jackson-3c4bc.firebaseapp.com",
  projectId: "jackson-3c4bc",
  storageBucket: "jackson-3c4bc.firebasestorage.app",
  messagingSenderId: "278411577622",
  appId: "1:278411577622:web:8a8d3513f02e8fcc4c2837",
};

// Force initialize or get existing
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// LOG THIS TO YOUR CONSOLE TO VERIFY IT IS WORKING
console.log("🔥 Firebase check - Project ID is:", app.options.projectId);

export const auth = getAuth(app);
