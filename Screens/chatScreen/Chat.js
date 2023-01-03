import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Pressable,
  Image,
  TextInput
} from "react-native";
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";
import text from "../../style/text";
import LeftChat from "../../component/chat/LeftChat";
import RightChat from "../../component/chat/RightChat";


export default function ChatMenu({ navigation }) {

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
     <Pressable
     onPress={()=> navigation.goBack()}
     style={{position:'absolute',margin:15}}>
      <Image source={images.arrow} style={[styles.arrowIcon]} />
     </Pressable>
        <View style={[styles.alignCenter,{marginVertical:10}]}>
          <Text style={[text.white, text.text30]}>رسائلي</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginHorizontal:20,marginTop:screenWidth.width10}}>
            <LeftChat msg={'Hi Mashael'}/>
            </View>
            <View style={{marginHorizontal:20}}>
            <RightChat msg={'Hi Jon'}/>
            </View>
        </ScrollView>
        <View >
        <TextInput 
        style={[styles.chatInput]}
        multiline={true}
        placeholder="Write Your Message Here"
        />
        <TouchableOpacity style={{position:'absolute',right:0,margin:13,marginHorizontal:30}}>
          <Image  source={images.send} style={[styles.arrowIcon,{tintColor:'#545454'}]} />
        </TouchableOpacity>
        </View>

      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: screenWidth.width10,
    // backgroundColor: '#ececec', 
    // margin: 20
  },
  alignCenter: {
    alignItems: "center",
  },
  
  arrowIcon:{
    width:30,
    height:30,
    resizeMode:'contain',
    tintColor:'#fff'
  },
  chatInput:{
    width:screenWidth.width90,
    backgroundColor:'#d9d9d9',
    borderRadius:10,
    padding:10,
    alignSelf:'center',
    marginBottom:20,
    paddingVertical:20,
    paddingTop:20,
    paddingRight:40
  }


});
