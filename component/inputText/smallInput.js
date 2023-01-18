import * as React from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import { screenWidth } from "../../config/Constant";
export default function SmallInput({
  navigation,
  icon = false,
  source,
  multiline = false,
  onChangeText,
  value,
  editable = true,
  keyboardType,
  style,
  ...props
}) {
  const changeHandler = (inputText) => {
    onChangeText(inputText);
  };
  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center" }}>
        <TextInput
          style={[styles.InputStyle, style]}
          multiline={multiline}
          onChangeText={changeHandler}
          value={value}
          editable={editable}
          keyboardType={keyboardType}
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
    width: screenWidth.width25,
    padding: 5,
    borderWidth: 1,
    borderColor: "#5398a0",
    borderRadius: 20,
    paddingHorizontal: 10,

    textAlign: "center",
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
