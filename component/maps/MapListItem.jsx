import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "react-native-vector-icons/Feather";
import { colors } from "../../config/Constant";
import Chip from "../Chip";

export default function MapListItem({ item, index }) {
  console.log("🚀 ~ item", item);
  const { id, title, full_name, address, category } = item;
  console.log("🚀 ~ item", item);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        {/* Title & category */}
        <View
          style={{
            flex: 1,
            flexDirection: "row-reverse",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.themeDefault,
            }}
          >
            {title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              // flex: 1,
              // flexWrap: "wrap",
            }}
          >
            {category &&
              category?.map((item, index) => <Chip key={index} text={item} />)}
          </View>
        </View>
        {/* Full Name */}
        <Text style={{ fontSize: 14, color: colors.gray }}>{full_name}</Text>

        {/* Address */}
        {address && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather
              name="map"
              size={12}
              color={colors.facebook}
              style={{ marginRight: 5 }}
            />
            <Text style={{ fontSize: 14, color: colors.gray }}>{address}</Text>
          </View>
        )}
      </View>
      <View style={{ width: 50, alignItems: "center" }}>
        <Feather name="map-pin" size={30} color={colors.facebook} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
