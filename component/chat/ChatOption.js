import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import * as React from "react";
import { fontSet, images, screenWidth } from "../../config/Constant";
import { SafeAreaView } from "react-native-safe-area-context";
import text from "../../style/text";
export default function ChatOption({
  navigation,
  onPress,
  Name,
  about

}) {

  return (
        <TouchableOpacity 
        onPress={onPress}
        style={[styles.profileDiv]}>
            <View style={{marginRight:20}}>
                <Image source={{uri:'https://med.gov.bz/wp-content/uploads/2020/08/dummy-profile-pic.jpg'}} style={[styles.PfIcon]} />
            </View>
            <View>
                <View>
                <Text style={[text.black,{fontSize:16}]}>{Name}</Text>                    
                </View>
                <View>
                <Text style={[text.grey,{fontSize:14}]}>{about}</Text>                    
                </View>
            </View>
        </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    PfIcon:{
        width:60,
        height:60,
        borderRadius:50,
        resizeMode:'contain'
    },
    profileDiv:{
        flexDirection:'row',
        alignItems:'center',
        width:screenWidth.width90,
        alignSelf:'center',
        borderBottomWidth:0.2,
        borderColor:'#545454',
        paddingHorizontal:10,
        paddingVertical:10,
        backgroundColor: '#ececec',
    }
 
});
