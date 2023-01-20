import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityCard from "../../component/activityComponents/ActivityCard";
import Button from "../../component/button/Button";
import { images, REQUESTS, screenWidth,colors } from "../../config/Constant";
import { db } from "../../config/firebase";
import { deleteTour, getUserId } from "../../network/ApiService";
import text from "../../style/text";
import { getDateFromSeconds } from "../../util/DateHelper";
import Loading from "./../../component/Loading";

export default function TourDetailedInformation({ navigation, route }) {
  // logObj(route.params, "route.params");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleAccept, setModalVisibleAccept] = useState(false);
  const [data, setData] = useState({
    title: null,
    description: null,
    age: null,
    imageUrl: null,
    location: null,
    city: null,
    meetingPoint: null,
    qty: 0,
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    status: 0,
    requestBy: null,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    activitiesCustomizable: true,
    activities: [],
    id: null,
  });

  const getTourDetail = async () => {
    let tourDetail = route.params;
    const totalPriceOfActivity = tourDetail?.activities?.reduce(
      (total, item) => total + item.price,
      0
    );

    setData({
      ...tourDetail,
      price: totalPriceOfActivity,
    });
    // logObj(tourDetail, "tourDetail");
  };

  useFocusEffect(
    useCallback(() => {
      getTourDetail();
    }, [])
  );

  const fetchTour = async () => {
    console.log("🚀 ~ data.id", data.id);
    const useId = data.id || route.params.id;
    console.log("🚀 ~ useId", useId);

    const docRef = doc(db, "tours", useId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log(docSnap.data());
        console.log("Updated data");
        const totalPriceOfActivity = docSnap
          .data()
          ?.activities?.reduce((total, item) => total + Number(item.price), 0);

        setData({
          ...docSnap.data(),
          id: docSnap.id,
          price: totalPriceOfActivity,
        });
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTour();
    }, [])
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getTouristRequests = async () => {
    const uid = await getUserId();
    const data = [];
    const q = query(collection(db, REQUESTS), where("tourId", "==", tourId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
        setRequest(doc.id);
      });
    });
  };

  const toggleModalAccept = () => {
    setModalVisibleAccept(!isModalVisibleAccept);
  };

  const onDeleteTour = async () => {
    setIsLoading(true);

    const tourId = data.id;
    await deleteTour(tourId);
    setIsLoading(false);

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{}}>
        <Loading isLoading={true} text="جاري حذف الجولة" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={{ flex: 1 }}
          source={images.backgroundImg}
          resizeMode="cover"
        >
          {/* Header */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", margin: 15 }}
          >
            <Image source={images.arrow} style={[styles.arrowIcon]} />
          </Pressable>
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <Text style={[text.white, text.text30]}>جولاتي</Text>
          </View>

          <View style={[styles.card]}>
            {/*  Image */}
            <View style={[styles.alignCenter, {}]}>
              {data.imageUrl ? (
                <Image
                  source={{ uri: data?.imageUrl }}
                  style={[styles.dummyImg]}
                />
              ) : (
                <Image source={images.photo} style={[styles.dummyImg]} />
              )}
            </View>

            {/* Title */}
            <View style={{ alignSelf: "center" }}>
              <Text
                style={[text.themeDefault, text.text20, { fontWeight: "bold" }]}
              >
                {data?.title}
              </Text>
            </View>

            {/* Price */}
            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text style={[text.themeDefault, text.text18, {}]}>
                {data?.price} SAR
              </Text>
            </View>

            {/* Date & Time */}
            <View
              style={[
                styles.flexRow,
                {
                  // justifyContent: "space-between",
                  marginVertical: 10,
                },
              ]}
            >
              <View style={{}}>
                <Text style={[text.themeDefault, text.text14]}>
                  {getDateFromSeconds(data?.date)}
                </Text>
              </View>
              <View style={{ marginHorizontal: 10 }} />
              <View style={{}}>
                <Text style={[text.themeDefault, text.text14]}>
                  {getDateFromSeconds(data?.startTime, "time")} -{" "}
                  {getDateFromSeconds(data?.endTime, "time")}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View
              style={[
                styles.flexRow,
                {
                  alignSelf: "flex-end",
                  marginHorizontal: 10,
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

            {/* Description */}
            <View style={{ marginHorizontal: 5 }}>
              <Text style={[text.themeDefault, text.text18, text.right]}>
                {data?.description}
              </Text>
            </View>

            {/* meetingPoint */}
            <View
              style={[
                {
                  alignSelf: "flex-end",
                  marginVertical: 10,
                },
              ]}
            >
              <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                <Text
                  style={[
                    text.themeDefault,
                    text.text20,
                    { fontWeight: "bold" },
                  ]}
                >
                  {data?.meetingPoint}
                </Text>
              </View>
            </View>

            {/* Age & Qty */}
            <View
              style={[
                styles.flexRow,
                {
                  justifyContent: "space-between",
                  marginVertical: 10,
                  marginHorizontal: 10,
                },
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
                  <Text style={[text.themeDefault, text.text20]}></Text>
                </View>
              </View>

              <View
                style={[
                  styles.flexRow,
                  {
                    alignSelf: "flex-end",
                  },
                ]}
              >
                <View style={{ marginHorizontal: 10 }}>
                  <Text style={[text.themeDefault, text.text20]}>
                    {data?.qty}
                  </Text>
                </View>
                <View>
                  <Image source={images.user} style={[styles.iconLg]} />
                </View>
              </View>
            </View>

            {/* Activitys */}
            <View
              style={{
                marginVertical: 10,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                // ...highlights.brdr1,
                width: "100%",
              }}
            >
              <Text
                style={[text.themeDefault, text.text20, { fontWeight: "bold" }]}
              >
                الأنشطة
              </Text>

              <Text
                style={[
                  text.themeDefault,
                  text.text18,
                  {
                    width: "100%",
                  },
                ]}
              >
                تخصيص الأنشطة: {data?.activitiesCustomizable ? "نعم" : "لا"}
              </Text>

              <View>
                {data.activities.map((item, index) => {
                  return (
                    <ActivityCard
                      key={index}
                      activity={item}
                      display
                      // onEditActivity = {onEditActivity}
                      // onRemoveActivity={onRemoveActivity}
                    />
                  );
                })}
              </View>
            </View>

            {/* Buttons */}
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
              <Button
                title={" تحديث معلومات الجولة"}
                onpress={() => navigation.navigate("EditTour", { data })}
                style={{ backgroundColor:colors.Blue,
                paddingVertical: 18,
                marginVertical:10,
                width: screenWidth.width90,}}
              />
              <Button title={" حذف الجولة"} onpress={toggleModal}
              style={{ backgroundColor:colors.brown,
                paddingVertical: 18,
               
                width: screenWidth.width90,}} />
            </View>
          </View>

          <StatusBar style="auto" />

          {/* Remove modal */}
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
                    هل أنت متأكد أنك تريد حذف هذه الجولة؟
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  
                  <View style={{}}>
                    <Button
                      title="الغاء"
                      style={{ backgroundColor:colors.lightBrown }}
                      onpress={toggleModal}
                    />
                  </View>
                  <View style={{}}>
                    <Button
                      title="حذف"
                      style={{ backgroundColor: colors.brown }}
                      onpress={onDeleteTour}
                    />
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
    
    alignItems: "center",
  },
  iconLg: {
    width: 40,
    height: 40,
    tintColor: "#5398a0",
  },
  arrowIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#fff",
  },
});
