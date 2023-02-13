import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { child, getDatabase, onValue, ref } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet,View } from "react-native";
import { Bubble, GiftedChat ,Send } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from 'react-native-paper';
import { colors } from "../../config/Constant";
import { markAsRead, sendMessage } from "../../network/ApiService";
import { images} from "./../../config/Constant";

const ChatConvesation = ({
  navigation,
  route: {
    params: { isTab, receiverName, receiverId, roomId, senderId, senderName },
  },
}) => {
  const [messages, setMessages] = useState([]);
  // console.log("🚀 ~ isTab", isTab);
  console.log("namemmmeme: ");

  const insets = useSafeAreaInsets();

  const DEFAULT_TABBAR_HEIGHT = !!isTab ? useBottomTabBarHeight() : 0;

  const onSend = useCallback(async (messages = []) => {
    await sendMessage(
      roomId,
      messages[0].text,
      {
        senderName,
        senderId,
      },
      {
        receiverName,
        receiverId,
      }
    );
  }, []);

  const refactory = (mapOfObjects) => {
    const arrayFromObj = Object.keys(mapOfObjects).map(
      (key) => mapOfObjects[key]
    );
    const formated = arrayFromObj
      .map((message) => {
        // if type sys
        if (message.type === "sys") {
          // console.log("🚀 ~ message.createdAt", message.createdAt);
          return {
            _id: message.id,
            text: message.content,
            createdAt: new Date(message.createdAt),
            system: true,
            isRead: false,
            sent: true,
          };
        }
        return {
          _id: message.id,
          text: message.content,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.from,
            name: message.senderName,
            avatar: images.user,
          },
          isRead: false,
          sent: true,
        };
      })
      .sort((a, b) => a.createdAt - b.createdAt);

    return formated.reverse();
  };

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db);
    const chat_Ref = child(dbRef, `chats/${roomId}`);

    markAsRead(roomId, senderId, receiverId);

    return onValue(chat_Ref, (snap) => {
      // <--- return the unsubscriber!
      if (snap.exists()) {
        const data = snap.val();
        const formated = refactory(data);
        setMessages(formated);
      }
    });
  }, []);

  console.log("🚀 ~ insets.bottom", insets.bottom);
  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32}  iconColor={colors.lightBrown} />
        </View>
      </Send>
    );
  }
  return (
    // <KeyboardAvoidingView style={{ flex: 1 }}>
    <GiftedChat 
    renderSend={renderSend}
    placeholder="اكتب رسالة"
    alwaysShowSend={true}
      wrapInSafeArea={false}
      bottomOffset={
        Platform.OS === "ios" && !!DEFAULT_TABBAR_HEIGHT
          ? DEFAULT_TABBAR_HEIGHT
          : 0
      }
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: senderId,
        name: senderName,
      }}
      // make bubble width 80% of screen

      renderBubble={(props) => {
        return (
          <Bubble
            {...props}
            textStyle={{
              right: {
                color: "black",
                
                padding: 3,
              },
              left: {
                color: "black",
                
                padding: 3,
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: colors.gray,
                borderRadius: 10,
              },
              right: {
                backgroundColor: colors.lightBrown,
                borderRadius: 10,
              },
            }}
          />
        );
      }}
    />
    // </KeyboardAvoidingView>
  );
};

export default ChatConvesation;

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});