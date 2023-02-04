import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TourDetailCard from "../../component/card/TourDetailCard";
import TabsWrapper from "../../component/TabsWrapper";
import { images, screenWidth } from "../../config/Constant";
import { db } from "../../config/firebase";
import { getUserId } from "../../network/ApiService";
import text from "../../style/text";

const tabs = [
  {
    title: "Previous",
  },
  {
    title: "Upcoming",
  },
  {
    title: "Post",
  },
];

export default function TourDetail({ navigation }) {
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [listedData, setListedData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const getAllRequests = async () => {
        const uid = await getUserId();
        const q = query(collection(db, "tours"), where("requestBy", "==", uid));

        // listen for changes
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const bag = [];
          querySnapshot.forEach((doc) => {
            // console.log("doc", doc.data());
            if (doc.data().status != 1) {
              bag.push({
                id: doc.id,
                ...doc.data(),
              });
            }
          });

          setData(bag);

          // remove duplicates from array
          const unique = [...new Set(bag)];
          setData(unique);
          setListedData(unique);
        });
      };
      getAllRequests();
    }, [])
  );

  useEffect(() => {
    // 0 = previous = past any status
    // 1 = upcoming = future or current and status 1
    // 2 = post = future or current status 0

    console.log("🚀 ~ selectedTab", selectedTab);
    if (selectedTab === 0) {
      const past = data.filter((item) => item.date.toDate() < new Date());
      setListedData(past);
    } else if (selectedTab === 1) {
      const future = data.filter(
        (item) => item.date.toDate() >= new Date() && item.status == 1
      );
      setListedData(future);
    } else {
      const post = data.filter(
        (item) => item.date.toDate() >= new Date() && item.status == 0
      );
      setListedData(post);
    }
  }, [selectedTab]);

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        {/* Header */}
        <View
          style={{
            alignItems: "center",

            marginTop: screenWidth.width15,
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
        <View style={styles.tabDiv}>
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
          <View
            style={[{}, styles.cardDiv, { marginTop: screenWidth.width15 }]}
          >
            {listedData?.length ? (
              listedData?.map((item, index) => {
                // console.log('item', item.title)
                return (
                  <View key={index} style={{ marginVertical: 20 }}>
                    <TourDetailCard
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
