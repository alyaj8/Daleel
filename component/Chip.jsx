import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../config/Constant";

const Chip = ({ text }) => {
  console.log("🚀 ~ text", text);
  return (
    <View
      style={{
        backgroundColor: colors.orange,
        borderRadius: 25,
        marginRight: 5,
        padding: 5,
        flexDirection: "row",
        // alignSelf: "center",
        width: "auto",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: colors.white,
            fontWeight: "bold",
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default Chip;

const styles = StyleSheet.create({});
