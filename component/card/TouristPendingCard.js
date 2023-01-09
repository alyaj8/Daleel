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

export default function TouristCard({
  onpress,
  source,
  title
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{marginHorizontal:20}}>
            <Image source={source} style={[styles.img]} />
          </View>
            <View style={{paddingHorizontal:10}}>
              <View style={{ width:screenWidth.width50, }}>
                <Text style={[text.themeDefault, text.text18, { textAlign: 'right', fontWeight: 'bold',marginRight:20 }]}>
                  {title}
                  </Text>
              </View>
                <View style={{alignSelf:'center',marginTop:30}}>
                <ButtonComponent buttonSelection={true} buttonDefault={false} title={'تحت الإنتظار'}
                onpress={onpress}
                  style={{ backgroundColor: '#b2e5e4' }}
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
    paddingVertical:20,
    marginVertical:15
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width25,
    height: screenWidth.width25,
  },
});
