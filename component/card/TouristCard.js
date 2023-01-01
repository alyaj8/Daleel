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

export default function Input({
  onpressAccepted,
  onpressRejected,
  source,
  price,
  acceptButton=true,
  rejectButton=true,
  bookeBy=true
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{marginHorizontal:20}}>
            <Image source={source} style={[styles.img]} />
          </View>
        
            <View style={{marginHorizontal:10}}>
              <View style={{  }}>
                <Text style={[text.themeDefault, text.text18, { textAlign: 'center', fontWeight: 'bold' }]}>جولة بلدة العلا القديمة</Text>
              </View>
            
           
              {rejectButton &&
                <View style={{alignSelf:'center',marginTop:30}}>
                <ButtonComponent buttonSelection={true} buttonDefault={false} title={'Rejected'}
                onpress={onpressRejected}
                  style={{ backgroundColor: '#c6302c' }}
                />
              </View>
              }
            
       
          
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
    paddingVertical:20
  },
  flexDirection: {
    flexDirection: "row",
    // alignItems:'center',
  },
  img: {
    width: screenWidth.width25,
    height: screenWidth.width25,
  },
});
