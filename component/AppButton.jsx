import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../config/Constant";
import text from "../style/text";

const AppButton = ({
  title,
  onPress,
  color = colors.brown,
  style,
  error = "",
  disabled = false,
  alwaysEnabled,
}) => {
  return (
    <>
      {(!disabled && !error) || alwaysEnabled ? (
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: color,
            },
            style,
          ]}
          onPress={() => {
            onPress();
            // console.log("onPress");
          }}
        >
          <Text
            style={[
              text.white,
              text.text20,
              {
                fontWeight: "bold",
              },
            ]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          {error && (
            <Text style={{ color: "red", fontWeight: "bold", marginBottom: 5 }}>
              {error}
            </Text>
          )}
          <View style={[styles.button, style, styles.disabled]}>
            <Text
              style={[
                text.grey,
                text.text20,
                {
                  fontWeight: "bold",
                },
              ]}
            >
              {title}
            </Text>
          </View>
        </>
      )}
    </>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    // width: "100%",
    // marginHorizontal: 10,
    backgroundColor: colors.brown,
    borderRadius: 7,
    padding: 5,
  },

  disabled: {
    backgroundColor: colors.light,
  },
});
