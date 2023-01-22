import { StatusBar } from "expo-status-bar";
import React, { useReducer, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import LocalBooingDetailCard from "../component/card/LocalBooingDetailCard";
import { colors, images, screenWidth } from "../config/Constant";
import {
  acceptRequest,
  createChatRoom,
  getUserId,
  getUserObj,
  updateRequest,
  updateTour,
} from "../network/ApiService";
import text from "../style/text";

import { Feather } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import AcceptedBookings from "../component/bookings/AcceptedBooking";
import RejectedBookings from "../component/bookings/RejectedBookings";
import Button from "../component/button/Button";
import { db } from "../config/firebase";

export default function Local_Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    all: [],
    accepted: [],
    rejected: [],
  });
  const menuTab = [
    { title: "الكل", selected: false },
    { title: "مقبولة", selected: false },
    { title: "مرفوضة ", selected: false },
  ];
  const [selectedMenu, setSelectedMenu] = useState(0);
  // force update use reducer
  const [update, forceUpdate] = useReducer((s) => s + 1, 0);
  const [isModalVisibleAccepted, setModalVisibleAccepted] = useState(false);
  const [isModalVisibleRejected, setModalVisibleRejected] = useState(false);

  //------------------
  //------------------

  const [requestId, setRequestId] = useState(null);
  const [tourId, setTourId] = useState(null);

  // to chat this is sender id
  const [currentUserId, setCurrentUserId] = useState(null);
  // to chat this is receiver id

  const Asyced = () => {
    getUserId().then((currentUserIdLoc) => {
      setCurrentUserId(currentUserIdLoc);
      const q = query(
        collection(db, "requests"),
        where("localId", "==", currentUserIdLoc)
      );

      const unsub = onSnapshot(q, (querySnapshot) => {
        let newRequest = [];
        querySnapshot.forEach((doc) => {
          newRequest.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const unique = newRequest.filter((thing, index, self) => {
          return (
            index ===
            self.findIndex((t) => {
              return t.id === thing.id;
            })
          );
        });

        const all = unique.filter((item) => item.status == 0);
        const accepted = unique.filter((item) => item.status === 1);
        const rejected = unique.filter((item) => item.status === 2);

        setData({ all, accepted, rejected });
      });
    });
  };

  React.useEffect(() => {
    Asyced();
  }, []);

  const onAcceptionReq = async () => {
    console.log("Accept> reqId: ");
    setModalVisibleAccepted(!isModalVisibleAccepted);

    await acceptRequest(requestId, tourId);
    forceUpdate();
  };

  const rejectRequest = async () => {
    console.log("Reject> reqId: ");

    setModalVisibleRejected(!isModalVisibleRejected);
    const DataToUpdate = {
      status: 2,
      acceptedAt: new Date(),
    };
    // console.log("🚀 ~ DataToUpdate", DataToUpdate);

    // TODO: update request status
    const updatedReq = await updateRequest(requestId, DataToUpdate);

    // TODO: update tour status
    const updatedTour = await updateTour(tourId, DataToUpdate);
    forceUpdate();
  };

  const onPressChat = async (request) => {
    try {
      setIsLoading(true);

      const chatItem = await createChatRoom(currentUserId, request.touristId);
      const me = await getUserObj();

      navigation.navigate("ChatConv", {
        receiverName: chatItem.name,
        receiverId: chatItem.senderId,
        senderId: me.uid,
        senderName: me.firstname,
        roomId: chatItem.roomId,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("🚀 ~ error", error);
    }
  };

  const onPressTab = (index) => {
    setSelectedMenu(index);
  };

  const toggleModalAccepted = (req) => {
    setRequestId(req.id);
    setTourId(req.tourId);

    setModalVisibleAccepted(!isModalVisibleAccepted);
  };

  const toggleModalRejected = (req) => {
    setRequestId(req.id);
    setTourId(req.tourId);

    setModalVisibleRejected(!isModalVisibleRejected);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        {/* Header */}
        <Text
          style={[
            styles.alignCenter,
            text.white,
            text.bold,
            text.text30,
            {
              marginTop: 20,
              width: "100%",
              textAlign: "center",
              //color:colors.Blue
            },
          ]}
        >
          طلباتي
        </Text>

        {/* Top Tabs */}
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
                    <Text
                      style={[
                        text.themeDefault,
                        text.text20,
                        { textAlign: "center" },
                      ]}
                    >
                      {menu?.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Body */}

        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* All */}
          {selectedMenu == 0 && (
            <View>
              {data.all.length > 0 ? (
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  {data.all.map((item, index) => {
                    return (
                      <View key={index} style={[styles.cardDiv]}>
                        <LocalBooingDetailCard
                          source={{
                            uri: item.imageUrl,
                          }}
                          title={item?.title}
                          bookedBy={item?.touristName}
                          onpressAccepted={() => toggleModalAccepted(item)}
                          onpressRejected={() => toggleModalRejected(item)}
                        />
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={{ marginTop: 200, alignItems: "center" }}>
                  <View
                    style={{
                      // marginTop: 200,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      // flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginRight: 10,
                        },
                        text.text20,
                      ]}
                    >
                      لا يوجد طلبات مُعلقة
                    </Text>
                    {/* Icon */}
                    <Feather name="alert-circle" size={24} color="black" />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Accepted */}
          {selectedMenu == 1 && (
            <View>
              {data.accepted.length > 0 ? (
                data.accepted.map((item, index) => {
                  const date = new Date(item?.dateCreated);
                  const setDate = date.toDateString();
                  const setTime = date.toTimeString();
                  return (
                    <AcceptedBookings
                      key={index}
                      source={{ uri: item?.imageUrl }}
                      // booked={item?.touristName}
                      title={item?.title}
                      date={setDate}
                      time={setTime}
                      item={item}
                      forPerson={item?.touristName}
                      onpressAccepted={() => onPressChat(item)}
                      type="local"
                    />
                  );
                })
              ) : (
                <View style={{ marginTop: 200, alignItems: "center" }}>
                  <View
                    style={{
                      // marginTop: 200,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      // flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginRight: 10,
                        },
                        text.text20,
                      ]}
                    >
                      لم تقبل أي جولات بعد
                    </Text>
                    {/* Icon */}
                    <Feather name="alert-circle" size={24} color="black" />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Rejected */}
          {selectedMenu == 2 && (
            <View>
              {data.rejected.length > 0 ? (
                data.rejected.map((request, index) => {
                  return (
                    <RejectedBookings
                      key={index}
                      source={{ uri: request?.imageUrl }}
                      booked={request?.touristName}
                      title={request?.title}
                    />
                  );
                })
              ) : (
                <View style={{ marginTop: 200, alignItems: "center" }}>
                  <View
                    style={{
                      // marginTop: 200,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      // flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginRight: 10,
                        },
                        text.text20,
                      ]}
                    >
                      لم ترفض أي جولات بعد
                    </Text>
                    {/* Icon */}
                    <Feather name="alert-circle" size={24} color="black" />
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={{ marginBottom: screenWidth.width20 }}></View>
        </ScrollView>

        {/* Modal Accepted */}
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
                    title="الغاء"
                    onpress={toggleModalAccepted}
                    style={{ backgroundColor: colors.lightBrown }}
                  />
                </View>
                <View style={{}}>
                  <Button
                    title="قبول"
                    onpress={() => onAcceptionReq()}
                    style={{ backgroundColor: colors.Blue }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Rejected */}
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
                    title="الغاء"
                    onpress={toggleModalRejected}
                    style={{ backgroundColor: colors.lightBrown }}
                  />
                </View>
                <View style={{}}>
                  <Button
                    title="رفض"
                    onpress={() => rejectRequest(2)}
                    style={{ backgroundColor: colors.brown }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
    // backgroundColorwith opacity
    backgroundColor: "rgba(255,255,255,1)",
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
