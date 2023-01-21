import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, screenWidth } from "../../config/Constant";
import text from "../../style/text";

export default function TouristRejectCard({ onpress, source, title }) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{ marginHorizontal: 50 }}>
            <Image source={source} style={[styles.img]} />
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <View style={{}}>
              <Text
                style={[
                  text.themeDefault,
                  text.text18,
                  { textAlign: "center", fontWeight: "bold" },
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
                    color: colors.brown,
                  },
                ]}
              >
                {" "}
                طلبك مرفوض
              </Text>
              {/* <ButtonComponent buttonSelection={true} buttonDefault={false} title={'مرفوض'}
                onpress={onpress}
                  style={{ backgroundColor: colors.brown ,borderRadius: 10, width: screenWidth.width40,}}
                /> */}
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
    backgroundColor: "#ececec",
    alignSelf: "center",
    paddingVertical: 20,
    marginVertical: 15,
    ///shadowEffect
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width25,
    height: screenWidth.width25,
  },
});
