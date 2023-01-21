import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import ButtonComponent from "../button/Button";

export default function DetailCard({
  onpressAccepted,
  onpressRejected,
  source,
  price,
  acceptButton = true,
  rejectButton = true,
  bookedBy = true,
  title,
}) {
  return (
    <View style={[styles.card, styles.flexDirection]}>
      {/* Image */}
      <View style={{ marginHorizontal: 20 }}>
        <Image source={source} style={[styles.img]} />
      </View>

      <View style={{ marginHorizontal: 10 }}>
        {/* Title */}
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

        {/* bookedBy */}
        {bookedBy && (
          <View style={[styles.flexDirection, { alignSelf: "center" }]}>
            <View style={{}}>
              <Text style={[text.themeDefault, text.text15]}>Booked By: </Text>
            </View>
            <View style={{}}>
              <Text style={[text.themeDefault, text.text15]}>{bookedBy}</Text>
            </View>
          </View>
        )}

        {/* acceptButton */}
        {acceptButton && (
          <View style={{ alignSelf: "center", marginVertical: 10 }}>
            <ButtonComponent
              buttonSelection={true}
              buttonDefault={false}
              title={"قبول "}
              onpress={onpressAccepted}
              style={{
                backgroundColor: colors.Blue,
                borderRadius: 10,
                width: screenWidth.width40,
                marginRight: 10,
              }}
            />
          </View>
        )}
        {/* rejectButton */}
        {rejectButton && (
          <View style={{ alignSelf: "center" }}>
            <ButtonComponent
              buttonSelection={true}
              buttonDefault={false}
              title={"رفض "}
              onpress={onpressRejected}
              style={{
                backgroundColor: colors.brown,
                borderRadius: 10,
                width: screenWidth.width40,
                marginRight: 10,
              }}
            />
          </View>
        )}
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
    // alignItems:'center',
  },
  img: {
    width: screenWidth.width25,
    height: screenWidth.width35,
  },
});
