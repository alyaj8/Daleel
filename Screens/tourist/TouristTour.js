import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useState } from "react";
import {
  FlatList,
  ImageBackground,
  RefreshControl,
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

  React.useEffect(() => {
    const bag = [];
    const q = query(collection(db, "tours"), where("status", "==", 0));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // build the data array
        const info = {
          id: doc.id,
          ...doc.data(),
        };

        bag.push(info);
      });

      // clear duplicate data by check if the id is added before
      const unique = bag.filter((thing, index, self) => {
        return (
          index ===
          self.findIndex((t) => {
            return t.id === thing.id;
          })
        );
      });

      setData(unique);
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      const uid = await getUserId();
      // console.log("🚀 ~ Tousit uid", uid);
      setCurrentUserId(uid);
    })();
  }, []);

  // when pull down to refresh, it will update the data
  const onRefresh = React.useCallback(() => {
    console.log("refreshing");
    setRefreshing(true);
    getLocalGuideRequests().then(() => setRefreshing(false));
  }, []);

  const rendersItem = ({ item }) => (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        // console.log("🚀 ~ أههه");

        return (
          <View style={{ marginVertical: 20 }}>
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
      }}
      ListEmptyComponent={
        <View style={{ marginTop: 200, alignItems: "center" }}>
          <Text style={[text.text12, text.themeDefault]}>No message found</Text>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
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
