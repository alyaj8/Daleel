import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import TouristHomeStack from "./TouristHomeStack";
import TouristTourStack from "./TouristTourStack";

import Tourist_Manage_Account from "../Screens/Tourist/Tourist_Manage_Account";

import { colors, images } from "../config/Constant";
import ChatStack from "./ChatStack";
import TouristExploreStack from "./TouristExploreStack";
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
                color: focused ? colors.lightBrown2 : "black",
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              طلباتي
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={{ ...Styles.iconView }}>
              <Image
                source={images.order}
                style={{
                  width: 34,
                  height: 28,
                  resizeMode: "contain",
                  tintColor: focused ? colors.lightBrown2 : "black",
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
                color: focused ? colors.lightBrown2: "black",
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
                source={images.bag}
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: "contain",
                  tintColor: focused ?colors.lightBrown2 : "black",
                }}
              />
            </View>
          ),
        }}
        name="TourStack"
        component={TouristTourStack}
      />

      {/* البحث */}
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.lightBrown2 : "black",
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
                  source={images.explore}
                  style={{
                    width: 45,
                    height: 45,
                    tintColor: focused ? colors.lightBrown2 : "black",
                  }}
                />
              </View>
            </View>
          ),
        }}
        name="PostSearch"
        component={TouristExploreStack}
      />

      {/* رسائلي */}
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.lightBrown2 : "black",
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
                  width: 26,
                  height: 26,
                  resizeMode: "contain",
                  tintColor: focused ? colors.lightBrown2: "black",

                }}
              />
            </View>
          ),
        }}
        name="ChatStack"
        component={ChatStack}
      />

      {/* حسابي */}
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused, color, size }) => (
            <Text
              style={{
                color: focused ? colors.lightBrown2 : "black",
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
                  width: 26,
                  height: 26,
                  resizeMode: "contain",
                  tintColor: focused ? colors.lightBrown2 : "black",
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
