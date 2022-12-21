import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import * as React from "react";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LocalHomeStack from "./LocalHomeStack";
import PostTour from "../Screens/Local/PostTour";
import { images } from "../config/Constant";
const Tab = createBottomTabNavigator();
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
function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          tabBarHideOnKeyboard: true,
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: "black",
                fontSize:focused? 14: 12,
                fontWeight: focused ? "900" : "normal",
                color: focused ? "#5398a0" : "black",
              }}
            >
              طلباتی
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              <Image
                source={images.mark}
                style={{ width: 20, height: 20, resizeMode: "contain" , tintColor: focused? "#5398a0":  "black", }}
              />
            </View>
          ),
        }}
        name="Home"
        component={PostTour}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: "black",
                fontSize:focused? 14: 12,
                fontWeight: focused ? "900" : "normal",
                color: focused ? "#5398a0" : "black",
              }}
            >
              جولاتي
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              <Image
                source={images.chat}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  tintColor: focused? "#5398a0":  "black", 
                }}
              />
            </View>
          ),
        }}
        name="PostTour"
        component={PostTour}
      />
      
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: "black",
                fontSize:focused? 14: 12 , 
                fontWeight: focused ? "900" : "normal",
                color: focused ? "#5398a0" : "black",
              }}
            >
              رسائلي
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              <Image
                source={images.chat}
                style={{
                  width:  20,
                  height: 20,
                  resizeMode: "contain",
                  tintColor: focused? "#5398a0":  "black", 
                }}
              />
            </View>
          ),
        }}
        name="Chat"
        component={PostTour}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: "black",
                fontSize: focused? 14: 12,
                fontWeight: focused ? "900" : "normal",
                color: focused? "#5398a0":  "black", 
              }}
            >
              ملفي
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              <Image
                source={images.profile}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  tintColor: focused? "#5398a0":  "black", 
                }}
              />
            </View>
          ),
        }}
        name="profile"
        component={PostTour}
      />
    </Tab.Navigator>
  );
}
export default BottomTab;
const Styles = StyleSheet.create({
  bg: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
