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
  highlights,
  imagePickerConfig,
  images,
  screenWidth,
} from "../../config/Constant";
import { getUserId, updateTour } from "../../network/ApiService";
import text from "../../style/text";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import ActivityCard from "../../component/activityComponents/ActivityCard";
import AppButton from "../../component/AppButton";
import ActivityForm from "../../component/forms/ActivityForm";
import InputMap from "../../component/maps/InputMap";
import MIcon from "../../component/MIcon";
import { getFormattedDate, getFormattedTime } from "../../util/DateHelper";
import Loading from "./../../component/Loading";

const initActivity = {
  id: null,
  title: "",
  description: "",
  location: "",
  date: null,
  startTime: null,
  endTime: null,
  price: null,
  imageUrl: null,
};

export default function EditTourV2({ navigation, route }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const modalizeRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerConfig, setPickerConfig] = useState("date"); // date, startTime, endTime

  const [tourId, setTourId] = useState(null);
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [qty, setQty] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");

  // logObj(meetingPoint, "🚀 ~ Edit > meetingPoint");

  const [age, setAge] = useState("");
  // const [price, setPrice] = useState(100);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [activitiesCustomizable, setActivitiesCustomizable] = useState(false);
  const [activitiesMode, setActivitiesMode] = useState("add"); // add, edit

  const [activity, setActivity] = useState(initActivity);

  // activities fake data it should be fetched from firebase
  const [activities, setActivities] = useState([]);

  const status = 0;

  let ages = [
    "0 - 10",
    "10 - 20",
    "20 - 30",
    "30 - 40",
    "40 - 50",
    "50 - 60",
    "60 - 70",
  ];

  const disabled = !title || !meetingPoint || !description || !qty;
  const modalizeRefAge = useRef(null);

  const getTourRequests = async () => {
    const uid = await getUserId();
    const data = [];
    const q = query(collection(db, "tours"), where("requestBy", "==", uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
        // console.log("doc", doc.id);
        setTourId(doc.id);
      });
    });
  };

  const deleteTour = async () => {
    setDeleteModalVisible(!isDeleteModalVisible);
    setIsLoading(true);
    const response = await deleteRequest(tourId);
    // console.log("response", response);
    setIsLoading(false);
    if (response) {
      // alert("Tour Deleted Successfully");
      navigation.navigate("TourDetail");
    }
  };

  useEffect(() => {
    let tour = route.params.data;
    // logObj(tour, "tour");
    setTitle(tour.title);
    setCity(tour.city);
    setQty(tour.qty);
    setMeetingPoint(tour.meetingPoint);
    setAge(tour.age);
    // setPrice(tour.price);
    setDescription(tour.description);
    setImageUrl(tour.imageUrl);
    setActivities(tour.activities);
    setTourId(tour.id);
    setDate(() => {
      // check if new Date() obj or firebase timestamp
      if (tour.date.toDate) {
        return tour.date.toDate();
      } else {
        return tour.date;
      }
    });
    setStartTime(
      tour.startTime.toDate ? tour.startTime.toDate() : tour.startTime
    );
    setEndTime(tour.endTime.toDate ? tour.endTime.toDate() : tour.endTime);
    setActivitiesCustomizable(tour.activitiesCustomizable);
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      ...imagePickerConfig,
    });
    if (!result.canceled) {
      setFilePath(result.assets[0].uri);
      setImageUrl(result.assets[0].uri);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalDelete = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
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

  const isTourHasImage = filePath ? true : false;
  // console.log("🚀 ~ OUR> isTourHasImage", isTourHasImage);
  // console.log("🚀 ~ OUT> tour", route.params.data.imageUrl);

  const submitRequest = async () => {
    setIsLoading(true);
    try {
      // setModalVisible(!isModalVisible);
      const isNewImg = filePath ? true : false;

      let localImg = null;

      if (isNewImg) {
        localImg = await uploadImage(filePath);
      }

      const userId = await getUserId();
      const tourDone = isNewImg && !!localImg ? true : false;

      const newTour = {
        title,
        city,
        qty,
        meetingPoint: {
          address: meetingPoint.address ? meetingPoint.address : "",
          category: meetingPoint.category ? meetingPoint.category : [],
          coordinates: { latitude: 24.806149, longitude: 46.639029 },
          full_name: meetingPoint.full_name ? meetingPoint.full_name : "",
          id: meetingPoint.id ? meetingPoint.id : "",
          title: meetingPoint.title ? meetingPoint.title : "",
        },
        age,
        // price,
        description,
        imageUrl: isNewImg ? localImg : imageUrl,
        activities,
        date,
        startTime,
        endTime,
        // status: tourDone ? "approved" : "pending",
        dateUpdated: new Date(),
        activitiesCustomizable: activitiesCustomizable,
      };

      // console.log("🚀 ~ tour", route.params.data.imageUrl);
      // console.log("🚀 ~ newTour", newTour.imageUrl);

      if (tourDone || !isNewImg) {
        // console.log("1");
        await updateTour(tourId, newTour);
        // alert("Tour Updated Successfully");
        setIsLoading(false);
        navigation.goBack();
      }

      // const response = await addRequest(newTour);
      // console.log("🚀 ~ no condition met");
      setIsLoading(false);
      // navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
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

  const onShowPicker = (type) => {
    setPickerConfig(type);
    setShowPicker(true);
  };

  const onPickerChange = (event, value) => {
    // check if value is null
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

  const getPickerValue = () => {
    const data =
      pickerConfig === "date"
        ? date || new Date()
        : pickerConfig === "startTime"
        ? startTime || new Date()
        : pickerConfig === "endTime"
        ? endTime || new Date()
        : pickerConfig === "activityDate"
        ? activity.date || new Date()
        : pickerConfig === "activityStartTime"
        ? activity.startTime || new Date()
        : pickerConfig === "activityEndTime"
        ? activity.endTime || new Date()
        : null;

    // check if data is null
    if (data === null) {
      return new Date();
    }

    // check if data is firestore timestamp
    if (data.toDate) {
      return data.toDate();
    }

    return data;
  };

  const onAddActivity = () => {
    setActivities([
      ...activities,
      {
        ...activity,
        id: activities.length + 1,
      },
    ]);

    // setActivity(initActivity);
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
    newActivities[index] = {
      ...activity,
      meetingPoint: {
        address: meetingPoint.address ? meetingPoint.address : "",
        category: meetingPoint.category ? meetingPoint.category : [],
        coordinates: { latitude: 24.806149, longitude: 46.639029 },
        full_name: meetingPoint.full_name ? meetingPoint.full_name : "",
        id: meetingPoint.id ? meetingPoint.id : "",
        title: meetingPoint.title ? meetingPoint.title : "",
      },
    };
    setActivities(newActivities);
    setActivitiesMode("add");
    setActivity(initActivity);
  };

  const onEditActivityCancel = () => {
    setActivitiesMode("add");
    setActivity(initActivity);
  };

  const onRemoveActivitySubmit = () => {
    setActivities(activities.filter((a) => a.id !== activity.id));
    setActivitiesMode("add");
    setActivity(initActivity);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* Loading */}

      <Loading visible={isLoading} text="تحديث الجولة..." />
      <ScrollView showsVerticalScrollIndicator={false}>
        {showPicker && (
          <DateTimePicker
            minimumDate={new Date()}
            mode={
              pickerConfig === "date" || pickerConfig === "activityDate"
                ? "date"
                : "time"
            }
            value={getPickerValue()}
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
            <Text style={[text.white, text.text30, { fontWeight: "bold" }]}>
              تحديث جولة
            </Text>
          </View>

          {/* Image */}
          {imageUrl ? (
            <TouchableOpacity
              onPress={() => pickImage()}
              style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
            >
              <Image source={{ uri: imageUrl }} style={[styles.dummyImg]} />
            </TouchableOpacity>
          ) : filePath ? (
            <TouchableOpacity
              onPress={() => pickImage()}
              style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
            >
              <Image source={{ filePath }} style={[styles.dummyImg]} />
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
              multiline
              placeholder="اكتب وصف الجولة"
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
                //value={date ? getFormattedDate(date) : ""}
                placeholder="اختر تاريخ الجولة"
                source={images.calendar}
                editable={false}
                // setValue={setDate}
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
                //value={endTime ? getFormattedTime(endTime) : ""}
                style={{ width: screenWidth.width40 }}
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
                //value={startTime ? getFormattedTime(startTime) : ""}
                placeholder="اختر وقت بداية"
                style={{ width: screenWidth.width40 }}
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
              style={{ alignSelf: "center", marginTop: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {cities.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.sheetText]}
                  onPress={() => selectCity(value)}
                >
                  <Text style={[text.black, text.text20]}>{value}</Text>
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
                      backgroundColor: "#fff",

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
                {/* <Text style={[text.themeDefault, text.text14]}>(اختياري)</Text> */}
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
            /*  */
            onAddActivity={onAddActivity}
            //
            onRemoveActivity={onRemoveActivity}
            onRemoveActivitySubmit={onRemoveActivitySubmit}
            //
            onEditActivity={onEditActivity}
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
              {activities.map((value, index) => (
                <ActivityCard
                  key={index}
                  onEditActivity={onEditActivity}
                  onRemoveActivity={onRemoveActivity}
                  activity={value}
                  // item={item}
                  // index={index}
                  onShowPicker={onShowPicker}
                />
              ))}
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
                // ...highlights.brdr1,
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
                <Text
                  style={[
                    text.white,
                    text.text14,
                    {
                      fontWeight: "bold",
                    },
                  ]}
                >
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

          {/* Buttons */}
          <View
            style={{
              marginHorizontal: 30,
              marginVertical: 10,
              marginBottom: 40,
            }}
          >
            <AppButton
              disabled={
                !title ||
                !city ||
                !qty ||
                !meetingPoint ||
                !description ||
                !imageUrl ||
                !date ||
                !startTime ||
                !endTime ||
                !description ||
                !age
              }
              title={"حفظ التغييرات"}
              style={{
                backgroundColor: colors.Blue,
                height: screenWidth.width15,
              }}
              onPress={() => {
                submitRequest();
              }}
            />
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                ...highlights.brdr01,
              }}
            >
              <AppButton
                // disabled={disabled}
                style={{
                  backgroundColor: colors.brown,
                  width: screenWidth.width70,
                  height: screenWidth.width12,
                }}
                title={"إلغاء التعديل"}
                onPress={() => {
                  navigation.goBack();
                }}
              />

              <MIcon
                name="delete"
                size={45}
                color={colors.brown}
                style={{ marginHorizontal: 10 }}
                onPress={() => {
                  toggleModalDelete();
                }}
              />
            </View>
          </View>

          {/* Modal Sheet */}
          <RBSheet ref={modalizeRefAge} height={screenWidth.width50}>
            <ScrollView
              style={{ alignSelf: "center", marginTop: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {ages.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.sheetText]}
                  onPress={() => selectAge(value)}
                >
                  <Text style={[text.black, text.text20]}>{value}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </RBSheet>

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
                    هل أنت متأكد أنك تريد تحديث هذه الجولة؟
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{}}>
                    <Button
                      title="تحديث"
                      onpress={() => {
                        setModalVisible(!isModalVisible);
                      }}
                    />
                  </View>
                  <View style={{}}>
                    <Button title="الغاء" onpress={toggleModal} />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={isDeleteModalVisible}>
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
                    هل أنت متأكد أنك تريد حذف هذه الجولة؟
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{}}>
                    <Button
                      title="حذف "
                      onpress={deleteTour}
                      style={{ backgroundColor: "#c6302c" }}
                    />
                  </View>
                  <View style={{}}>
                    <Button
                      title="الغاء"
                      onpress={toggleModalDelete}
                      style={{ backgroundColor: "#a5d5db" }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // ...highlights.brdr2,
  },
  alignCenter: {
    alignItems: "center",
  },
  dummyImg: {
    width: screenWidth.width90,
    height: screenWidth.width70,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 15,
  },
  img: {
    width: screenWidth.width80,
    height: screenWidth.width60,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 15,
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
    backgroundColor: "#fff",
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
