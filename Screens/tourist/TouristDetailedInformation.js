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
import NewAppButton from "../../component/AppButton";
import AppButton from "../../component/button/Button";
import Loading from "../../component/Loading";
import { colors, images, screenWidth } from "../../config/Constant";
import { auth, db } from "../../config/firebase";
import { getUserId, getUserObj, insertRequest } from "../../network/ApiService";
import text from "../../style/text";
import { getFormattedDate, getFormattedTime } from "./../../util/DateHelper";

export default function TouristDetailedInformation({ navigation, route }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateString, setDateString] = useState(null);
  const [startTimeString, setStartTimeString] = useState(null);
  const [endTimeString, setEndTimeString] = useState(null);
  const [userName, setUserName] = useState(null);
  const [customizing, setCustomizing] = useState(false);
  const [price, setPrice] = useState(0);
  // reducer force update
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);
  const [selectedActivities, setSelectedActivities] = useState([]);

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

  const [tourStatus, setTourStatus] = useState("notRequested");

  const currentUserId = auth?.currentUser?.uid;

  // console.log("🚀 ~ requests", data?.requests, currentUserId);
  // console.log("🚀 ~ status", data?.status);

  // const tourDetail = route.params.item;
  const tourId = route.params.tourId;

  // logObj(data);
  let temp = [];
  let working2 = !!selectedActivities ? selectedActivities : [];

  working2.forEach((activity) => {
    temp.push(activity.id);
  });

  // console.log("🚀 ~ temp", temp);

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

        console.log("🚀 ~ change", change.type, change.doc.data().status);
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
      console.log("🚀 ~ userData", userData);

      // get tour data
      const reqToAdd = {
        localId: data.requestBy,
        tourId: data.id,
        title: data.title,
        touristId: touristId,
        touristName: userData?.firstname,
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

  const isCustomizable = data?.activitiesCustomizable;

  const handlePressActivity = (item) => {
    let temp = selectedActivities;
    const selected = temp.find((activity) => activity.id === item.id);
    if (selected) {
      console.log("remove");
      temp = temp.filter((activity) => activity.id !== item.id);
    } else {
      console.log("add");
      temp.push(item);
    }
    setSelectedActivities(temp);

    forceUpdate();
  };

  useEffect(() => {
    let total = 0;
    let working = !!selectedActivities ? selectedActivities : [];
    working.forEach((activity) => {
      total += Number(activity.price);
    });
    setPrice(total);
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
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <Text style={[text.text25, text.bold, { color: colors.white }]}>
              {data?.title}
            </Text>
          </View>

          {/* Body */}
          <View style={[styles.card]}>
            {/* Image */}
            <View style={[styles.alignCenter, {}]}>
              {data?.imageUrl ? (
                <Image
                  source={{ uri: data.imageUrl }}
                  style={[styles.dummyImg]}
                />
              ) : (
                <Image source={images.photo} style={[styles.dummyImg]} />
              )}
            </View>

            {/* Price */}
            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text
                style={[
                  {
                    width: 100,
                    color: colors.brown,
                  },
                  text.text20,
                  {},
                ]}
              >
                {price} SAR
              </Text>
            </View>

            {/* Date */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={[{ width: "50%", color: colors.Blue }, text.text14]}>
                {getFormattedTime(data?.startTime)} :{" "}
                {getFormattedTime(data?.endTime)}
              </Text>
              <Text style={[{ width: "50%", color: colors.Blue }, text.text14]}>
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
              <Text style={[text.themeDefault, text.text18, text.right]}>
                {data?.description}
              </Text>
            </View>

            {/* Meeting Point */}
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

            {/* Age */}
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

              <NewAppButton
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
                  marginRight: 20,
                },
              ]}
            >
              <Text style={[text.textColor, text.text20, text.right]}>
                السعر الإجمالي للرحلة: {price}
              </Text>
            </View>
          </View>

          {/* Button */}
          <View style={{ alignSelf: "center", marginVertical: 30 }}>
            <AppButton
              title={tourStatus == "requested" ? "تم الحجز" : " حجز الجولة"}
              disabled={tourStatus == "requested"}
              onpress={toggleModal}
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
                  }}
                >
                  <View style={{}}>
                    <AppButton
                      title="حجز"
                      style={{ backgroundColor: colors.Blue }}
                      onpress={onReserveTour}
                    />
                  </View>
                  <View style={{}}>
                    <AppButton
                      title="الغاء"
                      style={{ backgroundColor: colors.lightBrown }}
                      onpress={toggleModal}
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
