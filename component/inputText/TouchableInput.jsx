import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../config/Constant";

const TouchableInput = ({
  navigation,
  icon = false,
  source,
  multiline = false,
  editable = true,
  onChangeText,
  value,

  placeholder = "برجاء ملئ الحقل",
  onPress,

  labelStyle,
  inputStyle,
  wrapperStyle,
  style,

  debug = false,

  ...props
}) => {
  if (debug) console.log("TouchableInput: ", value);

  const changeHandler = (inputText) => {
    // console.log("inputText", inputText);
    onChangeText(inputText);
  };

  const InpurComp = onPress ? TouchableOpacity : View;

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      <Text style={[styles.label, labelStyle]}>{props.label}</Text>

      {/* Input */}
      <View style={[{ justifyContent: "center" }, wrapperStyle]}>
        {editable ? (
          // Text Input Component
          <TextInput
            style={[
              styles.InputStyle,
              {
                height: multiline ? 100 : 60,
              },
              inputStyle,
            ]}
            value={value}
            onChangeText={changeHandler}
            placeholderTextColor={colors.grey}
            multiline={multiline}
            placeholder={placeholder}
            {...props}
          />
        ) : (
          // Touchable Component
          <InpurComp
            onPress={onPress}
            style={[styles.InputStyle, inputStyle]}
            editable={editable}
            onChangeText={changeHandler}
            {...props}
          >
            {!!value ? (
              <Text
                style={{
                  ...inputStyle,
                  textAlign: "right",
                  // marginRight: 20,
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                {value}
              </Text>
            ) : (
              <Text
                style={{
                  ...inputStyle,
                  textAlign: "right",
                  // marginRight: 20,
                  color: colors.grey,
                  width: "100%",
                }}
              >
                {placeholder}
              </Text>
            )}
          </InpurComp>
        )}

        {/* with icon */}
        {icon && (
          <View style={[styles.position]}>
            <Image source={source} style={[styles.icon]} />
          </View>
        )}
      </View>
    </View>
  );
};

export default TouchableInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    // width: "100%",

    // backgroundColor: "red",
  },
  InputStyle: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#5398a0",
    borderRadius: 20,
    textAlign: "right",
    backgroundColor: "#fff",

    alignItems: "center",
    justifyContent: "center",

    height: 60,
    // ...highlights.brdr04,
  },
  label: {
    // width: "100%",

    fontSize: 16,
    fontWeight: "bold",
    // color: "#5398a0",
    textAlign: "right",
    // width: screenWidth.width90,
    marginBottom: 5,
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
