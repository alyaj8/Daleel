import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";
import text from "../../style/text";
import ChatOption from "../../component/chat/ChatOption";


export default function ChatMenu({ navigation }) {

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 ,
      }} source={images.backgroundImg}>
        <View style={[styles.alignCenter, { marginVertical: 10 }]}>
          <Text style={[text.white, text.text30]}>رسائلي</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
           marginTop:screenWidth.width10
          }}>
            <ChatOption  Name={'Jon'} about={'React Native'}
            onPress={()=>navigation.navigate('Chat')} 
            />
            <ChatOption  Name={'A1'} about={'React Native'}
            onPress={()=>navigation.navigate('Chat')} 
            />

         


          </View>
        </ScrollView>
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


});
