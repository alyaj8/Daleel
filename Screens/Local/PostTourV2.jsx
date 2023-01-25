import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import AppButton from "../../component/AppButton";
import TourForm from "../../component/forms/TourForm";
import Loading from "../../component/Loading";
import TabsWrapper from "../../component/TabsWrapper";
import {
  ages,
  cities,
  colors,
  highlights,
  imagePickerConfig,
  images,
  screenWidth,
  uploadImage,
} from "../../config/Constant";
import { getUserId, insertTour } from "../../network/ApiService";
import text from "../../style/text";
import { logObj } from "../../util/DateHelper";
import ActivityForm from "./../../component/forms/ActivityForm";

const tabs = [
  { title: "الجولة", selected: false },
  { title: "الأنشطة", selected: false },
];

const initActivity = {
  id: null,
  title: "",
  description: "",
  location: "",
  date: null,
  startTime: null,
  endTime: null,
  price: null,
  imageUrl: null,
};

const initTour = {
  id: null,
  title: "",
  city: "",
  qty: null,
  meetingPoint: {
    address: "",
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    category: [],
    full_name: "",
    title: "",
    id: "",
  },
  age: "",
  description: "",
  imageUrl: null,
  date: null,
  startTime: null,
  endTime: null,
  status: 0,
  activitiesCustomizable: false,
  activities: [],
};

