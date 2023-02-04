import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/Ionicons";
import TourDetailCard from "../../component/card/TourDetailCard";
import { images, screenWidth } from "../../config/Constant";
import { db } from "../../config/firebase";
import { getUserId } from "../../network/ApiService";
import text from "../../style/text";

export default function TouristExplore({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tourId, setTourId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [filteredData, setFilteredData] = useState([]);
  // Lists
  // city
  const [cityList, setCityList] = useState([
    {
      label: "كل المدن",
      value: "كل المدن",
    },
  ]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityListVisible, setCityListVisible] = useState(false);

  // age
  const [ageList, setAgeList] = useState([
    {
      label: "كل الأعمار",
      value: "كل الأعمار",
    },
    {
      label: "عائلية",
      value: "عائلية",
    },
    {
      label: "كبار",
      value: "كبار",
    },
  ]);
  const [selectedAge, setSelectedAge] = useState(null);
  const [ageListVisible, setAgeListVisible] = useState(false);

  const search = (text) => {
    console.log(text);
    const filter = [];
    data.forEach((e) => {
      if (e.title.toLowerCase().includes(text.toLowerCase())) {
        filter.push(e);
      }
    });
    setData(filter);
    setFilteredData(filter);
  };

  const citiesBuilder = (data) => {
    const cities = [
      {
        label: "كل المدن",
        value: "كل المدن",
      },
    ];
    data.forEach((e) => {
      cities.push({
        label: e.city,
        value: e.city,
      });
    });
    setCityList(cities);
  };

  useFocusEffect(
    useCallback(() => {
      const getAllRequests = async () => {
        const uid = await getUserId();
        const q = query(
          collection(db, "tours"),
          where("status", "==", 0),
          // date is in the future
          where("date", ">", new Date())
        );
        // listen for changes
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const bag = [];
          querySnapshot.forEach((doc) => {
            // console.log(
            //   "🚀 ~ doc.data().status === 0",
            //   doc.data().status === 0
            // );
            if (doc.data().status === 0) {
              bag.push({
                id: doc.id,
                ...doc.data(),
              });
            }
          });

          setData(bag);
          setFilteredData(bag);
          // remove duplicates from array
          const unique = [...new Set(bag)];
          setData(unique);
          setFilteredData(unique);
          citiesBuilder(unique);
        });
      };
      getAllRequests();
    }, [])
  );

  const onCityChange = (item) => {
    let localData = data;
    // check if age filter is active
    if (selectedAge !== "كل الأعمار") {
      const filter = [];
      localData.forEach((e) => {
        if (e.age === selectedAge) {
          filter.push(e);
        }
      });
      localData = filter;
    }

    if (item.value === "كل المدن") {
      setFilteredData(localData);
    } else {
      const filter = [];
      localData.forEach((e) => {
        if (e.city === item.value) {
          filter.push(e);
        }
      });
      setFilteredData(filter);
    }

    setSelectedCity(item);
    setCityListVisible(false);
  };

  const onAgeChange = (item) => {
    let localData = data;
    // check if city filter is active
    if (selectedCity !== "كل المدن") {
      const filter = [];
      localData.forEach((e) => {
        if (e.city === selectedCity) {
          filter.push(e);
        }
      });
      localData = filter;
    }

    if (item.value === "كل الأعمار") {
      setFilteredData(localData);
    } else {
      const filter = [];
      localData.forEach((e) => {
        if (e.age === item.value) {
          filter.push(e);
        }
      });
      setFilteredData(filter);
    }

    setSelectedAge(item);
    setAgeListVisible(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        {/* Header */}
        <View style={[styles.alignCenter, { marginVertical: 20 }]}>
          <Text
            style={[
              {
                // flex: 1,
                width: "100%",
                textAlign: "center",
                //color: colors.Blue,
                fontSize: 30,
              },
              text.white,

              text.bold,
            ]}
          >
            استكشف الجولات
          </Text>
        </View>

        {/* Search */}
        <View
          style={{
            backgroundColor: "#FFF",
            // D0ECDF
            paddingVertical: 8,
            paddingHorizontal: 20,
            marginHorizontal: 20,
            borderRadius: 15,
            marginTop: 25,
            marginBottom: -10,
            flexDirection: "row",
            alignItems: "center",
            borderColor: "black",
            borderWidth: 0.2,
          }}
        >
          <Icon name="ios-search" size={25} style={{ marginRight: 10 }} />
          <TextInput
            placeholder="ابحث عن جوله او مرشد سياحي "
            placeholderTextColor="grey"
            onChangeText={(text) => search(text)}
            style={{
              fontWeight: "bold",
              fontSize: 18,
              width: 260,
              textAlign: "right",
            }}
          />
        </View>
        <View
          style={{
            width: "90%",
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 20,
            marginTop: 20,
            zIndex: 1,
          }}
        >
          {/* Age */}
          <DropDownPicker
            onSelectItem={onAgeChange}
            open={ageListVisible}
            value={selectedAge}
            items={ageList}
            setOpen={setAgeListVisible}
            setValue={setSelectedAge}
            setItems={setAgeList}
            containerStyle={{
              width: "45%",
            }}
          />

          {/* City */}
          <DropDownPicker
            onSelectItem={onCityChange}
            open={cityListVisible}
            value={selectedCity}
            items={cityList}
            setOpen={setCityListVisible}
            setValue={setSelectedCity}
            setItems={setCityList}
            containerStyle={{
              width: "45%",
            }}
          />
        </View>

        {/* Body */}
        <ScrollView style={[styles.cardDiv, { marginTop: screenWidth.width5 }]}>
          {filteredData.length > 0 ? (
            <>
              {filteredData.map((item, index) => {
                return (
                  <View key={index} style={{ marginVertical: 20 }}>
                    <TourDetailCard
                      source={{ uri: item?.imageUrl }}
                      title={item?.title}
                      tour={item}
                      onpress={() =>
                        navigation.navigate("TouristDetailedInformation", {
                          item,
                          tourId: item.id,
                        })
                      }
                    />
                  </View>
                );
              })}
            </>
          ) : (
            <View
              style={{
                marginTop: 200,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={[
                  {
                    marginRight: 10,
                    fontWeight: "bold",
                  },
                  text.text20,
                ]}
              >
                لا يوجد جولات
              </Text>
              {/* Icon */}
              <Feather name="alert-circle" size={24} color="black" />
            </View>
          )}
        </ScrollView>
      </ImageBackground>
      <StatusBar style="auto" />
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
  cardDiv: {
    marginTop: 20,
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
});
