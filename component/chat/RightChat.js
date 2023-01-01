import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import * as React from "react";
import { fontSet, images, screenWidth } from "../../config/Constant";
import { SafeAreaView } from "react-native-safe-area-context";
import text from "../../style/text";
export default function ChatOption({
  navigation,
  msg

}) {

  return (
      <View style={[styles.chatDiv]}>
        <View style={[styles.textDiv]}>
            <Text style={[text.black,text.text14,{flex:1}]}>{msg}</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  textDiv:{
    backgroundColor:'#d8f5f6',
    borderRadius:10,
    padding:10,
    marginRight:20
    
  },
  chatDiv:{
    flexDirection:'row',
    marginVertical:10,
    alignSelf:'flex-end'
  },
  imgDiv:{
    width:40,
    height:40,
    resizeMode:'cover',
    borderRadius:100

  }
 
});
