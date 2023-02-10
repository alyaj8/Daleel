import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsWrapper from "../component/TabsWrapper";

import { images, screenWidth } from "../config/Constant";
import { createChatRoom, getUserId, getUserObj } from "../network/ApiService";
import text from "../style/text";
import TouristHomeBody from "./../component/tourist_home/TouristHomeBody";

export default function Tourist_Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisibleAccepted, setModalVisibleAccepted] = useState(false);
  const [isModalVisibleRejected, setModalVisibleRejected] = useState(false);
  const [requestStatus, setRequestStatus] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const menuTab = [
    { title: "مُعلق", selected: false },
    { title: "مقبولة", selected: false },
    { title: "مرفوضة ", selected: false },
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

  const onPressChat = async (request) => {
    try {
      setIsLoading(true);
      const chatItem = await createChatRoom(currentUserId, request.localId);
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

  useEffect(() => {
    (async () => {
      const uid = await getUserId();
      // console.log("🚀 ~ Tousit uid", uid);
      setCurrentUserId(uid);
    })();
  }, []);

  useEffect(() => {
    setRequestStatus(requestStatus);
  }, [requestStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={{ flex: 1, marginTop: -47 }} source={images.backgroundImg}>
        {/* Header */}
        <Text
          style={[
            styles.alignCenter,
            text.white,
            text.bold,
            text.text30,
            {
              marginTop: 48,
              width: "100%",
              textAlign: "center",
              marginBottom: 15
              //color:colors.Blue
            },
          ]}
        >
          طلباتي
        </Text>

        {/* Top Tabs */}
        <TabsWrapper
          selectedMenu={selectedMenu}
          menuTabs={menuTab}
          onPressTab={onPressTab}
        />
        <TouristHomeBody
          selectedMenu={selectedMenu}
          requestStatus={requestStatus}
          setRequestStatus={setRequestStatus}
          toggleModalAccepted={toggleModalAccepted}
          toggleModalRejected={toggleModalRejected}
          onPressChat={onPressChat}
          isModalVisibleAccepted={isModalVisibleAccepted}
          isModalVisibleRejected={isModalVisibleRejected}
          currentUserId={currentUserId}
        />
      </ImageBackground>

      <StatusBar style="auto" />
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
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingVertical: 10,
    width: screenWidth.width30,
    alignItems: "center",
  },
  tabColor: {
    backgroundColor: "#e0e0e0",
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
