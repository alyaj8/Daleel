import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import LocalHomeStack from "./LocalHomeStack";
import TourStack from "./TourStack";

import ChatMenu from "../Screens/chatScreen/ChatMenu";
import Local_Manage_Account from "../Screens/Local/Local_Manage_Account";
import PostTour from "../Screens/Local/PostTour";

import { images } from "../config/Constant";
const Tab = createBottomTabNavigator();

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
                color: focused ? "#03989e" : "black",
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
                  tintColor: focused ? "#03989e" : "black",
                }}
              />
            </View>
          ),
        }}
        name="Home"
        component={LocalHomeStack}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? "#03989e" : "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              جولاتي
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
                  tintColor: focused ? "#03989e" : "black",
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
                color: focused ? "#03989e" : "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              نشر
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[Styles.plusTab, { ...Styles.iconView }]}>
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
        component={PostTour}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? "#03989e" : "black",
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
                  tintColor: focused ? "#03989e" : "black",
                }}
              />
            </View>
          ),
        }}
        name="ChatMenu"
        component={ChatMenu}
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? "#03989e" : "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              حسابي
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
                  tintColor: focused ? "#03989e" : "black",
                }}
              />
            </View>
          ),
        }}
        name="Local_Manage_Account"
        component={Local_Manage_Account}
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
  plusTab: {
    width: 55,
    height: 55,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginBottom: 30,
  },
});
