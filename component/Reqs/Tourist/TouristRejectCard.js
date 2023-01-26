import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, screenWidth } from "../../../config/Constant";
import text from "../../../style/text";

export default function TouristRejectCard({ onpress, source, title, local }) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{ marginHorizontal: 50 }}>
            <Image source={source} style={[styles.img]} />
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={[text.text18, { textAlign: "right", fontWeight: "bold" }]}
            >
              {title}
            </Text>
            <Text
              style={[text.text14, { textAlign: "right", fontWeight: "bold" }]}
            >
              المُرشد: {local}
            </Text>
            <View style={{ alignSelf: "center", marginTop: 15 }}>
              <Text
                style={[
                  text.text18,
                  {
                    textAlign: "right",
                    fontWeight: "bold",
                    marginRight: 20,
                    color: colors.brown,
                  },
                ]}
              >
                طلبك مرفوض
              </Text>
            </View>
          </View>
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
    paddingVertical: 20,
    marginVertical: 10,

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
    width: screenWidth.width25,
    height: screenWidth.width25,
  },
});
