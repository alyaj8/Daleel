import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  colors,
  highlights,
  imagePickerConfig,
  images,
  screenWidth,
} from "../../config/Constant";
import text from "../../style/text";
import { getFormattedDate, getFormattedTime } from "../../util/DateHelper";
import ActivityCard from "../activityComponents/ActivityCard";
import TouchableInput from "../inputText/DateTimeInput";
import InputMap from "../maps/InputMap";
import MIcon from "../MIcon";
import AppButton from "./../AppButton";

const ActivityForm = ({
  mode = "add",

  activity,
  activities,
  setActivity,
  activitiesMode,
  activitiesCustomizable,
  setTour,

  isModalVisible,
  openDatePicker,
  handleConfirm,
  isDatePickerVisible,

  onAddActivity,
  onRemoveActivity,
  onEditActivity,

  onRemoveActivitySubmit,
  onEditActivitySubmit,
  onEditActivityCancel,
}) => {
  const [imageUrl, setImageUrl] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      ...imagePickerConfig,
      aspect: [1, 1],
      maxHeight: 200,
      maxWidth: 200,
    });
    if (!result.canceled) {
      uploadImage(result.assets[0].uri)
        .then((imageUrl) => {
          // console.log("🚀 ~ imageUrl", imageUrl);
          setActivity({ ...activity, imageUrl: imageUrl });
        })
        .catch((error) => {
          console.log("🚀 ~ error", error);
        });
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const uploadImage = async (path) => {
    try {
      const uri = Platform.OS === "ios" ? path.replace("file://", "") : path;
      const response = await fetch(uri);
      const storage = getStorage();

      const fileName = uri.substring(uri.lastIndexOf("/") + 1);
      const blobFile = await response.blob();

      const reference = ref(storage, `media/${Date.now()}-${fileName}`);

      const result = await uploadBytesResumable(reference, blobFile);
      const url = await getDownloadURL(result.ref);
      // console.log("🚀 ~ url", url);

      return url;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return (
    <View style={[styles.container]}>
      {/* Form Section */}
      <View style={[styles.innerForm]}>
        {/* Name */}
        <TouchableInput
          label="اسم النشاط"
          placeholder="اكتب اسم النشاط"
          value={activity.title}
          onChangeText={(text) => setActivity({ ...activity, title: text })}
        />

        {/* Description */}
        <TouchableInput
          label="وصف النشاط"
          placeholder="اكتب وصف النشاط"
          value={activity.description}
          multiline
          onChangeText={(text) =>
            setActivity({ ...activity, description: text })
          }
        />

        {/* Location */}
        <InputMap
          label="موقع النشاط"
          placeholder="اختر موقع النشاط"
          value={activity.location}
          onSelectLocation={(location) => {
            return setActivity({ ...activity, location: location });
          }}
          onClearLocation={() => setActivity({ ...activity, location: "" })}
        />

        {/* Date */}
        <TouchableInput
          label="تاريخ النشاط"
          placeholder="اختر تاريخ النشاط"
          editable={false}
          icon={true}
          source={images.calendar}
          value={activity.date ? getFormattedDate(activity.date) : ""}
          // value={getFormattedDate(new Date())}
          onPress={() => openDatePicker("activityDate")}
        />
        {/* Start time, End time */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableInput
            label="وقت نهاية الجولة"
            placeholder="اختر وقت نهاية"
            editable={false}
            icon={true}
            source={images.timer}
            value={activity.endTime ? getFormattedTime(activity.endTime) : ""}
            // value={getFormattedDate(new Date())}
            onPress={() => openDatePicker("activityEndTime")}
            style={{ marginRight: 2 }}
          />

          <TouchableInput
            label="وقت بداية الجولة"
            placeholder="اختر وقت بداية"
            editable={false}
            icon={true}
            source={images.timer}
            value={
              activity.startTime ? getFormattedTime(activity.startTime) : ""
            }
            // value={getFormattedDate(new Date())}
            onPress={() => openDatePicker("activityStartTime")}
            style={{ marginLeft: 2 }}
          />
        </View>

        {/* Price & Image */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            alignItems: "flex-start",
          }}
        >
          <TouchableInput
            label="سعر النشاط"
            placeholder="سعر النشاط"
            value={activity.price}
            // value={activity?.price?.toString() || ""}
            keyboardType="numeric"
            icon={true}
            source={images.cart}
            onChangeText={(text) => setActivity({ ...activity, price: text })}
            style={{
              marginRight: 2,
              marginTop: 0,
              marginRight: 15,
            }}
          />
          {/* Image */}
          <View
            style={{
              marginLeft: 2,
              width: screenWidth.width40,
            }}
          >
            <Text style={[text.themeDefault, text.text15]}>
              ارفق صورة للنشاط
            </Text>
            {activity.imageUrl ? (
              <View
                style={{
                  // marginTop: screenWidth.width20,
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    // removeImage
                    setActivity({ ...activity, imageUrl: null });
                  }}
                >
                  <Image
                    source={{ uri: activity.imageUrl }}
                    style={{
                      width: screenWidth.width30,
                      height: screenWidth.width30,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  pickImage();
                }}
                style={{ alignItems: "flex-end" }}
              >
                <Image
                  source={images.photo}
                  style={{
                    width: screenWidth.width30,
                    height: screenWidth.width30,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Button */}
        <View style={{ marginTop: 20, marginBottom: 10, alignItems: "center" }}>
          {mode === "add" ? (
            <AppButton
              disabled={
                !activity.title ||
                !activity.description ||
                !activity.price ||
                !activity.imageUrl ||
                !activity.startTime ||
                !activity.endTime
              }
              title={"إضافة النشاط"}
              onPress={() => {
                onAddActivity();
              }}
              style={{ width: screenWidth.width80, height: 60 }}
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                // ...no_highlights.brdr01,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppButton
                // disabled={disabled}
                title={"حفظ التغييرات"}
                onPress={() => {
                  onEditActivitySubmit();
                }}
                style={{ width: screenWidth.width30, height: 50 }}
              />
              <View style={{ width: 10 }} />
              <AppButton
                // disabled={disabled}

                style={{
                  backgroundColor: colors.green,
                  width: screenWidth.width30,
                  height: 50,
                }}
                title={"إلغاء التعديل"}
                onPress={() => {
                  onEditActivityCancel();
                }}
              />

              <MIcon
                name="delete"
                size={50}
                color={colors.red}
                style={{ marginHorizontal: 10 }}
                onPress={() => {
                  onRemoveActivitySubmit();
                }}
              />
            </View>
          )}
        </View>
      </View>

      {/* Activities Section */}
      <View style={[styles.innerForm]}>
        {activities.length === 0 && (
          <View
            style={{
              // marginVertical: 10,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: -15,
              ...highlights.brdr03,
            }}
          >
            <Text
              style={[
                text.grey,
                text.text20,
                // text.center,
                {
                  fontWeight: "bold",
                },
              ]}
            >
              لم يتم اضافة أي نشاط
            </Text>
          </View>
        )}
        {
          // Activity List
          <View style={{ marginVertical: 10 }}>
            {activities.map((value, index) => (
              <ActivityCard
                key={index}
                activity={value}
                onEditActivity={onEditActivity}
                onRemoveActivity={onRemoveActivity}
              />
            ))}
          </View>
        }
      </View>

      {/* Price & Control Section */}
      {activities.length > 0 && (
        <View style={[styles.innerForm]}>
          {/* Price */}
          <View
            style={[
              {
                marginRight: 20,
              },
            ]}
          >
            <Text style={[text.themeDefault, text.text20, text.right]}>
              السعر الإجمالي للرحلة:{" "}
              {
                // totalPrice
                activities.reduce((a, b) => a + Number(b.price), 0)
              }{" "}
              ريال
            </Text>
          </View>

          {/* Activities Editable Checkbox */}
          <View
            style={[
              styles.alignCenter,
              {
                flex: 1,
                // width: "100%",
                // marginTop: 20,
                alignItems: "flex-end",
                // justifyContent: "center",
                marginHorizontal: 30,
                marginVertical: 10,
                // backgroundColor: colors.white,
                // transparent background color
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: 20,
              },
            ]}
          >
            <View
              style={{
                width: screenWidth.width90,
                // ...no_highlights.brdr1,
                alignItems: "flex-end",
                justifyContent: "center",
                padding: 10,
                marginRight: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[text.white, text.text14]}>
                  السماح للسائح بتخصيص أنشطة هذه الرحلة
                </Text>
                <Switch
                  value={activitiesCustomizable}
                  onValueChange={() =>
                    setTour((prevState) => ({
                      ...prevState,
                      activitiesCustomizable: !prevState.activitiesCustomizable,
                    }))
                  }
                  color={colors.themeDefault}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ActivityForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: colors.grayBg,
    borderRadius: 10,
    padding: 5,
    // height: "100%",
    // marginHorizontal: 20,
    // marginVertical: 20,
    ...highlights.brdr02,
  },
  innerForm: {
    ...highlights.brdr01,
    backgroundColor: colors.white,
    marginHorizontal: 4,
    width: screenWidth.width95,
    padding: 10,
    ...highlights.brdr03,

    flex: 1,
    marginBottom: 10,
    borderRadius: 10,
    // light Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    elevation: 2,
  },
  title: {
    alignSelf: "flex-end",
    fontSize: 20,
  },
});
