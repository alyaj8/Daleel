import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, highlights, images, screenWidth } from "../../config/Constant";
import { getFormattedDate, getFormattedTime } from "../../util/DateHelper";
import TouchableInput from "../inputText/DateTimeInput";
import InputMap from "../maps/InputMap";

let ages = ["عائلية", "كبار"];

const TourForm = ({
  navigation,
  route,
  isModalVisible,
  openDatePicker,
  handleConfirm,
  isDatePickerVisible,
  filePathTour,
  setFilePathTour,
  pickImage,
  onShowModal,
  setModalVisible,

  tour,
  setTour,
}) => {
  return (
    <View style={styles.container}>
      {/* Image  */}
      {filePathTour ? (
        <TouchableOpacity
          onPress={() => {
            // remove image
            setFilePathTour(null);
          }}
          style={{
            alignItems: "center",
            marginTop: screenWidth.width5,
          }}
        >
          <Image source={{ uri: filePathTour }} style={[styles.dummyImg]} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.alignCenter, { marginTop: screenWidth.width5 }]}
        >
          <Image source={images.photo} style={[styles.dummyImg]} />
        </TouchableOpacity>
      )}

      {/* Name */}
      <TouchableInput
        // debug
        label="اسم الجولة"
        placeholder="اكتب اسم الجولة"
        value={tour.title}
        editable
        onChangeText={(text) => setTour({ ...tour, title: text })}
      />

      {/* Description */}
      <TouchableInput
        label="وصف الجولة"
        placeholder="اكتب وصف الجولة"
        editable
        multiline
        value={tour.description}
        onChangeText={(text) => setTour({ ...tour, description: text })}
      />

      {/* Date */}
      <TouchableInput
        label="تاريخ الجولة"
        placeholder="اختر تاريخ الجولة"
        editable={false}
        icon={true}
        source={images.calendar}
        value={tour.date ? getFormattedDate(tour.date) : ""}
        // value={getFormattedDate(new Date())}
        onPress={() => openDatePicker("date")}
      />

      {/* Start time, End time */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableInput
          label="وقت نهاية الجولة"
          placeholder="اختر وقت نهاية"
          editable={false}
          icon={true}
          source={images.timer}
          value={tour.endTime ? getFormattedTime(tour.endTime) : ""}
          // value={getFormattedDate(new Date())}
          onPress={() => openDatePicker("endTime")}
          style={{ marginRight: 2 }}
        />

        <TouchableInput
          label="وقت بداية الجولة"
          placeholder="اختر وقت بداية"
          editable={false}
          icon={true}
          source={images.timer}
          value={tour.startTime ? getFormattedTime(tour.startTime) : ""}
          // value={getFormattedDate(new Date())}
          onPress={() => openDatePicker("startTime")}
          style={{ marginLeft: 2 }}
        />
      </View>

      {/* Meet point */}
      <InputMap
        label="نقطة اللقاء"
        placeholder="اختر نقطة اللقاء"
        value={tour.meetingPoint}
        onSelectLocation={(location) =>
          setTour({ ...tour, meetingPoint: location })
        }
        onClearLocation={() => setTour({ ...tour, meetingPoint: "" })}
        style={{ ...highlights.brdr02 }}
      />

      {/* City */}
      <TouchableInput
        label="المدينة"
        placeholder="اختر المدينة"
        editable={false}
        icon={true}
        source={images.location}
        value={tour.city}
        onPress={() => onShowModal("city")}
      />

      {/* Info */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* Age */}
        <TouchableInput
          label="العمر"
          placeholder="اختر العمر"
          editable={false}
          value={tour.age}
          onPress={() => onShowModal("age")}
          style={{ marginRight: 2 }}
        />

        {/* Qty */}
        <TouchableInput
          label="عدد الأشخاص"
          placeholder="اختر عدد الأشخاص"
          editable
          keyboardType="numeric"
          value={tour.qty}
          icon={true}
          source={images.profile}
          onChangeText={(text) => setTour({ ...tour, qty: text })}
          style={{ marginLeft: 2 }}
        />
      </View>
    </View>
  );
};

export default TourForm;

const styles = StyleSheet.create({
  container: {
    ...highlights.brdr01,
    backgroundColor: colors.white,
    marginHorizontal: 4,
    width: screenWidth.width95,
    padding: 10,
    ...highlights.brdr03,

    flex: 1,
    marginBottom: 50,
    borderRadius: 10,
    // light Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    elevation: 2,
  },
  alignCenter: {
    alignItems: "center",
  },
  dummyImg: {
    width: screenWidth.width80,
    height: screenWidth.width60,
    resizeMode: "contain",
    borderRadius: 15,

    // opacity: 0.7,
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
  datePicker: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 40,
    marginBottom: 5,
  },
  InputStyle: {
    width: screenWidth.width25,
    padding: 5,
    borderWidth: 1,
    borderColor: "#5398a0",
    borderRadius: 20,
    paddingHorizontal: 10,

    textAlign: "right",
  },
  sheetText: {
    alignSelf: "center",
    marginVertical: 10,
  },
  timeFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  InputStyleModal: {
    width: screenWidth.width90,
    paddingVertical: 12,
    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#5398a0",
    borderRadius: 20,
    paddingHorizontal: 20,
    textAlign: "right",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#5398a0",
  },
  position: {
    position: "absolute",
    left: 0,
    marginLeft: 15,
  },
});
