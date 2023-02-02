import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import {
  colors,
  highlights,
  imagePickerConfig,
  images,
  screenWidth,
} from "../../config/Constant";
import text from "../../style/text";
import ActivityCard from "../activityComponents/ActivityCard";
import MIcon from "../MIcon";
import AppButton from "./../AppButton";
import FormInputTouchable from "./FormInputTouchable";
import ImageForm from "./ImageForm";
import MapFrom from "./MapFrom";

const ActivityForm = ({
  mode = "idle",

  activity,
  activities,
  setActivity,
  activitiesMode,
  setActivitiesMode,
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

  // form state

  control,
  handleSubmit,
  errors,
  setValue,
  getValues,
  watch,
  reset,
  trigger,
}) => {
  const [imageUrl, setImageUrl] = useState(null);

  const pickImage = async () => {
    trigger("activity.imageUrl");
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
          setValue("activity.imageUrl", imageUrl);
          trigger("activity.imageUrl");
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

  const addDisabled =
    !!errors.activity ||
    !activity.title ||
    !activity.description ||
    !activity.location ||
    !activity.imageUrl ||
    !activity.startTime ||
    !activity.endTime ||
    !activity.price;
  return (
    <>
      <View style={[styles.container]}>
        {/* Form Section */}
        {mode === "idle" ? (
          <AppButton
            title="إضافة نشاط"
            onPress={() => setActivitiesMode("add")}
            style={{
              width: "98%",
              alignSelf: "center",
              marginVertical: 15,
              height: 70,
            }}
          />
        ) : (
          <View style={[styles.innerForm]}>
            {/* act_title */}
            <FormInputTouchable
              // debug
              label="اسم النشاط"
              placeholder="اكتب اسم النشاط"
              editable
              // Form
              name="activity.title"
              control={control}
              // rest
              onChangeText={(text) => {
                setActivity({ ...activity, title: text });
              }}
            />

            {/* act_description */}
            <FormInputTouchable
              // debug
              // Form
              name="activity.description"
              control={control}
              // rest
              label="وصف النشاط"
              placeholder="اكتب وصف النشاط"
              editable
              multiline
              onChangeText={(text) => {
                setActivity({ ...activity, description: text });
              }}
            />

            {/* location */}
            <MapFrom
              name="activity.location"
              control={control}
              // rest

              label="موقع النشاط"
              placeholder="اختر موقع النشاط"
              // value={activity.location}
              onSelectLocation={(location) => {
                setActivity({ ...activity, location: location });
                setValue("activity.location", location);
                trigger("activity.location");
              }}
              onClearLocation={() => {
                setActivity({ ...activity, location: "" });
                setValue("activity.location", null);
                trigger("activity.location");
              }}
            />

            {/* activityStartTime, activityEndTime time */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <FormInputTouchable
                // debug
                // Form
                name="activity.endTime"
                control={control}
                // rest
                label="وقت نهاية النشاط"
                placeholder="اختر وقت نهاية"
                editable={false}
                icon={true}
                source={images.timer}
                onPress={() => openDatePicker("activityEndTime")}
                style={{ marginRight: 2 }}
              />

              <FormInputTouchable
                // debug
                // Form
                name="activity.startTime"
                control={control}
                // rest
                label="وقت بداية النشاط"
                placeholder="اختر وقت بداية"
                editable={false}
                icon={true}
                source={images.timer}
                onPress={() => openDatePicker("activityStartTime")}
                style={{ marginLeft: 2 }}
              />
            </View>

            {/* price & activityImage */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                flexWrap: "nowrap",
                alignItems: "flex-start",
              }}
            >
              <FormInputTouchable
                // debug
                // Form
                name="activity.price"
                control={control}
                // rest
                label="سعر النشاط"
                placeholder="سعر النشاط"
                keyboardType="numeric"
                icon={true}
                onChangeText={(text) => {
                  setActivity({ ...activity, price: text });
                }}
                source={images.cart}
                style={{
                  // marginRight: 2,
                  // marginTop: 0,
                  // marginRight: 15,
                  width: screenWidth.width40,
                }}
              />
              {/* Image */}
              <ImageForm
                // debug
                // Form
                name="activity.imageUrl"
                control={control}
                // rest
                label="ارفق صورة للنشاط"
                // style
                onRemoveImage={() => {
                  setActivity({ ...activity, imageUrl: null });
                  setValue("activity.imageUrl", null);
                  trigger("activity.imageUrl");
                }}
                onPickImage={pickImage}
                style={{
                  alignItems: "center",
                  justifyContent: "center",

                  marginLeft: 2,
                  marginTop: 0,
                  marginLeft: 15,
                  width: screenWidth.width40,
                }}
              />
            </View>

            {/* Button */}
            <View
              style={{ marginTop: 20, marginBottom: 10, alignItems: "center" }}
            >
              {mode === "add" ? (
                <AppButton
                  disabled={addDisabled}
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
        )}

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
                        activitiesCustomizable:
                          !prevState.activitiesCustomizable,
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
    </>
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
