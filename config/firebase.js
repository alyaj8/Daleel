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
  apiKey: "AIzaSyDjm28EdyiBlBasDjMnKwX7IvemgWe-wug",
  authDomain: "daleel-app-47289.firebaseapp.com",
  databaseURL: "https://daleel-app-47289-default-rtdb.firebaseio.com",
  projectId: "daleel-app-47289",
  storageBucket: "daleel-app-47289.appspot.com",
  messagingSenderId: "135173890004",
  appId: "1:135173890004:web:97df8f1f87cc5fa11d4041",
  measurementId: "G-GTFJNGMZMF",
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
