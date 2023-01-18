import * as React from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import { screenWidth } from "../../config/Constant";
export default function Input({
  navigation,
  icon = false,
  source,
  multiline = false,
  value,
  editable = true,
  onChangeText,
  style,

  inputStyle,
  ...props
}) {
  const changeHandler = (inputText) => {
    // console.log("inputText", inputText);
    onChangeText(inputText);
  };
  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center" }}>
        <TextInput
          style={[styles.InputStyle, { ...style }]}
          multiline={multiline}
          value={value}
          editable={editable}
          onChangeText={changeHandler}
          {...props}
        />
        {icon && (
          <View style={[styles.position]}>
            <Image source={source} style={[styles.icon]} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  InputStyle: {
    width: screenWidth.width90,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#5398a0",
    borderRadius: 20,
    paddingHorizontal: 20,
    textAlign: "right",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#5398a0",
  },
  position: {
    position: "absolute",
    left: 0,
    marginLeft: 15,
  },
});
