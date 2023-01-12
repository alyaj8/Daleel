import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { initializeApp, getApps } from "firebase/app";
import { StripeProvider } from "@stripe/stripe-react-native";
import StripeApp from "./Screens/tourist/StripeApp";

import "firebase/storage";

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

  return (
    <StripeProvider publishableKey="pk_test_51Ll5efFetd1JSL8vQ1WpbGvxBewQSJi8ZUzB6WD0i19CUUkzdnaHAQzja4LNFMZpUWAZKUPTdSklL2KZSI1k9Qfy00MZ31WOSr">

      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>

    </StripeProvider>

  );
}

export default App;

