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
  TextInput,
  Platform,
} from "react-native";
import {
  images,
  screenWidth,
  REQUEST_TABLE,
  CHATS_TABLE,
} from "../../config/Constant";
import text from "../../style/text";
import LeftChat from "../../component/chat/LeftChat";
import RightChat from "../../component/chat/RightChat";
import AutoScroll from "react-native-auto-scroll";

import { SafeAreaView } from "react-native-safe-area-context";
import { getConversationId } from "../../util/CustomHelper";
import { getDataFromStorage } from "../../util/Storage";
import { insertMessage, createChatRoom } from "../../network/ApiService";
import {
  collection,
  query,
  where,
  getFirestore,
  addDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { convertSecondsIntoTime } from "../../util/DateHelper";
export default function ChatMenu({ navigation, route }) {
  const [request, setRequest] = useState(null);
  const [body, setBody] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const db = getFirestore();

  React.useEffect(() => {
    const request = route?.params?.params;
    setRequest(request);
    getAllMessages(request);
  }, []);

  const getAllMessages = async (request) => {

    const currentUser = await getDataFromStorage("user");
    const currentUserId = currentUser?.uid;
    const conversationId = getConversationId(
      request?.touristId,
      request?.localId
    );

    const q = query(
      collection(db, `chat/${conversationId}/messages`),
      orderBy("dateCreated", "asc")
    );
    onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        const obj = doc.data();
        data.push(obj);
      });
      setMessages(data);
      setCurrentUserId(currentUserId);
    });
  };

  const sendMessage = async () => {
    const currentUser = await getDataFromStorage("user");

    if (body === null) {
      return;
    }
    const chatUserId =
      currentUserId !== request?.localId
        ? request?.localId
        : request?.touristId;
    const conversationId = getConversationId(currentUserId, chatUserId);

    const data = {
      userId: currentUserId,
      body,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    };
    await insertMessage(data, conversationId);

    const currentUserChatRoomData = {
      image: "",
      dateCreated: Date.now(),
      lastMessage: body,
      name: currentUser?.firstname,
    };

    const otherUserChatRoomData = {
      image: "",
      dateCreated: Date.now(),
      lastMessage: body,
      name: "Usama Prince",
    };
    setBody(null);

    await createChatRoom(currentUserChatRoomData, chatUserId, currentUserId);
    
    await createChatRoom(
      otherUserChatRoomData,
      currentUserId,
      chatUserId
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", margin: 15 }}
        >
          <Image source={images.arrow} style={[styles.arrowIcon]} />
        </Pressable>
        <View style={[styles.alignCenter, { marginVertical: 10 }]}>
          <Text style={[text.white, text.text30]}>رسائلي</Text>
        </View>

        <AutoScroll>
          {messages.map((item, index) => {
            return (
              item?.userId !== currentUserId && (
                <View
                  key={index}
                  style={{
                    marginHorizontal: 20,
                    marginTop: screenWidth.width10,
                  }}
                >
                  <LeftChat
                    msg={item?.body}
                    date={convertSecondsIntoTime(item?.dateCreated)}
                  />
                </View>
              )
            );
          })}
          <View style={{ marginHorizontal: 20 }}>
            {messages.map((item, index) => {
              return (
                item?.userId === currentUserId && (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: 20,
                      marginTop: screenWidth.width10,
                    }}
                  >
                    <RightChat
                      msg={item?.body}
                      date={convertSecondsIntoTime(item?.dateCreated)}
                    />
                  </View>
                )
              );
            })}
          </View>
        </AutoScroll>
        <View>
          <TextInput
            value={body}
            style={[styles.chatInput]}
            multiline={true}
            onChangeText={(value) => setBody(value)}
            placeholder="Write Your Message Here"
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            style={{
              position: "absolute",
              right: 0,
              margin: Platform.OS == "ios" ? 13 : 18,
              marginHorizontal: 30,
            }}
          >
            <Image
              source={images.send}
              style={[styles.arrowIcon, { tintColor: "#545454" }]}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alignCenter: {
    alignItems: "center",
  },

  arrowIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  chatInput: {
    width: screenWidth.width90,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    marginBottom: 20,
    paddingVertical: 20,
    paddingTop: 20,
    paddingRight: 40,
  },
});
