import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import LocalHomeStack from "./LocalHomeStack";
import TourStack from "./TourStack";

import Local_Manage_Account from "../Screens/Local/Local_Manage_Account";

import { colors, images } from "../config/Constant";
import PostTourV2 from "../Screens/Local/PostTourV2";
import ChatStack from "./ChatStack";
const Tab = createBottomTabNavigator();

export default function LocalBottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          tabBarHideOnKeyboard: true,
        },
      }}
    >
      {/* طلباتي مرشد */}
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
        component={LocalHomeStack}
      />

      {/* جولاتي مرشد */}
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
                  tintColor: focused ? colors.brown : "black",
                }}
              />
            </View>
          ),
        }}
        name="TourStack"
        component={TourStack}
      />

      {/* نشر جولة مرشد */}
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
              إنشاء جولة
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[Styles.plusTab, { ...Styles.iconView }]}>
              <Image
                source={images.add}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: focused ? colors.brown : "black",
                }}
              />
            </View>
          ),
        }}
        name="PostSearch"
        // component={PostTour}
        component={PostTourV2}
      />

      {/* رسائلي مرشد */}
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
        name="ChatStack"
        component={ChatStack}
      />

      {/* حسابي مرشد */}
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
        name="Local_Manage_Account"
        component={Local_Manage_Account}
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
