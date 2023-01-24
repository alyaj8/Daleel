import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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

let ages = ["عائلية", "كبار"];

const TourForm = ({ navigation, route }) => {
  const [tour, setTour] = useState(initTour);
  const [activity, setActivity] = useState(initActivity);

  const [filePath, setFilePath] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerConfig, setPickerConfig] = useState("date"); // date, startTime, endTime
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activitiesMode, setActivitiesMode] = useState("add"); // add, edit

  const modalizeRef = useRef(null);
  const modalizeRefAge = useRef(null);

  return (
    <View>
      <Text>TourForm</Text>
    </View>
  );
};

export default TourForm;

const styles = StyleSheet.create({});
