import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { getApps, initializeApp } from "firebase/app";
import React, { useRef, useState } from "react";
import AppNavigator from "./navigation/AppNavigator";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import "firebase/storage";
import { useEffect } from "react";
import { LogBox } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // console.log("🚀 ~ expoPushToken", expoPushToken); 8ykDHtQcrzTL_OwkZdASpoR_R50fMIA1oLlox7BY
  // registerNNPushToken(5883, "y2Fpo5XNuGT8eydUBIqaag");

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
