import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import { getFormattedDate, getFormattedTime } from "../../util/DateHelper";
import Button from "../button/Button";
import Input from "../inputText/Input";
import MIcon from "../MIcon";

const ActivityForm = ({
  formTitle = "Activity Form",
  data,
  mode,
  activity,
  setActivity,
  onShowPicker,

  onAddActivity,
  onRemoveActivity,
  onEditActivity,

  onRemoveActivitySubmit,
  onEditActivitySubmit,
  onEditActivityCancel,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // console.log("🚀 ~ activity", activity);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
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

      const reference = ref(storage, `media/${fileName}`);

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
      <Text style={styles.title}>{formTitle}</Text>

      <View style={[styles.innerForm]}>
        {/* Name */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={[{ marginVertical: 10, alignSelf: "flex-end" }]}>
            <Text style={[text.themeDefault, text.text15]}>اسم النشاط</Text>
          </View>
          <Input
            placeholder="اكتب اسم النشاط"
            value={activity.title}
            onChangeText={(text) => setActivity({ ...activity, title: text })}
            style={{ width: screenWidth.width80 }}
          />
        </View>

        {/* Description */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={[{ marginVertical: 10, alignSelf: "flex-end" }]}>
            <Text style={[text.themeDefault, text.text15]}>وصف النشاط</Text>
          </View>
          <Input
            placeholder="اكتب وصف النشاط"
            multiline
            value={activity.description}
            onChangeText={(text) =>
              setActivity({ ...activity, description: text })
            }
            style={{ width: screenWidth.width80 }}
          />
        </View>

        {/* Location */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={[{ marginVertical: 10, alignSelf: "flex-end" }]}>
            <Text style={[text.themeDefault, text.text15]}>موقع النشاط</Text>
          </View>
          <Input
            placeholder="اختر موقع النشاط"
            multiline
            value={activity.location}
            onChangeText={(text) =>
              setActivity({ ...activity, location: text })
            }
            style={{ width: screenWidth.width80 }}
            source={images.location}
            icon={true}
          />
        </View>

        {/* Date */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={[{ marginVertical: 10, alignSelf: "flex-end" }]}>
            <Text style={[text.themeDefault, text.text15]}>تاريخ الجولة</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              // console.log("date");
              onShowPicker("activityDate");
            }}
          >
            <Input
              icon={true}
              value={activity.date ? getFormattedDate(activity.date) : ""}
              source={images.calendar}
              editable={false}
              style={{ width: screenWidth.width80 }}
              placeholder="اختر تاريخ النشاط"
            />
          </TouchableOpacity>
        </View>

        {/* Time */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 20,
            width: screenWidth.width80,
            // ...highlights.brdr3,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // console.log("end time");
              onShowPicker("activityEndTime");
            }}
            style={{
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginVertical: 10,
                alignSelf: "flex-end",
              }}
            >
              <Text style={[text.themeDefault, text.text15]}>
                وقت نهاية الجولة
              </Text>
            </View>
            <Input
              icon={true}
              source={images.timer}
              editable={false}
              placeholder="اختر وقت نهاية"
              value={activity.endTime ? getFormattedTime(activity.endTime) : ""}
              style={{ width: screenWidth.width38 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // console.log("start time");
              onShowPicker("activityStartTime");
            }}
            style={{
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginVertical: 10,
                alignSelf: "flex-end",
              }}
            >
              <Text style={[text.themeDefault, text.text15]}>
                وقت بداية الجولة
              </Text>
            </View>
            <Input
              icon={true}
              source={images.timer}
              editable={false}
              value={
                activity.startTime ? getFormattedTime(activity.startTime) : ""
              }
              placeholder="اختر وقت بداية"
              style={{ width: screenWidth.width38 }}
            />
          </TouchableOpacity>
        </View>

        {/* Price & Image */}
        <View
          style={{
            // alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "space-between",
            // alignItems: "center",
            marginVertical: 10,
            // ...highlights.brdr3,
            width: screenWidth.width80,
          }}
        >
          <View
            style={[
              {
                flexDirection: "column",
                // ...highlights.brdr1,
              },
            ]}
          >
            <Text style={[text.themeDefault, text.text15]}>سعر النشاط</Text>
            <Input
              placeholder="سعر النشاط"
              multiline
              value={activity?.price?.toString() || ""}
              keyboardType="numeric"
              onChangeText={(text) => setActivity({ ...activity, price: text })}
              style={{ width: screenWidth.width38, marginVertical: 10 }}
              source={images.cart}
              icon={true}
            />
          </View>

          {/* Image */}
          <View
            style={
              {
                // ...highlights.brdr2,
              }
            }
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
                style={{ marginTop: 10, alignItems: "flex-end" }}
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
            <Button
              // disabled={disabled}
              title={"إضافة النشاط"}
              onpress={() => {
                onAddActivity();
              }}
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                // ...highlights.brdr1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                // disabled={disabled}
                title={"حفظ التغييرات"}
                onpress={() => {
                  onEditActivitySubmit();
                }}
              />
              <View style={{ width: 10 }} />
              <Button
                // disabled={disabled}

                style={{ backgroundColor: colors.red }}
                title={"إلغاء التعديل"}
                onpress={() => {
                  onEditActivityCancel();
                }}
              />

              <MIcon
                name="delete"
                size={30}
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
    marginHorizontal: 20,
    marginVertical: 20,

    backgroundColor: colors.grayBg,
    borderRadius: 10,
    padding: 5,
  },
  innerForm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,

    // ...highlights.brdr1,
  },
  title: {
    alignSelf: "flex-end",
    fontSize: 20,
  },
});
