import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace these with your Firebase project credentials
// Get these from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(
  value => typeof value === 'string' && value.trim() !== ''
);

// Initialize Firebase only when the required environment variables are present.
// This keeps the app from crashing during module load in environments without Firebase setup.
let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);

  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);

  // Initialize Cloud Storage and get a reference to the service
  storage = getStorage(app);
}

export { auth, db, storage, isFirebaseConfigured };

export default app;
