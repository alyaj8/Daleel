import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Modal from "react-native-modal";
import { db } from "../../config/firebase";
import { getUserId } from "../../network/ApiService";
import text from "../../style/text";
import AppTouchableHigh from "../AppTouchableHigh";
import Button from "../button/Button";
import { screenWidth } from "./../../config/Constant";

import AcceptedBooking from "../reqs/common/AcceptedBooking";
import TouristPendingCard from "../reqs/tourist/TouristPendingCard";
import TouristRejectCard from "../reqs/tourist/TouristRejectCard";

const TouristHomeBody = ({
  selectedMenu,
  AppTouchableHighStatus,
  setRequestStatus,

  toggleModalAccepted,
  isModalVisibleAccepted,
  toggleModalRejected,
  isModalVisibleRejected,
  onPressChat,

  currentUserId,
}) => {
  const navigation = useNavigation();
  const [data, setData] = React.useState({
    all: [],
    accepted: [],
    rejected: [],
  });

  const goToTourDetail = (req) => {
    navigation.navigate("TouristDetailedInformation", {
      ...req,
      mode: "request",
      tourId: req.tourId,
    });
  };

  const Asyced = () => {
    getUserId().then((currentUserIdLoc) => {
      const q = query(
        collection(db, "requests"),
        where("touristId", "==", currentUserIdLoc)
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

        // logObj(unique, "🚀 ~ unique");

        const all = unique.filter((item) => item.status == 0);
        const accepted = unique.filter((item) => item.status === 1);
        const rejected = unique.filter((item) => item.status === 2);

        setData({ all, accepted, rejected });
      });
    });
  };

  const OldAsyced = () => {
    getUserId().then((currentUserIdLoc) => {
      const q = query(
        collection(db, "requests"),
        where("touristId", "==", currentUserIdLoc)
      );

      const unsub = onSnapshot(q, (querySnapshot) => {
        let newRequest = [];
        querySnapshot.forEach((doc) => {
          newRequest.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // console.log("🚀 ~ newRequest", newRequest);
        setRequestStatus(newRequest);
        setData(newRequest);
      });
    });
  };
  React.useEffect(() => {
    // console.log("Child", currentUserId);
    Asyced();

    // return unsub;
  }, []);

  return (
    <ScrollView style={{}} showsVerticalScrollIndicator={false}>
      {/* Pending */}
      {selectedMenu == 0 && (
        <View>
          {data.all.length > 0 ? (
            data.all.map((item, index) => {
              const isDeleted = item?.isDeleted;

              return (
                <AppTouchableHigh
                  key={index}
                  onPress={!!isDeleted ? null : () => goToTourDetail(item)}
                >
                  <View key={index}>
                    {item?.status == 0 && (
                      <View style={[styles.cardDiv, {}]}>
                        <TouristPendingCard
                          key={index}
                          source={{ uri: item?.imageUrl }}
                          title={item?.title}
                        />
                      </View>
                    )}
                  </View>
                </AppTouchableHigh>
              );
            })
          ) : (
            <View style={{ marginTop: 200, alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
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
                  لا يوجد طلبات
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
          {data?.accepted.length ? (
            data?.accepted?.map((item, index) => {
              const date = new Date(item?.dateCreated);
              const setDate = date.toDateString();
              const setTime = date.toTimeString();
              // console.log("date", setDate);
              const isDeleted = item?.isDeleted;

              return (
                <AppTouchableHigh
                  key={index}
                  onPress={!!isDeleted ? null : () => goToTourDetail(item)}
                >
                  <View key={index}>
                    {item?.status == 1 && (
                      <View style={[styles.cardDiv, {}]}>
                        <AcceptedBooking
                          key={index}
                          source={{ uri: item?.imageUrl }}
                          // booked={"Shatha"}
                          title={item?.title}
                          date={setDate}
                          time={setTime}
                          item={item}
                          forPerson={item?.localName}
                          onpressAccepted={() => onPressChat(item)}
                          type="tourist"
                          // onpressAccepted={() => navigation.navigate("ChatMenu")}
                        />
                      </View>
                    )}
                  </View>
                </AppTouchableHigh>
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
                  لم يتم قبول اي طلب
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
          {data?.rejected.length ? (
            data?.rejected?.map((item, index) => {
              const isDeleted = item?.isDeleted;

              return (
                <AppTouchableHigh
                  key={index}
                  onPress={!!isDeleted ? null : () => goToTourDetail(item)}
                >
                  <View key={index}>
                    {item?.status == 2 && (
                      <View style={[styles.cardDiv, {}]}>
                        <TouristRejectCard
                          key={index}
                          source={{ uri: item?.imageUrl }}
                          title={item?.title}
                          local={item?.localName}
                        />
                      </View>
                    )}
                  </View>
                </AppTouchableHigh>
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
                  لم يتم رفض اي طلب
                </Text>
                {/* Icon */}
                <Feather name="alert-circle" size={24} color="black" />
              </View>
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
  );
};

export default TouristHomeBody;

const styles = StyleSheet.create({});
