import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, highlights, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";

export default function TourDetailCard({ onpress, source, title, tour }) {
  // logObj(tour, "tour");
  const route = useRoute();
  // console.log("route", route);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onpress} style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          {/* image */}
          <View style={{}}>
            {source.uri ? (
              // <AppImage sourceURI={source.uri} style={[styles.img]} />
              <Image
                source={{
                  uri: source.uri,
                }}
                style={[styles.img]}
              />
            ) : (
              <Image source={images.photo} style={[styles.img]} />
            )}
          </View>

          {/* details */}
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              justifyContent: "center",
              alignItems: "flex-end",
              ...highlights.brdr02,
            }}
          >
            {/* title & activities */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                ...highlights.brdr01,
              }}
            >
              {/* activities */}

              <Text
                style={[
                  text.text20,
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                    color: colors.textHeadingColor,
                    ...highlights.brdr02,
                  },
                ]}
              >
                {title}
              </Text>
            </View>

            {/* age & qty & city */}
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              السن: {tour?.age}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              تستوعب: {tour?.qty} فرد{" "}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              مدينة: {tour?.city}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth.width90,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignSelf: "center",
    // shadow
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    ...highlights.brdr0,
  },
  flexDirection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...highlights.brdr0,
  },
  img: {
    width: screenWidth.width30,
    height: screenWidth.width30,
    // resizeMode: "contain",
    // ...highlights.brdr03,
    borderRadius: 10,
  },
});
