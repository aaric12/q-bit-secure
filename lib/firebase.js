// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKNuz0QYF-wDbsJ6aWZn4oJs65r7wEIAs",
  authDomain: "qbit-001.firebaseapp.com",
  projectId: "qbit-001",
  storageBucket: "qbit-001.firebasestorage.app",
  messagingSenderId: "1093246267804",
  appId: "1:1093246267804:web:c4ff118096f809558f5859",
  measurementId: "G-PZCB7PV3PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };