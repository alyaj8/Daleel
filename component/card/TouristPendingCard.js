import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import AppImage from "./../AppImage";

export default function TouristPendingCard({ onpress, source, title }) {
  console.log("🚀 ~ source", source);
  return (
    <View style={[styles.card, styles.flexDirection]}>
      {/* Image */}
      <View style={{ marginHorizontal: 5 }}>
        <AppImage sourceURI={source.uri} style={[styles.img]} />
      </View>
      {/* Rest */}
      <View style={{ paddingHorizontal: 10 }}>
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
          {/* <Button
            buttonSelection={true}
            buttonDefault={false}
            title={"قيد الإنتظار"}
            disabled={true}
            style={{ backgroundColor: "#b2e5e4" }}
          /> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth.width90,
    borderRadius: 10,
    backgroundColor: "#ececec",
    alignSelf: "center",
    paddingVertical: 20,
    marginVertical: 15,
    ///shadowEffect
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width30,
    height: screenWidth.width30,
  },
});
