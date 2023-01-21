import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import TouristHomeStack from "./TouristHomeStack";
import TourStack from "./TouristTourStack";

import ChatMenu from "./../Screens/chatScreen/ChatMenu";
import Tourist_Manage_Account from "./../Screens/tourist/Tourist_Manage_Account";

import { colors, images } from "../config/Constant";
const Tab = createBottomTabNavigator();

export default function TouristBottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          tabBarHideOnKeyboard: true,
        },
      }}
    >
      {/* طلباتي */}
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.brown : "black",
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
                  tintColor: focused ? colors.brown : "black",
                }}
              />
            </View>
          ),
        }}
        name="Home"
        component={TouristHomeStack}
      />

      {/* الجولات */}
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.brown : "black",
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
                  tintColor: focused ? colors.brown : "black",
                }}
              />
            </View>
          ),
        }}
        name="TourStack"
        component={TourStack}
      />

      {/* البحث */}
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.brown : "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              البحث
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[Styles.plusTabDiv, { ...Styles.iconView }]}>
              <View style={[Styles.plusTab, { ...Styles.iconView }]}>
                <Image
                  source={images.search}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: focused ? colors.brown : "black",
                  }}
                />
              </View>
            </View>
          ),
        }}
        name="PostSearch"
        component={TourStack}
      />

      {/* رسائلي */}
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.brown : "black",
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
                  tintColor: focused ? colors.brown : "black",
                }}
              />
            </View>
          ),
        }}
        name="ChatMenu"
        component={ChatMenu}
      />

      {/* حسابي */}
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.brown : "black",
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
                  tintColor: focused ? colors.brown : "black",
                }}
              />
            </View>
          ),
        }}
        name="Profile"
        component={Tourist_Manage_Account}
      />
    </Tab.Navigator>
  );
}
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
