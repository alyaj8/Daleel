import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";

const MIcon = ({
  onPress,
  name,
  size,
  color,

  ...otherProps
}) => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      style={{ borderRadius: 50 }}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={color}
        {...otherProps}
      />
    </TouchableHighlight>
  );
};

export default MIcon;

const styles = StyleSheet.create({});
