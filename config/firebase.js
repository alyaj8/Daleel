// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBmeUtWA3YfmlcB5YD6XArIhoOiFbtx9TI",
    authDomain: "daleel-db.firebaseapp.com",
    projectId: "daleel-db",
    storageBucket: "daleel-db.appspot.com",
    messagingSenderId: "602896000538",
    appId: "1:602896000538:web:478f3d40b90af9caf093a3",
    measurementId: "G-56DGNG2KLW",
  };
  
export const setPassword = (email) => {
  return firebase.auth().sendPasswordResetEmail(email);
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
export default app;
