import * as ImagePicker from "expo-image-picker";
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
import { getUserId, updateTour } from "../../network/ApiService";
import text from "../../style/text";
import { limitCharacters } from "../../util/DateHelper";
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

const EditTourV3 = ({ navigation, route }) => {
  // Page State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);

  console.log("🚀 ~ isUpdated", isUpdated);

  // Tour
  const [tour, setTour] = useState(initTour);
  const [filePathTour, setFilePathTour] = useState(null);

  // Activity
  const [activity, setActivity] = useState(initActivity);
  const [activities, setActivities] = useState([initActivity]);
  const [activitiesMode, setActivitiesMode] = useState("add"); // add, edit

  // Modals Refs and configs
  const modalizeRef = useRef(null);
  const modalizeRefAge = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerConfig, setPickerConfig] = useState("date"); // date, startTime, endTime

  useEffect(() => {
    let tour = route.params.data;
    const tourData = {
      ...tour,
      // check if new Date() obj or firebase timestamp
      date: tour.date.toDate ? tour.date.toDate() : tour.date,
      startTime: tour.startTime.toDate
        ? tour.startTime.toDate()
        : tour.startTime,
      endTime: tour.endTime.toDate ? tour.endTime.toDate() : tour.endTime,
    };
    setTour(tourData);
    setActivities(tourData.activities);

    setIsUpdated(false);
  }, []);

  useEffect(() => {
    return () => {
      console.log("OUIUUUUUUUUUUUUT");
    };
  }, []);

  useEffect(() => {
    setIsUpdated(true);
  }, [activities, tour]);

  const reset = () => {
    setTour(initTour);
    setActivity(initActivity);
    setFilePathTour(null);
    setActivities([]);
  };

  const onPressTab = (index) => {
    setSelectedMenu(index);
  };

  const openDatePicker = (type) => {
    setPickerConfig(type);
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    setDatePickerVisibility(false);

    if (pickerConfig === "date") {
      setTour({ ...tour, date: date });
    }
    if (pickerConfig === "startTime") {
      setTour({ ...tour, startTime: date });
    }
    if (pickerConfig === "endTime") {
      setTour({ ...tour, endTime: date });
    }
    if (pickerConfig === "activityDate") {
      setActivity({ ...activity, date: date });
    }
    if (pickerConfig === "activityStartTime") {
      setActivity({ ...activity, startTime: date });
    }
    if (pickerConfig === "activityEndTime") {
      setActivity({ ...activity, endTime: date });
    }
  };

  // Modal
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
    if (type === "city") {
      setTour({ ...tour, city: value });
      modalizeRef.current?.close();
    }
    if (type === "age") {
      setTour({ ...tour, age: value });
      modalizeRefAge.current?.close();
    }
  };

  // Activity methods
  const onAddActivity = () => {
    const curActLoc = activity?.location;

    // validate location
    const ActLoc = {
      address: curActLoc.address || "",
      title: curActLoc.title || "",
      category: curActLoc.category || [],
      full_name: curActLoc.full_name || "",
      coordinates: {
        latitude: curActLoc.coordinates.latitude || 0,
        longitude: curActLoc.coordinates.longitude || 0,
      },
      id: curActLoc.id || "",
    };

    const act = {
      ...activity,
      id: activities.length + 1,
      location: ActLoc,
    };

    setActivities([...activities, act]);

    // setActivity(initActivity);
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

  // Image Picker & Tour
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      ...imagePickerConfig,
    });
    if (!result.canceled) {
      setFilePathTour(result.assets[0].uri);
    }
  };

  const deleteTour = async () => {
    setDeleteModalVisible(!isDeleteModalVisible);
    setIsLoading(true);
    const response = await deleteRequest(tour.id);
    // console.log("response", response);
    setIsLoading(false);
    if (response) {
      alert("Tour Deleted Successfully");
      navigation.navigate("TourDetail");
    }
  };

  const submitRequest = async () => {
    setModalVisible(!isModalVisible);
    setIsLoading(true);
    try {
      const isNewImg = filePathTour ? true : false;

      let localImg = null;

      if (isNewImg) {
        localImg = await uploadImage(filePathTour);
      }

      const userId = await getUserId();
      const tourDone = isNewImg && !!localImg ? true : false;

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

      const newTour = {
        ...tour,
        meetingPoint,
        activities: activities,
        dateUpdated: new Date(),
        imageUrl: isNewImg ? localImg : tour.imageUrl,
      };

      if (tourDone || !isNewImg) {
        await updateTour(tour.id, newTour);
        setIsLoading(false);
        navigation.goBack();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error submitRequest", error);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 0:
        return (
          <TourForm
            tour={tour}
            isModalVisible={isModalVisible}
            openDatePicker={openDatePicker}
            handleConfirm={handleConfirm}
            pickImage={pickImage}
            filePathTour={filePathTour}
            setFilePathTour={setFilePathTour}
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
            activities={activities}
            setActivity={setActivity}
            activitiesMode={activitiesMode}
            activitiesCustomizable={tour.activitiesCustomizable}
            setTour={setTour}
            //
            isModalVisible={isModalVisible}
            openDatePicker={openDatePicker}
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
      <Loading text="جاري تحديث الجولة..." visible={isLoading} />
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
              <AppButton
                style={{
                  height: 40,
                  width: 60,
                  ...styles.shadow,
                }}
                title={"إلغاء"}
                onPress={() => {
                  navigation.goBack();
                  // reset();
                }}
              />
              <Text style={styles.headerText}>
                تحديث: {limitCharacters(tour.title, 7)}
              </Text>
              <AppButton
                disabled={!isUpdated || activitiesMode === "edit"}
                style={{
                  // ...styles.button,
                  height: 40,
                  width: 60,
                  ...styles.shadow,
                }}
                color={colors.green}
                title={"تحديث"}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>
          </View>
          <TabsWrapper menuTabs={tabs} onPressTab={onPressTab} />
        </View>

        {/* Body */}
        <KeyboardAwareScrollView
          enableAutomaticScroll
          extraHeight={240}
          enableOnAndroid
          contentContainerStyle={{
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </KeyboardAwareScrollView>

        {/* Btns */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: screenWidth.width90,
            marginVertical: screenWidth.width2,
          }}
        >
          <AppButton
            color={colors.redTheme}
            style={{
              ...styles.button,
              ...styles.shadow,
              width: screenWidth.width40,
              height: 60,
            }}
            title={"حذف"}
            onPress={() => {
              navigation.goBack();
              // reset();
            }}
          />
          <AppButton
            color={colors.green}
            disabled={!isUpdated || activitiesMode === "edit"}
            style={{
              ...styles.button,
              ...styles.shadow,

              width: screenWidth.width40,
              height: 60,
            }}
            title={"تحديث"}
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
                هل أنت متأكد أنك تريد تحديث هذه الجولة؟
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <AppButton
                title="تحديث"
                color={colors.green}
                onPress={submitRequest}
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
        mode={
          pickerConfig === "date" || pickerConfig === "activityDate"
            ? "date"
            : "time"
        }
        date={
          pickerConfig === "date"
            ? tour.date || new Date()
            : pickerConfig === "startTime"
            ? tour.startTime || new Date()
            : pickerConfig === "endTime"
            ? tour.endTime || new Date()
            : pickerConfig === "activityDate"
            ? activity.date || new Date()
            : pickerConfig === "activityStartTime"
            ? activity.startTime || new Date()
            : pickerConfig === "activityEndTime"
            ? activity.endTime || new Date()
            : new Date()
        }
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={new Date()}
        nativeID="datePicker"
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

export default EditTourV3;

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
    // textAlign: "right",
    // width: "75%",
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
