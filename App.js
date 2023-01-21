import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { getApps, initializeApp } from "firebase/app";
import registerNNPushToken from "native-notify";
import React from "react";
import AppNavigator from "./navigation/AppNavigator";

import "firebase/storage";
import { useEffect } from "react";
import { LogBox } from "react-native";

function App() {
  registerNNPushToken(5883, "y2Fpo5XNuGT8eydUBIqaag");

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

  if (getApps.length === 0) {
    initializeApp(firebaseConfig);
  }

  // hide  WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
  useEffect(() => {
    LogBox.ignoreLogs(["new NativeEventEmitter"]); // Ignore log notification by message
    LogBox.ignoreAllLogs(); //Ignore all log notifications
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
