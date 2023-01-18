import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { screenWidth } from "../../config/Constant";
import text from "../../style/text";
import NewAppButton from "../AppButton";

export default function TouristCard({ onpress, source, title }) {
  return (
    <View style={[styles.card, styles.flexDirection]}>
      {/* Image */}
      <View style={{ marginHorizontal: 5 }}>
        <Image source={source} style={[styles.img]} />
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
          <NewAppButton
            buttonSelection={true}
            buttonDefault={false}
            title={"تحت الإنتظار"}
            onpress={onpress}
            style={{ backgroundColor: "#b2e5e4" }}
          />
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
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width30,
    height: screenWidth.width30,
  },
});
