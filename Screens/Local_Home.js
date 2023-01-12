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
import {
  images,
  screenWidth,
  REQUEST_TABLE,
  REQUESTS,
} from "../config/Constant";
import LocalBooingDetailCard from "../component/card/DetailCard";
import { getUserId, updateRequest, updateStatus } from "../network/ApiService";
import Loader from "../component/Loaders/Loader";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../component/button/Button";
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
import { auth } from "../config/firebase";
import { getDataFromStorage } from "../util/Storage";

export default function Local_Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [ui, setuid] = useState(null);
  const [requestId, setRequestId] = useState(null);

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
      getLocalGuideRequests();
    }, [navigation])
  );

  // const getAllRequests = async () => {
  //   getLocalGuideRequests();
  // };

  const getLocalGuideRequests = async () => {
    let user = await getDataFromStorage("user");
    let uid = user?.uid;
    const data = [];
    const requests = query(
      collection(db, REQUESTS),
      where("localId", "==", uid)
    );
    const unsubscribe = onSnapshot(requests, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let obj = doc.data()
        obj['id'] = doc.id;
        data.push(obj);
        setRequestId(doc.id)
      });
      setData(data);
      console.log('data', data)
      setuid(uid);
    });
  };
  const acceptRequest = async (status) => {
    setModalVisibleAccepted(!isModalVisibleAccepted);
    const currentUserId = await getUserId();
    const params = {
      status: status,
      acceptedBy: currentUserId,
    };
    const updated = await updateStatus(requestId, params);
    console.log('response', params)
    let message =
      updated == 1 ? "Request accepted successfully." : "Request rejected.";
    if (updated) {
      alert(message);
    }
  }
  const rejectRequest = async (status) => {
    setModalVisibleRejected(!isModalVisibleRejected);
    const currentUserId = await getUserId();
    const params = {
      status: status,
      rejectedBy: currentUserId,
    };
    const updated = await updateStatus(requestId, params);
    console.log('response', updated)
    let message =
      status == 2 ? "Request rejected successfully." : "Request rejected.";
    if (updated) {
      alert(message);
    }
  }
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
              {data?.length ? (
                data?.map((item, index) => {
                  console.log("item", item?.touristName);
                  return (
                    <View key={index}>
                      {item?.status == 0 &&
                        <View key={index} style={[styles.cardDiv, {}]}>
                          <LocalBooingDetailCard
                            source={{ uri: item?.imageUrl }}
                            title={item?.title}
                            bookedBy={item?.touristName}
                            onpressAccepted={toggleModalAccepted}
                            onpressRejected={toggleModalRejected}
                          />
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
                                    هل أنت متأكد أنك تريد قبول هذه الجولة؟
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
                                      onpress={() => acceptRequest(1)}
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
                                    هل أنت متأكد أنك تريد رفض هذه الجولة؟
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
                                      onpress={() => rejectRequest(2)}
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
                        </View>

                      }
                    </View>
                  );
                })
              ) : (
                <View style={{}}>
                </View>
              )}
            </View>
          )}
          {selectedMenu == 2 && data?.length ? (
            data?.map((item, index) => {
              const date = new Date(item?.dateCreated)
              const setDate= date.toDateString()
              const setTime= date.toTimeString()
              console.log('date',setDate)
              return (
                <View key={index}>
                  {item?.status == 1 &&
                    <AcceptedBookings
                      source={{ uri: item?.imageUrl }}
                      booked={item?.touristName}
                      title={item?.title}
                      date={setDate}
                      time={setTime}
                      onpressAccepted={() => onPressChat(item)}
                    />
                  }
                </View>
              );
            })
          ) : (
            <View style={{}}>
              {/* <Text style={[text.text12, text.themeDefault]}>No request</Text> */}
            </View>
          )}

          {selectedMenu == 1 && data?.length ? (
            data?.map((request, index) => {
              return (
                <View key={index}>
                  {request?.status == 2 &&
                    <RejectedBookings
                      source={{ uri: request?.imageUrl }}
                      booked={request?.touristName}
                      title={request?.title}
                    />
                  }
                </View>
              );
            })
          ) : (
            <View style={{}}>
              {/* <Text style={[text.text12, text.themeDefault]}>No request</Text> */}
            </View>
          )}
          <View style={{ marginBottom: screenWidth.width20 }}></View>


        </ScrollView>
      </ImageBackground>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: screenWidth.width10,
    backgroundColor: "#fff",
  },
  alignCenter: {
    alignItems: "center",
  },
  cardDiv: {
    marginTop: 20,
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
