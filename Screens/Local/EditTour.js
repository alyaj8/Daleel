import { PortalProvider } from "@gorhom/portal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import RBSheet from "react-native-raw-bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../component/button/Button";
import Input from "../../component/inputText/Input";
import SmallInput from "../../component/inputText/smallInput";
import {
  cities,
  imagePickerConfig,
  images,
  screenWidth,
} from "../../config/Constant";
import { db } from "../../config/firebase";
import { deleteRequest, getUserId } from "../../network/ApiService";
import text from "../../style/text";

export default function EditTour({ navigation, route }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const [title, setTitle] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [meetingPoint, setMeetingPoint] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState(null);
  const [city, setCity] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [qty, setQty] = useState(null);
  const [age, setAge] = useState(null);
  const [price, setPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [tourId, setTourId] = useState(null);

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [dateString, setDateString] = useState(null);
  const [startTimeString, setStartTimeString] = useState(null);
  const [endTimeString, setEndTimeString] = useState(null);

  const status = 0;
  let ages = [
    "0-10",
    "10 - 20",
    "20 - 30",
    "30 - 40",
    "40-50",
    "50-60",
    "60-70",
  ];

  const modalizeRefAge = useRef(null);
  useFocusEffect(
    useCallback(() => {
      getTourDetail();
      getTourRequests();
      dateFormat();
    }, [])
  );
  const getTourDetail = async () => {
    let tour = route.params.data;
    let id = route.params;

    console.log("tour", id);
    setTitle(tour?.title);
    setFilePath(tour?.imageUrl);
    setDescription(tour?.description);
    setAge(tour?.age);
    setLocation(tour?.location);
    setPrice(tour?.price);
    setQty(tour?.qty);
    setTitle(tour?.title);
    setCity(tour?.city);
    setMeetingPoint(tour?.meetingPoint);
  };

  const dateFormat = async () => {
    let tourDetail = route.params.data;
    const date = tourDetail?.date;
    const startTime = tourDetail?.startTime;
    const endTime = tourDetail?.endTime;
    const DateSet = new Date(date);
    const StartTimeSet = new Date(startTime);
    const EndTimeSet = new Date(endTime);
    const dateShow = DateSet.toLocaleDateString();
    const startTimeShow = StartTimeSet.toTimeString();
    const endTimeShow = EndTimeSet.toTimeString();
    setDateString(dateShow);
    setStartTimeString(startTimeShow);
    setEndTimeString(endTimeShow);
    console.log("tourDetail", startTimeShow);
  };

  const getTourRequests = async () => {
    const uid = await getUserId();
    const data = [];
    const q = query(collection(db, "tours"), where("requestBy", "==", uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
        console.log("doc", doc.id);
        setTourId(doc.id);
      });
    });
  };
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
  const toggleModalDelete = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };
  const onSelectDate = (event, value) => {
    setDateString(value?.getTime());
    console.log(value?.getTime());
    // setShowDatePicker(false);
  };
  const onSelectEndTime = (event, value) => {
    // setShowTimePicker(false);
    setEndTimeString(value);
  };
  const onSelectStartTime = (event, value) => {
    // setShowTimePicker(false);
    setStartTimeString(value);
  };
  const upload = async (path) => {
    const uri = Platform.OS === "ios" ? path.replace("file://", "") : path;
    const fileName = uri.substring(uri.lastIndexOf("/") + 1);
    const storage = getStorage();
    const response = await fetch(uri);
    const file = await response.blob();

    const reference = ref(storage, `media/${Date.now()}-${fileName}`);

    const uploadTask = uploadBytesResumable(reference, file);

    let imageUrl = null;
    uploadTask.on("state_changed", (snapshot) => {
      let saveData = true;
      const progress =
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (progress == 100) {
        if (saveData) {
          saveData = false;
          getDownloadURL(reference).then((url) => {
            const imageUrl = url;
            setFilePath(imageUrl);
            console.log("image donwload url", imageUrl);
          });
        }
      }
    });
    try {
      await uploadTask;
      return imageUrl;
    } catch (e) {
      console.error(e);
    }
  };

  const updateTour = async (filePath) => {
    setModalVisible(!isModalVisible);
    upload(filePath);
    console.log("imageurl in screen", filePath);
    // if (imageUrl) {
    const params = {};
    if (title) {
      params["title"] = title;
    }
    if (filePath) {
      params["imageUrl"] = filePath;
    }
    if (dateString) {
      params["date"] = dateString;
    }
    if (qty) {
      params["qty"] = qty;
    }
    if (age) {
      params["age"] = age;
    }
    if (price) {
      params["price"] = price;
    }
    if (meetingPoint) {
      params["meetingPoint"] = meetingPoint;
    }
    if (location) {
      params["location"] = location;
    }
    if (description) {
      params["description"] = description;
    }
    // if (startTimeString) {
    //   params["startTime"] = startTimeString;
    // }
    // if (endTime) {
    //   params["endTime"] = endTime;
    // }

    // console.log("data----------------->", params, tourId);
    const updated = await updateTour(tourId, params);
    console.log("updated--------->", updated);
    setIsLoading(false);
    if (updated) {
      alert("Tour Updated");
      navigation.navigate("TourDetail");
    }
  };
  const deleteTour = async () => {
    setDeleteModalVisible(!isDeleteModalVisible);
    setIsLoading(true);
    const response = await deleteRequest(tourId);
    console.log("response", response);
    setIsLoading(false);
    if (response) {
      alert("Tour Deleted Successfully");
      navigation.navigate("TourDetail");
    }
  };
  const selectAge = (age) => {
    setAge(age);
    modalizeRefAge.current?.close();
  };
  const onOpen = () => {
    modalizeRefAge.current?.open();
  };
  const onChangeText = () => {};
  const modalizeRef = useRef(null);
  const onShowCity = () => {
    modalizeRef.current?.open();
  };
  const selectCity = (city) => {
    setCity(city);
    modalizeRef.current?.close();
  };
  console.log(imageUrl);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={{ flex: 1 }}
          source={images.backgroundImg}
          resizeMode="cover"
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", margin: 15 }}
          >
            <Image source={images.arrow} style={[styles.arrowIcon]} />
          </Pressable>
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <Text style={[text.white, text.text30]}>جولاتي</Text>
          </View>
          {filePath ? (
            <TouchableOpacity
              onPress={() => pickImage()}
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
              setValue={setTitle}
              onChangeText={onChangeText}
              value={title}
            />
          </View>
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
              setValue={setDescription}
              onChangeText={onChangeText}
              value={description}
            />
          </View>
          <TouchableOpacity style={[styles.alignCenter]}>
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>تاريخ الجولة</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[]}
            >
              <Input
                icon={true}
                value={dateString}
                source={images.calendar}
                editable={false}
                setValue={setDateString}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                minimumDate={new Date()}
                value={new Date()}
                display={Platform.OS === "ios" ? "calendar" : "default"}
                is24Hour={true}
                onChange={onSelectDate}
                style={styles.datePicker}
              />
            )}
          </TouchableOpacity>
          <View style={[]}>
            <TouchableOpacity
              onPress={() => setShowEndTimePicker(true)}
              style={[styles.alignCenter, {}]}
            >
              <View
                style={[
                  styles.alignRight,
                  { marginHorizontal: 40, marginVertical: 10 },
                ]}
              >
                <Text style={[text.themeDefault, text.text15]}>
                  وقت نهاية الجولة
                </Text>
              </View>
              <Input
                icon={true}
                source={images.timer}
                editable={false}
                value={endTimeString}
                setValue={setEndTimeString}
                style={{ width: screenWidth.width90 }}
              />
              {showEndTimePicker && (
                <DateTimePicker
                  maximumDate={new Date()}
                  value={endTime}
                  mode={"default"}
                  display={Platform.OS === "ios" ? "compact" : "default"}
                  is24Hour={true}
                  onChange={onSelectEndTime}
                  style={[styles.datePicker, { marginRight: 20 }]}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowStartTimePicker(true)}
              style={[styles.alignCenter, {}]}
            >
              <View
                style={[
                  styles.alignRight,
                  { marginHorizontal: 40, marginVertical: 10 },
                ]}
              >
                <Text style={[text.themeDefault, text.text15]}>
                  وقت بداية الجولة
                </Text>
              </View>
              <Input
                icon={true}
                source={images.timer}
                editable={false}
                setValue={setStartTimeString}
                value={startTimeString}
                style={{ width: screenWidth.width90 }}
              />
              {showStartTimePicker && (
                <DateTimePicker
                  maximumDate={new Date()}
                  value={startTime}
                  mode={"default"}
                  display={Platform.OS === "ios" ? "compact" : "default"}
                  is24Hour={true}
                  onChange={onSelectStartTime}
                  style={[styles.datePicker, { marginRight: 20 }]}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.alignCenter, {}]}>
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>موقع الجولة</Text>
            </View>
            <Input
              icon={true}
              setValue={setLocation}
              source={images.location}
              value={location}
            />
          </View>
          <View style={[styles.alignCenter, {}]}>
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>المدينه</Text>
            </View>
            <TouchableOpacity
              onPress={() => onShowCity()}
              style={[styles.InputStyleModal]}
            >
              <Text
                style={[text.themeDefault, text.text18, { textAlign: "right" }]}
              >
                {city}
              </Text>
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
          <View style={[styles.alignCenter]}>
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>نقطة لقاء</Text>
            </View>
            <Input
              multiline={true}
              onChangeText={onChangeText}
              setValue={setMeetingPoint}
              value={meetingPoint}
            />
          </View>
          <View
            style={[
              styles.smallInputDiv,
              {
                marginHorizontal: 20,
              },
            ]}
          >
            <View style={[styles.alignCenter]}>
              <View style={{ marginVertical: 10 }}>
                <Text style={[text.themeDefault, text.text14]}>السعر</Text>
              </View>
              <SmallInput
                keyboardType={"numeric"}
                setValue={setPrice}
                value={price}
                onChangeText={onChangeText}
              />
            </View>
            <PortalProvider>
              <View style={[styles.alignCenter]}>
                <View style={{ marginVertical: 10 }}>
                  <Text style={[text.themeDefault, text.text14]}>
                    الحد العمري
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.InputStyle]}
                  onPress={() => onOpen()}
                >
                  <Text
                    style={[text.black, text.text14, { textAlign: "center" }]}
                  >
                    {age}
                  </Text>
                </TouchableOpacity>
              </View>
            </PortalProvider>

            <View style={[styles.alignCenter]}>
              <View style={{ marginVertical: 10 }}>
                <Text style={[text.themeDefault, text.text14]}>عدد السياح</Text>
              </View>
              <SmallInput
                keyboardType={"numeric"}
                setValue={setQty}
                onChangeText={onChangeText}
                value={qty}
              />
            </View>
          </View>
          <View style={[{ marginVertical: 40, alignSelf: "center" }]}>
            <Button
              // disabled={disabled}
              title={"تحديث "}
              onpress={toggleModal}
            />
            {/* <Button
              // disabled={disabled}
              style={{ backgroundColor: "#a5d5db" }}
              title={"حذف"}
              onpress={toggleModalDelete}
            /> */}
          </View>
          <StatusBar style="auto" />
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
                    <Button
                      title="تحديث "
                      onpress={() => updateTour(filePath)}
                    />
                  </View>
                  <View style={{}}>
                    <Button
                      title="الغاء"
                      onpress={toggleModal}
                      style={{ backgroundColor: "#a5d5db" }}
                    />
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
  },
  alignCenter: {
    alignItems: "center",
  },
  dummyImg: {
    width: screenWidth.width50,
    height: screenWidth.width50,
    resizeMode: "contain",
    opacity: 0.7,
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
  arrowIcon: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
});
