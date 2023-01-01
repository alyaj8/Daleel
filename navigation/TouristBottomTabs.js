import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import * as React from "react";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TouristHomeStack from "./TouristHomeStack";
import TourStack from "./TouristTourStack";


import PostTour from "../Screens/Local/PostTour";
import TouristDetail from "../Screens/tourist/TouristDetail";
import TourDetail from "../Screens/Local/TourDetail";
import Tourist_Account from "../Screens/Tourist_Account";




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
                color:focused? '#03989e': "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              طلباتی
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              <Image
                source={images.mark}
                style={{
                   width: 20,
                    height: 20, 
                    resizeMode: "contain",
                  tintColor:focused? '#03989e': "black",


                   }}
              />
            </View>
          ),
        }}
        name="Home"
        component={TouristHomeStack}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color:focused? '#03989e': "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
         الجولات
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              <Image
                source={images.location}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  tintColor:focused? '#03989e': "black",
                }}
              />
            </View>
          ),
        }}
        name="TourStack"
        component={TourStack}
      />
        <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color:focused? '#03989e': "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
            
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[Styles.plusTab,{ ...Styles.iconView }]}>
              <Image
                source={images.add}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: "#03989e",
                }}
              />
            </View>
          ),
        }}
        name="PostSearch"
        component={Tourist_Account}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color:focused? '#03989e': "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
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
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  tintColor:focused? '#03989e': "black",

                }}
              />
            </View>
          ),
        }}
        name="ChatMenu"
        component={Tourist_Account}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused? '#03989e': "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
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
                  tintColor:focused? '#03989e': "black",

                }}
              />
            </View>
          ),
        }}
        name="Profile"
        component={Tourist_Account}
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
  plusTab:{
    width:55,
    height:55,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
    marginBottom:30,
  }
});
