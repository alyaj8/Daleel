import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { child, getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Chip from "../../component/Chip";
import { colors, images, screenWidth } from "../../config/Constant";
import {
  createChatRoom,
  getUserId,
  getUserObj,
} from "../../network/ApiService";
import text from "../../style/text";
import { getFormattedTime } from "./../../util/DateHelper";

const ChatCard = ({ item, onPressChat }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.grayBg,
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={() => {
        onPressChat(item);
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={images.user}
          style={{
            width: 80,
            height: 80,
            marginRight: 10,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: colors.white,
            padding: 15,
          }}
        />

        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            // padding: 10,
          }}
        >
          {/*  Name */}
          <Text
            style={[
              text.bold,
              text.text25,
              {
                color: colors.black,
                textAlign: "right",
              },
            ]}
          >
            {item.name}
          </Text>

          {/* Last message */}
          <Text
            style={[
              text.text16,
              {
                color: "rgba(0,0,0,0.5)",
                textAlign: "center",
                marginRight: 20,
                // ...highlights.brdr1,
              },
            ]}
          >
            {item.lastMsg}
          </Text>
          {!item.isRead && <Chip text={"غير مقروء"} />}
          {/* Time */}
          <Text
            style={[
              text.text12,
              {
                color: colors.outlineBg,
                textAlign: "right",
              },
            ]}
          >
            {getFormattedTime(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatsList = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [chats, setChats] = useState([]);

  const refactory = (mapOfObjects) => {
    const arrayFromObj = Object.keys(mapOfObjects).map(
      (key) => mapOfObjects[key]
    );
    const formated = arrayFromObj
      .map((chats) => {
        // logObj(chats, "chats");
        return {
          ...chats,
        };
      })
      .sort((a, b) => a.createdAt - b.createdAt);

    return formated.reverse();
  };

  const getUser = async () => {
    const user = await getUserId();
    setCurrentUserId(user);
  };

  useEffect(() => {
    getUser();
    const db = getDatabase();
    const dbRef = ref(db);
    const chat_Ref = child(dbRef, `chatlist/${currentUserId}`);

    return onValue(chat_Ref, (snap) => {
      // <--- return the unsubscriber!
      if (snap.exists()) {
        const data = snap.val();
        const formated = refactory(data);
        setChats(formated);
      }
    });
  }, [currentUserId]);

  const onPressChat = async (chat) => {
    try {
      setIsLoading(true);

      const chatItem = await createChatRoom(currentUserId, chat.senderId);
      const me = await getUserObj();

      navigation.navigate("ChatConv", {
        receiverName: chatItem.name,
        receiverId: chatItem.senderId,
        senderId: me.uid,
        senderName: me.firstname,
        roomId: chatItem.roomId,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("🚀 ~ error", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
        {/* Header */}
        <Text
          style={[
            styles.alignCenter,
            text.white,
            text.bold,
            text.text30,
            {
              marginTop: 40,
              width: "100%",
              textAlign: "center",
              //color:colors.Blue
            },
          ]}
        >
          محادثاتي
        </Text>

        {/* Body */}
        <View style={styles.cardDiv}>
          <Text style={[text.white, text.text20, styles.alignCenter]}>
            لا يوجد لديك محادثات حاليا
          </Text>
          {chats.length > 0 ? (
            chats.map((item, index) => {
              return (
                <ChatCard key={index} item={item} onPressChat={onPressChat} />
              );
            })
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.brown,
                  textAlign: "center",
                  marginRight: 20,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                لا يوجد لديك محادثات حاليا
              </Text>
              <Feather name="alert-circle" size={35} color="red" />
            </View>
          )}
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default ChatsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: screenWidth.width10,
    backgroundColor: "#fff",
  },
  alignCenter: {
    alignItems: "center",
  },
  cardDiv: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20,
    width: screenWidth.width90,
    alignSelf: "center",
    // alignItems: "center",
    padding: 20,
    // justifyContent: "center",
    flex: 1,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    // backgroundColorwith opacity
    backgroundColor: "rgba(255,255,255,1)",
    width: screenWidth.width80,
    padding: 20,
    borderRadius: 20,
  },
  headerTab: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingVertical: 10,
    width: screenWidth.width30,
    alignItems: "center",
  },
  tabColor: {
    backgroundColor: "#f1f1f1",
    width: screenWidth.width90,
    alignSelf: "center",
    borderRadius: 20,
  },
  flexDirection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
});
