import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import text from "../style/text";
import { images, screenWidth, REQUEST_TABLE } from "../config/Constant";
import LocalBooingDetailCard from "../component/card/DetailCard";
import { getUseraId } from "../network/ApiService";
import Loader from "../component/Loaders/Loader";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  query,
  where,
  getFirestore,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
export default function Local_Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const db = getFirestore();

  useFocusEffect(
    useCallback(() => {
      getAllRequests();
    }, [navigation])
  );

  const getAllRequests = async () => {
    getAllPendingRequests();
  };

  const getAllPendingRequests = async () => {
    const data = [];
    const q = query(collection(db, REQUEST_TABLE), where("status", "==", 0));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const obj = {
          id: doc?.id,
          ...doc?.data(),
        };
        data.push(obj);
      });
      setData(data);
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        <View style={[styles.alignCenter, { marginTop: 20 }]}>
          <Text style={[text.white, text.text30]}>﻿ الجولات المتاحة</Text>
        </View>
        <ScrollView style={{}} showsVerticalScrollIndicator={false}>
          {data?.length ? (
            data?.map((item, index) => {
              return (
                <View
                  key={index}
                  style={[styles.cardDiv, { marginTop: screenWidth.width15 }]}
                >
                  <LocalBooingDetailCard
                    onpress={() =>
                      navigation.navigate("BookingDetail", { data: item })
                    }
                    source={{ uri: item?.imageUrl }}
                    title={item?.name}
                    price={item?.price}
                    date={item?.date}
                    desciption={item?.desciption}
                  />
                </View>
              );
            })
          ) : (
            <View style={{ marginTop: 200, alignItems: "center" }}>
              <Text style={[text.text12, text.themeDefault]}>
                No message found
              </Text>
            </View>
          )}
          <View style={{ marginBottom: screenWidth.width20 }}></View>
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
});
