import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, screenWidth } from "../config/Constant";
import { getUserId } from "../network/ApiService";
import text from "../style/text";
import TouristHomeBody from "./../component/tourist_home/TouristHomeBody";

export default function Local_Home({ navigation }) {
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

  const onPressChat = (request) => {
    navigation.navigate("Chat", { params: request });
  };

  useEffect(() => {
    (async () => {
      const uid = await getUserId();
      // console.log("🚀 ~ Tousit uid", uid);
      setCurrentUserId(uid);
    })();
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("effect callBack");
  //     fetchRequests();
  //     return () => {
  //       console.log("unsub");
  //     };
  //   }, [])
  // );

  useEffect(() => {
    setRequestStatus(requestStatus);
  }, [requestStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={{ alignItems: "center" }}
        source={images.backgroundImg}
      >
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
          <View
            style={[
              {
                width: "100%",
                flexDirection: "row",
                // ...no_highlights.brdr1,
              },
              styles.flexDirection,
              styles.tabColor,
            ]}
          >
            {menuTab.map((menu, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => onPressTab(index)}
                    style={[
                      styles.headerTab,
                      {
                        backgroundColor:
                          selectedMenu == index ? "#c6c6c6" : "#e0e0e0",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        {
                          width: "100%",
                          textAlign: "center",
                        },
                        text.themeDefault,
                        text.text20,
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
