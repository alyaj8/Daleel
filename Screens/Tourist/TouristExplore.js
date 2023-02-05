import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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

  const [searchText, setSearchText] = useState("");

  const Asyced = () => {
    getUserId().then((currentUserIdLoc) => {
      const q = query(collection(db, "tours"));

      const unsub = onSnapshot(q, (querySnapshot) => {
        let newRequest = [];
        querySnapshot.forEach((doc) => {
          newRequest.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const unique = newRequest.filter((thing, index, self) => {
          return (
            index ===
            self.findIndex((t) => {
              return t.id === thing.id;
            })
          );
        });
        citiesBuilder(unique);

        setData(unique);
        setFilteredData(unique);
      });
    });
  };

  React.useEffect(() => {
    // console.log("Child", currentUserId);
    Asyced();

    // return unsub;
  }, []);

  const citiesBuilder = (data) => {
    const cities = [
      {
        label: "كل المدن",
        value: "كل المدن",
      },
    ];

    data.forEach((item) => {
      // check if city is already in the list
      const isCityExist = cities.find((city) => city.value === item.city);
      if (!isCityExist) {
        cities.push({
          label: item.city,
          value: item.city,
        });
      }
    });

    setCityList(cities);
  };

  // logObj(cityList);

  useEffect(() => {
    const isSearch = !!searchText;
    const isCity = selectedCity !== "كل المدن" && selectedCity !== null;
    const isAge = selectedAge !== "كل الأعمار" && selectedAge !== null;
    let localData = data;

    if (isSearch) {
      localData = localData.filter((item) =>
        item.title.toUpperCase().includes(searchText.toUpperCase())
      );
    }
    if (isCity) {
      localData = localData.filter((item) => item.city === selectedCity);
    }
    if (isAge) {
      localData = localData.filter((item) => item.age === selectedAge);
    }
    setFilteredData(localData);
  }, [selectedCity, selectedAge, searchText]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{ flex: 1, marginTop: -40 }}
        source={images.backgroundImg}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={[styles.alignCenter, { marginVertical: 50 }]}>
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
            borderRadius: 9,
            marginTop: -25,
            marginBottom: -10,
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#BDBDBD",
            borderWidth: 2,
          }}
        >
          <Icon
            name="ios-search"
            size={25}
            style={{ marginRight: 10, color: "#BDBDBD" }}
          />
          <TextInput
            placeholder="إبحث عن جولة      "
            placeholderTextColor="grey"
            onChangeText={(text) => setSearchText(text)}
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
            placeholder="العمر"
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
            placeholder="المدينة"
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
                      mode="explore"
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
