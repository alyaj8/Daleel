import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, highlights, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import { getFormattedTime, limitCharacters } from "../../util/DateHelper";
import AppImage from "../AppImage";
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
    startTime,
    endTime,
    imageUrl,
  } = activity;

  const [selected, setSelected] = React.useState(false);
  const [checked, setChecked] = React.useState(isChecked);

  const WrapperComponet = withChecklist ? TouchableOpacity : View;
  // const { id, title, full_name, address, coordinates, category } = item;

  let fakeLocation = {
    full_name:
      "مجمع الدمام الطبي، King Khaled Bin Abdulaziz Rd.، الدمام، السعودية",
    title: "مجمع الدمام الطبي",
  };

  return (
    <WrapperComponet
      style={[
        styles.container,
        highlights.brdr01,
        {
          borderColor: selected ? colors.lightBrown : colors.gray,
          borderWidth: selected ? 2 : 1,
        },
        isChecked && { borderColor: colors.lightBrown, borderWidth: 3 },
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
          highlights.brdr02,
        ]}
      >
        {/* #Left Side */}
        <View style={[styles.col]}>
          {/* #Upper Buttons */}
          {!display && (
            <View style={[styles.row, highlights.brdr04]}>
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
          {imageUrl ? (
            <AppImage
              sourceURI={imageUrl}
              style={{
                width: screenWidth.width25,
                height: screenWidth.width25,
                borderRadius: 10,
                resizeMode: "contain",
              }}
            />
          ) : (
            <Image
              source={images.photo}
              style={{
                width: screenWidth.width25,
                height: screenWidth.width25,
                borderRadius: 10,
                resizeMode: "contain",
              }}
            />
          )}
        </View>

        {/* #Right Side */}
        <View
          style={[
            styles.col,
            styles.ROWxLeft_COLyTop,
            styles.ROWyButtom_COLxRight,
            highlights.brdr03,
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
            <View
              style={{
                borderRightColor: colors.brown,
                borderRightWidth: 3,
                paddingRight: 5,
                marginBottom: 3,
              }}
            >
              <Text
                style={[
                  styles.title,
                  text.text18,
                  {
                    fontWeight: "bold",
                    marginBottom: 5,
                  },
                ]}
              >
                {title}
              </Text>
            </View>

            {/* Times */}
            <View style={[styles.col, styles.ROWyButtom_COLxRight]}>
              <View style={[styles.row]}>
                <Text
                  style={[
                    text.text12,
                    {
                      fontWeight: "bold",
                    },
                  ]}
                >
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
          <View
            style={{
              borderBottomWidth: 1,
              borderTopWidth: 1,
              paddingVertical: 5,
              borderBottomColor: colors.grey,
              borderTopColor: colors.grey,
              width: "90%",
              marginVertical: 2,
              // height: "40%",
            }}
          >
            <Text
              style={[
                text.text14,
                {
                  color: colors.dark,
                  fontWeight: "bold",
                  alignSelf: "flex-end",
                  textAlign: "right",
                },
              ]}
            >
              {limitCharacters(description, 55)}
            </Text>
          </View>

          {/* #Lower info */}
          <View
            style={[
              styles.row,
              styles.ROWxLeft_COLyTop,
              {
                justifyContent: "space-around",
                width: "100%",
              },
              highlights.brdr05,
            ]}
          >
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

                  {
                    width: screenWidth.width10,
                  },
                ]}
              >
                ريال {Number(price)}
              </Text>
            </View>

            {/* Location */}
            <View style={[styles.row, styles.ROWxLeft_COLyTop]}>
              <Text style={[text.text12, { textAlign: "right" }]}>
                {/* {limitCharacters(fakeLocation.full_name, 20)} */}
                {limitCharacters(location?.title, 20)}
              </Text>
              <MIcon
                name="map-marker"
                size={14}
                color="black"
                style={{ marginRight: 5 }}
              />
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

    // shadow stuff
    shadowColor: "#885d00",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  innerForm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginHorizontal: 6,
    marginVertical: 5,
    // paddingHorizontal: 10,

    // ...highlights. brdr01,
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
