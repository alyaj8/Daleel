import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, images, screenWidth } from "../../../config/Constant";
import text from "../../../style/text";
import AppImage from "../../AppImage";
import ButtonComponent from "../../button/Button";

export default function LocalPendingCard({
  onpressAccepted, // onprLocalBooingDetailCardessAccepted,
  onpressRejected,
  source,
  price,
  acceptButton = true,
  rejectButton = true,
  bookedBy = true,
  title,
}) {
  // console.log("🚀 ~ source", source);
  return (
    <View style={[styles.card, styles.flexDirection]}>
      {/* image */}
      <View
        style={{
          marginLeft: 10,
        }}
      >
        {source.uri ? (
          <AppImage sourceURI={source?.uri} style={[styles.img]} />
        ) : (
          <Image source={images.photo} style={[styles.img]} />
        )}
      </View>

      <View style={{ marginHorizontal: 5 }}>
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
          <View style={[styles.flexDirection, { alignSelf: "flex-end" }]}>
            <Text style={[text.text15]}>{bookedBy}</Text>
            <Text style={[text.text15]}>حجزت من: </Text>
          </View>
        )}

        {/* acceptButton */}
        {acceptButton && (
          <View style={{ alignSelf: "center", marginVertical: 10 }}>
            <ButtonComponent
              buttonSelection={true}
              buttonDefault={false}
              title={"قبول"}
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
    backgroundColor: "#fff",
    alignSelf: "center",
    paddingVertical: 10,
    // marginVertical: 15,
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
    // alignItems:'center',
  },
  img: {
    width: screenWidth.width35,
    height: screenWidth.width35,
    resizeMode: "contain",
    backgroundColor: colors.white,
    borderRadius: 15,
  },
});
