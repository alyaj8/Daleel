import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import { images, screenWidth } from "../../config/Constant";
import { SafeAreaView } from "react-native-safe-area-context";
import text from "../../style/text";
import { getDateTime } from "../../util/DateHelper";
import ButtonComponent from "../button/Button";

export default function AcceptedBooking({ onpressAccepted, source, title = "", booked }) {


  const onPressChat = () =>{

    console.log('chat button pressed')

  }


  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{ marginHorizontal: 20 }}>
            <Image source={source} style={[styles.img]} />
          </View>
          <View>
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    text.themeDefault,
                    text.text18,
                    { textAlign: "center", fontWeight: "bold" },
                  ]}
                >
                  {title}
                </Text>
              </View>
              <View
                style={[
                  styles.flexDirection,
                  { alignSelf: "center", marginTop: 5 },
                ]}
              >
                <View style={{}}>
                  <Text style={[text.themeDefault, text.text16]}>
                    Booked By:{" "}
                  </Text>
                </View>
                <View style={{}}>
                  <Text style={[text.themeDefault, text.text16]}>{booked}</Text>
                </View>
              </View>
            </View>

            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text style={[text.themeDefault, text.text14]}>29-02-2022</Text>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Text style={[text.themeDefault, text.text14]}>12:00 P.M</Text>
            </View>
            <View style={{ marginVertical: 10, alignSelf: "center" }}>
              <ButtonComponent
                buttonSelection={true}
                buttonDefault={false}
                title={"ذهاب لدردشة "}
                onpress={onPressChat}
                style={{ backgroundColor: "#ff8656" }}
              />
            </View>
            <View style={{ alignSelf: "center" }}>
              <ButtonComponent
                buttonSelection={true}
                buttonDefault={false}
                title={"مدفوعة"}
                onpress={onpressAccepted}
                style={{ backgroundColor:"#ff8656" }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth.width90,
    borderRadius: 10,
    backgroundColor: "#ececec",
    alignSelf: "center",
    paddingVertical: 20,
    marginVertical: 15,
    ///shadowEffect
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width25,
    height: screenWidth.width40,
  },
});
