// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgdKRkmLHv9qxrf_90ol6LKdekQAhP1Ks",
  authDomain: "ecom-proj1-70b9c.firebaseapp.com",
  projectId: "ecom-proj1-70b9c",
  storageBucket: "ecom-proj1-70b9c.firebasestorage.app",
  messagingSenderId: "644085462749",
  appId: "1:644085462749:web:70be16c33e161ce3f34d34",
  measurementId: "G-EBCKMMBR14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)
const WEB_CLIENT_ID = "644085462749-s7eaf0n5r2l6sg6a06nmutopo692bqi0.apps.googleusercontent.com"

export { app, db, auth, WEB_CLIENT_ID }