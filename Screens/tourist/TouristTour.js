import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useState } from "react";
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
export default function TouristTour({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tourId, setTourId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getAllRequests = async () => {
        const uid = await getUserId();
        const q = query(collection(db, "tours"), where("status", "==", 0));

        // listen for changes
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const bag = [];
          querySnapshot.forEach((doc) => {
            // console.log(
            //   "🚀 ~ doc.data().status === 0",
            //   doc.data().status === 0
            // );
            if (doc.data().status === 0) {
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
        });
      };
      getAllRequests();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        <View style={[styles.alignCenter, { marginVertical: 20 }]}>
          <Text
            style={[
              {
                // flex: 1,
                width: "100%",
                textAlign: "center",
                //color: colors.Blue,
              },
              text.white,
              text.text30,
              text.bold,
            ]}
          >
            الجولات
          </Text>
        </View>
        <ScrollView style={[styles.cardDiv, { marginTop: screenWidth.width5 }]}>
          {data.length > 0 ? (
            <>
              {data.map((item, index) => {
                return (
                  <View key={index} style={{ marginVertical: 20 }}>
                    <TourDetailCard
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
              })}
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
