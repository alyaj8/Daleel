import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

// convesation

const ChatConvesation = ({
  navigation,
  route: {
    params: { chatItem },
  },
}) => {
  // const { name, roomId, senderId } = chatItem;
  console.log("🚀 ~ chatItem", chatItem);
  useEffect(() => {
    // get the messages
  }, []);

  return (
    <View>
      {/* <Text>{roomId}</Text> */}
      <Text>مرحبًا</Text>
    </View>
  );
};

export default ChatConvesation;

const styles = StyleSheet.create({});
