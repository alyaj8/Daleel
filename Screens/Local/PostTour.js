import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import { images, screenWidth, REQUEST_TABLE, cities } from "../../config/Constant";
import text from "../../style/text";
import Input from "../../component/inputText/Input";
import SmallInput from "../../component/inputText/smallInput";
import Button from "../../component/button/Button";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PortalProvider } from "@gorhom/portal";
import RBSheet from "react-native-raw-bottom-sheet";
import { insertRequest, getUserId } from "../../network/ApiService";
import Loader from "../../component/Loaders/Loader";
import { SafeAreaView } from "react-native-safe-area-context";


import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function PostTour({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);

  const [description, setDescription] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [date, setDate] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [qty, setQty] = useState(null);
  const [meetingPoint, setMeetingPoint] = useState(null);

  const [age, setAge] = useState(null);
  const [price, setPrice] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  // const db = getFirestore();

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

  const disabled =
    !title ||
    !meetingPoint ||
    !location ||
    !description ||
    !price ||
    !qty;
  const modalizeRefAge = useRef(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setFilePath(result.assets[0].uri);
    }
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const onSelectDate = (event, value) => {
    var date = new Date(value?.getTime());
    // setDate(value?.getTime());
    console.log(date);
    // setShowDatePicker(false);
  };
  const onSelectEndTime = (event, value) => {
    // setShowTimePicker(false);
    setEndTime(value);
  };
  const onSelectStartTime = (event, value) => {
    // setShowTimePicker(false);
    setStartTime(value);
  };
  const upload = async (path) => {
    const uri = Platform.OS === "ios" ? path.replace("file://", "") : path;
    const fileName = uri.substring(uri.lastIndexOf("/") + 1);
    const storage = getStorage();
    const response = await fetch(uri);
    const file = await response.blob();

    const storageRef = ref(storage, `media/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    let imageUrl = null;
    uploadTask.on("state_changed", (snapshot) => {
      let saveData = true;
      const progress =
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (progress == 100) {
        if (saveData) {
          saveData = false;
          getDownloadURL(storageRef).then((url) => {
            const imageUrl = url;
            setImageUrl(imageUrl)
            // console.log('image donwload url',imageUrl)
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
  }
  console.log('image------------->', imageUrl)

  const submitRequest = async () => {
    setModalVisible(!isModalVisible);
    setIsLoading(true);
    const requestBy = await getUserId();
    upload(filePath);
    console.log("imageurl in screen", imageUrl)
    // if (imageUrl) {
    const data = {
      imageUrl,
      title,
      date,
      startTime,
      endTime,
      qty,
      location,
      description,
      city,
      meetingPoint,
      age,
      price,
      status,
      requestBy,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    };
    console.log(data)
    await insertRequest(data, REQUEST_TABLE);
    setIsLoading(false);
    navigation.goBack();
    // return;
    // }

  };
  const modalizeRef = useRef(null);
  const onShowCity = () => {
    modalizeRef.current?.open();
  };
  const selectCity = (city) => {
    setCity(city);
    modalizeRef.current?.close();
  };
  const onChangeText = () => { };
  const selectAge = (age) => {
    setAge(age);
    modalizeRefAge.current?.close();
  };
  const onOpen = () => {
    modalizeRefAge.current?.open();
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={{ flex: 1 }}
          source={images.backgroundImg}
          resizeMode="cover"
        >
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <Text style={[text.white, text.text30, { fontWeight: "bold" }]}>
              نشر جولة
            </Text>
          </View>
          {filePath ? (
            <View
              style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
            >
              <Image source={{ uri: filePath }} style={[styles.dummyImg]} />
            </View>
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
            <Input setValue={setTitle} onChangeText={onChangeText} />
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
            <Input setValue={setDescription} onChangeText={onChangeText} />
          </View>
          <TouchableOpacity
            style={[styles.alignCenter]}
          >
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
              style={[]}>
              <Input
                icon={true}
                value={date}
                source={images.calendar}
                editable={false}
              // setValue={setDate}
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
          <View style={[styles.timeFlex]}>
            <TouchableOpacity
              onPress={() => setShowEndTimePicker(true)}
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
                icon={true}
                source={images.timer}
                editable={false}
                value={endTime}
                // setValue={setEndTime}
                style={{ width: screenWidth.width40 }}
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
                  { marginHorizontal: 10, marginVertical: 10 },
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
                setValue={setStartTime}
                value={startTime}
                style={{ width: screenWidth.width40 }}
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
              <Text style={[text.black, text.text15, { textAlign: 'right' }]}>{city}</Text>
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
              />
            </View>
          </View>
          <View
            style={[styles.alignCenter, { marginTop: 20, marginBottom: 70 }]}
          >
            <Button
              // disabled={disabled}
              title={"نشر"} onpress={toggleModal} />
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
                    <Button title="نشر" onpress={submitRequest} />
                  </View>
                  <View style={{}}>
                    <Button title="الغاء" onpress={toggleModal} />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </ScrollView>
      <Loader isLoading={isLoading} layout={"outside"} />
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
