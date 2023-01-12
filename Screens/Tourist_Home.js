import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import text from "../style/text";
import { images, screenWidth, REQUEST_TABLE, TOURS_REQUEST } from "../config/Constant";
import TouristPendingCard from "../component/card/TouristPendingCard";
import TouristRejectedCard from "../component/card/touristRejectCard";
import TouristAcceptedCard from "../component/card/TouristAcceptCard";
import AcceptedBooking from "../component/bookings/AcceptedBooking";
import { getUserId } from "../network/ApiService";
import Loader from "../component/Loaders/Loader";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import Button from "../component/button/Button";
import {
  collection,
  query,
  where,
  getFirestore,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import AcceptedBookings from "../component/bookings/touristBooking/acceptCard";
import RejectedBookings from "../component/bookings/touristBooking/rejectCard";

export default function Local_Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [requestStatus, setRequestStatus] = useState([]);

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
      getTourRequests();
    }, [navigation])
  );

  const getAllRequests = async () => {
    getLocalGuideRequests();
  };
  const getLocalGuideRequests = async () => {
    const data = [];
    const q = query(
      collection(db, REQUEST_TABLE),
      where("status", "==", 0)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let obj = doc.data()
        obj['id'] = doc.id;
        data.push(obj);
      });
      setData(data);
      console.log('data', data)
    });
  };
  const getTourRequests = async () => {
    const uid = await getUserId();
    const data = [];
    const q = query(
      collection(db, TOURS_REQUEST),
      where("touristId", "==", uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let obj = doc.data()
        obj['id'] = doc.id;
        data.push(obj);
      });
      // const requests= data[]
      setRequestStatus(data);
    });
  };
  const onPressChat = (request) => {
    navigation.navigate("Chat", { params: request });
  };

  return (
    <SafeAreaView style={styles.container}>
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
              {requestStatus?.length ? (
                requestStatus?.map((item, index) => {
                  return (
                    <View>

                      {item?.status == 0 &&
                        <View
                          style={[styles.cardDiv, {}]}
                        >
                          <TouristPendingCard
                            source={{ uri: item?.imageUrl }}
                            title={item?.title}
                            

                          />
                        </View>
                      }
                    </View>
                  );
                })
              ) : (
                <View style={{ marginTop: 200, alignItems: "center" }}>
                  <Text style={[text.text12, text.themeDefault]}>
                    No message found
                  </Text>
                </View>
              )}
            </View>
          )}
          {selectedMenu == 2 && (
            <View>
              {requestStatus?.length ? (
                requestStatus?.map((item, index) => {
                  const date = new Date(item?.dateCreated)
                  const setDate= date.toDateString()
                  const setTime= date.toTimeString()
                  console.log('date',setDate)
                  return (
                    <View>
                      {item?.status == 1 &&
                        <View
                          style={[styles.cardDiv, {}]}
                        >
                          <AcceptedBooking
                            source={{ uri: item?.imageUrl }}
                            booked={'Shatha'}
                            title={item?.title}
                            date={setDate}
                            time={setTime}
                            onpressAccepted={()=> onPressChat(item)}
                            // onpressAccepted={() => navigation.navigate("ChatMenu")}
                          />
                        </View>
                      }
                    </View>
                  );
                })
              ) : (
                <View style={{ marginTop: 200, alignItems: "center" }}>
                  <Text style={[text.text12, text.themeDefault]}>
                    No message found
                  </Text>
                </View>
              )}
            </View>

          )}
          {selectedMenu == 1 && (

            <View>
              {requestStatus?.length ? (
                requestStatus?.map((item, index) => {
                  console.log('status', item?.status)
                  return (
                    <View>
                      {item?.status == 2 &&
                        <View
                          style={[styles.cardDiv, {}]}
                        >
                          <TouristRejectedCard
                            source={{ uri: item?.imageUrl }}
                            title={item?.title}

                          />
                        </View>
                      }
                    </View>
                  );
                })
              ) : (
                <View style={{ marginTop: 200, alignItems: "center" }}>
                  <Text style={[text.text12, text.themeDefault]}>
                    No message found
                  </Text>
                </View>
              )}
            </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
