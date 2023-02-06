import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
  TouchableOpacity,
  View,
} from "react-native";
//import Comment from "./Comment";
import Modal from "react-native-modal";
import { Rating } from "react-native-ratings";
import ActivityCard from "../../component/activityComponents/ActivityCard";
import AppButton from "../../component/AppButton";
import AppImage from "../../component/AppImage";
import Button from "../../component/button/Button";
import Loading from "../../component/Loading";
import MapListItem from "../../component/maps/MapListItem";
import {
  colors,
  highlights,
  images,
  REQUESTS,
  screenWidth,
} from "../../config/Constant";
import { auth, db } from "../../config/firebase";
import { deleteTour, getUserId } from "../../network/ApiService";
import text from "../../style/text";
import { getFormattedDate, getFormattedTime } from "../../util/DateHelper";
import Icon from "react-native-vector-icons/Ionicons";

export default function TourDetailedInformation({ navigation, route }) {
  // logObj(route.params, "route.params");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleAccept, setModalVisibleAccept] = useState(false);
  const DEFAULT_TABBAR_HEIGHT = useBottomTabBarHeight();

  const isReq = route.params?.mode === "request";
  const selectedActivities = route.params?.activities;

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
  let [bookstar, setBookStar] = useState(0);

  let checkReview = () => {
    let countStar = 0;
    data?.reviews?.length >= 0 &&
      auth.onAuthStateChanged(async (user) => {
        data.reviews?.map((val, ind) => {
          countStar = countStar + val.review;
          if (user.uid === val.comenteuseruid) {
            setReviewDone(true);
          }
        });
        setBookStar(countStar);
      });
  };

  useEffect(() => {
    checkReview();
  }, []);

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
    const useId = isReq
      ? data.tourId || route.params.tourId
      : data.id || route.params.id;

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
    const useId = isReq
      ? data.tourId || route.params.tourId
      : data.id || route.params.id;
    console.log("🚀 ~ useId", useId);
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
    <View style={styles.container}>
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
          <Icon
            name="arrow-back-outline"
            size={45}
            style={{ color: "white", marginTop: 45, marginLeft: 5 }}
            onPress={() => navigation.goBack()}
          />
          <View
            style={[
              styles.alignCenter,
              {
                height: 18,
                // flexWrap: "wrap",
                marginHorizontal: 35,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text
              style={[
                text.white,
                text.text30,
                { fontWeight: "bold", marginTop: -50 },
              ]}
            >
              {data?.title}
            </Text>
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

            {/* Rating */}

            {/* Title */}
            <View
              style={{
                alignSelf: "center",
                paddingBottom: 15,
              }}
            >
              <Text style={[text.text30, { fontWeight: "bold" }]}>
                {data?.title}
              </Text>
            </View>

            {/* local name */}
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <Text style={[text.text15, { fontWeight: "bold" }]}>
                أسم المُرشد: {data?.localName}
              </Text>
            </View>
            <View
              style={{
                alignSelf: "center",
                paddingBottom: 15,
              }}
            >
              <Rating
                startingValue={bookstar && bookstar / data.reviews?.length}
                imageSize={30}
                fractions={20}
                showRating={false}
                readonly={true}
                tintColor={"#ececec"}
                style={{
                  marginVertical: 10,
                }}
              />
              {data.reviews?.length > 0 ? (
                <Text
                  style={{
                    color: "black",
                    alignItems: "center",
                    fontWeight: "800",
                    alignSelf: "center",
                    fontSize: 15,
                    marginTop: -10,
                  }}
                >
                  {"     "} {(bookstar / data.reviews?.length).toFixed(2)} من
                  اصل 5 {"\n"}
                </Text>
              ) : (
                <Text style={{ color: "black" }}></Text>
              )}
              <TouchableOpacity
                style={{
                  width: 150,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
                onPress={() => {
                  navigation.navigate("Localcomments", data);
                }}
              // disabled={data.reviews?.length == null ? true : false}
              >
                <Text
                  style={{
                    color:
                      data.reviews?.length > 0
                        ? colors.lightBrown
                        : colors.lightBrown,
                    textDecorationLine: "underline",
                    fontWeight: "900",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {data.reviews?.length > 0
                    ? "تقيمات الجولة"
                    : " تقييمات الجولة..."}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Price */}

            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text18,
                  { color: colors.brown, fontSize: 22, marginTop: -18 },
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
                paddingBottom: 20,
              }}
            >
              <Text
                style={[
                  {
                    textAlign: "center",
                    flex: 1,
                    color: colors.Blue,
                    fontWeight: "bold",
                    paddingBottom: 20,
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
                    paddingBottom: 20,
                  },
                  text.text14,
                ]}
              >
                {getFormattedDate(data?.date)}
              </Text>
            </View>
            {/* Location */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={[
                  text.text16,
                  {
                    fontWeight: "bold",
                    marginRight: 5,
                  },
                ]}
              >
                {data?.city}
              </Text>
              <Image source={images.location} style={[styles.icon]} />
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
                },
              ]}
            >
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 10,
                }}
              >
                <Text
                  style={[
                    text.themeDefault,
                    text.text20,
                    { fontWeight: "bold" },
                  ]}
                >
                  نقطة اللقاء
                </Text>
              </View>
            </View>
            <View
              style={{
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
                    الفئة العمرية: {data?.age}
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
            }}
          >
            <View
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  text.textHeadingColor,
                  text.text20,
                  {
                    fontWeight: "bold",
                  },
                ]}
              >
                الأنشطة
              </Text>
            </View>
            {!!data?.activities &&
              data?.activities.map((item, index) => {
                const isSelected = selectedActivities.find(
                  (activity) => activity.id === item.id
                );

                return (
                  <ActivityCard
                    display={isReq}
                    isChecked={isReq && isSelected}
                    key={index}
                    activity={item}
                  //display
                  />
                );
              })}
          </View>

          {/* Buttons */}
          <View
            style={[
              styles.flexRow,
              {
                justifyContent: "space-between",
                marginHorizontal: 20,
                marginBottom:
                  Platform.OS === "ios"
                    ? DEFAULT_TABBAR_HEIGHT - 20
                    : DEFAULT_TABBAR_HEIGHT - 20,
                ...highlights.brdr03,
              },
            ]}
          >
            <AppButton
              title={"تحديث معلومات الجولة"}
              onPress={() => navigation.navigate("EditTour", { data })}
              style={{
                backgroundColor: colors.Blue,
                paddingVertical: 18,
                marginVertical: 10,
                width: screenWidth.width90,
              }}
            />
            <AppButton
              title={" حذف الجولة"}
              onPress={toggleModal}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  icon: {
    width: 25,
    height: 30,
    tintColor: "lightbrown",
    marginRight: 15,
  },
  flexRow: {
    alignItems: "center",
  },
  iconLg: {
    width: 40,
    height: 40,
    tintColor: "lightbrown",
  },
  arrowIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#fff",
  },
});
