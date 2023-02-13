import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, highlights, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";

export default function TourDetailCard({ onpress, source, title, tour, mode }) {
  const today = new Date().toISOString().slice(0, 10);
  const tourDate = tour.date.toDate().toISOString().slice(0, 10);
  const isExplore = mode === "explore";
  console.log("🚀 ~ isExplore", isExplore);
  const isMyTour = mode === "myTour";
  console.log("🚀 ~ isMyTour", isMyTour);
  const isPassed = tourDate < today;
  const isPaid = tour.isPaid;
  const bookedByName = tour.bookedByName;

  // logObj(tour, "tour");
  const route = useRoute();
  // console.log("route", route);
  console.log("🚀 ~ tour?.bookedBy", tour?.bookedBy);

  // switch status
  // available only for explore when not paid and not passed

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
            <View
              style={{
                flexDirection: "row-reverse",
              }}
            >
              {/* Is Explore  available */}
              {isExplore &&
                (!isPassed && !isPaid ? (
                  <Text
                    style={[
                      text.text15,
                      { fontWeight: "bold", color: colors.green },
                    ]}
                  >
                    متاحة للحجز
                  </Text>
                ) : (
                  <Text
                    style={[
                      text.text15,
                      { fontWeight: "bold", color: colors.redTheme },
                    ]}
                  >
                    غير متاحة للحجز
                  </Text>
                ))}

              {/* Is My Tour  available */}
              {isMyTour &&
                (!isPassed ? (
                  <Text
                    style={[
                      text.text15,
                      { fontWeight: "bold", color: colors.green },
                    ]}
                  >
                    قادمة
                  </Text>
                ) : (
                  <Text
                    style={[
                      text.text15,
                      { fontWeight: "bold", color: colors.redTheme },
                    ]}
                  >
                    فائتة
                  </Text>
                ))}

              {/* Is Booked */}
              {isMyTour && isPaid && (
                <>
                  <Text style={[{ fontWeight: "bold" }]}> | </Text>
                  <Text
                    style={[
                      text.text15,
                      { fontWeight: "bold", color: colors.lightBrown },
                    ]}
                  >
                    محجوزة
                  </Text>
                </>
              )}
            </View>
            {/* title */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                ...highlights.brdr01,
              }}
            >
              <Text
                style={[
                  text.text22,
                  text.HeadingC,
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                    ...highlights.brdr02,
                  },
                ]}
              >
                {title}
              </Text>
            </View>
            <Text
              style={[
                // text.text12,
                text.SubduedTextC,
                {
                  fontWeight: "bold",
                  textAlign: "center",
                  ...highlights.brdr02,
                },
              ]}
            >
              المُرشد: {tour.localName}
            </Text>
            {/* age & qty & city */}
            <Text
                 style={[
                  // text.text12,
                  text.SubduedTextC,
                  {
                    fontWeight: "bold",
                    textAlign: "center",
                    ...highlights.brdr02,
                  },
                ]}
            >
              الفئة العمرية: {tour?.age}
            </Text>
            <Text
                 style={[
                  // text.text12,
                  text.SubduedTextC,
                  {
                    fontWeight: "bold",
                    textAlign: "center",
                    ...highlights.brdr02,
                  },
                ]}
            >
              تستوعب: {tour?.qty} فرد{" "}
            </Text>
            <Text
                 style={[
                  // text.text12,
                  text.SubduedTextC,
                  {
                    fontWeight: "bold",
                    textAlign: "center",
                    ...highlights.brdr02,
                  },
                ]}
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
