import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";

const AppTouchableHigh = ({ children, ...props }) => {
  return (
    <TouchableHighlight
      style={styles.container}
      underlayColor="#dddddd"
      activeOpacity={0.99}
      {...props}
    >
      {children}
    </TouchableHighlight>
  );
};

export default AppTouchableHigh;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 0,
    margin: 0,
    width: "92%",
    alignSelf: "center",
  },
});
