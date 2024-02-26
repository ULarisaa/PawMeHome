// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB=getFirestore(FIREBASE_APP);