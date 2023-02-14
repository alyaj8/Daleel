import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import text from "../style/text";
// <ImageBackground source={require("../assets/2.jpg")} resizeMode="cover">

export default function Sign_up({ navigation }) {
  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require("../assets/B7.png")}
      resizeMode="cover"
    >
      <View
        style={{
          width: "100%",
          height: 45,
          paddingHorizontal: 5,
          marginTop: 70,

        }}
      >
        <Icon
          name="arrow-back-outline"
          size={50}
          style={{ color: "#f8f5f2", marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View
        style={[
          styles.alignCenter,
          {
            height: 18,
            // flexWrap: "wrap",
            marginHorizontal: 35,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text
          style={[
            text.white,

            { fontWeight: "bold", marginTop: -50, fontSize: 30 },
          ]}
        >
          إنشاء حساب
        </Text>
      </View>

      <View style={{ marginTop: 80, alignSelf: "center" }}>
        <Text style={{ fontSize: 33, fontWeight: "bold" }}>
          {" "}
          أهلا بك في دليل!
        </Text>
      </View>

      <View style={{ marginTop: 40, alignSelf: "flex-end" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {"   "}  تسجيل حساب جديد كـ:
        </Text>
      </View>

      <View style={{ marginLeft: -165, marginTop: 85 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Local_Sign_up");
          }}
        >
          <Image
            style={{ height: 140, width: 120, alignSelf: "center" }}
            source={require("../assets/location.png")}
          />

          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 18,
            }}
          >
            مرشد سياحي
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginLeft: 165, marginTop: -160 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Tourist_Sign_up");
          }}
        >
          <Image
            style={{ height: 140, width: 130, alignSelf: "center" }}
            source={require("../assets/t1.png")}
          />

          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 18,
            }}
          >
            {" "}
            سائح
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //   marginBottom: 20,
    //  alignItems: 'center',
  },
});

/*
<View style={{ marginTop: 10, alignSelf: "flex-end" }}>
<Text
    style={{
        fontWeight: "bold",
        alignSelf: "center",
        fontSize: 18,
    }}
>الرجوع إلى صفحة
</Text>
</View>

<View>
<TouchableOpacity
    style={{
        borderRadius: 25,
        width: "48%",
        height: 50,
    }}
    onPress={() => {
        navigation.navigate("Log_in2");
    }}
>
    <Text
        style={{
            fontWeight: "bold",
            alignSelf: "center",
            fontSize: 18,
            textDecorationLine: 'underline',
            color: "blue"

        }}
    >تسجيل الدخول
    </Text>
</TouchableOpacity>
</View>*/
