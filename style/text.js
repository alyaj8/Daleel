import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../config/Constant";
const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  themeDefault: {
    color: colors.themeDefault,
    fontWeight: "bold",
    width: "100%",
  },
  fontFamily: {
    // fontFamily:'serif',
  },
  HeadingC:{
    color:"#212121"
  },
  TextC:{
    color:"#424242"
  },
  SubduedTextC:{
    color:"#616161"
  },
  text6: {
    fontSize: 6,
    textAlign: "justify",
  },
  text7: {
    fontSize: 7,
    textAlign: "justify",
  },
  text8: {
    fontSize: 8,
    textAlign: "justify",
  },
  text9: {
    fontSize: 9,
    textAlign: "justify",
  },
  text10: {
    fontSize: 10,
    textAlign: "justify",
  },
  text11: {
    fontSize: 11,
    textAlign: "justify",
  },
  text12: {
    fontSize: 12,
    textAlign: "justify",
  },
  text13: {
    fontSize: 13,
    textAlign: "justify",
  },
  text14: {
    fontSize: 18,
  },
  text15: {
    fontSize: 15,
    textAlign: "justify",
  },
  text16: {
    fontSize: 18,
    textAlign: "justify",
  },
  text18: {
    fontSize: 18,
    textAlign: "justify",
  },
  text20: {
    fontSize: 20,
    textAlign: "justify",
  },
  text22: {
    fontSize: 22,
    textAlign: "justify",
  },
  text23: {
    fontSize: 23,
    textAlign: "justify",
  },
  text24: {
    fontSize: 24,
    textAlign: "justify",
  },
  text25: {
    fontSize: 25,
    textAlign: "justify",
  },
  text26: {
    fontSize: 26,
    textAlign: "justify",
  },
  text27: {
    fontSize: 27,
    textAlign: "justify",
  },
  text30: {
    fontSize: 30,
    textAlign: "justify",
  },
  text40: {
    fontSize: 40,
    textAlign: "justify",
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
