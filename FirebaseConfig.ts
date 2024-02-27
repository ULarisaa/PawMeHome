import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuy39RuaxlWSzd7jBzvXY_q42VCgumh_s",
  authDomain: "pawmehome.firebaseapp.com",
  projectId: "pawmehome",
  storageBucket: "pawmehome.appspot.com",
  messagingSenderId: "857705319130",
  appId: "1:857705319130:web:3367aed6ec17d2ec8633e3",
  measurementId: "G-H5NJTJ4RBB"
};

const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firestore
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Export the auth instance
export { auth };