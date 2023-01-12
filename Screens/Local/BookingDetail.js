import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import Button from "../../component/button/Button";
import Modal from "react-native-modal";
import { getUserId, updateRequest } from "../../network/ApiService";
import { getUserObj } from "../../network/ApiService";
import { getFormattedDate, convertUnixIntoTime } from "../../util/DateHelper";
import { getRequestStatus } from "../../util/CustomHelper";

export default function BookingDetail({ navigation, route }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    getRequesWithId();
  }, []);

  const getRequesWithId = async () => {
    const currentUserId = await getUserId();
    const user = await getUserObj();
    let data = route.params.data;

    setData(data);
    setCurrentUserId(currentUserId);
    setUser(user);
  };

  const updateRequestStatus = async (status) => {
    setModalVisible(!isModalVisible);
    const currentUserId = await getUserId();
    const params = {
      status: status,
      acceptedBy: currentUserId,
    };
    const updated = await updateRequest(data?.id, params);
    let message =
      status == 1 ? "Request accepted successfully." : "Request rejected.";
    if (updated) {
      alert(message);
      navigation.goBack();
    }
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
            <Text style={[text.white, text.text30]}>جولاتي</Text>
          </View>
          <View style={[styles.card]}>
            <View style={[styles.alignCenter, {}]}>
              <Image
                source={{ uri: data?.imageUrl }}
                style={[styles.dummyImg]}
              />
            </View>
            <View style={{ alignSelf: "center" }}>
              <Text
                style={[text.themeDefault, text.text20, { fontWeight: "bold" }]}
              >
                {data?.name}
              </Text>
            </View>
            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text style={[text.themeDefault, text.text18, {}]}>
                Rs. {data?.price}
              </Text>
            </View>
            <View
              style={[
                styles.flexRow,
                { justifyContent: "space-between", marginVertical: 10 },
              ]}
            >
              <View style={{}}>
                <Text style={[text.themeDefault, text.text14]}>
                  {getFormattedDate(data?.date)}
                </Text>
              </View>
              <View style={{}}>
                <Text style={[text.themeDefault, text.text14]}>
                  {convertUnixIntoTime(data?.time)}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.flexRow,
                {
                  alignSelf: "flex-end",
                  marginHorizontal: 30,
                  marginVertical: 10,
                },
              ]}
            >
              <View style={{ marginHorizontal: 10 }}>
                <Text style={[text.themeDefault, text.text16]}>
                  {data?.location}
                </Text>
              </View>
              <View>
                <Image source={images.location} style={[styles.icon]} />
              </View>
            </View>
            <View
              style={[
                styles.flexRow,
                { justifyContent: "space-between", marginVertical: 10 },
              ]}
            >
              <View style={[styles.flexRow]}>
                <View>
                  <Text
                    style={[
                      text.themeDefault,
                      text.text20,
                      { fontWeight: "bold" },
                    ]}
                  >
                    {data?.age}
                  </Text>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                  <Text style={[text.themeDefault, text.text20]}>سنة</Text>
                </View>
              </View>
              <View style={[styles.flexRow]}>
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={[
                      text.themeDefault,
                      text.text20,
                      { fontWeight: "bold" },
                    ]}
                  >
                    {data?.qty}
                  </Text>
                </View>
                <View>
                  <Image source={images.child} style={[styles.iconLg]} />
                </View>
              </View>
              <View style={[styles.flexRow]}>
                <View>
                  <Text
                    style={[
                      text.themeDefault,
                      text.text20,
                      { fontWeight: "bold" },
                    ]}
                  >
                    2
                  </Text>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                  <Image source={images.couple} style={[styles.iconLg]} />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.flexRow,
                {
                  alignSelf: "flex-end",
                  marginHorizontal: 30,
                  marginVertical: 10,
                },
              ]}
            >
              <View style={{ marginHorizontal: 10 }}>
                <Text style={[text.themeDefault, text.text20]}>
                  {data?.name}
                </Text>
              </View>
              <View>
                <Image source={images.user} style={[styles.iconLg]} />
              </View>
            </View>

            <View
              style={[
                {
                  alignSelf: "flex-end",
                  marginVertical: 10,
                },
              ]}
            >
              <View style={{ marginHorizontal: 10 }}>
                <Text style={[text.themeDefault, text.text20]}>
                  {getRequestStatus(data?.status)}
                </Text>
              </View>
            </View>

            <View style={{ marginHorizontal: 5 }}>
              <Text style={[text.themeDefault, text.text18, text.right]}>
                {data?.description}
              </Text>
            </View>
            {currentUserId !== data?.requestBy && data?.status == 0 && (
              <View
                style={[
                  styles.flexRow,
                  {
                    justifyContent: "space-between",
                    marginVertical: 20,
                    marginHorizontal: 20,
                  },
                ]}
              >
                <Button title={"قبول"} onpress={toggleModal} />
                <Button title={"رفض"} onpress={toggleModal} />
              </View>
            )}
          </View>

          <StatusBar style="auto" />
          <Modal isVisible={isModalVisible}>
            <View style={[styles.modalView]}>
              <View style={[styles.main]}>
                <View style={{ marginVertical: 40 }}>
                  <Text
                    style={[
                      text.themeDefault,
                      text.text22,
                      { textAlign: "center", fontWeight: "bold" },
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
                    <Button title="قبول" onpress={() => updateRequestStatus(1)} />
                  </View>
                  <View style={{}}>
                    <Button title="الغاء" onpress={() => updateRequestStatus(2)} />
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
    backgroundColor: "#fff",
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
  card: {
    width: screenWidth.width90,
    padding: 30,
    borderRadius: 10,
    backgroundColor: "#ececec",
    alignSelf: "center",
    marginVertical: 50,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: "#5398a0",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconLg: {
    width: 40,
    height: 40,
    tintColor: "#5398a0",
  },
});
