import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { images, screenWidth } from "../../config/Constant";
import text from "../../style/text";

export default function TouristBookingDetail({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={{ flex: 1 }}
          source={images.backgroundImg}
          resizeMode="cover"
        >
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <Text style={[text.white, text.text30]}>جولاتي</Text>
          </View>
          <View style={[styles.card]}>
            <View style={[styles.alignCenter, {}]}>
              <Image source={images.photo} style={[styles.dummyImg]} />
            </View>
            <View style={{ alignSelf: "center" }}>
              <Text
                style={[text.themeDefault, text.text20, { fontWeight: "bold" }]}
              >
                جولة بلدة العلا القديمة
              </Text>
            </View>
            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text style={[text.themeDefault, text.text18, {}]}>70RS</Text>
            </View>
            <View
              style={[
                styles.flexRow,
                { justifyContent: "space-between", marginVertical: 10 },
              ]}
            >
              <View style={{}}>
                <Text style={[text.themeDefault, text.text14]}>
                  1:00 P.M to 2:00 P.M
                </Text>
              </View>
              <View style={{}}>
                <Text style={[text.themeDefault, text.text14]}>
                  02/12/2022 Saturday
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.flexRow,
                {
                  alignSelf: "flex-end",
                  marginHorizontal: 30,
                  marginVertical: 10,
                },
              ]}
            >
              <View style={{ marginHorizontal: 10 }}>
                <Text style={[text.themeDefault, text.text16]}>
                  جولة بلدة العلا القديمة
                </Text>
              </View>
              <View>
                <Image source={images.location} style={[styles.icon]} />
              </View>
            </View>
            <View
              style={[
                styles.flexRow,
                { justifyContent: "space-between", marginVertical: 10 },
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
                    12-50
                  </Text>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                  <Text style={[text.themeDefault, text.text20]}>سنة</Text>
                </View>
              </View>
              <View style={[styles.flexRow]}>
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={[
                      text.themeDefault,
                      text.text20,
                      { fontWeight: "bold" },
                    ]}
                  >
                    2
                  </Text>
                </View>
                <View>
                  <Image source={images.child} style={[styles.iconLg]} />
                </View>
              </View>
              <View style={[styles.flexRow]}>
                <View>
                  <Text
                    style={[
                      text.themeDefault,
                      text.text20,
                      { fontWeight: "bold" },
                    ]}
                  >
                    2
                  </Text>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                  <Image source={images.couple} style={[styles.iconLg]} />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.flexRow,
                {
                  alignSelf: "flex-end",
                  marginHorizontal: 30,
                  marginVertical: 10,
                },
              ]}
            >
              <View style={{ marginHorizontal: 10 }}>
                <Text style={[text.themeDefault, text.text20]}>جولة بلدة</Text>
              </View>
              <View>
                <Image source={images.user} style={[styles.iconLg]} />
              </View>
            </View>
            <View style={{ marginHorizontal: 5 }}>
              <Text style={[text.themeDefault, text.text18, text.right]}>
                مخصصة للاسترخاء بتصميم عصري ومريح ندعوك لاستكشاف أشهر التكوينات
                الصخرية في العلاء مع فرصة مميزة لتأمل عظمة هذه التحفة الطبيعية
                الخالدة من موقع مثالي
              </Text>
            </View>
          </View>

          <StatusBar style="auto" />
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
});
