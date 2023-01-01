import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { LogBox } from "react-native";
import { UserProvider } from "../config/UserContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Local_Home from "../Screens/Local_Home";
import TourDetail from "../Screens/Local/TourDetail";
import TourDetailedInformation from "../Screens/Local/TourDetailedInformation";
import EditTour from "../Screens/Local/EditTour";
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
/*const PUBLISHABLE_KEY =
  "pk_test_51Ll5efFetd1JSL8vQ1WpbGvxBewQSJi8ZUzB6WD0i19CUUkzdnaHAQzja4LNFMZpUWAZKUPTdSklL2KZSI1k9Qfy00MZ31WOSr";*/
function TourStack() {
  // hide logbox warning
  React.useEffect(() => {
    LogBox.ignoreLogs([
      "Warning: Async Storage has been extracted from react-native core",
    ]);
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TourDetail" component={TourDetail} />
      <Stack.Screen name="TourDetailedInformation" component={TourDetailedInformation} />
      <Stack.Screen name="EditTour" component={EditTour} />

    </Stack.Navigator>
  );
}

export default TourStack;
