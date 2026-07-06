import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAylmBnttNSs5URFclexeiCBGQ-TdnnICU",
  authDomain: "texawave-website.firebaseapp.com",
  databaseURL: "https://texawave-website-default-rtdb.firebaseio.com",
  projectId: "texawave-website",
  storageBucket: "texawave-website.firebasestorage.app",
  messagingSenderId: "974420032729",
  appId: "1:974420032729:web:e47c43c1f1eb213f3bd2c8"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db, firebaseConfig };
