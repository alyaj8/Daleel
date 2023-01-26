import {} from "expo-status-bar";
import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { screenWidth } from "../../config/Constant";
import text from "../../style/text";
import ButtonComponent from "../button/Button";
export default function rejectCard({
  onpressAccepted,
  onpressRejected,
  source,
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{ marginHorizontal: 20 }}>
            <Image source={source} style={[styles.img]} />
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <View style={{ marginVertical: 10 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text18,
                  { textAlign: "center", fontWeight: "bold" },
                ]}
              >
                جولة بلدة العلا القديمة
              </Text>
            </View>
            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <ButtonComponent
                buttonSelection={true}
                buttonDefault={false}
                title={"مرفوضة"}
                onpress={onpressRejected}
                style={{ backgroundColor: "#c6302c" }}
                disabled={true}
              />
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
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: "#ececec",
    alignSelf: "center",
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width25,
    height: screenWidth.width35,
  },
});
