import { PortalProvider } from "@gorhom/portal";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import RBSheet from "react-native-raw-bottom-sheet";
import Button from "../../component/button/Button";
import Input from "../../component/inputText/Input";
import SmallInput from "../../component/inputText/smallInput";
import {
  cities,
  colors,
  imagePickerConfig,
  images,
  REQUEST_TABLE,
  screenWidth,
} from "../../config/Constant";
import { getUserId, insertTour } from "../../network/ApiService";
import text from "../../style/text";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import ActivityForm from "../../component/forms/ActivityForm";
import Loading from "../../component/Loading";
import InputMap from "../../component/maps/InputMap";
import { getFormattedDate, getFormattedTime } from "../../util/DateHelper";
import { getDataFromStorage } from "../../util/Storage";
import ActivityCard from "./../../component/activityComponents/ActivityCard";

export default function PostTour({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerConfig, setPickerConfig] = useState("date"); // date, startTime, endTime
  const [isLoading, setIsLoading] = useState(false);
  const modalizeRef = useRef(null);

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [qty, setQty] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");

  // logObj(
  //   meetingPoint,
  //   "🚀 ~ file: PostTour.js ~ line 85 ~ PostTour ~ meetingPoint"
  // );

  const [age, setAge] = useState("");
  // const [price, setPrice] = useState(100);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const [date, setDate] = useState(nowDate);
  const [startTime, setStartTime] = useState(nowDate);
  const [endTime, setEndTime] = useState(nowDate);

  const [activitiesCustomizable, setActivitiesCustomizable] = useState(false);
  const [activitiesMode, setActivitiesMode] = useState("add"); // add, edit

  const [activity, setActivity] = useState({
    id: null,
    title: "",
    description: "",
    location: "",
    date: new Date(),
    //yesterday
    startTime: null,
    endTime: null,
    price: "",
    imageUrl: null,
  });

  // activities fake data it should be fetched from firebase
  const [activities, setActivities] = useState([]);

  const status = 0;

  let ages = ["عائلية", "كبار"];

  const disabled = !title || !meetingPoint || !description || !qty;
  const modalizeRefAge = useRef(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      ...imagePickerConfig,
    });
    if (!result.canceled) {
      setFilePath(result.assets[0].uri);
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

  const submitRequest = async () => {
    try {
      setIsLoading(true);
      setModalVisible(!isModalVisible);
      const isTourHasImage = filePath ? true : false;

      let imageUrl = null;
      if (isTourHasImage) {
        imageUrl = await uploadImage(filePath);
        // console.log("🚀 ~ imageUrl", imageUrl);
      }

      const userId = await getUserId();
      const tourDone = isTourHasImage && !!imageUrl ? true : false;
      if (tourDone || !isTourHasImage) {
        const data = {
          title,
          description,
          age,
          imageUrl,
          city,
          meetingPoint,
          qty,
          date,
          startTime,
          endTime,
          status,
          requestBy: userId,
          dateCreated: Date.now(),
          dateUpdated: null,
          // activities:
          activitiesCustomizable,
          activities: activities,
        };
        // logObj(data);
        await insertTour(data, REQUEST_TABLE);
        setIsLoading(false);
        navigation.goBack();
      }

      // setLoading(false);
      // navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
      alert("حدث خطأ ما، الرجاء المحاولة مرة أخرى");
      console.log("error submitRequest", error);
    }
  };

  const onShowCity = () => {
    modalizeRef.current?.open();
  };

  const selectCity = (city) => {
    setCity(city);
    modalizeRef.current?.close();
  };

  const selectAge = (age) => {
    setAge(age);
    modalizeRefAge.current?.close();
  };
  const onOpen = () => {
    modalizeRefAge.current?.open();
  };

  useEffect(() => {
    getDataFromStorage("loggedInUser").then((data) => {
      // console.log("user data", data.email);
    });
  }, []);

  const onShowPicker = (type) => {
    setPickerConfig(type);
    setShowPicker(true);
  };

  const onPickerChange = (event, value) => {
    // const date = new Date(value?.getTime());
    // console.log("🚀 ~ value", value);
    setShowPicker(false);
    if (event.type === "set") {
      if (pickerConfig === "date") {
        setDate(value);
      } else if (pickerConfig === "startTime") {
        setStartTime(value);
      } else if (pickerConfig === "endTime") {
        setEndTime(value);
      } else if (pickerConfig === "activityDate") {
        setActivity({ ...activity, date: value });
      } else if (pickerConfig === "activityStartTime") {
        setActivity({ ...activity, startTime: value });
      } else if (pickerConfig === "activityEndTime") {
        setActivity({ ...activity, endTime: value });
      }
    }
  };

  const onAddActivity = () => {
    setActivities([
      ...activities,
      {
        ...activity,
        id: activities.length + 1,
      },
    ]);

    // setActivity({
    //   title: "",
    //   description: "",
    //   location: "",
    //   date: null,
    //   startTime: null,
    //   endTime: null,
    // });
  };
  // logObj(activities);
  const onRemoveActivity = () => {
    setActivities(activities.slice(0, -1));
  };
  const onEditActivity = (id) => {
    setActivitiesMode("edit");
    setActivity(activities.find((a) => a.id === id));
  };

  const onEditActivitySubmit = () => {
    const index = activities.findIndex((a) => a.id === activity.id);
    const newActivities = [...activities];
    newActivities[index] = activity;
    setActivities(newActivities);
    setActivitiesMode("add");
    setActivity({
      title: "",
      description: "",
      location: "",
      date: null,
      startTime: null,
      endTime: null,
    });
  };

  const onEditActivityCancel = () => {
    setActivitiesMode("add");
    setActivity({
      title: "",
      description: "",
      location: "",
      date: null,
      startTime: null,
      endTime: null,
    });
  };

  const onRemoveActivitySubmit = () => {
    setActivities(activities.filter((a) => a.id !== activity.id));
    setActivitiesMode("add");
    setActivity({
      title: "",
      description: "",
      location: "",
      date: null,
      startTime: null,
      endTime: null,
    });
  };

  const onRemoveTourLocation = () => {
    setMeetingPoint({});
  };

  const onSelectActivityLocation = (location) => {
    const { id, title, full_name, address, category } = location;
    setActivity({
      ...activity,
      location: { id, title, full_name, address, category },
    });
  };

  const onRemoveActivityLocation = () => {
    setActivity({
      ...activity,
      location: {},
    });
  };

  const nowDate = null;
  const newDate = new Date();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Loading text="جاري نشر الجولة..." visible={isLoading} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {showPicker && (
          <DateTimePicker
            minimumDate={new Date()}
            mode={
              pickerConfig === "date" || pickerConfig === "activityDate"
                ? "date"
                : "time"
            }
            value={
              pickerConfig === "date"
                ? date || newDate
                : pickerConfig === "startTime"
                ? startTime || newDate
                : pickerConfig === "endTime"
                ? endTime || newDate
                : pickerConfig === "activityDate"
                ? activity.date || newDate
                : pickerConfig === "activityStartTime"
                ? activity.startTime || newDate
                : pickerConfig === "activityEndTime"
                ? activity.endTime || newDate
                : newDate
            }
            display={Platform.OS === "ios" ? "calendar" : "default"}
            // is24Hour={true}
            onChange={onPickerChange}
            style={styles.datePicker}
          />
        )}

        <ImageBackground
          style={{ flex: 1 }}
          source={images.backgroundImg}
          resizeMode="cover"
        >
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <Text
              style={[
                text.white,
                text.text30,
                { fontWeight: "bold", marginTop: 20 },
              ]}
            >
              نشر جولة
            </Text>
          </View>

          {/* Image */}
          {filePath ? (
            <TouchableOpacity
              onPress={() => {
                // remove image
                setFilePath(null);
              }}
              style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
            >
              <Image source={{ uri: filePath }} style={[styles.dummyImg]} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => pickImage()}
              style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
            >
              <Image source={images.photo} style={[styles.dummyImg]} />
            </TouchableOpacity>
          )}

          {/* Name */}
          <View style={[styles.alignCenter]}>
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>اسم الجولة</Text>
            </View>
            <Input
              value={title}
              placeholder="اكتب اسم الجولة"
              placeholderTextColor={colors.grey}
              onChangeText={(text) => setTitle(text)}
            />
          </View>

          {/* Description */}
          <View style={[styles.alignCenter]}>
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>وصف الجولة</Text>
            </View>
            <Input
              value={description}
              placeholder="اكتب وصف الجولة"
              multiline
              placeholderTextColor={colors.grey}
              onChangeText={(text) => setDescription(text)}
            />
          </View>

          {/* Date */}
          <View style={[styles.alignCenter]}>
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>تاريخ الجولة</Text>
            </View>

            <TouchableOpacity onPress={() => onShowPicker("date")} style={[]}>
              <Input
                value={date ? getFormattedDate(date) : ""}
                icon={true}
                placeholder="اختر تاريخ الجولة"
                source={images.calendar}
                editable={false}
                style={{ color: colors.black }}
                //setValue={setDate}
              />
            </TouchableOpacity>
          </View>

          {/* Start time, End time */}
          <View style={[styles.timeFlex]}>
            <TouchableOpacity
              onPress={() => onShowPicker("endTime")}
              style={[styles.alignCenter, {}]}
            >
              <View
                style={[
                  styles.alignRight,
                  { marginHorizontal: 10, marginVertical: 10 },
                ]}
              >
                <Text style={[text.themeDefault, text.text15]}>
                  وقت نهاية الجولة
                </Text>
              </View>
              <Input
                value={endTime ? getFormattedTime(endTime) : ""}
                icon={true}
                source={images.timer}
                editable={false}
                placeholder="اختر وقت نهاية"
                style={{ width: screenWidth.width40, color: colors.black }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onShowPicker("startTime")}
              style={[styles.alignCenter, {}]}
            >
              <View
                style={[
                  styles.alignRight,
                  { marginHorizontal: 10, marginVertical: 10 },
                ]}
              >
                <Text style={[text.themeDefault, text.text15]}>
                  وقت بداية الجولة
                </Text>
              </View>
              <Input
                value={startTime ? getFormattedTime(startTime) : ""}
                icon={true}
                source={images.timer}
                editable={false}
                placeholder="اختر وقت بداية"
                style={{ width: screenWidth.width40, color: colors.black }}
              />
            </TouchableOpacity>
          </View>

          {/* Meet point */}
          <View style={[styles.alignCenter, {}]}>
            <View
              style={[
                styles.alignRight,
                {
                  marginHorizontal: 40,
                  marginVertical: 10,
                },
              ]}
            >
              <Text style={[{}, text.themeDefault, text.text15]}>
                نقطة اللقاء
              </Text>
            </View>
            {/* MapPicker */}
            <InputMap
              placeholder="اختر نقطة اللقاء"
              value={meetingPoint}
              onSelectLocation={(location) => setMeetingPoint(location)}
              onClearLocation={() => setMeetingPoint("")}
              style={{
                marginHorizontal: 20,
              }}
            />
          </View>

          {/* City */}
          <View style={[styles.alignCenter, {}]}>
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>المدينة</Text>
            </View>
            <TouchableOpacity
              onPress={() => onShowCity()}
              style={[styles.InputStyleModal]}
            >
              {city ? (
                <Text style={[text.black, text.text15, { textAlign: "right" }]}>
                  {city}
                </Text>
              ) : (
                <Text style={[text.grey, text.text15, { textAlign: "right" }]}>
                  اختر المدينة
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <RBSheet ref={modalizeRef} height={screenWidth.width80}>
            <ScrollView
              contentContainerStyle={{
                // ...no_highlights.brdr1,
                width: "100%",
                alignSelf: "center",
                marginTop: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
              showsVerticalScrollIndicator={false}
            >
              {cities.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.sheetText]}
                  onPress={() => selectCity(value)}
                  style={{
                    // ...no_highlights.brdr2,
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderColor: colors.grey,
                    borderBottomWidth: 1,
                    borderTopWidth: index === 0 ? 1 : 0,
                  }}
                >
                  <Text
                    style={[
                      {
                        fontWeight: "bold",
                      },
                      text.black,
                      text.text20,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </RBSheet>

          {/* Info */}
          <View
            style={[
              styles.smallInputDiv,
              {
                marginHorizontal: 20,
              },
            ]}
          >
            {/* Age */}
            <PortalProvider>
              <View
                style={[
                  {
                    width: screenWidth.width40,
                  },
                ]}
              >
                <View style={{ marginVertical: 10 }}>
                  <Text style={[text.themeDefault, text.text14]}>
                    الحد العمري
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.InputStyle,
                    {
                      width: screenWidth.width40,
                      height: screenWidth.width12,

                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => onOpen()}
                >
                  <Text
                    style={[
                      text.black,
                      text.text14,
                      {
                        textAlign: "center",
                        color: age ? text.black.color : text.grey.color,
                        alignSelf: "center",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {age ? age : "اختر العمر"}
                  </Text>
                </TouchableOpacity>
              </View>
            </PortalProvider>

            {/* Qty */}
            <View
              style={[
                {
                  flexDirection: "column",
                  justifyContent: "center",
                  // alignItems: "center",
                },
              ]}
            >
              <View
                style={[
                  {
                    marginVertical: 10,
                  },
                ]}
              >
                <Text style={[text.themeDefault, text.text14]}>عدد السياح</Text>
              </View>
              <SmallInput
                value={qty}
                keyboardType={"numeric"}
                onChangeText={(value) => setQty(value)}
                placeholder="اختر عدد السياح"
                style={{
                  backgroundColor: colors.white,
                  // marginVertical: 10,
                  width: screenWidth.width40,
                  height: screenWidth.width12,
                }}
                placeholderTextColor={colors.grey}
              />
            </View>
          </View>

          {/* Activeitys */}

          {/* Activity Form */}
          <ActivityForm
            formTitle={activitiesMode === "add" ? "اضافة نشاط" : "تعديل نشاط"}
            activity={activity}
            setActivity={setActivity}
            onShowPicker={onShowPicker}
            mode={activitiesMode}
            onAddActivity={onAddActivity}
            onRemoveActivity={onRemoveActivity}
            onEditActivity={onEditActivity}
            onRemoveActivitySubmit={onRemoveActivitySubmit}
            onEditActivitySubmit={onEditActivitySubmit}
            onEditActivityCancel={onEditActivityCancel}
          />

          {/* Activity List */}
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <SafeAreaView style={{ width: screenWidth.width90 }}>
              <View style={{ marginVertical: 10 }}>
                <Text style={[text.themeDefault, text.text30, text.center]}>
                  الأنشطة
                </Text>
              </View>

              {activities.length === 0 && (
                <View style={{ marginVertical: 10 }}>
                  <Text style={[text.grey, text.text20, text.center]}>
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
            </SafeAreaView>
          </View>

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
                width: "100%",
                // marginTop: 20,
                alignItems: "flex-end",
                // justifyContent: "center",
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
                <Text style={[text.grey, text.text14]}>
                  السماح للسائح بتخصيص أنشطة هذه الرحلة
                </Text>
                <Switch
                  value={activitiesCustomizable}
                  onValueChange={() =>
                    setActivitiesCustomizable(!activitiesCustomizable)
                  }
                  color={colors.themeDefault}
                />
              </View>
            </View>
          </View>

          {/* Post Button */}
          <View
            style={[styles.alignCenter, { marginTop: 20, marginBottom: 70 }]}
          >
            <Button
              // disabled={disabled}
              title={"نشر"}
              onpress={toggleModal}
            />
          </View>

          {/* Modal Sheet */}
          <RBSheet ref={modalizeRefAge} height={screenWidth.width50}>
            <ScrollView
              contentContainerStyle={{
                // ...no_highlights.brdr1,
                width: "100%",
                alignSelf: "center",
                marginTop: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
              showsVerticalScrollIndicator={false}
            >
              {ages.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.sheetText]}
                  onPress={() => selectAge(value)}
                  style={{
                    // ...no_highlights.brdr2,
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderColor: colors.grey,
                    borderBottomWidth: 1,
                    borderTopWidth: index === 0 ? 1 : 0,
                  }}
                >
                  <Text style={[text.black, text.text20]}>{value}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </RBSheet>
        </ImageBackground>
      </ScrollView>
      {/* Modal */}
      <Modal isVisible={isModalVisible}>
        <View style={[styles.modalView]}>
          <View style={[styles.main]}>
            <View style={{ marginVertical: 20 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text22,
                  { textAlign: "center" },
                ]}
              >
                هل أنت متأكد أنك تريد نشر هذه الجولة؟
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{}}>
                <Button title="نشر" onpress={submitRequest} />
              </View>
              <View style={{}}>
                <Button title="الغاء" onpress={toggleModal} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alignCenter: {
    alignItems: "center",
  },
  dummyImg: {
    width: screenWidth.width50,
    height: screenWidth.width50,
    resizeMode: "contain",
    // opacity: 0.7,
  },
  alignRight: {
    alignSelf: "flex-end",
  },
  smallInputDiv: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    backgroundColor: "#fff",
    width: screenWidth.width80,
    padding: 20,
    borderRadius: 20,
  },
  datePicker: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 40,
    marginBottom: 5,
  },
  InputStyle: {
    width: screenWidth.width25,
    padding: 5,
    borderWidth: 1,
    borderColor: "#5398a0",
    borderRadius: 20,
    paddingHorizontal: 10,

    textAlign: "right",
  },
  sheetText: {
    alignSelf: "center",
    marginVertical: 10,
  },
  timeFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  InputStyleModal: {
    width: screenWidth.width90,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#5398a0",
    borderRadius: 20,
    paddingHorizontal: 20,
    textAlign: "right",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#5398a0",
  },
  position: {
    position: "absolute",
    left: 0,
    marginLeft: 15,
  },
});

/*
  * @format tour object

  * title: "",
  * description: "",
  * age: "",
  * imageUrl: "",
  * city: "",
  * meetingPoint: "",
  * qty: 0,
  * date: new Date(),
  * startTime: new Date(),
  * endTime: new Date(),
  * status: 0,
  * requestBy: "",
  * dateCreated: new Date(),
  * dateUpdated: new Date(),
  * activitiesCustomizable: true,
  * activities: [
  *   {
  *     title: "",
  *     description: "",
  *     location: "",
  *     date: new Date(),
  *     startTime: new Date(),
  *     endTime: new Date(),
  *     price: 100,
  *     age: 10,
  *     imageUrl: "",
  *   }
  * ],
  * 

*/
