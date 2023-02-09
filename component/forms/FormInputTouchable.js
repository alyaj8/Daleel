import * as React from "react";
import { useController } from "react-hook-form";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../config/Constant";
import { getFormattedDate, getFormattedTime } from "../../util/DateHelper";

const FormInputTouchable = ({
  // form state
  control,
  name,
  // props
  navigation,
  icon = false,
  source,
  multiline = false,
  editable = true,

  placeholder = "رجاء ملئ الحقل",
  onPress,

  labelStyle,
  inputStyle,
  wrapperStyle,
  style,

  onChangeText,

  debug = false,

  ...props
}) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { invalid, isTouched, isDirty, error },
  } = useController({
    name,
    control,
  });

  if (debug === ",") {
    console.log("🚀 ~ error", error);
    console.log("🚀 ~ value", value);
    console.log("🚀 ~ isDirty", isDirty);
    console.log("🚀 ~ isTouched", isTouched);
    console.log("🚀 ~ invalid", invalid);
    console.log("🚀 ~ name", name);
  }

  const InpurComp = onPress ? TouchableOpacity : View;

  const changeHandler = (inputText) => {
    onChange(inputText);
    onChangeText && onChangeText(inputText);
  };

  const renderValue = (val) => {
    if (val) {
      // check if it is a date
      if (val instanceof Date) {
        // if name contains date
        const ckeckName = name.toLowerCase();

        if (ckeckName.includes("date")) {
          return getFormattedDate(val);
        }
        // if name contains time
        else if (ckeckName.includes("time")) {
          return getFormattedTime(val);
        }
      } else {
        return val;
      }
    } else {
      return placeholder;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      <Text style={[styles.label, labelStyle]}>{props.label}</Text>

      {/* Input */}
      <View style={[{ justifyContent: "center" }, wrapperStyle]}>
        <>
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
              placeholderTextColor={colors.grey}
              multiline={multiline}
              placeholder={placeholder}
              // Form
              value={value}
              onChangeText={changeHandler}
              onBlur={onBlur}
              {...props}
            />
          ) : (
            // Touchable Component
            <InpurComp
              onPress={onPress}
              style={[styles.InputStyle, inputStyle]}
              {...props}
            >
              <Text
                style={{
                  ...inputStyle,
                  textAlign: "right",
                  // marginRight: 20,
                  fontWeight: "bold",
                  width: "100%",
                  color: !!value ? colors.black : colors.grey,
                }}
              >
                {renderValue(value)}
              </Text>
            </InpurComp>
          )}
        </>

        {/* with icon */}
        {icon && (
          <View style={[styles.position]}>
            <Image source={source} style={[styles.icon]} />
          </View>
        )}
      </View>

      {/* Error */}
      {error && <Text style={{ color: "red" }}>{error?.message}</Text>}
    </View>
  );
};

export default FormInputTouchable;

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
    borderColor: "#BDBDBD",
    height: 50,
    borderRadius: 10,
    paddingLeft: 20,
    backgroundColor: "#ffff",
    paddingRight: 20,
    textAlign: "right",
    backgroundColor: "#fff",

    alignItems: "center",
    justifyContent: "center",

    height: 60,
    // ...highlights.brdr04,
  },
  label: {
    // width: "100%",
    marginRight: 9,

    fontSize: 18,
    fontWeight: "bold",
    // color: "#5398a0",
    textAlign: "right",
    // width: screenWidth.width90,
    marginBottom: 5,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: colors.lightBrown,
  },
  position: {
    position: "absolute",
    left: 0,
    marginLeft: 15,
  },
});
