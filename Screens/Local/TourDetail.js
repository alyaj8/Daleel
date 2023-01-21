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
import { images, REQUEST_TABLE, screenWidth } from "../../config/Constant";
import { db } from "../../config/firebase";
import { getUserId } from "../../network/ApiService";
import text from "../../style/text";
export default function TourDetail({ navigation }) {
  const [data, setData] = useState([]);
  const [tourId, setTourId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getAllRequests();
    }, [])
  );
  const getAllRequests = async () => {
    getLocalGuideRequests();
  };
  const getLocalGuideRequests = async () => {
    const uid = await getUserId();
    const data = [];
    const q = query(
      collection(db, REQUEST_TABLE),
      where("requestBy", "==", uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let obj = doc.data();
        obj["id"] = doc.id;
        data.push(obj);
        // setTourId(data);
      });
      setData(data);
      // console.log("tour data--->", data);
    });
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        <View style={[styles.alignCenter, { marginVertical: 10 }]}>
          <Text style={[text.white, text.text30, text.bold]}>جولاتي</Text>
        </View>
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[{}, styles.cardDiv, { marginTop: screenWidth.width15 }]}
          >
            {data?.length ? (
              data?.map((item, index) => {
                // console.log('item', item.title)
                return (
                  <View key={index} style={{ marginVertical: 20 }}>
                    <TourDetailCard
                      source={{ uri: item?.imageUrl }}
                      title={item?.title}
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
    marginTop: screenWidth.width10,
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