const PostTourV2 = () => {
  // Page State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(0);

  // Tour
  const [tour, setTour] = useState(initTour);
  const [filePathTour, setFilePathTour] = useState(null);

  // Activity
  const [activity, setActivity] = useState(initActivity);
  const [activities, setActivities] = useState([]);
  const [filePathActivity, setFilePathActivity] = useState(null);
  const [activitiesMode, setActivitiesMode] = useState("add"); // add, edit

  // Modals Refs and configs
  const modalizeRef = useRef(null);
  const modalizeRefAge = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerConfig, setPickerConfig] = useState("date"); // date, startTime, endTime

  useEffect(() => {
    if (false) {
      logObj(tour, "🚀 ~ tour");
      logObj(activity, "🚀 ~ activity");
      // logObj(activities, "🚀 ~ activities");
    }
  }, [tour, activity, activities]);

  const onPressTab = (index) => {
    setSelectedMenu(index);
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility((prevState) => !prevState);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    toggleDatePicker();
  };

  const onShowModal = (type) => {
    console.log("onShowModal > type: ", type);
    if (type === "city") {
      modalizeRef.current?.open();
    }
    if (type === "age") {
      modalizeRefAge.current?.open();
    }
  };

  const selectModal = (type, value) => {
    console.log("selectModal > type: ", type);
    console.log("selectModal > value: ", value);

    if (type === "city") {
      setTour({ ...tour, city: value });
      modalizeRef.current?.close();
    }
    if (type === "age") {
      setTour({ ...tour, age: value });
      modalizeRefAge.current?.close();
    }
  };

  const pickImage = async (mode) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      ...imagePickerConfig,
    });
    if (!result.canceled) {
      if (mode === "activity") setFilePathActivity(result.assets[0].uri);
      if (mode === "tour") setFilePathTour(result.assets[0].uri);
    }
  };

  const submitRequest = async () => {
    try {
      setIsLoading(true);
      setModalVisible(!isModalVisible);
      const isTourHasImage = filePathTour ? true : false;

      let imageUrl = null;
      if (isTourHasImage) {
        imageUrl = await uploadImage(filePathTour);
        // console.log("🚀 ~ imageUrl", imageUrl);
      }

      const userId = await getUserId();

      const tourDone = isTourHasImage && !!imageUrl ? true : false;

      // validate meeting point
      const localMeetingPoint = tour.meetingPoint;
      const meetingPoint = {
        address: localMeetingPoint.address ? localMeetingPoint.address : "",
        category: localMeetingPoint.category ? localMeetingPoint.category : [],
        coordinates: { latitude: 24.806149, longitude: 46.639029 },
        full_name: localMeetingPoint.full_name
          ? localMeetingPoint.full_name
          : "",
        id: localMeetingPoint.id ? localMeetingPoint.id : "",
        title: localMeetingPoint.title ? localMeetingPoint.title : "",
      };
      if (tourDone || !isTourHasImage) {
        const data = {
          ...tour,
          meetingPoint,
          imageUrl,
          activitiesCustomizable,
          activities: activities,
          requestBy: userId,
          dateCreated: Date.now(),
          dateUpdated: null,
        };
        // logObj(data);
        await insertTour(data, "tours");

        logObj(data, "🚀 ~ PostTour.js");

        setIsLoading(false);
        // navigation.goBack();
      }

      // setLoading(false);
      // navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
      alert("حدث خطأ ما، الرجاء المحاولة مرة أخرى");
      console.log("error submitRequest", error);
    }
  };

  const onAddActivity = () => {
    const curActLoc = activity?.location;

    setActivities([
      ...activities,
      {
        ...activity,
        location: {
          address: !!curActLoc.address ? curActLoc.address : " ",
          category: !!curActLoc?.category ? curActLoc.category : [],
          coordinates: {
            latitude: curActLoc?.coordinates?.latitude,
            longitude: curActLoc?.coordinates?.longitude,
          },
          full_name: !!curActLoc.full_name ? curActLoc.full_name : null,
          id: !!curActLoc.id ? curActLoc.id : null,
          title: !!curActLoc.title ? curActLoc.title : null,
        },
        id: activities.length + 1,
      },
    ]);

    setActivity(initActivity);
  };

  const onRemoveActivity = (id) => {
    setActivities(activities.filter((act) => act.id !== id));
  };

  const onEditActivity = (id) => {
    setActivitiesMode("edit");
    setActivity(activities.find((a) => a.id === id));
  };

  const onEditActivitySubmit = () => {
    const index = activities.findIndex((a) => a.id === activity.id);
    const newActivities = [...activities];
    newActivities[index] = activity;
    setActivities(newActivities);
    setActivitiesMode("add");
    setActivity(initActivity);
  };

  const onEditActivityCancel = () => {
    setActivitiesMode("add");
    setActivity(initActivity);
  };

  const onRemoveActivitySubmit = () => {
    setActivities(activities.filter((a) => a.id !== activity.id));
    setActivitiesMode("add");
    setActivity(initActivity);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 0:
        return (
          <TourForm
            tour={tour}
            isModalVisible={isModalVisible}
            toggleDatePicker={toggleDatePicker}
            handleConfirm={handleConfirm}
            isDatePickerVisible={isDatePickerVisible}
            onShowModal={onShowModal}
            selectModal={selectModal}
            setTour={setTour}
          />
        );
      case 1:
        return (
          <ActivityForm
            mode={activitiesMode}
            //
            activity={activity}
            activities={tour.activities}
            setActivity={setActivity}
            activitiesMode={activitiesMode}
            //
            isModalVisible={isModalVisible}
            toggleDatePicker={toggleDatePicker}
            handleConfirm={handleConfirm}
            isDatePickerVisible={isDatePickerVisible}
            //
            onAddActivity={onAddActivity}
            onRemoveActivit={onRemoveActivity}
            onEditActivity={onEditActivity}
            //
            onRemoveActivitySubmit={onRemoveActivitySubmit}
            onEditActivitySubmit={onEditActivitySubmit}
            onEditActivityCancel={onEditActivityCancel}
          />
        );
      default:
        return <TourForm />;
    }
  };

  return (
    <View style={styles.container}>
      <Loading text="جاري نشر الجولة..." visible={isLoading} />
      <ImageBackground
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: screenWidth.width100,
          height: Dimensions.get("window").height,
          alignItems: "center",
          justifyContent: "center",
        }}
        source={images.backgroundImg}
        resizeMode="cover"
      >
        {/* Header */}
        <View
          style={{
            alignItems: "center",
            marginTop: screenWidth.width10,
            // marginVertical: 0,
          }}
        >
          <View style={styles.headerContaner}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={styles.headerText}>نشر جولة جديدة</Text>
              <AppButton
                disabled={false}
                style={{
                  // ...styles.button,
                  height: 40,
                  width: 60,
                  ...styles.shadow,
                }}
                title={"نشر"}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>
          </View>
          <TabsWrapper menuTabs={tabs} onPressTab={onPressTab} />
        </View>

        <KeyboardAwareScrollView
          enableAutomaticScroll
          extraHeight={240}
          enableOnAndroid
          contentContainerStyle={{
            width: "100%",
            // marginBottom: 100,
          }}
        >
          {selectedMenu === 0 ? (
            <TourForm
              tour={tour}
              isModalVisible={isModalVisible}
              toggleDatePicker={toggleDatePicker}
              handleConfirm={handleConfirm}
              isDatePickerVisible={isDatePickerVisible}
              onShowModal={onShowModal}
              selectModal={selectModal}
              setTour={setTour}
            />
          ) : (
            <ActivityForm
              mode={activitiesMode}
              //
              activity={activity}
              activities={tour.activities}
              setActivity={setActivity}
              activitiesMode={activitiesMode}
              //
              isModalVisible={isModalVisible}
              toggleDatePicker={toggleDatePicker}
              handleConfirm={handleConfirm}
              isDatePickerVisible={isDatePickerVisible}
              //
              onAddActivity={onAddActivity}
              onRemoveActivit={onRemoveActivity}
              onEditActivity={onEditActivity}
              //
              onRemoveActivitySubmit={onRemoveActivitySubmit}
              onEditActivitySubmit={onEditActivitySubmit}
              onEditActivityCancel={onEditActivityCancel}
            />
          )}
        </KeyboardAwareScrollView>

        <View>
          <AppButton
            disabled={false}
            style={{
              ...styles.button,
              ...styles.shadow,

              ...highlights.brdr02,
              width: screenWidth.width80,
              height: 60,
              marginVertical: 20,
              marginBottom: 50,
            }}
            title={"نشر"}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </View>
      </ImageBackground>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        collapsable={true}
        animationType="fade"
      >
        <View style={[styles.modalView]}>
          <View style={[styles.main]}>
            <View style={{ marginVertical: 20 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text22,
                  { textAlign: "center" },
                ]}
              >
                هل أنت متأكد أنك تريد نشر هذه الجولة؟
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <AppButton
                title="نشر"
                // onPress={submitRequest}
                style={{ width: "45%", height: 55 }}
              />
              <AppButton
                title="الغاء"
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  width: "45%",
                  height: 55,
                  backgroundColor: colors.apple,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={toggleDatePicker}
      />

      <RBSheet ref={modalizeRef} height={screenWidth.width80}>
        <ScrollView
          contentContainerStyle={{
            // ...no_highlights.brdr1,
            width: "100%",
            alignSelf: "center",
            marginTop: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          {cities.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.sheetText]}
              onPress={() => selectModal("city", value)}
              style={{
                // ...no_highlights.brdr2,
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.grey,
                borderBottomWidth: 1,
                borderTopWidth: index === 0 ? 1 : 0,
              }}
            >
              <Text
                style={[
                  {
                    fontWeight: "bold",
                  },
                  text.black,
                  text.text20,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </RBSheet>

      <RBSheet ref={modalizeRefAge} height={screenWidth.width50}>
        <ScrollView
          contentContainerStyle={{
            // ...no_highlights.brdr1,
            width: "100%",
            alignSelf: "center",
            marginTop: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          {ages.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.sheetText]}
              onPress={() => selectModal("age", value)}
              style={{
                // ...no_highlights.brdr2,
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.grey,
                borderBottomWidth: 1,
                borderTopWidth: index === 0 ? 1 : 0,
              }}
            >
              <Text
                style={[
                  text.black,
                  text.text20,
                  {
                    fontWeight: "bold",
                  },
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </RBSheet>

      <StatusBar style="auto" />
    </View>
  );
};

export default PostTourV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContaner: {
    // flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    width: screenWidth.width90,
    marginTop: 10,
    ...highlights.brdr01,
  },
  headerText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "right",
    width: "75%",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // ...highlights.brdr01,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  main: {
    backgroundColor: "#fff",
    // width: screenWidth.width80,
    // backgroundColor: "red",
    padding: 20,
    borderRadius: 20,
  },
  button: {
    height: 55,
    width: "90%",
    // marginBottom: 200,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 29,

    ...highlights.brdr07,
  },

  shadow: {
    // drop top shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // drop bottom shadow
    elevation: 5,
  },
});
