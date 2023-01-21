import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../config/Constant";
import text from "../style/text";

const AppButton = ({
  title,
  onPress,
  color = "primary",
  style,
  disabled = false,
}) => {
  return (
    <>
      {!disabled ? (
        <TouchableOpacity
          style={[styles.button, style]}
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
            تخصيص الأنشطة
          </Text>
        </View>
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
    backgroundColor: colors.blue,
    borderRadius: 7,
    padding: 5,
  },

  disabled: {
    backgroundColor: colors.light,
  },
});
