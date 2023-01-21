import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, highlights, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import { logObj } from "../../util/DateHelper";
import AppImage from "../AppImage";

export default function TourDetailCard({ onpress, source, title, tour }) {
  logObj(tour, "tour");
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onpress} style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{}}>
            {source.uri ? (
              <AppImage sourceURI={source.uri} style={[styles.img]} />
            ) : (
              <Image source={images.photo} style={[styles.img]} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              style={[
                text.text20,
                {
                  textAlign: "center",
                  fontWeight: "bold",
                  color: colors.textHeadingColor,
                },
              ]}
            >
              {title}
            </Text>
            {tour.activities.length > 0 && (
              <Text
                style={[
                  text.text16,
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                    color: colors.textHeadingColor,
                  },
                ]}
              >
                {tour.activities.length > 0 && (
                  <>
                    <Feather name="activity" size={24} color="black" />
                    <Text> {tour.activities.length} </Text>
                  </>
                )}
              </Text>
            )}

            <Text>السن: {tour.age}</Text>
            <Text>تستوعب: {tour.qty} فرد </Text>
            <Text>مدينة: {tour.city} فرد </Text>
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
    // ...highlights.brdr3,
    borderRadius: 10,
  },
});
