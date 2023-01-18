import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../config/Constant";

const Loading = ({ visible = false, text = "جاري التحميل..." }) => {
  if (!visible) return null;

  return (
    <View
      style={{
        flex: 1,

        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        zIndex: 999,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: colors.white, fontSize: 20, marginBottom: 10 }}>
        {text}
      </Text>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
