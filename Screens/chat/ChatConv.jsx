import { child, getDatabase, onValue, ref } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { colors } from "../../config/Constant";
import { sendMessage } from "../../network/ApiService";

const ChatConvesation = ({
  navigation,
  route: {
    params: { receiverName, receiverId, roomId, senderId, senderName },
  },
}) => {
  const [messages, setMessages] = useState([]);

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

    await getChat();
  }, []);

  const refactory = (mapOfObjects) => {
    const arrayFromObj = Object.keys(mapOfObjects).map(
      (key) => mapOfObjects[key]
    );
    const formated = arrayFromObj
      .map((message) => {
        // if type sys
        if (message.type === "sys") {
          console.log("🚀 ~ message.createdAt", message.createdAt);
          return {
            _id: message.id,
            text: message.content,
            createdAt: new Date(message.createdAt),
            system: true,
          };
        }
        return {
          _id: message.id,
          text: message.content,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.from,
            name: message.senderName,
            avatar: "https://placeimg.com/140/140/any",
          },
        };
      })
      .sort((a, b) => a.createdAt - b.createdAt);

    return formated.reverse();
  };

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db);
    const chat_Ref = child(dbRef, `chats/${roomId}`);

    return onValue(chat_Ref, (snap) => {
      // <--- return the unsubscriber!
      if (snap.exists()) {
        const data = snap.val();
        const formated = refactory(data);
        setMessages(formated);
      }
    });
  }, []);

  return (
    <GiftedChat
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
                color: "yellow",
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: colors.brown,
              },
            }}
          />
        );
      }}
    />
  );
};

export default ChatConvesation;

const styles = StyleSheet.create({});
