import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, highlights, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import FormInputTouchable from "./FormInputTouchable";
import ImageForm from "./ImageForm";
import MapFrom from "./MapFrom";

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
  onRemoveImage,
  onShowModal,
  setModalVisible,

  tour,
  setTour,

  // form state
  control,
  handleSubmit,
  errors,
  setValue,
  getValues,
  watch,
  reset,
  trigger,
}) => {
  // console.log("watch: ", watch("meetingPoint"));

  return (
    <View style={styles.container}>
      {/* Image  */}
      <ImageForm
        // debug
        // Form
        name="imageUrl"
        control={control}
        // rest
        label="ارفق صورة للجولة"
        // style
        onRemoveImage={onRemoveImage}
        onPickImage={pickImage}
        style={{
          alignItems: "center",
          alignSelf: "center",
          width: screenWidth.width80,
          minHeight: screenWidth.width70,
       
        }}
        imageStye={{
          width: screenWidth.width80,
          height: screenWidth.width60,
          resizeMode: "contain",
          borderRadius: screenWidth.width10,
          marginTop: screenWidth.width5,
        }}
      />

      {/* {tour.imageUrl ? (
        <TouchableOpacity
          onPress={() => pickImage()}
          style={[styles.alignCenter, { marginTop: screenWidth.width5 }]}
        >
          <Image source={{ uri: tour.imageUrl }} style={[styles.dummyImg]} />
        </TouchableOpacity>
      ) : filePathTour ? (
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
      )} */}

      {/* Name */}
      <FormInputTouchable
        // debug
        label="اسم الجولة"
        placeholder="*اكتب اسم الجولة"
        editable
        // Form
        name="title"
        control={control}
      />

      {/* Description */}
      <FormInputTouchable
        // debug

        // Form
        name="description"
        control={control}
        // rest
        label="وصف الجولة"
        placeholder="*اكتب وصف الجولة"
        editable
        multiline
      />

      {/* Date */}
      <FormInputTouchable
        // debug
        // Form
        name="date"
        control={control}
        // rest
        label="تاريخ الجولة"
        placeholder="*اختر تاريخ الجولة"
        editable={false}
        icon={true}
        source={images.calendar}
        onPress={() => openDatePicker("date")}
      />

      {/* Start time, End time */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <FormInputTouchable
          // debug
          // Form
          name="endTime"
          control={control}
          // rest
          label="وقت نهاية الجولة"
          placeholder="*اختر وقت نهاية"
          editable={false}
          icon={true}
          source={images.timer}
          onPress={() => openDatePicker("endTime")}
          style={{ marginRight: 2 }}
        />

        <FormInputTouchable
          // debug
          // Form
          name="startTime"
          control={control}
          // rest
          label="وقت بداية الجولة"
          placeholder="*اختر وقت بداية"
          editable={false}
          icon={true}
          source={images.timer}
          onPress={() => openDatePicker("startTime")}
          style={{ marginLeft: 2 }}
        />
      </View>

      {/* Meet point */}
      <MapFrom
        name="meetingPoint"
        control={control}
        // rest
        label="  نقطة اللقاء"
        placeholder="*اختر نقطة اللقاء"
        // value={tour.meetingPoint}
        onSelectLocation={(location) => {
          setTour({ ...tour, meetingPoint: location });
          setValue("meetingPoint", location);
          trigger("meetingPoint");
        }}
        onClearLocation={() => {
          setTour({ ...tour, meetingPoint: null });
          setValue("meetingPoint", null);
          trigger("meetingPoint");
        }}
        style={{ ...highlights.brdr02 }}
      />

      {/* City */}
      <FormInputTouchable
        // debug
        // Form
        name="city"
        control={control}
        // rest
        label="المدينة"
        placeholder="*اختر المدينة"
        editable={false}
        icon={true}
        source={images.location}
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
        <FormInputTouchable
          // debug
          // Form
          name="age"
          control={control}
          // rest
          label="الفئة العمرية"
          placeholder="*اختر الفئة العمرية"
          editable={false}
          onPress={() => onShowModal("age")}
          style={{ marginRight: 2 }}
        />

        {/* Qty */}
        <FormInputTouchable
          // debug
          // Form
          name="qty"
          control={control}
          // rest
          label="اقصى عدد للسياح"
          placeholder="*اكتب عدد الأشخاص"
          editable
          keyboardType="numeric"
          icon={true}
          source={images.profile}
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
