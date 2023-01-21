import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../config/Constant";
const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  themeDefault: {
    color: colors.themeDefault,
    fontWeight: "bold",
    width: "100%",
    // ...no_highlights.brdr1,
  },
  fontFamily: {
    // fontFamily:'serif',
  },
  text6: {
    fontSize: 6,
  },
  text7: {
    fontSize: 7,
  },
  text8: {
    fontSize: 8,
  },
  text9: {
    fontSize: 9,
  },
  text10: {
    fontSize: 10,
  },
  text11: {
    fontSize: 11,
  },
  text12: {
    fontSize: 12,
  },
  text14: {
    fontSize: 14,
  },
  text15: {
    fontSize: 15,
  },
  text16: {
    fontSize: 16,
  },
  text18: {
    fontSize: 18,
  },
  text20: {
    fontSize: 20,
  },
  text22: {
    fontSize: 22,
  },
  text23: {
    fontSize: 23,
  },
  text24: {
    fontSize: 24,
  },
  text25: {
    fontSize: 25,
  },
  text26: {
    fontSize: 26,
  },
  text27: {
    fontSize: 27,
  },
  text30: {
    fontSize: 30,
  },
  text40: {
    fontSize: 40,
  },
  letterSpace: {
    letterSpacing: 1,
  },

  justify: {
    textAlign: "justify",
  },
  center: {
    textAlign: "center",
  },
  right: {
    textAlign: "right",
  },
  left: {
    textAlign: "left",
  },
  lineHeight: {
    lineHeight: 20,
  },

  // font family

  regular: {
    fontFamily: "Poppins-Regular",
  },
  medium: {
    fontFamily: "Poppins-Medium",
  },
  semibold: {
    fontFamily: "Poppins-SemiBold",
  },
  bold: {
    fontWeight: "bold",
  },
  light: {
    fontFamily: "Poppins-Light",
  },
  heavy: {
    fontFamily: "Poppins-Black",
  },

  //font colors
  white: {
    color: colors.white,
  },
  grey48: {
    color: "#484848",
  },
  grey: {
    color: colors.grey,
  },
  greyDark: {
    color: colors.greyDark,
  },
  black: {
    color: colors.black,
  },
  upperCase: {
    textTransform: "uppercase",
  },
  lightGrey: {
    color: colors.greyLight,
  },
  lightBlue: {
    color: colors.lightBlue,
  },

  themeSecondary: {
    color: colors.themeSecondary,
  },
  label: {
    color: colors.label,
  },
  orange: {
    color: colors.orange,
  },
  timeChatText: {
    color: "#757575",
    fontSize: 13,
    textAlign: "center",
  },
});
