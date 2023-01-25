import { StatusBar } from "expo-status-bar";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useReducer, useState } from "react";
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
import ActivityCard from "../../component/activityComponents/ActivityCard";
import AppButton from "../../component/AppButton";
import AppImage from "../../component/AppImage";
import Loading from "../../component/Loading";
import MapListItem from "../../component/maps/MapListItem";
import { colors, highlights, images, screenWidth } from "../../config/Constant";
import { auth, db } from "../../config/firebase";
import {
  getUser,
  getUserId,
  getUserObj,
  insertRequest,
} from "../../network/ApiService";
import text from "../../style/text";
import { getFormattedDate, getFormattedTime } from "./../../util/DateHelper";

export default function TouristDetailedInformation({ navigation, route }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [dateString, setDateString] = useState(null);
  const [startTimeString, setStartTimeString] = useState(null);
  const [endTimeString, setEndTimeString] = useState(null);
  const [userName, setUserName] = useState(null);
  const [price, setPrice] = useState(0);
  // reducer force update

  const [customizing, setCustomizing] = useState(false);
  const [tourStatus, setTourStatus] = useState("notRequested");
  const [selectedActivities, setSelectedActivities] = useState([]);

  const currentUserId = auth?.currentUser?.uid;
  const tourId = route.params.tourId;

  const [update, forceUpdate] = useReducer((x) => x + 1, 0);

  const [data, setData] = useState({
    id: null,
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    activities: [],
    status: null,
    touristId: null,
    price: null,
  });

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
      querySnapshot.docChanges().forEach((change) => {
        change.type === "added" && setTourStatus("requested");
        change.type === "removed" && setTourStatus("notRequested");

        // console.log("🚀 ~ change", change.type, change.doc.data().status);
      });
    });

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
      const touristId = await getUserId();
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
      };

      const response = await insertRequest(reqToAdd);
      // logObj(response, "🚀 ~ response");

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
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", margin: 15 }}
          >
            <Image source={images.arrow} style={[styles.arrowIcon]} />
          </Pressable>
          <View
            style={[
              styles.alignCenter,
              { marginTop: 20, ...highlights.brdr02 },
            ]}
          >
            <Text style={[text.text25, text.bold, { color: colors.white }]}>
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
                {price} SAR
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
                  // ...no_highlights. brdr01,
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
                ...highlights.brdr02,
              }}
            >
              <Text
                style={[
                  text.textHeadingColor,
                  text.text25,
                  {
                    fontWeight: "bold",
                    //    ...no_highlights. brdr03
                  },
                ]}
              >
                الأنشطة
              </Text>

              <AppButton
                title={customizing ? "حفظ التخصيص" : "تخصيص الأنشطة"}
                disabled={!isCustomizable || tourStatus == "requested"}
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
            {!!data?.activities &&
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
                  ...highlights.brdr02,
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
                  color: colors.Blue,
                  fontWeight: "bold",
                  fontSize: 16,
                  marginHorizontal: 20,
                }}
              >
                {price} ريال
              </Text>
            </View>
          </View>

          {/* Button */}
          <View style={{ alignSelf: "center", marginVertical: 30 }}>
            <AppButton
              title={tourStatus == "requested" ? "تم الحجز" : " حجز الجولة"}
              disabled={tourStatus == "requested"}
              onPress={toggleModal}
              style={{
                backgroundColor:
                  tourStatus == "requested" ? colors.gray : colors.Blue,
                paddingVertical: 18,
                width: screenWidth.width90,
              }}
            />
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
                    ...highlights.brdr02,
                  }}
                >
                  <AppButton
                    title="حجز"
                    style={{ backgroundColor: colors.Blue, width: "45%" }}
                    onPress={onReserveTour}
                  />
                  <AppButton
                    title="الغاء"
                    style={{
                      backgroundColor: colors.lightBrown,
                      width: "45%",
                    }}
                    onPress={toggleModal}
                  />
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
    marginTop: screenWidth.width10,
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
    tintColor: "#5398a0",
  },
  flexRow: {
    flexDirection: "row",
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
