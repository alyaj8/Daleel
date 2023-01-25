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
import React, { useCallback, useEffect, useState } from "react";
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
import AppImage from "../../component/AppImage";
import Button from "../../component/button/Button";
import {
  colors,
  highlights,
  images,
  no_highlights,
  REQUESTS,
  screenWidth,
} from "../../config/Constant";
import { db } from "../../config/firebase";
import { deleteTour, getUserId } from "../../network/ApiService";
import text from "../../style/text";
import { getFormattedDate, getFormattedTime } from "../../util/DateHelper";
import Loading from "./../../component/Loading";
import MapListItem from "./../../component/maps/MapListItem";

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
      (total, item) => total + Number(item.price),
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

  useEffect(() => {
    // console.log("useEffect");
    const useId = data.id || route.params.id;

    const unsubscribe = onSnapshot(
      doc(db, "tours", useId),
      (snapshot) => {
        const totalPriceOfActivity = snapshot
          .data()
          ?.activities?.reduce((total, item) => total + Number(item.price), 0);

        setData({
          id: snapshot.id,
          price: totalPriceOfActivity,

          ...snapshot.data(),
        });
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchTour = async () => {
    // console.log("🚀 ~ data.id", data.id);
    const useId = data.id || route.params.id;
    // console.log("🚀 ~ useId", useId);

    const docRef = doc(db, "tours", useId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log(docSnap.data());
        // console.log("Updated data");
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
          style={{ flex: 1, ...no_highlights.brdr2 }}
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
          <View
            style={[
              styles.alignCenter,
              {
                height: 65,
                // flexWrap: "wrap",
                marginHorizontal: 35,
                alignItems: "center",
                justifyContent: "center",
                // ...highlights.brdr2,
              },
            ]}
          >
            <Text style={[text.white, text.text30]}>{data?.title}</Text>
          </View>

          {/* Body */}
          <View style={[styles.card]}>
            {/* Image */}
            <View style={[styles.alignCenter, {}]}>
              {data?.imageUrl ? (
                <AppImage sourceURI={data.imageUrl} style={[styles.img]} />
              ) : (
                <Image source={images.photo} style={[styles.dummyImg]} />
              )}
            </View>
            {/* Title */}
            <View
              style={{
                alignSelf: "center",
                ...highlights.brdr02,
              }}
            >
              <Text style={[text.text30, { fontWeight: "bold" }]}>
                {data?.title}
              </Text>
            </View>
            {/* Price */}
            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text18,
                  { color: colors.brown },
                ]}
              >
                {data.price} SAR
              </Text>
            </View>
            {/* Date & Time */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  {
                    textAlign: "center",
                    flex: 1,
                    color: colors.Blue,
                    ...highlights.brdr0,
                    fontWeight: "bold",
                  },
                  text.text14,
                ]}
              >
                {getFormattedTime(data?.startTime)} :{" "}
                {getFormattedTime(data?.endTime)}
              </Text>
              <Text
                style={[
                  {
                    textAlign: "center",
                    flex: 1,
                    color: colors.Blue,
                    fontWeight: "bold",

                    ...highlights.brdr0,
                  },
                  text.text14,
                ]}
              >
                {getFormattedDate(data?.date)}
              </Text>
            </View>
            {/* Location */}
            <View
              style={[
                styles.flexRow,
                {
                  alignItems: "center",
                  // ...no_highlights.brdr1,
                  justifyContent: "flex-end",
                },
                {
                  // alignSelf: "flex-end",

                  marginHorizontal: 10,
                  marginVertical: 10,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={[{}, text.themeDefault, text.text16]}>
                  {data?.city}
                </Text>
                <Image source={images.location} style={[styles.icon]} />
              </View>
            </View>
            {/* Description */}
            <View style={{ marginHorizontal: 5 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text14,
                  text.right,
                  {
                    padding: 15,
                  },
                ]}
              >
                {data?.description}
              </Text>
            </View>

            {/* meetingPoint */}
            <View
              style={[
                {
                  alignSelf: "flex-end",
                  // marginVertical: 10,
                  ...highlights.brdr01,
                },
              ]}
            >
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 10,
                  ...highlights.brdr02,
                }}
              >
                <Text
                  style={[
                    text.themeDefault,
                    text.text20,
                    { fontWeight: "bold", ...highlights.brdr03 },
                  ]}
                >
                  نقطة اللقاء
                </Text>
              </View>
            </View>
            <View
              style={{
                ...highlights.brdr04,
                paddingHorizontal: 10,
              }}
            >
              <MapListItem item={data.meetingPoint} withMap />
            </View>

            {/* Age & Qty */}
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  ...highlights.brdr05,
                  // marginVertical: 10,
                  // marginHorizontal: 10,
                },
              ]}
            >
              <View style={[{ flexDirection: "row" }]}>
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
                  {
                    flexDirection: "row",
                    alignSelf: "flex-end",
                    alignItems: "center",
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
          </View>

          {/* Activitys */}
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: "#ececec",
              borderRadius: 10,
              padding: 10,
              marginVertical: 10,
              ///shadowEffect
              shadowColor: "#171717",
              shadowOffset: { width: -1, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 5,
              alignItems: "center",
              // alignSelf: "center",
              // justifyContent: "center",
              ...highlights.brdr02,
            }}
          >
            <View
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                alignItems: "center",
                // ...no_highlights.brdr2,
              }}
            >
              <Text
                style={[
                  text.textHeadingColor,
                  text.text20,
                  {
                    fontWeight: "bold",
                    //    ...no_highlights.brdr3
                  },
                ]}
              >
                الأنشطة
              </Text>
            </View>
            {!!data?.activities &&
              data?.activities.map((item, index) => {
                return <ActivityCard key={index} activity={item} display />;
              })}
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
              style={{
                backgroundColor: colors.Blue,
                paddingVertical: 18,
                marginVertical: 10,
                width: screenWidth.width90,
              }}
            />
            <Button
              title={" حذف الجولة"}
              onpress={toggleModal}
              style={{
                backgroundColor: colors.brown,
                paddingVertical: 18,

                width: screenWidth.width90,
              }}
            />
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
                      style={{ backgroundColor: colors.lightBrown }}
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
  img: {
    width: screenWidth.width80,
    height: screenWidth.width60,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 15,
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
    width: screenWidth.width95,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ececec",
    alignSelf: "center",
    marginTop: 50,
    ...no_highlights.brdr1,
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
