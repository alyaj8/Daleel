import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import {
  getFormattedDate,
  getFormattedTime,
  limitCharacters,
} from "../../util/DateHelper";
import MIcon from "../MIcon";

const ActivityCard = ({
  activity,
  display = false,
  onEditActivity,
  onRemoveActivity,
  // checklist
  withChecklist = false,
  onCheck,
  isChecked = false,
}) => {
  const {
    id,
    title,
    description,
    location,
    price,
    date,
    startTime,
    endTime,
    imageUrl,
  } = activity;

  const [selected, setSelected] = React.useState(false);
  const [checked, setChecked] = React.useState(isChecked);

  const WrapperComponet = withChecklist ? TouchableOpacity : View;

  return (
    <WrapperComponet
      style={[
        styles.container, // highlights.brdr2
        {
          borderColor: selected ? colors.themeDefault : colors.lightGrey,
          borderWidth: selected ? 2 : 1,
        },
        isChecked && { borderColor: colors.red, borderWidth: 3 },
      ]}
      onPress={() => {
        setChecked(!checked);
        onCheck(activity);
      }}
    >
      <View
        style={[
          styles.innerForm,
          styles.row,
          // styles.ROWxLeft_COLyTop,
          {
            justifyContent: "space-between",
          },
          // highlights.brdr1,
        ]}
      >
        {/* #Left Side */}
        <View style={[styles.col]}>
          {/* #Upper Buttons */}
          {!display && (
            <View
              style={[
                styles.row, // highlights.brdr4
              ]}
            >
              {withChecklist ? (
                <MIcon
                  onPress={() => {
                    setChecked(!checked);
                    onCheck(activity);

                    console.log("checked", !isChecked);
                  }}
                  name={
                    isChecked ? "checkbox-marked" : "checkbox-blank-outline"
                  }
                  size={30}
                  color={isChecked ? colors.themeDefault : colors.lightGrey}
                />
              ) : (
                <>
                  {/* Delete */}
                  <MIcon
                    onPress={() => {
                      onRemoveActivity(id);
                    }}
                    name="close-circle-outline"
                    size={30}
                    color="red"
                  />
                  {/* Edit */}
                  <MIcon
                    onPress={() => {
                      onEditActivity(id);
                    }}
                    name="circle-edit-outline"
                    size={30}
                    color="black"
                  />
                </>
              )}
            </View>
          )}

          {/* Image */}
          <Image
            source={imageUrl ? { uri: imageUrl } : images.photo}
            style={{
              width: screenWidth.width25,
              height: screenWidth.width25,
              borderRadius: 10,
              resizeMode: "contain",
            }}
          />
        </View>

        {/* #Right Side */}
        <View
          style={[
            styles.col,
            styles.ROWxLeft_COLyTop,
            styles.ROWyButtom_COLxRight,
            // highlights.brdr3,
            {
              flex: 1,
              width: screenWidth.width45,
              height: "100%",
              justifyContent: "space-between",
            },
          ]}
        >
          {/* #Upper Info */}
          {/* <View style={[styles.row, styles.ROWxLeft_COLyTop]}> */}
          <View style={[styles.col, styles.ROWxLeft_COLyTop]}>
            {/* Title */}
            <Text style={[styles.title, text.text16]}>{title}</Text>

            {/* Times & Date */}
            <View style={[styles.col, styles.ROWyButtom_COLxRight]}>
              <View style={[styles.row]}>
                <Text style={[text.text12, text.themeDefault]}>
                  {getFormattedDate(date)}
                </Text>
                <MIcon
                  name="calendar"
                  size={14}
                  color="black"
                  style={{ marginLeft: 5 }}
                />
              </View>
              <View style={[styles.row]}>
                <Text style={[text.text12, text.themeDefault]}>
                  {getFormattedTime(startTime)} : {getFormattedTime(endTime)}
                </Text>
                <MIcon
                  name="clock-outline"
                  size={14}
                  color="black"
                  style={{ marginLeft: 5 }}
                />
              </View>
            </View>
            {/* </View> */}
          </View>

          {/* Description */}
          <Text
            style={[
              text.text14,
              {
                color: colors.dark,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                paddingVertical: 5,
                borderBottomColor: colors.grey,
                borderTopColor: colors.grey,
                width: "90%",
              },
            ]}
          >
            {limitCharacters(description, 60)}
          </Text>

          {/* #Lower info */}
          <View
            style={[
              styles.row,
              styles.ROWxLeft_COLyTop,
              {
                justifyContent: "space-around",
                width: "100%",
              },
              // highlights.brdr5,
            ]}
          >
            {/* Location */}
            <View style={[styles.row, styles.ROWxLeft_COLyTop]}>
              <MIcon
                name="map-marker"
                size={14}
                color="black"
                style={{ marginRight: 5 }}
              />
              <Text style={[text.text12, text.themeDefault]}>
                {limitCharacters(location, 20)}
              </Text>
            </View>

            {/* Price */}
            <View style={[styles.row, styles.ROWxLeft_COLyTop]}>
              <MIcon
                name="cash"
                size={14}
                color="black"
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  text.text12,
                  text.themeDefault,
                  {
                    width: screenWidth.width10,
                  },
                ]}
              >
                {Number(price)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </WrapperComponet>
  );
};

export default ActivityCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 20,
    marginVertical: 20,

    backgroundColor: colors.light,
    borderRadius: 10,
    padding: 5,

    width: screenWidth.width80,
  },
  innerForm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginHorizontal: 6,
    marginVertical: 5,
    // paddingHorizontal: 10,

    // ...highlights.brdr1,
  },
  title: {
    alignSelf: "flex-end",
    fontSize: 20,
  },

  row: {
    flexDirection: "row",
  },

  col: {
    flexDirection: "column",
  },
  ROWxLeft_COLyTop: {
    justifyContent: "flex-start",
  },
  ROWyCenter_COLxCenter: {
    alignItems: "center",
  },
  ROWxRight_COLyBottom: {
    justifyContent: "flex-end",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  ROWyTop_COLxLeft: {
    alignItems: "flex-start",
  },
  ROWxCenter_COLyCenter: {
    justifyContent: "center",
  },
  ROWyButtom_COLxRight: {
    alignItems: "flex-end",
  },
});
