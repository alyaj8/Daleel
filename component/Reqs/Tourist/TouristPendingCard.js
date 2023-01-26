import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, screenWidth } from "../../../config/Constant";
import text from "../../../style/text";
import AppImage from "../../AppImage";
import { highlights } from "./../../../config/Constant";

export default function TouristPendingCard({ onpress, source, title }) {
  // console.log("🚀 ~ source", source);
  return (
    <View style={[styles.card, styles.flexDirection, highlights.brdr02]}>
      {/* Image */}
      <View style={{}}>
        <AppImage
          sourceURI={source.uri}
          style={[styles.img, highlights.brdr01]}
        />
      </View>

      {/* Rest */}
      <View style={{ ...highlights.brdr03 }}>
        <View style={{ width: screenWidth.width50 }}>
          <Text
            style={[
              text.themeDefault,
              text.text18,
              { textAlign: "right", fontWeight: "bold", marginRight: 20 },
            ]}
          >
            {title}
          </Text>
        </View>
        <View style={{ alignSelf: "center", marginTop: 30 }}>
          <Text
            style={[
              text.text18,
              {
                textAlign: "right",
                fontWeight: "bold",
                marginRight: 20,
                color: colors.lightBrown,
              },
            ]}
          >
            {" "}
            طلبك قيد الإنتظار
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth.width90,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    paddingVertical: 7,
    marginVertical: 7,
    // Show shadow on Android and iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width35,
    height: screenWidth.width35,
    borderRadius: 10,
    marginLeft: 10,
  },
});
