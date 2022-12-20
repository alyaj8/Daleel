import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import { images, screenWidth } from "../../config/Constant";
import { SafeAreaView } from "react-native-safe-area-context";
import text from "../../style/text";
export default function Button({
  navigation,
  title,
  onpress,
  disabled = false,
}) {
  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        onPress={onpress}
        style={[
          styles.btn,
          { backgroundColor: disabled ? "rgba(83, 152, 160, 0.5)" : "#5398a0" },
        ]}
      >
        <Text style={[text.white, text.text20]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: screenWidth.width30,
    paddingVertical: 7,
    backgroundColor: "#5398a0",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

});
