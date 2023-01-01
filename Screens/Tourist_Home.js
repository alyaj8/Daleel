import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import text from "../style/text";
import { images, screenWidth, REQUEST_TABLE } from "../config/Constant";
import TouristCard from "../component/card/TouristCard";
import { getUserId } from "../network/ApiService";
import Loader from "../component/Loaders/Loader";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import Button from "../component/button/Button";

// import MenuTab from '../component/menuTab/TabMenu';
import {
  collection,
  query,
  where,
  getFirestore,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import AcceptedBookings from "../component/bookings/AcceptedBooking";
import RejectedBookings from "../component/bookings/RejectedBookings";

export default function Local_Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisibleAccepted, setModalVisibleAccepted] = useState(false);
  const [isModalVisibleRejected, setModalVisibleRejected] = useState(false);
  const menuTab = [
    { title: "الكل", selected: false },
    { title: "مرفوضة ", selected: false },
    { title: "مقبولة", selected: false },
  ];
  const [selectedMenu, setSelectedMenu] = useState(0);

  const onPressTab = (index) => {
    setSelectedMenu(index);
  };

  const toggleModalAccepted = () => {
    setModalVisibleAccepted(!isModalVisibleAccepted);
  };
  const toggleModalRejected = () => {
    setModalVisibleRejected(!isModalVisibleRejected);
  };
  const db = getFirestore();

  useFocusEffect(
    useCallback(() => {
      getAllRequests();
    }, [navigation])
  );

  const getAllRequests = async () => {
    getLocalGuideRequests();
  };

  const getLocalGuideRequests = async () => {
    const uid = await getUserId();
    const data = [];
    const q = query(
      collection(db, REQUEST_TABLE),
      where("requestBy", "==", uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setData(data);
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        <View style={[styles.alignCenter, { marginVertical: 10 }]}>
          <Text style={[text.white, text.text30]}>طلباتي</Text>
        </View>
        <View>
          <View style={[styles.flexDirection, styles.tabColor]}>
            {menuTab.map((menu, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => onPressTab(index)}
                    style={[
                      styles.headerTab,
                      {
                        backgroundColor:
                          selectedMenu == index ? "#d9d9d9" : "#f1f1f1",
                      },
                    ]}
                  >
                    <Text style={[text.themeDefault, text.text20]}>
                      {menu?.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
        <ScrollView style={{}} showsVerticalScrollIndicator={false}>
          {selectedMenu == 0 && (
            <View>
              <View
                style={[styles.cardDiv, { marginTop: screenWidth.width10 }]}
              >
                <TouristCard
                  source={images.photo}
                  title={'جولة بلدة العلا القديمة'}
                />
              </View>
            </View>
          )}
          {selectedMenu == 2 && (
            <AcceptedBookings
              source={images.photo}
              booked={'Shatha'}
              title="جولة بلدة العلا القديمة"
              onpressAccepted={() => navigation.navigate("ChatMenu")}
            />
          )}
          {selectedMenu == 1 && (
            <TouristCard
              source={images.photo}
              title={"جولة بلدة العلا القديمة"}
            />
          )}
          <View style={{ marginBottom: screenWidth.width20 }}></View>
          <Modal isVisible={isModalVisibleAccepted}>
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
                    <Button
                      title="قبول"
                      onpress={toggleModalAccepted}
                      style={{ backgroundColor: "#80cc28" }}
                    />
                  </View>
                  <View style={{}}>
                    <Button
                      title="الغاء"
                      onpress={toggleModalAccepted}
                      style={{ backgroundColor: "#a5d5db" }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Modal isVisible={isModalVisibleRejected}>
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
                    <Button
                      title="رفض"
                      onpress={toggleModalRejected}
                      style={{ backgroundColor: "#c6302c" }}
                    />
                  </View>
                  <View style={{}}>
                    <Button
                      title="الغاء"
                      onpress={toggleModalRejected}
                      style={{ backgroundColor: "#a5d5db" }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: screenWidth.width10,
    backgroundColor: "#fff",
  },
  alignCenter: {
    alignItems: "center",
  },
  cardDiv: {},
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
  headerTab: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingVertical: 10,
    width: screenWidth.width30,
    alignItems: "center",
  },
  tabColor: {
    backgroundColor: "#f1f1f1",
    width: screenWidth.width90,
    alignSelf: "center",
    borderRadius: 20,
  },
  flexDirection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
});
