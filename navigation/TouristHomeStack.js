import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { LogBox } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Tourist_Home from "../Screens/Tourist_Home.js"
const Stack = createNativeStackNavigator();
const firebaseConfig = {
  apiKey: "AIzaSyBmeUtWA3YfmlcB5YD6XArIhoOiFbtx9TI",
  authDomain: "daleel-db.firebaseapp.com",
  projectId: "daleel-db",
  storageBucket: "daleel-db.appspot.com",
  messagingSenderId: "602896000538",
  appId: "1:602896000538:web:478f3d40b90af9caf093a3",
  measurementId: "G-56DGNG2KLW",
};
initializeApp(firebaseConfig);
function App() {
  React.useEffect(() => {
    LogBox.ignoreLogs([
      "Warning: Async Storage has been extracted from react-native core",
    ]);
  }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tourist_Home" component={Tourist_Home} />

      
    </Stack.Navigator>
  );
}
export default App;
