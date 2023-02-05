import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  colors,
  highlights,
  images,
  screenWidth,
} from "../../../config/Constant";
import { getFormattedDate, getFormattedTime } from "../../../util/DateHelper";
import AppButton from "../../AppButton";
import AppImage from "../../AppImage";

export default function AcceptedBooking({
  onpressAccepted,
  onPressPayment = () => console.log("Payment"),
  source,
  title = "",
  booked,
  date,
  time,
  item,
  forPerson,
  type = "local", // local or tourist
}) {
  const isLLost5min =
    item?.acceptedAt?.toDate() <
    new Date().setMinutes(new Date().getMinutes() - 5);
  console.log("🚀 ~ isLLost5min", isLLost5min);

  return (
    <View
      style={[
        styles.card,
        {
          flexDirection: "column",
        },
      ]}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Image */}
        <View>
          {source.uri ? (
            <AppImage sourceURI={source.uri} style={[styles.img]} />
          ) : (
            <Image source={images.photo} style={[styles.img]} />
          )}
        </View>

        {/* Info & Btns */}
        <View
          style={{
            flex: 1,

            ...highlights.brdr01,
          }}
        >
          {/* Title */}
          <View style={{ alignItems: "flex-end", marginBottom: 1 }}>
            <Text
              style={{
                fontSize: 24,
                color: colors.brown,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {title}
            </Text>
            {type == "local" && (
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "right",
                  fontWeight: "bold",
                  color: colors.lightBrown,
                }}
              >
                {item?.isPaid
                  ? "تم الدفع"
                  : isLLost5min
                  ? "فات وقت الدفع"
                  : "لم يتم الدفع بعد"}
              </Text>
            )}
          </View>

          {/* Booked at */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              ...highlights.brdr02,
              borderBottomWidth: 1,
              paddingBottom: 5,
              marginLeft: 5,
              borderBottomColor: colors.textHeadingColor,
            }}
          >
            {/* Accepted at */}
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                borderRightWidth: 2,
                borderRightColor: colors.textHeadingColor,
                alignItems: "flex-end",
                justifyContent: "center",

                paddingRight: 10,
                ...highlights.brdr03,
              }}
            >
              <Text>قُبلت: </Text>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {getFormattedTime(item?.acceptedAt)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {getFormattedDate(date)}
              </Text>
            </View>

            {/* Booked at */}
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "center",

                // paddingRight: 3,
                ...highlights.brdr03,
              }}
            >
              <Text>الموعد: </Text>

              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {getFormattedTime(item?.acceptedAt)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  // textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {getFormattedDate(date)}
              </Text>
            </View>
          </View>
          {/* Booked by or for */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              {" "}
              {forPerson}{" "}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {type === "local" ? "السائح: " : "المُرشِد: "}
            </Text>
          </View>
        </View>
      </View>
      {/* Btns */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 5,
          // ...highlights.brdr02,
        }}
      >
        {type !== "local" && (
          <AppButton
            title={
              item?.isPaid ? "تم الدفع" : isLLost5min ? "فات الدفع" : "الدفع"
            }
            disabled={item?.isPaid || isLLost5min}
            onPress={onPressPayment}
            style={{
              width: screenWidth.width40,
              height: 60,
              backgroundColor: colors.Blue,
              borderRadius: 10,
              padding: 10,
              marginRight: 10,
            }}
          />
        )}
        <AppButton
          title={"الذهاب للدردشة"}
          onPress={onpressAccepted}
          style={{
            flex: 1,
            height: 60,

            backgroundColor: colors.lightBrown,
            borderRadius: 10,
            padding: 10,
            // margin: 3,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth.width95,
    padding: 13,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginVertical: 7,
    // shadow
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    ...highlights.brdr00,
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width40,
    height: screenWidth.width30,
    resizeMode: "contain",
    borderRadius: 10,
  },
});
