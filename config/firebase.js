// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref } from "firebase/storage";

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

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const storage = getStorage(app);
const storageRef = ref(storage);

export { db, auth, storageRef };
export default app;
