import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppTouchableHigh from "../../component/AppTouchableHigh";
import TourDetailCard from "../../component/card/TourDetailCard";
import Loading from "../../component/Loading";
import AcceptedBooking from "../../component/Reqs/Common/AcceptedBooking";
import TabsWrapper from "../../component/TabsWrapper";
import { images, screenWidth } from "../../config/Constant";
import { db } from "../../config/firebase";
import {
  createChatRoom,
  getUserId,
  getUserObj,
} from "../../network/ApiService";
import text from "../../style/text";
// import AcceptedBooking from "../../component/Reqs/Common/AcceptedBooking";

const tabs = [
  {
    title: "القادمة",
  },
  {
    title: "المَنشورة",
  },
  {
    title: "السابقة",
  },
];

export default function TourDetail({ navigation }) {
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [listedData, setListedData] = useState({
    prev: [],
    post: [],
    upcom: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const onPressChat = async (request) => {
    try {
      setIsLoading(true);

      const me = await getUserObj();
      const chatItem = await createChatRoom(me.uid, request.bookedBy);
      console.log("🚀 ~ request.bookedBy", request.bookedBy);
      console.log("🚀 ~ me.uid", me.uid);

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
      console.log("🚀 ~ Local Home Err> ", error);
    }
  };

  const goToTourDetail = (tour) => {
    navigation.navigate("TourDetailedInformation", {
      ...tour,
      mode: "myTour",
    });
  };
  const Asyced = () => {
    getUserId().then((currentUserIdLoc) => {
      const q = query(
        collection(db, "tours"),
        where("requestBy", "==", currentUserIdLoc)
      );

      const unsub = onSnapshot(q, (querySnapshot) => {
        let tours = [];

        querySnapshot.forEach((doc) => {
          tours.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const unique = tours.filter((thing, index, self) => {
          return (
            index ===
            self.findIndex((t) => {
              return t.id === thing.id;
            })
          );
        });

        // logObj(unique, "🚀 ~ unique");

        const today = new Date().toISOString().slice(0, 10);

        let prev = []; // past, any status
        let post = []; // present, future, status 0
        let upcom = []; // present, future, status 1

        unique.forEach((item) => {
          const tourDate = item.date.toDate().toISOString().slice(0, 10);

          // past
          if (tourDate < today && item.isPaid) {
            prev.push(item);
          }
          // present, future
          else if (tourDate >= today && item.isPaid) {
            upcom.push(item);
          }

          post.push(item);
        });

        setListedData({ prev, post, upcom });
      });
    });
  };

  useEffect(() => {
    Asyced();
  }, []);

  return (
    <View style={styles.container}>
      <Loading visible={isLoading} text="جاري الحجز" />

      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        {/* Header */}
        <View
          style={{
            alignItems: "center",

            marginTop: screenWidth.width10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            جولاتي
          </Text>
        </View>

        {/* Tabs */}
        <View
          style={
            {
              // backgroundColor: "red",
            }
          }
        >
          <TabsWrapper
            menuTabs={tabs}
            selectedMenu={selectedTab}
            onPressTab={(index) => setSelectedTab(index)}
          />
        </View>

        {/* Cards */}
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* OLD */}
          {false && (
            <View
              style={[{}, styles.cardDiv, { marginTop: screenWidth.width2 }]}
            >
              {listedData?.prev || listedData?.post || listedData?.upcom ? (
                listedData[
                  selectedTab === 0
                    ? "upcom"
                    : selectedTab === 1
                    ? "post"
                    : "prev"
                ].map((item, index) => {
                  // console.log('item', item.title)
                  return (
                    <View key={index} style={{ marginVertical: 20 }}>
                      <TourDetailCard
                        mode="myTour"
                        key={index}
                        source={{ uri: item?.imageUrl }}
                        title={item?.title}
                        tour={item}
                        onpress={() =>
                          navigation.navigate("TourDetailedInformation", item)
                        }
                      />
                    </View>
                  );
                })
              ) : (
                <View
                  style={{
                    marginTop: 200,
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
                    لا يوجد جولات
                  </Text>
                  {/* Icon */}
                  <Feather name="alert-circle" size={24} color="black" />
                </View>
              )}
            </View>
          )}

          {/* upcom */}
          {selectedTab === 0 && (
            <View>
              {listedData?.upcom.length > 0 ? (
                <>
                  {listedData?.upcom.map((item, index) => {
                    const date = new Date(item?.dateCreated);
                    const setDate = date.toDateString();
                    const setTime = date.toTimeString();
                    const isDeleted = item.isDeleted;

                    return (
                      <AppTouchableHigh
                        key={index}
                        onPress={
                          !!isDeleted ? null : () => goToTourDetail(item)
                        }
                      >
                        <AcceptedBooking
                          mode="myTour"
                          key={index}
                          source={{ uri: item?.imageUrl }}
                          // booked={item?.touristName}
                          title={item?.title}
                          date={setDate}
                          time={setTime}
                          item={item}
                          forPerson={item?.bookedByName}
                          onpressAccepted={() => onPressChat(item)}
                          type="local"
                        />
                      </AppTouchableHigh>
                    );
                  })}
                </>
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
                    لايوجد جولات قادمة
                    </Text>
                    {/* Icon */}
                    <Feather name="alert-circle" size={24} color="black" />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* post */}
          {selectedTab === 1 && (
            <View>
              {listedData?.post.length > 0 ? (
                <>
                  {listedData?.post.map((item, index) => {
                    const isDeleted = item?.isDeleted;

                    return (
                      <AppTouchableHigh
                        key={index}
                        onPress={
                          !!isDeleted ? null : () => goToTourDetail(item)
                        }
                      >
                        <View key={index} style={{ marginVertical: 20 }}>
                          <TourDetailCard
                            mode="myTour"
                            key={index}
                            source={{ uri: item?.imageUrl }}
                            title={item?.title}
                            tour={item}
                            onpress={() =>
                              navigation.navigate(
                                "TourDetailedInformation",
                                item
                              )
                            }
                          />
                        </View>
                      </AppTouchableHigh>
                    );
                  })}
                </>
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
                      لا يوجد جولات منشورة
                    </Text>
                    {/* Icon */}
                    <Feather name="alert-circle" size={24} color="black" />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* prev */}
          {selectedTab === 2 && (
            <View>
              {listedData?.prev.length > 0 ? (
                <>
                  {listedData?.prev.map((item, index) => {
                    const date = new Date(item?.dateCreated);
                    const setDate = date.toDateString();
                    const setTime = date.toTimeString();
                    const isDeleted = item.isDeleted;

                    return (
                      <AppTouchableHigh
                        key={index}
                        onPress={
                          !!isDeleted ? null : () => goToTourDetail(item)
                        }
                      >
                        <AcceptedBooking
                          mode="myTour"
                          chatDisabled
                          key={index}
                          source={{ uri: item?.imageUrl }}
                          // booked={item?.touristName}
                          title={item?.title}
                          date={setDate}
                          time={setTime}
                          item={item}
                          forPerson={item?.bookedByName}
                          onpressAccepted={() => console.log("Hi")}
                          type="local"
                        />
                      </AppTouchableHigh>
                    );
                  })}
                </>
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
                      لا يوجد جولات سابقة
                    </Text>
                    {/* Icon */}
                    <Feather name="alert-circle" size={24} color="black" />
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 20,
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
});
