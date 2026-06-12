// ═══════════════════════════════════════════════════════════════
// Firebase Configuration
// ═══════════════════════════════════════════════════════════════
// This file initializes Firebase services (Auth + Firestore).
// Make sure to fill in your Firebase config values in the .env file.
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("AUTH DOMAIN:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log("API KEY =", import.meta.env.VITE_FIREBASE_API_KEY);
alert(import.meta.env.VITE_FIREBASE_API_KEY);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
