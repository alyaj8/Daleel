import { Feather } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Modal from "react-native-modal";
import { db } from "../../config/firebase";
import { getUserId } from "../../network/ApiService";
import text from "../../style/text";
import AcceptedBooking from "../bookings/AcceptedBooking";
import Button from "../button/Button";
import TouristPendingCard from "../card/TouristPendingCard";
import TouristRejectedCard from "../card/touristRejectCard";
import { screenWidth } from "./../../config/Constant";

const TouristHomeBody = ({
  selectedMenu,
  requestStatus,
  setRequestStatus,

  toggleModalAccepted,
  isModalVisibleAccepted,
  toggleModalRejected,
  isModalVisibleRejected,
  onPressChat,

  currentUserId,
}) => {
  const [data, setData] = React.useState(requestStatus);

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
          {data?.length ? (
            data?.map((item, index) => {
              return (
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
                  // ...no_highlights.brdr1,
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
          {data?.length ? (
            data?.map((item, index) => {
              const date = new Date(item?.dateCreated);
              const setDate = date.toDateString();
              const setTime = date.toTimeString();
              // console.log("date", setDate);

              return (
                <View key={index}>
                  {item?.status == 1 && (
                    <View style={[styles.cardDiv, {}]}>
                      <AcceptedBooking
                        key={index}
                        source={{ uri: item?.imageUrl }}
                        booked={"Shatha"}
                        title={item?.title}
                        date={setDate}
                        time={setTime}
                        onpressAccepted={() => onPressChat(item)}
                        // onpressAccepted={() => navigation.navigate("ChatMenu")}
                      />
                    </View>
                  )}
                </View>
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
                  // ...no_highlights.brdr1,
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
          {data?.length ? (
            data?.map((item, index) => {
              return (
                <View key={index}>
                  {item?.status == 2 && (
                    <View style={[styles.cardDiv, {}]}>
                      <TouristRejectedCard
                        key={index}
                        source={{ uri: item?.imageUrl }}
                        title={item?.title}
                      />
                    </View>
                  )}
                </View>
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
                  // ...no_highlights.brdr1,
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
