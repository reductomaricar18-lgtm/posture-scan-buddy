import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9LQ6ftsg-N5KeDPB_Fa07g9Fb-LBjenE",
  authDomain: "posture-scan-buddy.firebaseapp.com",
  databaseURL: "https://posture-scan-buddy-default-rtdb.firebaseio.com/",
  projectId: "posture-scan-buddy",
  storageBucket: "posture-scan-buddy.firebasestorage.app",
  messagingSenderId: "894654085196",
  appId: "1:894654085196:web:a37574ef3d81def8fa1ce9",
  measurementId: "G-WFBJJJ80SC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Realtime Database and get a reference to the service
export const rtdb = getDatabase(app);

// Initialize Firebase Analytics (optional - only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
