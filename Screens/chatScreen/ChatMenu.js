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
import { SafeAreaView } from "react-native-safe-area-context";
import { getConversationId } from "../../util/CustomHelper";
import { getDataFromStorage } from "../../util/Storage";
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

export default function ChatMenu({ navigation }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const db = getFirestore();

  React.useEffect(() => {
    getAllMessages();
  }, []);

  const getAllMessages = async () => {
    const currentUser = await getDataFromStorage("user");
    const currentUserId = currentUser?.uid;

    const q = query(
      collection(db, `users/${currentUserId}/chat_threads`),
      orderBy("dateCreated", "desc")
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
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        <View style={[styles.alignCenter, { marginVertical: 10 }]}>
          <Text style={[text.white, text.text30]}>رسائلي</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginTop: screenWidth.width10,
            }}
          >
            {messages.map((item, index) => {
              return (
                <ChatOption
                  Name={item?.name}
                  about={item?.lastMessage}
                  // onPress={() => navigation.navigate("Chat")}
                />
              );
            })}
          </View>
        </ScrollView>
      </ImageBackground>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: '#ececec',
    // margin: 20
  },
  alignCenter: {
    alignItems: "center",
  },
});
