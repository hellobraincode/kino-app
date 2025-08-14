// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQCVnBWzWYxtcahv_y4DeRtFxSuxJlAJk",
  authDomain: "kino-web-7d98c.firebaseapp.com",
  projectId: "kino-web-7d98c",
  storageBucket: "kino-web-7d98c.firebasestorage.app",
  messagingSenderId: "350705885395",
  appId: "1:350705885395:web:d8bbaa96993dd2ee457426"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
