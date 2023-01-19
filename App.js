import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { getApps, initializeApp } from "firebase/app";
import React from "react";
import AppNavigator from "./navigation/AppNavigator";

import "firebase/storage";
import { useEffect } from "react";
import { LogBox } from "react-native";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyBmeUtWA3YfmlcB5YD6XArIhoOiFbtx9TI",
    authDomain: "daleel-db.firebaseapp.com",
    projectId: "daleel-db",
    storageBucket: "daleel-db.appspot.com",
    messagingSenderId: "602896000538",
    appId: "1:602896000538:web:478f3d40b90af9caf093a3",
    measurementId: "G-56DGNG2KLW",
  };

  if (getApps.length === 0) {
    initializeApp(firebaseConfig);
  }

  // hide  WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
  useEffect(() => {
    LogBox.ignoreLogs(["new NativeEventEmitter"]); // Ignore log notification by message
    // LogBox.ignoreAllLogs(); //Ignore all log notifications
  }, []); //

  return (
    <StripeProvider publishableKey="pk_test_51Ll5efFetd1JSL8vQ1WpbGvxBewQSJi8ZUzB6WD0i19CUUkzdnaHAQzja4LNFMZpUWAZKUPTdSklL2KZSI1k9Qfy00MZ31WOSr">
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </StripeProvider>
  );
}

export default App;
