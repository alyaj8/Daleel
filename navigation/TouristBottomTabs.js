import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import * as React from "react";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LocalHomeStack from "../navigation/LocalHomeStack";
import TouristHomeStack from "../navigation/TouristHomeStack";
import TouristDetail from "../Screens/tourist/TouristDetail";
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
/*const PUBLISHABLE_KEY =
  "pk_test_51Ll5efFetd1JSL8vQ1WpbGvxBewQSJi8ZUzB6WD0i19CUUkzdnaHAQzja4LNFMZpUWAZKUPTdSklL2KZSI1k9Qfy00MZ31WOSr";*/
function TouristBottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarActiveTintColor: '#002733',
        headerShown: false,
        // tabBarShowLabel:false,

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
                color: focused? "#5398a0":  "black",
                fontSize:focused? 14: 12,
                fontWeight: focused ? "900" : "normal",
              }}
            >
              طلباتی
            </Text>
          ),

          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              <Image
                source={images.mark}
                style={{ width: 20, height: 20, resizeMode: "contain", tintColor: focused? "#5398a0":  "black",  }}
              />
            </View>
          ),
          // tabBarButton
        }}
        name="TouristHomeStack"
        component={TouristHomeStack}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused? "#5398a0":  "black",
                fontSize: focused? 14: 12,
                fontWeight: focused ? "900" : "normal",
              }}
            >
              جولاتي
            </Text>
          ),

          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              {/* <Tab col={focused ? '#0118B5' : 'white'} /> */}
              <Image
                source={images.location}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  tintColor: focused? "#5398a0":  "black",
                }}
              />
            </View>
          ),
          // tabBarButton
        }}
        name="LocalHomeStack"
        component={LocalHomeStack}
      />
      
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused? "#5398a0":  "black",
                fontSize:focused? 14: 12,
                fontWeight: focused ? "900" : "normal",
              }}
            >
              رسائلي
            </Text>
          ),

          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              {/* <Tab col={focused ? '#0118B5' : 'white'} /> */}
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
          // tabBarButton
        }}
        name="Chat"
        component={LocalHomeStack}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused? "#5398a0":  "black",
                fontSize:focused? 14: 12,
                fontWeight: focused ? "900" : "normal",
              }}
            >
              ملفي
            </Text>
          ),

          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              {/* <Tab col={focused ? '#0118B5' : 'white'} /> */}
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
          // tabBarButton
        }}
        name="TouristDetail"
        component={TouristDetail}
      />
    </Tab.Navigator>
  );
}
export default TouristBottomTab;
const Styles = StyleSheet.create({
  
  bg: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
