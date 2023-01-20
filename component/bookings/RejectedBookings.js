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
import { images, screenWidth,colors } from "../../config/Constant";
import { SafeAreaView } from "react-native-safe-area-context";
import text from "../../style/text";
import { getDateTime } from "../../util/DateHelper";
import ButtonComponent from "../button/Button";

export default function Input({
  onpressAccepted,
  onpressRejected,
  source,
  title,
  booked
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{marginHorizontal:20}}>
            <Image source={source} style={[styles.img]} />
          </View>
          <View style={{marginHorizontal:10}}>
          <View style={{ width:screenWidth.width50, }}>
                <Text style={[text.themeDefault, text.text18, { textAlign: 'right', fontWeight: 'bold',marginRight:20 }]}>
                  {title}
                  </Text>
              </View>
              {booked &&
                 <View style={[styles.flexDirection,{alignSelf:'center'}]}>
                 <View style={{ }}>
                   <Text style={[text.themeDefault, text.text16]}>Booked By: </Text>
                 </View>
                 <View style={{ }}>
                   <Text style={[text.themeDefault, text.text16]}>{booked}</Text>
                 </View>
               </View>
              }
              <View style={{ alignSelf:'center' ,marginVertical:20}}>
              <Text style={[
             
             text.text18,
             { textAlign: "right", fontWeight: "bold", marginRight: 20 ,color: colors.brown,},
           ]}> تم رفض الطلب</Text>
              {/* <ButtonComponent buttonSelection={true} buttonDefault={false} title={'مرفوضة'}
              onpress={onpressRejected}
                style={{ backgroundColor: '#c6302c' }}
                disabled={true}
              /> */}
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
    backgroundColor:"#ececec",
    alignSelf: "center",
    paddingVertical: 20,
    marginVertical: 15,
    ///shadowEffect
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    
  },
  flexDirection: {
    flexDirection: "row",
  },
  img: {
    width: screenWidth.width25,
    height: screenWidth.width35,
  },
});
