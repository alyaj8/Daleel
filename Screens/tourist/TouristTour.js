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
import { images, screenWidth } from "../../config/Constant";
import { db } from "../../config/firebase";
import { getUserId } from "../../network/ApiService";
import text from "../../style/text";
//import { Dropdown } from "react-native-element-dropdown";
import TabsWrapper from "./../../component/TabsWrapper";

const tabs = [
  {
    title: "السابقة",
  },
  {
    title: "القادمة",
  },
];

export default function TouristTour({ navigation }) {
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [listedData, setListedData] = useState({
    prev: [],
    upcom: [],
  });

  const Asyced = () => {
    getUserId().then((currentUserIdLoc) => {
      console.log("🚀 ~ currentUserIdLoc", currentUserIdLoc);
      const q = query(
        collection(db, "tours"),
        where("status", "==", 1),
        where("isPaid", "==", true),
        where("bookedBy", "==", currentUserIdLoc)
      );

      const unsub = onSnapshot(q, (querySnapshot) => {
        let tours = [];

        querySnapshot.forEach((doc) => {
          tours.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // console.log("🚀 ~ tours", tours.length);
        // console.log("🚀 ~ tours", tours[0].date.toDate());

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

        let prev = [];
        let upcom = [];
        unique.forEach((item) => {
          if (item.date.toDate().toISOString().slice(0, 10) < today) {
            prev.push(item);
          } else {
            upcom.push(item);
          }
        });

        setListedData({ prev, upcom });
      });
    });
  };

  useEffect(() => {
    Asyced();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{ flex: 1, marginTop: -50 }}
        source={images.backgroundImg}
      >
        {/* Header */}
        <View style={[styles.alignCenter, { marginVertical: 20 }]}>
          <Text
            style={[
              {
                // flex: 1,
                width: "100%",
                textAlign: "center",
                //color: colors.Blue,
                fontSize: 30,
                marginTop: 40,
              },
              text.white,
              text.bold,
            ]}
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

        {/* Body */}
        <ScrollView style={[styles.cardDiv]}>
          {listedData?.prev.length > 0 || listedData?.upcom.length > 0 ? (
            <>
              {listedData[selectedTab === 0 ? "prev" : "upcom"].map(
                (item, index) => {
                  return (
                    <View key={index} style={{ marginVertical: 20 }}>
                      <TourDetailCard
                        mode="tourist"
                        source={{ uri: item?.imageUrl }}
                        title={item?.title}
                        tour={item}
                        onpress={() =>
                          navigation.navigate("TouristDetailedInformation", {
                            item,
                            tourId: item.id,
                          })
                        }
                      />
                    </View>
                  );
                }
              )}
            </>
          ) : (
            <View
              style={{
                marginTop: 200,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={[
                  {
                    marginRight: 10,
                    fontWeight: "bold",
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
        </ScrollView>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: screenWidth.width10,
    backgroundColor: "#fff",
  },
  alignCenter: {
    alignItems: "center",
  },
  cardDiv: {
    // marginTop: 20,
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
