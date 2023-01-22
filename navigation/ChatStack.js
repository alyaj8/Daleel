import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import ChatConvesation from "../Screens/chat/ChatConv";
import ChatsList from "../Screens/chat/ChatsMenu";
const Stack = createNativeStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatsList" component={ChatsList} />
      <Stack.Screen name="ChatConv" component={ChatConvesation} />
    </Stack.Navigator>
  );
}

export default ChatStack;
