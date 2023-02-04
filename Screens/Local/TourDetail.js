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
import TourDetailCard from "../../component/card/TourDetailCard";
import TabsWrapper from "../../component/TabsWrapper";
import { images, screenWidth } from "../../config/Constant";
import { db } from "../../config/firebase";
import { getUserId } from "../../network/ApiService";
import text from "../../style/text";

const tabs = [
  {
    title: "القادمة",
  },
  {
    title: "الحالية",
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
    curr: [],
    upcom: [],
  });

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
        let curr = []; // present, future, status 0
        let upcom = []; // present, future, status 1

        unique.forEach((item) => {
          const tourDate = item.date.toDate().toISOString().slice(0, 10);

          // past, any status
          if (tourDate < today) {
            prev.push(item);
          }
          // present, future
          else if (tourDate >= today) {
            // status 0
            if (item.status === 0) {
              curr.push(item);
            }
            // status 1
            else if (item.status === 1) {
              upcom.push(item);
            }
          }
        });

        setListedData({ prev, curr, upcom });
      });
    });
  };

  useEffect(() => {
    Asyced();
  }, []);

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
          <View style={[{}, styles.cardDiv, { marginTop: screenWidth.width2 }]}>
            {listedData?.prev || listedData?.curr || listedData?.upcom ? (
              listedData[
                selectedTab === 0
                  ? "upcom"
                  : selectedTab === 1
                  ? "curr"
                  : "prev"
              ].map((item, index) => {
                // console.log('item', item.title)
                return (
                  <View key={index} style={{ marginVertical: 20 }}>
                    <TourDetailCard
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
