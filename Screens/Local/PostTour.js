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
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";
import text from "../../style/text";
import Input from "../../component/inputText/Input";
import SmallInput from "../../component/inputText/smallInput";
import Button from "../../component/button/Button";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PortalProvider } from "@gorhom/portal";
import RBSheet from "react-native-raw-bottom-sheet";
import { upload, insertRequest, getUserId } from "../../network/ApiService";
import Loader from "../../component/Loaders/Loader";

export default function PostTour({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(null);
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [qty, setQty] = useState(null);
  const [age, setAge] = useState(null);
  const [price, setPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const status = 0;
  let ages = ["10 - 20", "20 - 30", "30 - 40"];

  const disabled =
    !name ||
    !date ||
    !time ||
    !location ||
    !description ||
    !filePath ||
    !price ||
    !qty;
  const modalizeRefAge = useRef(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });
    if (!result.canceled) {
      setFilePath(result.assets[0].uri);
    }
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const onSelectDate = (event, value) => {
    setDate(value?.getTime());
    console.log(value?.getTime());
    // setShowDatePicker(false);
  };
  const onSelectTime = (event, value) => {
    // setShowTimePicker(false);
    setTime(value);
  };

  const submitRequest = async () => {
    setModalVisible(!isModalVisible);
    setIsLoading(true);
    const requestBy = await getUserId();
    const imageUrl = await upload(filePath);
    console.log('imageurl in screen', imageUrl)
    if (imageUrl) {
      const data = {
        imageUrl,
        name,
        date,
        time,
        qty,
        location,
        description,
        age,
        price,
        status,
        requestBy,
        dateCreated: Date.now(),
        dateUpdated: Date.now(),
      };
      await insertRequest(data, REQUEST_TABLE);
      setIsLoading(false);
      navigation.navigate('Home')
      return;
    }
    setIsLoading(false);
    alert("Error while saving data. Pls try again later.");
  };

  const onChangeText = () => {};
  const selectAge = (age) => {
    setAge(age);
    modalizeRefAge.current?.close();
  };
  const onOpen = () => {
    modalizeRefAge.current?.open();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={{ flex: 1 }}
          source={images.backgroundImg}
          resizeMode="cover"
        >
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <Text style={[text.white, text.text30]}>جولاتي</Text>
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
            <Input setValue={setName} onChangeText={onChangeText} />
          </View>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
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
            <Input
              icon={true}
              source={images.calendar}
              editable={false}
              setValue={setDate}
            />
            {showDatePicker  && (
              <DateTimePicker
                minimumDate={new Date()}
                value={new Date()}
                // mode={'datetime'}
                display={Platform.OS === "ios" ? "calendar" : "default"}
                is24Hour={true}
                onChange={onSelectDate}
                style={styles.datePicker}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={[styles.alignCenter, {}]}
          >
            <View
              style={[
                styles.alignRight,
                { marginHorizontal: 40, marginVertical: 10 },
              ]}
            >
              <Text style={[text.themeDefault, text.text15]}>وقت الجولة</Text>
            </View>
            <Input
              icon={true}
              source={images.timer}
              editable={false}
              setValue={setTime}
            />
            {showTimePicker && (
              <DateTimePicker
                maximumDate={new Date()}
                value={time}
                mode={"default"}
                display={Platform.OS === "ios" ? "compact" : "default"}
                is24Hour={true}
                onChange={onSelectTime}
                style={styles.datePicker}
              />
            )}
          </TouchableOpacity>

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
              setValue={setDescription}
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
            <Button disabled={disabled} title={"نشر"} onpress={toggleModal} />
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
                    هل أنت متأكد من نشر هذه الجولة؟
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: screenWidth.width10,
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
    // justifyContent: "center",
    // alignItems: "flex-start",
    // width: 320,
    // height: 260,
    // display: "flex",
    position:'absolute',
    bottom:0,right:0,
    marginRight:40,
    marginBottom:5,
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
});
