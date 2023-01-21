import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import BookingDetail from "../Screens/Local/BookingDetail";
import Tourist_Home from "../Screens/Tourist_Home";

const Stack = createNativeStackNavigator();

function TouristHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tourist_Home" component={Tourist_Home} />

      <Stack.Screen name="BookingDetail" component={BookingDetail} />
    </Stack.Navigator>
  );
}
export default TouristHomeStack;
