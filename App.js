import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from "react";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { LogBox } from "react-native";
import { UserProvider } from "./config/UserContext";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Tourist_Home from './Screens/Tourist_Home'
import Sign_up from './Screens/Sign_up'
import Log_in from './Screens/Log_in'
import Log_in2 from './Screens/Log_in2'


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
function App() {
  // hide logbox warning
  React.useEffect(() => {
    LogBox.ignoreLogs([
      "Warning: Async Storage has been extracted from react-native core",
    ]);
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Log_in2"
      >
        <Stack.Screen name="Sign_up" component={Sign_up} />
        <Stack.Screen name="Log_in" component={Log_in} />
        <Stack.Screen name="Log_in2" component={Log_in2} />
        <Stack.Screen name="Tourist_Home" component={Tourist_Home} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}
/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})*/
export default App;
