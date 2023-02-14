import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { getAuth } from "firebase/auth";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useReducer, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Rating } from "react-native-ratings";
import Icon from "react-native-vector-icons/Ionicons";
import ActivityCard from "../../component/activityComponents/ActivityCard";
import AppButton from "../../component/AppButton";
import AppImage from "../../component/AppImage";
import Loading from "../../component/Loading";
import MapListItem from "../../component/maps/MapListItem";
import { colors, images, screenWidth } from "../../config/Constant";
import { auth, db } from "../../config/firebase";
import {
  getUser,
  getUserObj,
  insertRequest,
  updateRequest,
} from "../../network/ApiService";
import text from "../../style/text";
import { getFormattedDate, getFormattedTime } from "./../../util/DateHelper";
async function sendBookNotification(
  expoPushToken,
  title,
  body,
  touristName,
  tourId
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { touristName, tourId },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default function TouristDetailedInformation({ navigation, route }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const DEFAULT_TABBAR_HEIGHT = useBottomTabBarHeight();

  const [dateString, setDateString] = useState(null);
  const [startTimeString, setStartTimeString] = useState(null);
  const [endTimeString, setEndTimeString] = useState(null);
  const [userName, setUserName] = useState(null);
  const [price, setPrice] = useState(0);
  // reducer force update
  let [bookstar, setBookStar] = useState(0);
  let [reviewDone, setReviewDone] = useState(false);

  const [customizing, setCustomizing] = useState(false);
  const [tourStatus, setTourStatus] = useState("notRequested"); // requested, accepted, rejected
  const [selectedActivities, setSelectedActivities] = useState([]);
  var Auth = getAuth();
  const currentUserId = auth?.currentUser?.uid;

  const tourId = route.params.tourId;

  const [update, forceUpdate] = useReducer((x) => x + 1, 0);

  // if this tour is requested by this user before
  const [currentTourRequest, setCurrentTourRequest] = useState(null);

  const [data, setData] = useState({
    id: null,
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    activities: [],
    status: null,
    touristId: null,
    price: null,

    requestBy: "", //"wjj1ovm0FqQ5v1o2HS3m9lHOzAR2",
    imageUrl: "",
    status: null,
    title: "جولة خطرة",
    city: "جدة",
  });

  const isReq = route.params?.mode === "request";
  const currentActs = route.params?.activities;

  let checkReview = () => {
    let countStar = 0;
    data?.reviews?.length >= 0 &&
      Auth.onAuthStateChanged(async (user) => {
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
  }, [data]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    setTourStatus("notRequested");

    // console.log("useEffect");
    const unsubscribe = onSnapshot(
      doc(db, "tours", tourId),
      (snapshot) => {
        setData({
          id: snapshot.id,
          ...snapshot.data(),
        });
        setSelectedActivities(snapshot.data()?.activities);
        calculatePrice(snapshot.data()?.activities);
      },
      (error) => {
        console.log(error);
      }
    );

    // TODO: Check if their is a request for this tour by this user
    const q = query(
      collection(db, "requests"),
      where("tourId", "==", tourId),
      where("touristId", "==", currentUserId)
    );

    const unsubscribe2 = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          setCurrentTourRequest({
            id: doc.id,
            ...doc.data(),
          });

          if (doc.data().status == 0) {
            setTourStatus("requested");
          } else if (doc.data().status == 1 && doc.data().isPaid == false) {
            setTourStatus("accepted");
          } else if (doc.data().status == 2) {
            setTourStatus("rejected");
          }
        }
      });
    });

    // isReq &&
    //   setData((prev) => ({
    //     ...prev,

    //     activities: selectedActivities,
    //   }));

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  const onReserveTour = async () => {
    try {
      // pre request
      // init modal & loading
      setModalVisible(!isModalVisible);
      setIsLoading(true);

      // get user data
      const userData = await getUserObj();
      const touristId = await userData.uid;

      const localData = await getUser(data.requestBy);
      // console.log("🚀 ~ userData", userData);

      // get tour data
      const reqToAdd = {
        localId: data.requestBy,
        tourId: data.id,
        title: data.title,
        touristId: touristId,
        touristName: userData?.firstname,
        localName: localData?.firstname,
        status: 0,
        imageUrl: data?.imageUrl,
        dateCreated: Date.now(),
        activities: selectedActivities,
        price,
        isPaid: false,
      };

      if (tourStatus == "notRequested") {
        await insertRequest(reqToAdd);
      } else if (tourStatus == "rejected") {
        await updateRequest(currentTourRequest.id, {
          status: 0,
          activities: selectedActivities,
          price,
        });
      } else if (tourStatus == "accepted" || "requested") {
        alert("لقد قمت بالحجز مسبقا");
        setIsLoading(false);
        return;
      }

      await sendBookNotification(
        localData.push_token,
        "تم حجز جولة " + data.title,
        "طلب حجز جولة جديد من قبل " + userData.firstname,
        userData.firstname,
        data.id
      );
      // Post request
      setIsLoading(false);
      // navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const calculatePrice = (Activities) => {
    let temp = 0;
    selectedActivities.forEach((activity) => {
      temp += Number(activity.price);
    });
    setPrice(temp);

    return temp;
  };

  const handlePressActivity = (item) => {
    let temp = selectedActivities;

    const selected = temp.find((activity) => activity.id === item.id);
    if (selected) {
      // console.log("remove");
      temp = temp.filter((activity) => activity.id !== item.id);
    } else {
      console.log("add");
      temp.push(item);
    }

    setSelectedActivities(temp);
    calculatePrice(temp);
    // sd
    forceUpdate();
  };

  const isCustomizable = data?.activitiesCustomizable;

  useEffect(() => {
    const res = calculatePrice(selectedActivities);
    // console.log("🚀 ~ res", res);
  }, [selectedActivities]);

  return (
    <View style={styles.container}>
      <Loading visible={isLoading} text="جاري الحجز" />
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
            style={{ color: "white", marginTop: 45, marginLeft: 10 }}
            onPress={() => navigation.goBack()}
          />
          <View style={[styles.alignCenter, { marginTop: -36 }]}>
            <Text style={[text.text25, text.bold, { color: colors.white }]}>
              معلومات الجولة
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
            {/* Title */}
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <Text style={[text.text30,text.HeadingC, { fontWeight: "bold" }]}>
                {data?.title}
              </Text>
            </View>

            {/* local name */}
            <View
              style={{
                alignSelf: "center",
                paddingTop: 7,
              }}
            >
              <Text style={[text.text15,text.SubduedTextC, { fontWeight: "bold" }]}>
                اسم المُرشد: {data?.localName}
              </Text>
            </View>

            <Rating
              startingValue={bookstar && bookstar / data.reviews?.length}
              imageSize={30}
              fractions={25}
              showRating={false}
              readonly={true}
              tintColor={"#ececec"}
              style={{
                marginVertical: 10,
                padding: 2,
              }}
            />

            {data.reviews?.length > 0 ? (
              <Text
                style={{
                  color: "#616161",
                  alignItems: "center",
                  fontWeight: "800",
                  alignSelf: "center",
                  marginLeft: 20,
                  fontSize: 13,
                  marginTop: -10,
                }}
              >
                {""} {(bookstar / data.reviews?.length).toFixed(2)} من أصل 5{" "}
                {"\n "}
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
                navigation.navigate("Comment", data);
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
                  marginTop: -20,
                }}
              >
                {data.reviews?.length > 0
                  ? "تقيمات الجولة..."
                  : "لا توجد تقيمات"}
              </Text>
            </TouchableOpacity>
            {/* Price */}
            <View style={{ alignSelf: "center", marginVertical: -5 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text18,
                  { color: colors.brown, fontSize: 22, paddingBottom: 25 },
                ]}
              >
                {price} SAR
              </Text>
            </View>
            {/* Date & Time */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10,
              }}
            >
              <Text
                style={[
                  {
                    textAlign: "center",
                    flex: 1,
                    color: colors.Blue,
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
                  text.TextC,
                  {
                    fontWeight: "bold",
                    marginRight: 5,
                    paddingTop: 20,
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
                  text.TextC,
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
                    text.TextC,
                    text.text18,
                    { fontWeight: "bold" },
                  ]}
                >
                  نقطة اللقاء:
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
                      text.TextC,
                      text.text18,
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
                  styles.flexRow,
                  {
                    alignSelf: "flex-end",
                  },
                ]}
              >
                <View style={{ marginHorizontal: 10 }}>
                  <Text style={[text.TextC, text.text20,text.bold]}>
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
                width: "95%",
              }}
            >
              <Text
                style={[
                  text.textHeadingColor,
                  text.text25,
                  {
                    fontWeight: "bold",
                  },
                ]}
              >
                الأنشطة
              </Text>

              <AppButton
                title={customizing ? "حفظ التخصيص" : "تخصيص الأنشطة"}
                disabled={
                  !isCustomizable ||
                  tourStatus == "requested" ||
                  tourStatus == "accepted" ||
                  data.isPaid == true
                }
                style={{
                  backgroundColor: customizing
                    ? colors.lightBrown
                    : colors.brown,
                }}
                onPress={() => {
                  //   logObj(selectedActivities, "selectedActivities");
                  setCustomizing((prev) => {
                    // customizing = false;
                    return !prev;
                  });
                }}
              />
            </View>
            {isReq
              ? currentActs.map((item, index) => {
                  return (
                    <ActivityCard
                      key={index}
                      activity={item}
                      display
                      isChecked
                    />
                  );
                })
              : !!data?.activities &&
                data?.activities.map((item, index) => {
                  const isSelected = selectedActivities
                    .map((item) => item.id)
                    .includes(item.id);

                  //   console.log("🚀 ~ OUT > isSelected", isSelected);
                  return (
                    <ActivityCard
                      key={index}
                      activity={item}
                      display={!customizing}
                      withChecklist={customizing}
                      isChecked={isSelected}
                      onCheck={handlePressActivity}
                    />
                  );
                })}
            {/* Price */}
            <View
              style={[
                {
                  // marginRight: 20,
                  alignSelf: "flex-end",
                  width: "95%",
                  flexDirection: "row-reverse",
                },
              ]}
            >
              <Text
                style={[
                  text.textColor,
                  text.text20,
                  text.right,
                  {
                    fontWeight: "bold",
                  },
                ]}
              >
                السعر الإجمالي للرحلة:
              </Text>
              <Text
                style={{
                  color: colors.lightBrown,
                  fontWeight: "900",
                  fontSize: 18,
                  marginHorizontal: 20,
                }}
              >
                {price} ريال
              </Text>
            </View>
          </View>

          {/* Button */}
          <View style={{ alignSelf: "center", marginVertical: 30 }}>
            {data?.isPaid ? (
              <AppButton
                title="جولة محجوزة"
                disabled
                style={{
                  paddingVertical: 18,
                  paddingHorizontal: 30,
                  width: screenWidth.width90,
                }}
              />
            ) : (
              <AppButton
                title={
                  price == 0
                  ? "يجب اختيار نشاط واحد على الأقل"
                  :tourStatus == "requested"
                    ? "تم الطلب"
                    : tourStatus == "accepted"
                    ? "تم الحجز"
                    : tourStatus == "rejected"
                    ? "طلب مرة أخرى"
                    : "حجز الجولة"
                }
                disabled={tourStatus == "requested" || tourStatus == "accepted"|| price == 0}
                onPress={toggleModal}
                style={{
                  backgroundColor:
                    tourStatus == "requested"
                      ? colors.gray
                      : tourStatus == "accepted"
                      ? colors.green
                      : tourStatus == "rejected"
                      ? colors.redTheme
                      : colors.Blue,
                  paddingVertical: 18,
                  paddingHorizontal: 30,
                  width: screenWidth.width90,
                }}
              />
            )}
          </View>

          <StatusBar style="auto" />

          {/* Modal */}
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
                    هل أنت متأكد أنك تريد حجز هذه الجولة؟
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    // flex: 1,
                  }}
                >
                       <AppButton
                    title="الغاء"
                    style={{
                      backgroundColor: colors.lightBrown,
                      width: "45%",
                    }}
                    onPress={toggleModal}
                  />
                  <AppButton
                    title="حجز"
                    style={{ backgroundColor: colors.Blue, width: "45%" }}
                    onPress={onReserveTour}
                  />
             
                </View>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </ScrollView>
      <ExpoStatusBar style="dark" />
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
    marginVertical: 50,
    ///shadowEffect
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: colors.brown,
    marginRight: 15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconLg: {
    width: 40,
    height: 40,
    tintColor: colors.brown,
  },
  arrowIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#fff",
  },
});
