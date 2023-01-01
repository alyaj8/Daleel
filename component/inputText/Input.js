import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import * as React from "react";
import { images, screenWidth } from "../../config/Constant";
import { SafeAreaView } from "react-native-safe-area-context";
import text from "../../style/text";
export default function Input({
  navigation,
  icon = false,
  source,
  multiline = false,
  setValue,
  value,
  editable = true,
  onChangeText,
  style,
}) {
  const changeHandler = inputText => {
    if (onChangeText) onChangeText();
    setValue(inputText);
  };
  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center" }}>
        <TextInput
          style={[styles.InputStyle,{...style}]}
          multiline={multiline}
          setValue={setValue}
          value={value}
          editable={editable}
          onChangeText={changeHandler}
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
