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
import { getDateTime} from "../../util/DateHelper";


export default function Input({
  navigation,
  title = "",
  price = "",
  date = "",
  desciption = "",
  source,
  onpress,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onpress} style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{}}>
            <Image source={source} style={[styles.img]} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{alignItems:'flex-end'}}>
              <Text style={[text.themeDefault, text.text20,{textAlign:'right'}]}>{title}</Text>
            </View>
            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text style={[text.themeDefault, text.text20]}>{price}</Text>
            </View>
            <View style={{ alignSelf: "center", marginVertical: 5 }}>
              <Text
                style={[text.themeDefault, text.text14, { fontWeight: "bold" }]}
              >
                {getDateTime(date)}
              </Text>
            </View>
            <View style={{ marginHorizontal: 5 }}>
              <Text style={[text.themeDefault, text.text14, text.right]}>
                {desciption}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth.width90,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ececec",
    alignSelf: "center",
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width30,
    height: screenWidth.width40,
    resizeMode: "contain",
  },
});
